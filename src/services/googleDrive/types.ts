/**
 * googleDrive/types — type vocabulary shared by the Drive auth and HTTP layers.
 *
 * This module is intentionally dependency-free (type-only, no runtime imports)
 * so both `auth.ts` and `client.ts` can import from it without creating a cycle.
 *
 * Design contract: the Drive layer never throws for network or API failures.
 * Every operation returns a {@link DriveResult}, which is a discriminated union
 * on `ok`. Consumers branch on `result.ok` and translate
 * {@link DriveErrorCode} through i18n.
 */

/**
 * A Google access token held in memory only.
 *
 * HARD CONSTRAINT: this value must never be written to localStorage,
 * sessionStorage, cookies or the URL. There is no refresh token, so a session is
 * short (~1 h) and ends by asking the user to reconnect.
 *
 * WHO HOLDS IT: `driveSession.ts`, not a window closure. Two windows (My Drive
 * and the Recycle Bin) need the same account session and `osWindowRegistry`
 * cannot carry data between them, so the token moved to a module scope. This
 * changes *ownership*, not *storage* — see that module's header for why.
 */
export interface DriveToken {
  /** Bearer token for the `Authorization` header. */
  readonly accessToken: string;
  /** Epoch milliseconds when the token stops being accepted (see `token/expires`). */
  readonly expiresAt: number;
}

/** True when the token is expired or close enough to expiry to be useless. */
export function isDriveTokenExpired(token: DriveToken, now: number = Date.now()): boolean {
  return token.expiresAt <= now;
}

/** Stable, translatable failure reasons produced by the Drive layer. */
export type DriveErrorCode =
  /** 401: the token is gone or expired. The UI must offer a reconnect. */
  | 'auth-expired'
  /** 403: the granted scope is not enough, or access to the item is forbidden. */
  | 'forbidden'
  /** 404: the file, folder or account resource does not exist (or was trashed). */
  | 'not-found'
  /** 429: per-user quota exhausted. Retryable after a delay. */
  | 'rate-limited'
  /** 400: Google rejected the request itself (bad query, missing body, bad scope). */
  | 'invalid-request'
  /** fetch() failed, the browser is offline, or the response could not be read. */
  | 'network'
  /** Any other non-success response. */
  | 'unknown';

/** Structured failure returned inside {@link DriveResult}. */
export interface DriveError {
  /** Translatable reason. UI copy comes from i18n, never from here. */
  readonly code: DriveErrorCode;
  /** HTTP status when the failure came from a response; `null` for network errors. */
  readonly status: number | null;
  /** Raw diagnostic text from Google or from fetch(). For logs, never for UI. */
  readonly detail: string;
}

/** Result of a Drive operation: either a value or a structured error, never a throw. */
export type DriveResult<T> = { ok: true; data: T } | { ok: false; error: DriveError };

/**
 * A Drive file as returned by `files.list`.
 *
 * `size` is a string because Drive v3 serializes 64-bit sizes as strings.
 * Optional fields stay `null` rather than `undefined` so the shape is stable
 * regardless of the `fields` mask used by the calling method.
 */
export interface DriveFile {
  readonly id: string;
  readonly name: string;
  readonly mimeType: string;
  readonly size: string | null;
  readonly trashed: boolean;
  readonly modifiedTime: string | null;
  /** Revision marker; changes on every content edit. See {@link DriveWriteResult}. */
  readonly headRevisionId: string | null;
  readonly webViewLink: string | null;
  /**
   * When the file was moved to the trash. Only requested by the trash listing,
   * so it is `null` for every other call — the reason {@link DriveFile} keeps a
   * stable shape across differing `fields` masks.
   */
  readonly trashedTime: string | null;
  /**
   * Whether Drive will let this file be restored, from the output-only
   * `capabilities.canUntrash`. `null` means the listing did not ask for it;
   * only an explicit `false` is a refusal.
   */
  readonly canUntrash: boolean | null;
}

/**
 * A Drive folder.
 *
 * The app's workspace folder is *discovered* rather than persisted, so this type
 * is the result of a name lookup in `files.list`, never a value read back from
 * local storage.
 */
export interface DriveFolder {
  readonly id: string;
  readonly name: string;
  readonly mimeType: string;
  readonly createdTime: string | null;
  readonly webViewLink: string | null;
}

/** Account behind the current token, from `GET /about?fields=user`. */
export interface DriveAccount {
  readonly email: string | null;
  readonly displayName: string | null;
}

/**
 * Outcome of a content write (`files.update?uploadType=media`).
 *
 * CONFLICT DETECTION HAS A RACE WINDOW: the Drive v3 `files.update` method has
 * no conditional-update primitive (no `If-Match`, no expected-revision
 * parameter), so a revision cannot be enforced server-side. The client can only
 * compare `headRevisionId` before and after the write, which narrows the window
 * to "between the caller's read and the write request" — it does not close it.
 * Two tabs saving the same file at the same moment can still overwrite each
 * other. Anything presented to the user as a conflict check must say "changed
 * since you loaded it", never "guaranteed safe write".
 */
export interface DriveWriteResult {
  readonly id: string;
  /** Revision *after* the write. Never the revision that was compared against. */
  readonly headRevisionId: string | null;
  readonly modifiedTime: string | null;
  readonly size: string | null;
}

/** Result of `trashFile`. The file is recoverable from the Drive trash for 30 days. */
export interface DriveTrashResult {
  readonly id: string;
  readonly name: string;
  readonly trashed: boolean;
}

/**
 * Result of `renameFile`.
 *
 * Its own type rather than a reuse of {@link DriveFile}: a rename changes the
 * name and the `modifiedTime` Drive derives from it, and echoing back a full
 * file would invite a caller to trust fields the `PATCH` never asked for. The
 * `fields` mask is deliberately this narrow, so this type is the exact shape
 * the request can promise.
 */
export interface DriveRenameResult {
  readonly id: string;
  readonly name: string;
  readonly modifiedTime: string | null;
}

/**
 * Result of `restoreFile`.
 *
 * Its own type rather than a reuse of {@link DriveTrashResult}: the two
 * operations are opposites, and a caller reading `restoreFile`'s signature
 * should not have to know they happen to share a payload. `parents` is echoed
 * back so the UI can report where the file actually landed instead of assuming.
 */
export interface DriveRestoreResult {
  readonly id: string;
  readonly name: string;
  readonly trashed: boolean;
  readonly parents: readonly string[];
}