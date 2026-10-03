import React from 'react';
import './index.css';
import { getCascadeOffset } from '../../utils/cascadePosition';
import { showMessageBox } from '../../utils/messageBox';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import {
  buildConsentUrl,
  clearPendingAuth,
  consumePendingCode,
  exchangeCodeForToken,
  generatePkce,
  generateState,
  loadPendingAuth,
  savePendingAuth,
} from '../../services/googleDrive/auth';
import { driveClient } from '../../services/googleDrive/client';
import { getDriveErrorMessage } from '../../services/googleDrive/errors';
import { isDriveTokenExpired } from '../../services/googleDrive/types';
import { DRIVE, LOCAL_STORAGE_KEYS } from '../../constants';
import type { DriveError, DriveErrorCode, DriveFile, DriveFolder, DriveToken } from '../../services/googleDrive/types';
import type { OsGuiWindow } from '../../types/os-gui';
import type { AppData } from '../../types';

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<string, { es: string; en: string }> = {
  windowTitle: { es: 'Mi unidad', en: 'My Drive' },
  connectHeading: { es: 'Conectar con Google Drive', en: 'Connect to Google Drive' },
  connectText: {
    es: 'Se va a crear una carpeta llamada "{folder}" en tu Drive para guardar los archivos que crees acá.',
    en: 'A folder named "{folder}" will be created in your Drive to store the files you create here.',
  },
  connectButton: { es: 'Conectar con Google', en: 'Connect with Google' },
  connectHint: {
    es: 'Se abrirá una pestaña nueva para aprobar el acceso. Volvé a esta ventana cuando termines.',
    en: 'A new tab will open to approve access. Come back to this window when you are done.',
  },
  diagnosticsLabel: {
    es: 'Redirección configurada:',
    en: 'Configured redirect:',
  },
  connectTimeout: {
    es: 'No llegó el código de autorización. Volvé a intentarlo.',
    en: 'The authorization code never arrived. Please try again.',
  },
  connectStateMismatch: {
    es: 'La respuesta de Google no corresponde a esta solicitud. Volvé a intentarlo.',
    en: "Google's response does not match this request. Please try again.",
  },
  connectExchangeFailed: {
    es: 'Google no devolvió un token válido. Volvé a intentarlo.',
    en: 'Google did not return a valid token. Please try again.',
  },
  configMissing: {
    es: 'Falta la configuración de Google (VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI).',
    en: 'Google is not configured (VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI).',
  },
  secureContextMissing: {
    es: 'Este navegador no expone WebCrypto fuera de https. Abrí la app en https o en localhost.',
    en: 'This browser does not expose WebCrypto outside https. Open the app over https or on localhost.',
  },
  reconnectHeading: { es: 'La sesión con Google venció', en: 'Your Google session expired' },
  reconnectText: {
    es: 'Conectá de nuevo para seguir usando la carpeta "{folder}".',
    en: 'Connect again to keep using the "{folder}" folder.',
  },
  reconnectButton: { es: 'Conectar de nuevo', en: 'Reconnect' },
  connectingHeading: { es: 'Conectando con Google', en: 'Connecting to Google' },
  connectingText: {
    es: 'Aprobá el acceso en la pestaña nueva. Esta ventana espera el código de autorización.',
    en: 'Approve access in the new tab. This window is waiting for the authorization code.',
  },
  newFile: { es: 'Nuevo archivo', en: 'New file' },
  newFileTitle: { es: 'Nuevo archivo', en: 'New file' },
  newFileHint: {
    es: 'Se crea un archivo markdown vacío. Si no escribís ".md", se agrega solo.',
    en: 'An empty markdown file is created. The ".md" extension is added when missing.',
  },
  newFileInvalid: {
    es: 'Ese nombre no sirve. No puede estar vacío ni llevar / \\ : * ? " < > |',
    en: 'That name will not work. It cannot be empty or contain / \\ : * ? " < > |',
  },
  fileNameLabel: { es: 'Nombre del archivo', en: 'File name' },
  refresh: { es: 'Actualizar', en: 'Refresh' },
  disconnect: { es: 'Desconectar', en: 'Disconnect' },
  open: { es: 'Abrir', en: 'Open' },
  edit: { es: 'Editar', en: 'Edit' },
  trash: { es: 'Papelera', en: 'Trash' },
  save: { es: 'Guardar', en: 'Save' },
  back: { es: 'Volver', en: 'Back' },
  create: { es: 'Crear', en: 'Create' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  retry: { es: 'Reintentar', en: 'Retry' },
  emptyFolder: {
    es: 'La carpeta está vacía. Usá "Nuevo archivo" para crear el primero.',
    en: 'This folder is empty. Use "New file" to create the first one.',
  },
  conflictTitle: { es: 'El archivo cambió', en: 'The file changed' },
  conflictMessage: {
    es: '"{name}" cambió en Drive desde que lo abriste. Si guardás, se pisa la versión que está ahí ahora.',
    en: '"{name}" changed in Drive since you opened it. Saving overwrites the version that is there now.',
  },
  trashTitle: { es: 'Mover a la papelera', en: 'Move to trash' },
  trashMessage: {
    es: '"{name}" va a la papelera de Drive. Podés recuperarlo desde drive.google.com durante 30 días.',
    en: '"{name}" goes to the Drive trash. You can restore it from drive.google.com for 30 days.',
  },
  errorHeading: { es: 'No se pudo completar la operación', en: 'The operation could not be completed' },
  forbiddenHint: {
    es: 'La app solo pide permiso sobre los archivos que ella misma crea. Si el archivo no es de la app, no se puede tocar.',
    en: 'The app only asks for access to the files it creates itself. Files not created by the app cannot be touched.',
  },
  unknownError: {
    es: 'Ocurrió un error inesperado.',
    en: 'An unexpected error occurred.',
  },
  statusWorking: { es: 'Trabajando...', en: 'Working...' },
  statusWaiting: { es: 'Esperando a Google', en: 'Waiting for Google' },
  statusEditing: { es: 'Editando', en: 'Editing' },
  statusReady: { es: 'Listo', en: 'Ready' },
  statusError: { es: 'Error', en: 'Error' },
  fileCount: { es: 'archivo(s)', en: 'file(s)' },
  sizeUnknown: { es: '?', en: '?' },
  dateUnknown: { es: 'sin fecha', en: 'no date' },
  editorLabel: { es: 'Contenido del archivo', en: 'File content' },
  accountLabel: { es: 'Cuenta', en: 'Account' },
  anonymousAccount: { es: 'Cuenta desconocida', en: 'Unknown account' },
};

// ─── Local types ──────────────────────────────────────────────────────────────

type DriveView = 'disconnected' | 'reconnect' | 'connecting' | 'list' | 'editor' | 'newFile' | 'error';

interface DriveConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
}

