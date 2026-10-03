/**
 * googleDrive/client — thin HTTP layer over the Drive v3 API.
 *
 * Contract, enforced by construction:
 *
 *   - The access token is a *parameter of every call*. There is no module-level
 *     mutable state and no token cache, so this module cannot leak a session
 *     into an unrelated caller or another tab.
 *   - Nothing throws for network or API failures. Every method returns a
 *     {@link DriveResult}; transport problems and HTTP errors both arrive as
 *     `{ ok: false, error }`.
 *   - A 401 is retried exactly once (some failures are clock skew on a token
 *     that is still valid). A second 401 becomes `auth-expired`, which the UI
 *     answers with an explicit reconnect — there is no refresh token without a
 *     backend.
 *   - Deletion is always `trashed: true`. The Drive API's permanent delete is
 *     never called from this module.
 *   - `files.update` has no conditional-update primitive, so write conflicts are
 *     detected by *comparing* `headRevisionId` before writing. See
 *     {@link DriveWriteResult} for the race window this leaves open.
 */

import { DRIVE } from '../../constants';
import { createDriveError, httpFailure, networkFailure } from './errors';
import type {
  DriveAccount,
  DriveFile,
  DriveFolder,
  DriveResult,
  DriveToken,
  DriveTrashResult,
  DriveWriteResult
} from './types';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/** Page size for `files.list`. 100 is the maximum the API accepts. */
const DRIVE_PAGE_SIZE = 100;

/**
 * Upper bound on paginated `files.list` walks. The app-managed workspace holds
 * a handful of files, so this only exists to stop an unexpected account from
 * turning one list call into an unbounded loop.
 */
const DRIVE_MAX_PAGES = 20;

const DRIVE_FILE_FIELDS = 'id,name,mimeType,size,trashed,modifiedTime,headRevisionId,webViewLink';
const DRIVE_FOLDER_FIELDS = 'id,name,mimeType,createdTime,webViewLink';

/** Drive ids are opaque base64url-ish tokens; reject anything else before interpolating. */
const DRIVE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

/**
 * Discovery query measured in the spike: it returns folders this app created in
 * *previous* sessions without knowing their id. Combined with the stable
 * {@link DRIVE.WORKSPACE_FOLDER_NAME} it is what lets the app find its workspace
 * after a browser-data wipe.
 */
const buildFolderDiscoveryQuery = (): string =>
  `mimeType = '${DRIVE.FOLDER_MIME_TYPE}' and trashed = false`;

/** The public surface of the Drive client. */
export interface DriveClient {
  findWorkspaceFolder(token: DriveToken): Promise<DriveResult<DriveFolder | null>>;
  ensureWorkspaceFolder(token: DriveToken): Promise<DriveResult<DriveFolder>>;
  listFiles(token: DriveToken, folderId: string): Promise<DriveResult<DriveFile[]>>;
  readFileContent(token: DriveToken, fileId: string): Promise<DriveResult<string>>;
  createTextFile(
    token: DriveToken,
    folderId: string,
    name: string,
    content: string
  ): Promise<DriveResult<DriveFile>>;
  getHeadRevisionId(token: DriveToken, fileId: string): Promise<DriveResult<string | null>>;
  updateTextFile(
    token: DriveToken,
    fileId: string,
    content: string
  ): Promise<DriveResult<DriveWriteResult>>;
  trashFile(token: DriveToken, fileId: string): Promise<DriveResult<DriveTrashResult>>;
  getAccountEmail(token: DriveToken): Promise<DriveResult<DriveAccount>>;
}

interface DriveRequestInit {
  readonly method: 'GET' | 'POST' | 'PATCH';
  readonly path: string;
  readonly baseUrl?: string;
  readonly body?: string;
  readonly contentType?: string;
  readonly accept?: string;
}

/** One decoded page of a `files.list` walk. */
interface DriveItemPage<T> {
  readonly items: T[];
  readonly nextPageToken: string | null;
}

/** Read a human-readable diagnostic out of a Google error body. Never throws. */
const readErrorDetail = async (response: Response): Promise<string> => {
  const fallback = `HTTP ${response.status}`;
  let text: string;
  try {
    text = await response.text();
  } catch {
    return fallback;
  }
  if (!text) return fallback;
  try {
    const payload: unknown = JSON.parse(text);
    if (typeof payload === 'object' && payload !== null) {
      const error = (payload as Record<string, unknown>).error;
      if (typeof error === 'object' && error !== null) {
        const message = (error as Record<string, unknown>).message;
        if (typeof message === 'string' && message) return message;
      }
    }
  } catch {
    return text;
  }
  return text;
};