interface ConsentAttempt {
  readonly verifier: string;
  readonly state: string;
}

const DRIVE_ICON = '/images/icons/drive-32x32.svg';
const FILE_ICON = '/images/icons/notepad-file-16x16.png';
const MARKDOWN_EXTENSION_PATTERN = /\.md$/i;
const ILLEGAL_FILENAME_PATTERN = /[\\/:*?"<>|]/;
const MAX_FILENAME_LENGTH = 120;
const OPEN_FILE_APP_ID = 'markdownViewer';
const DRIVE_APP_ID = 'driveApp';

/** Single-instance guard: the app registry lets os-gui apps open twice. */
let activeWindow: OsGuiWindow | null = null;

// ─── Small helpers ────────────────────────────────────────────────────────────

function getLang(): 'es' | 'en' {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE);
  return saved === 'es' ? 'es' : 'en';
}

function tr(key: string): string {
  return TRANSLATIONS[key]?.[getLang()] ?? key;
}

/** Replace `{placeholder}` tokens in an already translated template. */
function fill(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function readDriveConfig(): DriveConfig | null {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  if (!VITE_GOOGLE_CLIENT_ID || !VITE_GOOGLE_CLIENT_SECRET || !VITE_GOOGLE_REDIRECT_URI) return null;
  return {
    clientId: VITE_GOOGLE_CLIENT_ID,
    clientSecret: VITE_GOOGLE_CLIENT_SECRET,
    redirectUri: VITE_GOOGLE_REDIRECT_URI,
  };
}

function formatSize(bytes: string | null): string {
  const parsed = Number(bytes);
  if (bytes === null || bytes === '' || !Number.isFinite(parsed) || parsed < 0) return tr('sizeUnknown');
  if (parsed < 1024) return `${parsed} B`;
  if (parsed < 1024 * 1024) return `${(parsed / 1024).toFixed(1)} KB`;
  return `${(parsed / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (iso === null) return tr('dateUnknown');
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return tr('dateUnknown');
  return parsed.toLocaleDateString(getLang());
}

function stripMarkdownExtension(name: string): string {
  return name.replace(MARKDOWN_EXTENSION_PATTERN, '');
}

/** Reject unusable names and guarantee a `.md` extension. */
function normalizeFileName(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed.length > MAX_FILENAME_LENGTH) return null;
  if (ILLEGAL_FILENAME_PATTERN.test(trimmed)) return null;
  return MARKDOWN_EXTENSION_PATTERN.test(trimmed) ? trimmed : `${trimmed}.md`;
}

function clearChildren(element: HTMLElement): void {
  while (element.firstChild) element.removeChild(element.firstChild);
}


/**
 * Opens the Drive window as a native os-gui window.
 *
 * The window is a small state machine over `view`: connect (or reconnect) →
 * waiting for the callback tab → workspace list → editor. Failures land on the
 * error view unless the failure is an expired token, which always offers a
 * reconnect.
 */
export function launchDrive(): void {
  const $Window = window.$Window;
  if (!$Window) {
    console.error('os-gui not loaded.');
    return;
  }

  if (activeWindow !== null) {
    activeWindow.show();
    activeWindow.focus();
    return;
  }

  let token: DriveToken | null = null;
  let view: DriveView = 'disconnected';
  let errorCode: DriveErrorCode | null = null;
  let notice: string | null = null;
  let workspaceFolder: DriveFolder | null = null;
  let files: DriveFile[] = [];
  let accountEmail: string | null = null;
  let editorFile: DriveFile | null = null;
  let editorContent = '';
  let editorBaselineRevision: string | null = null;
  let newFileName = '';
  let consentAttempt: ConsentAttempt | null = null;
  let busy = false;
  let statusLeft = '';
  let statusMiddle = '';
  let statusRight = '';

  const title = tr('windowTitle');
  const $win = $Window({
    title,
    icons: {
      16: DRIVE_ICON,
      32: DRIVE_ICON,
    },
    minWidth: 360,
    minHeight: 320,
  });

  $win.css({ width: '820px', height: '580px' });
  $win.center();
  const cascadeOffset = getCascadeOffset();
  $win.css({ left: parseInt($win.css('left')) + cascadeOffset, top: parseInt($win.css('top')) + cascadeOffset });
  activeWindow = $win;
  registerOsWindow($win, DRIVE_APP_ID, title, DRIVE_ICON);
  $win.onClosed(() => {
    activeWindow = null;
    token = null;
  });

  const root = document.createElement('div');
  root.className = 'drive-root';

  const toolbar = document.createElement('div');
  toolbar.className = 'drive-toolbar';

  const body = document.createElement('div');
  body.className = 'drive-body inset-deep';

  const statusBar = document.createElement('div');
  statusBar.className = 'drive-status';

  const statusCells: HTMLElement[] = [0, 1, 2].map(() => {
    const cell = document.createElement('div');
    cell.className = 'drive-status-cell';
    statusBar.appendChild(cell);
    return cell;
  });

  root.append(toolbar, body, statusBar);
  $win.$content.append(root);

  function updateStatus(left: string, middle: string, right: string): void {
    statusLeft = left;
    statusMiddle = middle;
    statusRight = right;
    statusCells[0].textContent = left;
    statusCells[1].textContent = busy ? tr('statusWorking') : middle;
    statusCells[2].textContent = busy ? tr('statusWorking') : right;
  }

  function setBusy(value: boolean): void {
    busy = value;
    updateStatus(statusLeft, statusMiddle, statusRight);
  }

  function createButton(label: string, className: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = className;
    button.type = 'button';
    button.textContent = label;
    button.disabled = busy;
    button.addEventListener('click', () => {
      // Views are rebuilt after every async result; disabling here stops a
      // double click from firing the same Drive request twice.
      button.disabled = true;
      onClick();
    });
    return button;
  }

  function createToolbarButton(label: string, onClick: () => void): HTMLButtonElement {
    return createButton(label, 'drive-toolbar-button', onClick);
  }

  function createToolbarSpacer(): HTMLElement {
    const spacer = document.createElement('span');
    spacer.className = 'drive-toolbar-spacer';
    return spacer;
  }

  function createToolbarLabel(text: string): HTMLElement {
    const label = document.createElement('span');
    label.className = 'drive-toolbar-label';
    label.textContent = text;
    label.title = text;
    return label;
  }

  function renderView(): void {
    clearChildren(toolbar);
    clearChildren(body);

    switch (view) {
      case 'reconnect':
        buildConnectView(true);
        break;
      case 'connecting':
        buildConnectingView();
        break;
      case 'list':
        buildListView();
        break;
      case 'editor':
        buildEditorView();
        break;
      case 'newFile':
        buildNewFileView();
        break;
      case 'error':
        buildErrorView();
        break;
      case 'disconnected':
      default:
        buildConnectView(false);
        break;
    }
  }

  // ── Authorization ──

  /**
   * Render the connect (or reconnect) panel.
   *
   * The panel only *asks*: the actual link target is produced by
   * `prepareConsent`, so the flow cannot start before a verifier exists.
   */
  function buildConnectView(isReconnect: boolean): void {
    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr(isReconnect ? 'reconnectHeading' : 'connectHeading');
    panel.appendChild(heading);

    const description = document.createElement('p');
    description.className = 'drive-panel-text';
    description.textContent = fill(tr(isReconnect ? 'reconnectText' : 'connectText'), {
      folder: DRIVE.WORKSPACE_FOLDER_NAME,
    });
    panel.appendChild(description);

    if (notice !== null) {
      const noticeEl = document.createElement('p');
      noticeEl.className = 'drive-panel-notice';
      noticeEl.textContent = notice;
      panel.appendChild(noticeEl);
    }

    const config = readDriveConfig();
    if (config === null) {
      const missing = document.createElement('p');
      missing.className = 'drive-panel-error';
      missing.textContent = tr('configMissing');
      panel.appendChild(missing);
      body.appendChild(panel);
      updateStatus('', '', tr('statusError'));
      return;
    }

    const link = document.createElement('a');
    link.className = 'drive-connect-link';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = tr(isReconnect ? 'reconnectButton' : 'connectButton');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => {
      const attempt = consentAttempt;
      if (attempt === null) {
        event.preventDefault();
        return;
      }
      savePendingAuth(attempt);
      void awaitAuthorization(attempt);
    });
    panel.appendChild(link);

    const hint = document.createElement('p');
    hint.className = 'drive-panel-hint';
    hint.textContent = tr('connectHint');
    panel.appendChild(hint);

    const diagnostics = document.createElement('p');
    diagnostics.className = 'drive-panel-hint';
    diagnostics.textContent = tr('diagnosticsLabel') + ' ' + config.redirectUri;
    panel.appendChild(diagnostics);

    body.appendChild(panel);
    updateStatus(accountLabel(), '', tr('statusReady'));

    void prepareConsent(link, config);
  }

  /**
   * Generate the PKCE pair and point the connect link at Google's consent URL.
   *
   * The verifier and state have to reach `sessionStorage` before the browser
   * leaves this page, so they are generated here and persisted later, inside
   * the click handler. The link is a real `<a target="_blank">`, never
   * `window.open`: the flow navigates away, which a popup cannot survive
   * reliably, and this avoids depending on popup permissions.
   */
  async function prepareConsent(link: HTMLAnchorElement, config: DriveConfig): Promise<void> {
    consentAttempt = null;
    let pkce: { verifier: string; challenge: string };
    try {
      pkce = await generatePkce();
    } catch (error) {
      console.error('Drive PKCE generation failed.', error);
      renderNotice(tr('secureContextMissing'));
      return;
    }

    const state = generateState();
    consentAttempt = { verifier: pkce.verifier, state };
    link.href = buildConsentUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      state,
      codeChallenge: pkce.challenge,
    });
    link.removeAttribute('aria-disabled');
  }

  /**
   * Replace the connect panel with a single message.
   *
   * Used for failures that cannot be retried from here (no WebCrypto in this
   * context): re-running the panel builder would rebuild the link, and the
   * link re-arms the flow that just failed.
   */
  function renderNotice(message: string): void {
    clearChildren(body);
    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr('connectHeading');

    const text = document.createElement('p');
    text.className = 'drive-panel-error';
    text.textContent = message;

    panel.append(heading, text);
    body.appendChild(panel);
    updateStatus('', '', tr('statusError'));
  }

  /** Wait for the callback tab to publish the code, then validate and use it. */
  async function awaitAuthorization(attempt: ConsentAttempt): Promise<void> {
    notice = null;
    view = 'connecting';
    renderView();

    const pending = await consumePendingCode();
    if (pending === null) {
      notice = tr('connectTimeout');
      view = 'disconnected';
      renderView();
      return;
    }

    if (pending.state !== attempt.state) {
      clearPendingAuth();
      notice = tr('connectStateMismatch');
      view = 'disconnected';
      renderView();
      return;
    }

    await completeAuthorization(attempt, pending.code);
  }

  async function completeAuthorization(attempt: ConsentAttempt, code: string): Promise<void> {
    const config = readDriveConfig();
    if (config === null) {
      notice = tr('configMissing');
      view = 'disconnected';
      renderView();
      return;
    }

    const session = loadPendingAuth() ?? attempt;
    try {
      token = await exchangeCodeForToken({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code,
        codeVerifier: session.verifier,
        redirectUri: config.redirectUri,
      });
    } catch (error) {
      console.error('Drive token exchange failed.', error);
      clearPendingAuth();
      notice = tr('connectExchangeFailed');
      view = 'disconnected';
      renderView();
      return;
    }

    clearPendingAuth();
    consentAttempt = null;
    errorCode = null;
    await loadWorkspace();
  }

  // ── Workspace ──

  function disconnect(): void {
    token = null;
    workspaceFolder = null;
    files = [];
    accountEmail = null;
    editorFile = null;
    editorContent = '';
    editorBaselineRevision = null;
    newFileName = '';
    errorCode = null;
    notice = null;
    view = 'disconnected';
    renderView();
  }

  /** Return the live token, or drop to the reconnect screen when it is gone. */
  function requireToken(): DriveToken | null {
    if (token === null || isDriveTokenExpired(token)) {
      token = null;
      view = 'reconnect';
      renderView();
      return null;
    }
    return token;
  }

  function handleDriveError(error: DriveError): void {
    console.error(`Drive request failed (${error.code}): ${error.detail}`);
    if (error.code === 'auth-expired') {
      token = null;
      view = 'reconnect';
      renderView();
      return;
    }
    errorCode = error.code;
    view = 'error';
    renderView();
  }

  async function loadWorkspace(): Promise<void> {
    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const folder = await driveClient.ensureWorkspaceFolder(activeToken);
    if (!folder.ok) {
      setBusy(false);
      handleDriveError(folder.error);
      return;
    }
    workspaceFolder = folder.data;

    const listed = await driveClient.listFiles(activeToken, folder.data.id);
    if (!listed.ok) {
      setBusy(false);
      handleDriveError(listed.error);
      return;
    }
    files = listed.data;

    const authorized = await loadAccountEmail(activeToken);
    setBusy(false);
    if (!authorized) {
      view = 'reconnect';
      renderView();
      return;
    }

    editorFile = null;
    errorCode = null;
    view = 'list';
    renderView();
  }

  /** Read the account email for the status bar; `false` means the token died. */
  async function loadAccountEmail(activeToken: DriveToken): Promise<boolean> {
    const account = await driveClient.getAccountEmail(activeToken);
    if (account.ok) {
      accountEmail = account.data.email;
      return true;
    }
    if (account.error.code === 'auth-expired') {
      token = null;
      return false;
    }
    accountEmail = null;
    return true;
  }

  function accountLabel(): string {
    return `${tr('accountLabel')}: ${accountEmail ?? tr('anonymousAccount')}`;
  }

  // ── List view ──

  function buildListView(): void {
    toolbar.appendChild(createToolbarLabel(workspaceFolder?.name ?? DRIVE.WORKSPACE_FOLDER_NAME));
    toolbar.appendChild(createToolbarSpacer());
    toolbar.appendChild(createToolbarButton(tr('newFile'), () => {
      newFileName = '';
      view = 'newFile';
      renderView();
    }));
    toolbar.appendChild(createToolbarButton(tr('refresh'), () => {
      void loadWorkspace();
    }));
    toolbar.appendChild(createToolbarButton(tr('disconnect'), () => disconnect()));

    if (files.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'drive-empty';
      empty.textContent = tr('emptyFolder');
      body.appendChild(empty);
      updateStatus(fill(tr('fileCount'), { count: 0 }), accountLabel(), tr('statusReady'));
      return;
    }

    const list = document.createElement('div');
    list.className = 'drive-list';
    for (const file of files) list.appendChild(buildFileRow(file));
    body.appendChild(list);
    updateStatus(fill(tr('fileCount'), { count: files.length }), accountLabel(), tr('statusReady'));
  }

  function buildFileRow(file: DriveFile): HTMLElement {
    const row = document.createElement('div');
    row.className = 'drive-row';

    const nameCell = document.createElement('span');
    nameCell.className = 'drive-row-name';

    const icon = document.createElement('img');
    icon.className = 'drive-row-icon';
    icon.src = FILE_ICON;
    icon.width = 16;
    icon.height = 16;
    icon.alt = '';

    const name = document.createElement('span');
    name.className = 'drive-row-name-text';
    name.textContent = file.name;
    name.title = file.name;

    nameCell.append(icon, name);

    const metaCell = document.createElement('span');
    metaCell.className = 'drive-row-meta';
    metaCell.textContent = `${formatSize(file.size)} · ${formatDate(file.modifiedTime)}`;

    const actions = document.createElement('span');
    actions.className = 'drive-row-actions';
    actions.appendChild(createButton(tr('open'), 'drive-action-button', () => void openInViewer(file)));
    actions.appendChild(createButton(tr('edit'), 'drive-action-button', () => void openEditor(file)));
    actions.appendChild(createButton(tr('trash'), 'drive-action-button', () => void moveFileToTrash(file)));

    row.append(nameCell, metaCell, actions);
    return row;
  }

  /** Hand the file to the markdown viewer through the desktop open event. */
  async function openInViewer(file: DriveFile): Promise<void> {
    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const content = await driveClient.readFileContent(activeToken, file.id);
    setBusy(false);
    if (!content.ok) {
      handleDriveError(content.error);
      return;
    }

    const detail: { appId: string; appData: AppData } = {
      appId: OPEN_FILE_APP_ID,
      appData: {
        file: {
          name: stripMarkdownExtension(file.name),
          content: content.data,
          rawContent: content.data,
          folder: DRIVE.WORKSPACE_FOLDER_NAME,
          date: formatDate(file.modifiedTime),
        },
        windowKey: `drive/${file.id}`,
        title: file.name,
      },
    };
    window.dispatchEvent(new CustomEvent('desktop-open-app', { detail }));
  }

  async function openEditor(file: DriveFile): Promise<void> {
    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const content = await driveClient.readFileContent(activeToken, file.id);
    setBusy(false);
    if (!content.ok) {
      handleDriveError(content.error);
      return;
    }

    editorFile = file;
    editorContent = content.data;
    editorBaselineRevision = file.headRevisionId;
    view = 'editor';
    renderView();
  }

  // ── Editor ──

  function leaveEditor(): void {
    editorFile = null;
    editorBaselineRevision = null;
    editorContent = '';
    view = 'list';
    renderView();
  }

  function buildEditorView(): void {
    const file = editorFile;
    if (file === null) {
      view = 'list';
      renderView();
      return;
    }

    toolbar.appendChild(createToolbarLabel(file.name));
    toolbar.appendChild(createToolbarSpacer());
    toolbar.appendChild(createToolbarButton(tr('save'), () => void saveEditor()));
    toolbar.appendChild(createToolbarButton(tr('back'), () => leaveEditor()));

    const editor = document.createElement('div');
    editor.className = 'drive-editor';

    const textarea = document.createElement('textarea');
    textarea.className = 'drive-textarea';
    textarea.value = editorContent;
    textarea.spellcheck = false;
    textarea.setAttribute('aria-label', tr('editorLabel'));
    textarea.addEventListener('input', () => {
      editorContent = textarea.value;
    });

    editor.appendChild(textarea);
    body.appendChild(editor);
    updateStatus(file.name, tr('statusEditing'), tr('statusReady'));
    textarea.focus();
  }

  /**
   * Write the buffer back to Drive after a best-effort conflict check.
   *
   * The revision recorded when the file was opened is compared against the
   * current one and the user is warned when they differ. That check is NOT
   * atomic: Drive v3 offers no conditional update, so a change landing between
   * the comparison and the write still overwrites. The warning therefore talks
   * about "changed since you opened it", never about a safe write.
   */
  async function saveEditor(): Promise<void> {
    const file = editorFile;
    if (file === null) return;
    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const head = await driveClient.getHeadRevisionId(activeToken, file.id);
    if (!head.ok) {
      setBusy(false);
      handleDriveError(head.error);
      return;
    }

    const remoteRevision = head.data;
    const changedElsewhere =
      editorBaselineRevision !== null && remoteRevision !== null && remoteRevision !== editorBaselineRevision;

    if (changedElsewhere) {
      setBusy(false);
      const answer = await showMessageBox({
        title: tr('conflictTitle'),
        message: fill(tr('conflictMessage'), { name: file.name }),
        icon: 'warning',
        buttons: 'YesNo',
      });
      if (answer !== 'yes') return;
      setBusy(true);
    }

    const written = await driveClient.updateTextFile(activeToken, file.id, editorContent);
    setBusy(false);
    if (!written.ok) {
      handleDriveError(written.error);
      return;
    }

    const updated: DriveFile = {
      ...file,
      headRevisionId: written.data.headRevisionId,
      modifiedTime: written.data.modifiedTime,
      size: written.data.size,
    };
    files = files.map((entry) => (entry.id === file.id ? updated : entry));
    editorFile = updated;
    editorBaselineRevision = written.data.headRevisionId;
    view = 'list';
    renderView();
  }

  // ── New file ──

  function buildNewFileView(): void {
    toolbar.appendChild(createToolbarLabel(tr('newFileTitle')));
    toolbar.appendChild(createToolbarSpacer());
    toolbar.appendChild(createToolbarButton(tr('create'), () => void createFile()));
    toolbar.appendChild(createToolbarButton(tr('cancel'), () => {
      newFileName = '';
      view = 'list';
      renderView();
    }));

    const panel = document.createElement('div');
    panel.className = 'drive-panel drive-panel-left';

    const label = document.createElement('label');
    label.className = 'drive-field-label';
    label.htmlFor = 'drive-new-file-name';
    label.textContent = tr('fileNameLabel');

    const input = document.createElement('input');
    input.className = 'drive-field-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.value = newFileName;
    input.addEventListener('input', () => {
      newFileName = input.value;
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') void createFile();
    });

    const hint = document.createElement('p');
    hint.className = 'drive-panel-hint';
    hint.textContent = tr('newFileHint');

    panel.append(label, input, hint);
    body.appendChild(panel);
    updateStatus('', accountLabel(), tr('statusReady'));
    input.focus();
  }

  async function createFile(): Promise<void> {
    const folder = workspaceFolder;
    if (folder === null) return;
    const activeToken = requireToken();
    if (activeToken === null) return;

    const name = normalizeFileName(newFileName);
    if (name === null) {
      await showMessageBox({
        title: tr('newFileTitle'),
        message: tr('newFileInvalid'),
        icon: 'warning',
      });
      return;
    }

    setBusy(true);
    const created = await driveClient.createTextFile(activeToken, folder.id, name, '');
    setBusy(false);
    if (!created.ok) {
      handleDriveError(created.error);
      return;
    }

    files = [created.data, ...files];
    newFileName = '';
    view = 'list';
    renderView();
  }

  // ── Trash ──

  async function moveFileToTrash(file: DriveFile): Promise<void> {
    const activeToken = requireToken();
    if (activeToken === null) return;

    const answer = await showMessageBox({
      title: tr('trashTitle'),
      message: fill(tr('trashMessage'), { name: file.name }),
      icon: 'question',
      buttons: 'YesNo',
    });
    if (answer !== 'yes') return;

    setBusy(true);
    const trashed = await driveClient.trashFile(activeToken, file.id);
    setBusy(false);
    if (!trashed.ok) {
      handleDriveError(trashed.error);
      return;
    }

    files = files.filter((entry) => entry.id !== file.id);
    if (editorFile !== null && editorFile.id === file.id) {
      editorFile = null;
      editorBaselineRevision = null;
      editorContent = '';
      view = 'list';
    }
    renderView();
  }

  // ── Connecting / error ──

  function buildConnectingView(): void {
    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr('connectingHeading');

    const text = document.createElement('p');
    text.className = 'drive-panel-text';
    text.textContent = tr('connectingText');

    const spinner = document.createElement('div');
    spinner.className = 'drive-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', tr('connectingHeading'));

    panel.append(heading, text, spinner);
    body.appendChild(panel);
    updateStatus('', tr('statusWaiting'), tr('statusReady'));
  }

  function buildErrorView(): void {
    toolbar.appendChild(createToolbarButton(tr('retry'), () => void loadWorkspace()));
    toolbar.appendChild(createToolbarSpacer());
    toolbar.appendChild(createToolbarButton(tr('disconnect'), () => disconnect()));

    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr('errorHeading');

    const message = document.createElement('p');
    message.className = 'drive-panel-error';
    message.textContent =
      errorCode === null ? tr('unknownError') : getDriveErrorMessage(errorCode, getLang());

    panel.append(heading, message);

    if (errorCode === 'forbidden') {
      const hint = document.createElement('p');
      hint.className = 'drive-panel-hint';
      hint.textContent = tr('forbiddenHint');
      panel.appendChild(hint);
    }

    body.appendChild(panel);
    updateStatus('', accountLabel(), tr('statusError'));
  }

  renderView();
}

/**
 * Placeholder React component. The app registry requires a component, but the real
 * window is imperative os-gui DOM owned by launchDrive, like every other app here.
 */
export const DriveApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