/**
 * Perform one authenticated Drive request.
 *
 * Returns the raw `Response` on success so callers can read JSON or text.
 * Retries once on 401; a second 401 maps to `auth-expired`.
 */
const driveFetch = async (
  token: DriveToken,
  init: DriveRequestInit,
  isRetry = false
): Promise<DriveResult<Response>> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token.accessToken}`,
    Accept: init.accept ?? 'application/json'
  };
  if (init.contentType) headers['Content-Type'] = init.contentType;

  let response: Response;
  try {
    response = await fetch(`${init.baseUrl ?? DRIVE_API_BASE}${init.path}`, {
      method: init.method,
      headers,
      body: init.body
    });
  } catch (error) {
    return networkFailure(error);
  }

  if (response.ok) return { ok: true, data: response };

  if (response.status === 401 && !isRetry) {
    return driveFetch(token, init, true);
  }

  return httpFailure(response.status, await readErrorDetail(response));
};

/** {@link driveFetch} plus JSON decoding, with the shape check delegated to `parse`. */
const driveJson = async <T>(
  token: DriveToken,
  init: DriveRequestInit,
  parse: (payload: unknown) => T | null
): Promise<DriveResult<T>> => {
  const result = await driveFetch(token, init);
  if (!result.ok) return { ok: false, error: result.error };

  let payload: unknown;
  try {
    payload = await result.data.json();
  } catch (error) {
    return networkFailure(error);
  }

  const parsed = parse(payload);
  if (parsed === null) {
    return {
      ok: false,
      error: createDriveError('unknown', result.data.status, 'unrecognized response shape')
    };
  }
  return { ok: true, data: parsed };
};

/** Normalize a `files.list` entry into {@link DriveFile}, or reject it. */
const toDriveFile = (raw: unknown): DriveFile | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.id !== 'string' || item.id === '') return null;
  return {
    id: item.id,
    name: typeof item.name === 'string' ? item.name : '',
    mimeType: typeof item.mimeType === 'string' ? item.mimeType : '',
    size: typeof item.size === 'string' ? item.size : null,
    trashed: item.trashed === true,
    modifiedTime: typeof item.modifiedTime === 'string' ? item.modifiedTime : null,
    headRevisionId: typeof item.headRevisionId === 'string' ? item.headRevisionId : null,
    webViewLink: typeof item.webViewLink === 'string' ? item.webViewLink : null
  };
};

/** Normalize a folder payload into {@link DriveFolder}, or reject it. */
const toDriveFolder = (raw: unknown): DriveFolder | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const item = raw as Record<string, unknown>;
  if (typeof item.id !== 'string' || item.id === '') return null;
  return {
    id: item.id,
    name: typeof item.name === 'string' ? item.name : '',
    mimeType: typeof item.mimeType === 'string' ? item.mimeType : '',
    createdTime: typeof item.createdTime === 'string' ? item.createdTime : null,
    webViewLink: typeof item.webViewLink === 'string' ? item.webViewLink : null
  };
};

const parseItemPage = <T>(
  payload: unknown,
  parseItem: (raw: unknown) => T | null
): DriveItemPage<T> | null => {
  if (typeof payload !== 'object' || payload === null) return null;
  const body = payload as Record<string, unknown>;

  const items: T[] = [];
  const rawItems = body.files;
  if (Array.isArray(rawItems)) {
    for (const raw of rawItems) {
      const item = parseItem(raw);
      if (item !== null) items.push(item);
    }
  }
  return {
    items,
    nextPageToken: typeof body.nextPageToken === 'string' ? body.nextPageToken : null
  };
};

/**
 * Walk `files.list` for one query, accumulating pages until Google stops
 * handing out a `nextPageToken` or {@link DRIVE_MAX_PAGES} is reached.
 */
const listAllItems = async <T>(
  token: DriveToken,
  query: string,
  fields: string,
  parseItem: (raw: unknown) => T | null
): Promise<DriveResult<T[]>> => {
  const collected: T[] = [];
  let pageToken: string | null = null;

  for (let page = 0; page < DRIVE_MAX_PAGES; page += 1) {
    const params = new URLSearchParams({
      q: query,
      fields,
      pageSize: String(DRIVE_PAGE_SIZE),
      orderBy: 'createdTime desc'
    });
    if (pageToken !== null) params.set('pageToken', pageToken);

    const result = await driveJson<DriveItemPage<T>>(
      token,
      { method: 'GET', path: `/files?${params.toString()}` },
      (payload) => parseItemPage(payload, parseItem)
    );
    if (!result.ok) return { ok: false, error: result.error };

    collected.push(...result.data.items);
    pageToken = result.data.nextPageToken;
    if (pageToken === null) break;
  }

  return { ok: true, data: collected };
};

const listAllFiles = (token: DriveToken, query: string): Promise<DriveResult<DriveFile[]>> =>
  listAllItems(token, query, DRIVE_FILE_FIELDS, toDriveFile);

const listAllFolders = (token: DriveToken, query: string): Promise<DriveResult<DriveFolder[]>> =>
  listAllItems(token, query, DRIVE_FOLDER_FIELDS, toDriveFolder);

/** Reject an id that is not shaped like a Drive id before it reaches a URL or query. */
const requireDriveId = (id: string, field: string): DriveResult<string> => {
  if (!DRIVE_ID_PATTERN.test(id)) {
    return {
      ok: false,
      error: createDriveError('invalid-request', null, `${field} is not a valid Drive id`)
    };
  }
  return { ok: true, data: id };
};

/** Create a folder in the account root and return it. */
const createFolder = async (token: DriveToken, name: string): Promise<DriveResult<DriveFolder>> => {
  const params = new URLSearchParams({ fields: DRIVE_FOLDER_FIELDS });
  return driveJson<DriveFolder>(
    token,
    {
      method: 'POST',
      path: `/files?${params.toString()}`,
      body: JSON.stringify({ name, mimeType: DRIVE.FOLDER_MIME_TYPE }),
      contentType: 'application/json; charset=UTF-8'
    },
    toDriveFolder
  );
};

/** Random multipart boundary. Hex digits only: it can never break the framing. */
const createMultipartBoundary = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `drive_upload_${suffix}`;
};

interface MultipartBody {
  readonly body: string;
  readonly boundary: string;
}

/**
 * Build the `multipart/related` body measured in the spike: JSON metadata part
 * first, then the raw content. Both parts are text, so string concatenation is
 * safe and fetch encodes the body as UTF-8.
 */
const buildMultipartBody = (metadata: unknown, content: string): MultipartBody => {
  const boundary = createMultipartBoundary();
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    `Content-Type: ${DRIVE.MARKDOWN_MIME_TYPE}; charset=UTF-8`,
    '',
    content,
    `--${boundary}--`,
    ''
  ].join('\r\n');
  return { body, boundary };
};

export const driveClient: DriveClient = {
  findWorkspaceFolder: async (token) => {
    const result = await listAllFolders(token, buildFolderDiscoveryQuery());
    if (!result.ok) return { ok: false, error: result.error };

    const workspace = result.data.find((folder) => folder.name === DRIVE.WORKSPACE_FOLDER_NAME);
    return { ok: true, data: workspace ?? null };
  },

  /**
   * Return the workspace folder, creating it on first use.
   *
   * Two tabs connecting at the same moment can both observe "not found" and
   * create a duplicate folder. The duplicates are harmless (both are visible to
   * the app and `findWorkspaceFolder` picks the newest), and resolving this
   * properly would need a server-side lock this project does not have.
   */
  ensureWorkspaceFolder: async (token) => {
    const found = await driveClient.findWorkspaceFolder(token);
    if (!found.ok) return { ok: false, error: found.error };
    if (found.data !== null) return { ok: true, data: found.data };
    return createFolder(token, DRIVE.WORKSPACE_FOLDER_NAME);
  },

  listFiles: async (token, folderId) => {
    const validId = requireDriveId(folderId, 'folderId');
    if (!validId.ok) return { ok: false, error: validId.error };
    return listAllFiles(token, `'${validId.data}' in parents and trashed = false`);
  },

  readFileContent: async (token, fileId) => {
    const validId = requireDriveId(fileId, 'fileId');
    if (!validId.ok) return { ok: false, error: validId.error };

    const response = await driveFetch(token, {
      method: 'GET',
      path: `/files/${encodeURIComponent(validId.data)}?alt=media`,
      accept: `${DRIVE.MARKDOWN_MIME_TYPE}, text/plain, */*`
    });
    if (!response.ok) return { ok: false, error: response.error };

    try {
      return { ok: true, data: await response.data.text() };
    } catch (error) {
      return networkFailure(error);
    }
  },

  createTextFile: async (token, folderId, name, content) => {
    const validId = requireDriveId(folderId, 'folderId');
    if (!validId.ok) return { ok: false, error: validId.error };

    const params = new URLSearchParams({ uploadType: 'multipart', fields: DRIVE_FILE_FIELDS });
    const { body, boundary } = buildMultipartBody(
      { name, mimeType: DRIVE.MARKDOWN_MIME_TYPE, parents: [validId.data] },
      content
    );

    return driveJson<DriveFile>(
      token,
      {
        method: 'POST',
        baseUrl: DRIVE_UPLOAD_BASE,
        path: `/files?${params.toString()}`,
        body,
        contentType: `multipart/related; boundary=${boundary}`
      },
      toDriveFile
    );
  },

  getHeadRevisionId: async (token, fileId) => {
    const validId = requireDriveId(fileId, 'fileId');
    if (!validId.ok) return { ok: false, error: validId.error };

    const result = await driveJson<{ headRevisionId: string | null }>(
      token,
      {
        method: 'GET',
        path: `/files/${encodeURIComponent(validId.data)}?fields=headRevisionId`
      },
      (payload) => {
        if (typeof payload !== 'object' || payload === null) return null;
        const revision = (payload as Record<string, unknown>).headRevisionId;
        return { headRevisionId: typeof revision === 'string' ? revision : null };
      }
    );
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.headRevisionId };
  },

  /**
   * Overwrite a file's content and return its *new* revision.
   *
   * The Drive API cannot enforce a revision, so callers that care about lost
   * updates must compare {@link DriveClient.getHeadRevisionId} against the
   * revision they loaded, and warn when they differ before writing.
   */
  updateTextFile: async (token, fileId, content) => {
    const validId = requireDriveId(fileId, 'fileId');
    if (!validId.ok) return { ok: false, error: validId.error };

    const params = new URLSearchParams({
      uploadType: 'media',
      fields: 'id,headRevisionId,modifiedTime,size'
    });

    const result = await driveJson<DriveWriteResult>(
      token,
      {
        method: 'PATCH',
        baseUrl: DRIVE_UPLOAD_BASE,
        path: `/files/${encodeURIComponent(validId.data)}?${params.toString()}`,
        body: content,
        contentType: `${DRIVE.MARKDOWN_MIME_TYPE}; charset=UTF-8`
      },
      (payload) => {
        if (typeof payload !== 'object' || payload === null) return null;
        const body = payload as Record<string, unknown>;
        if (typeof body.id !== 'string') return null;
        return {
          id: body.id,
          headRevisionId: typeof body.headRevisionId === 'string' ? body.headRevisionId : null,
          modifiedTime: typeof body.modifiedTime === 'string' ? body.modifiedTime : null,
          size: typeof body.size === 'string' ? body.size : null
        };
      }
    );
    if (!result.ok) return { ok: false, error: result.error };
    return result;
  },

  /** Move a file to the Drive trash. Never a permanent delete. */
  trashFile: async (token, fileId) => {
    const validId = requireDriveId(fileId, 'fileId');
    if (!validId.ok) return { ok: false, error: validId.error };

    const params = new URLSearchParams({ fields: 'id,name,trashed' });

    const result = await driveJson<DriveTrashResult>(
      token,
      {
        method: 'PATCH',
        path: `/files/${encodeURIComponent(validId.data)}?${params.toString()}`,
        body: JSON.stringify({ trashed: true }),
        contentType: 'application/json; charset=UTF-8'
      },
      (payload) => {
        if (typeof payload !== 'object' || payload === null) return null;
        const body = payload as Record<string, unknown>;
        if (typeof body.id !== 'string') return null;
        return {
          id: body.id,
          name: typeof body.name === 'string' ? body.name : '',
          trashed: body.trashed === true
        };
      }
    );
    if (!result.ok) return { ok: false, error: result.error };
    return result;
  },

  /**
   * Email of the signed-in account, from `GET /about?fields=user`.
   *
   * A successful response with no email is possible for managed accounts, so
   * this reports `null` fields rather than failing.
   */
  getAccountEmail: async (token) => {
    const result = await driveJson<DriveAccount>(
      token,
      { method: 'GET', path: '/about?fields=user' },
      (payload) => {
        if (typeof payload !== 'object' || payload === null) return null;
        const user = (payload as Record<string, unknown>).user;
        if (typeof user !== 'object' || user === null) return { email: null, displayName: null };
        const account = user as Record<string, unknown>;
        return {
          email: typeof account.emailAddress === 'string' ? account.emailAddress : null,
          displayName: typeof account.displayName === 'string' ? account.displayName : null
        };
      }
    );
    if (!result.ok) return { ok: false, error: result.error };
    return result;
  }
};