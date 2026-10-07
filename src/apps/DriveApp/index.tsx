import React from 'react';
import './index.css';
import { getCascadeOffset } from '../../utils/cascadePosition';
import { showMessageBox } from '../../utils/messageBox';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import {
  DROPDOWN_ARROW_SVG,
  SPRITE,
  createCompoundButton,
  createSeparator,
  createToolbarButton,
  ensureDisabledFilter,
  openViewsDropdown,
} from '../../utils/explorerChrome';
import type { ViewsRadioGroup } from '../../utils/explorerChrome';
import { driveClient } from '../../services/googleDrive/client';
import {
  launchDriveConnect,
  prepareDriveConnect,
  readDriveConfig,
} from '../../services/googleDrive/driveConnect';
import type {
  DriveConfig,
  DriveConnectArming,
  DriveConnectMessages,
  DriveConnectProgress,
} from '../../services/googleDrive/driveConnect';
import {
  clearDriveToken,
  clearDriveWorkspaceFolderId,
  getDriveToken,
  getUsableDriveToken,
  notifyDriveWorkspaceChanged,
  setDriveWorkspaceFolderId,
  subscribeDriveWorkspace,
} from '../../services/googleDrive/driveSession';
import { getDriveErrorMessage } from '../../services/googleDrive/errors';
import { DRIVE, LOCAL_STORAGE_KEYS } from '../../constants';
import type { DriveError, DriveErrorCode, DriveFile, DriveFolder, DriveToken } from '../../services/googleDrive/types';
import type {
  OsGuiMenuBar,
  OsGuiMenuDefinition,
  OsGuiMenuItem,
  OsGuiWindow,
} from '../../types/os-gui';
import type { AppData, File, RemoteSaveHandle, RemoteSaveResult } from '../../types';

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
  // The Recycle Bin can start the same flow, and the two would race for one
  // authorization code, so the message is not hypothetical: the flow is refused while
  // another window holds it, and this says why instead of leaving a dead link.
  connectInProgress: {
    es: 'Ya hay una conexión en curso en otra ventana. Esperá a que termine.',
    en: 'A connection is already in progress in another window. Wait for it to finish.',
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
  // ── Loading ──
  loadingHeading: { es: 'Abriendo Mi unidad', en: 'Opening My Drive' },
  loadingText: {
    es: 'Buscando los archivos de tu carpeta "{folder}" en Google Drive.',
    en: 'Looking for the files in your "{folder}" folder on Google Drive.',
  },
  newFile: { es: 'Nuevo', en: 'New' },
  // The seven rows of the Win98 "New" submenu. Only the text document is
  // implemented; the rest are greyed for visual parity with the reference
  // screenshot instead of dropped, because the shape of the menu is the point.
  menuNewFolder: { es: 'Carpeta', en: 'Folder' },
  menuNewShortcut: { es: 'Acceso directo', en: 'Shortcut' },
  menuNewSound: { es: 'Sonido', en: 'Wave Sound' },
  menuNewTextDocument: { es: 'Documento de texto', en: 'Text Document' },
  menuNewWordPad: { es: 'WordPad', en: 'WordPad Document' },
  menuNewImage: { es: 'Imagen', en: 'Bitmap Image' },
  menuNewBriefcase: { es: 'Maletín', en: 'Briefcase' },
  newDocumentDefaultName: { es: 'Nuevo documento de texto', en: 'New Text Document' },
  newFileInvalid: {
    es: 'Ese nombre no sirve. No puede estar vacío ni llevar / \\ : * ? " < > |',
    en: 'That name will not work. It cannot be empty or contain / \\ : * ? " < > |',
  },
  renameTitle: { es: 'Renombrar', en: 'Rename' },
  renameLabel: { es: 'Nombre', en: 'Name' },
  renameFailed: {
    es: 'No se pudo renombrar. El archivo quedó como "{name}".',
    en: 'Could not rename it. The file kept the name "{name}".',
  },
  refresh: { es: 'Actualizar', en: 'Refresh' },
  open: { es: 'Abrir', en: 'Open' },
  edit: { es: 'Editar', en: 'Edit' },
  trash: { es: 'Papelera', en: 'Trash' },
  back: { es: 'Volver', en: 'Back' },
  forward: { es: 'Adelante', en: 'Forward' },
  up: { es: 'Subir', en: 'Up' },
  views: { es: 'Vistas', en: 'Views' },
  retry: { es: 'Reintentar', en: 'Retry' },
  emptyFolder: {
    es: 'La carpeta está vacía. Usá Archivo ▸ Nuevo ▸ Documento de texto para crear el primero.',
    en: 'This folder is empty. Use File ▸ New ▸ Text Document to create the first one.',
  },
  conflictTitle: { es: 'El archivo cambió', en: 'The file changed' },
  conflictMessage: {
    es: '"{name}" cambió en Drive desde que lo abriste. Si guardás, se pisa la versión que está ahí ahora.',
    en: '"{name}" changed in Drive since you opened it. Saving overwrites the version that is there now.',
  },
  // ── Remote save (the editor shows these verbatim, so they live here) ──
  remoteSaveDone: {
    es: '"{name}" se guardó en Google Drive.',
    en: '"{name}" was saved to Google Drive.',
  },
  remoteSaveFailed: {
    es: 'No se pudo guardar "{name}" en Google Drive.',
    en: 'Could not save "{name}" to Google Drive.',
  },
  remoteSaveConflictAborted: {
    es: 'No se guardó nada: el archivo cambió en Drive y elegiste no pisarlo.',
    en: 'Nothing was saved: the file changed in Drive and you chose not to overwrite it.',
  },
  remoteSaveWindowClosed: {
    es: 'La ventana de Mi unidad se cerró, así que no se pudo guardar. Abrila de nuevo y editá el archivo otra vez.',
    en: 'The My Drive window was closed, so nothing could be saved. Open it again and edit the file once more.',
  },
  remoteSaveSignedOut: {
    es: 'La sesión de Mi unidad no está activa, así que no se pudo guardar. Conectá de nuevo y guardá otra vez.',
    en: 'The My Drive session is not active, so nothing could be saved. Connect again and save once more.',
  },
  trashTitle: { es: 'Mover a la papelera', en: 'Move to trash' },
  // Points at this desktop's own Recycle Bin, not at drive.google.com: the
  // desktop now has a window that lists exactly these files and restores them
  // back to the workspace folder, which is a better answer than "go to a
  // website that cannot see the rest of the app".
  trashMessage: {
    es: '"{name}" va a la papelera. Lo podés restaurar desde la Papelera del escritorio (ícono del escritorio o Inicio > Programas).',
    en: '"{name}" goes to the trash. You can restore it from the desktop Recycle Bin (desktop icon or Start > Programs).',
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
  statusReady: { es: 'Listo', en: 'Ready' },
  statusError: { es: 'Error', en: 'Error' },
  fileCount: { es: '{count} archivo(s)', en: '{count} file(s)' },
  sizeUnknown: { es: '?', en: '?' },
  dateUnknown: { es: 'sin fecha', en: 'no date' },
  accountLabel: { es: 'Cuenta', en: 'Account' },
  anonymousAccount: { es: 'Cuenta desconocida', en: 'Unknown account' },
  // ── Explorer chrome ──
  addressLabel: { es: 'Dirección', en: 'Address' },
  columnName: { es: 'Nombre', en: 'Name' },
  columnSize: { es: 'Tamaño', en: 'Size' },
  columnModified: { es: 'Modificado', en: 'Modified' },
  columnType: { es: 'Tipo', en: 'Type' },
  typeMarkdown: { es: 'Documento Markdown', en: 'Markdown Document' },
  panelSelectPrompt: {
    es: 'Seleccioná un elemento para ver su descripción.',
    en: 'Select an item to view its description.',
  },
  panelLineSize: { es: 'Tamaño: {value}', en: 'Size: {value}' },
  panelLineModified: { es: 'Modificado: {value}', en: 'Modified: {value}' },
  panelLineType: { es: 'Tipo: {value}', en: 'Type: {value}' },
  panelLineOpenHint: {
    es: 'Hacé doble clic para abrirlo.',
    en: 'Double click to open it.',
  },
  // ── Menus ──
  menuFile: { es: '&Archivo', en: '&File' },
  menuEdit: { es: '&Editar', en: '&Edit' },
  menuView: { es: '&Ver', en: '&View' },
  menuHelp: { es: 'A&yuda', en: '&Help' },
  menuNew: { es: '&Nuevo', en: '&New' },
  menuOpen: { es: '&Abrir', en: 'O&pen' },
  menuDelete: { es: '&Papelera', en: '&Delete' },
  menuRename: { es: 'Re&nombrar', en: 'Rena&me' },
  menuProperties: { es: 'P&ropiedades', en: 'P&roperties' },
  menuConnect: { es: '&Conectar', en: '&Connect' },
  menuDisconnect: { es: '&Desconectar', en: '&Disconnect' },
  menuClose: { es: '&Cerrar', en: '&Close' },
  menuUndo: { es: '&Deshacer', en: '&Undo' },
  menuCut: { es: 'Cor&tar', en: 'Cu&t' },
  menuCopy: { es: '&Copiar', en: '&Copy' },
  menuPaste: { es: '&Pegar', en: '&Paste' },
  menuToolbars: { es: '&Barras de herramientas', en: '&Toolbars' },
  menuStandardButtons: { es: 'Botones &estándar', en: '&Standard Buttons' },
  menuAddressBar: { es: 'Barra de &dirección', en: '&Address Bar' },
  menuStatusBar: { es: 'Barra de &estado', en: 'Status &Bar' },
  menuViewModeGroup: { es: 'Modo de vista', en: 'View mode' },
  menuViewLargeIcons: { es: 'Iconos &grandes', en: 'Lar&ge Icons' },
  menuViewSmallIcons: { es: 'Iconos &pequeños', en: 'S&mall Icons' },
  menuViewList: { es: '&Lista', en: '&List' },
  menuViewDetails: { es: '&Detalles', en: '&Details' },
  menuRefresh: { es: '&Actualizar', en: '&Refresh' },
  menuAbout: { es: '&Acerca de Mi unidad', en: '&About My Drive' },
  aboutTitle: { es: 'Acerca de Mi unidad', en: 'About My Drive' },
  aboutMessage: {
    es:
      'Mi unidad\n\nExplorá la carpeta "{folder}" de tu Google Drive. La app solo pide permiso sobre los archivos que ella misma crea.\n\nCuatro modos de vista: iconos grandes, iconos pequeños, lista y detalles.\n\nVersión 1.0',
    en:
      'My Drive\n\nBrowse the "{folder}" folder in your Google Drive. The app only asks for access to the files it creates itself.\n\nFour view modes: Large Icons, Small Icons, List, Details.\n\nVersion 1.0',
  },
};

// ─── Local types ──────────────────────────────────────────────────────────────

/**
 * The screens of this window.
 *
 * `loading` is not `connecting`: `connecting` waits on the *user* (they have to
 * approve access in another tab) and `loading` waits on the *network* (a usable
 * token already exists and the workspace is being fetched). They look alike on
 * screen but they mean opposite things, and collapsing them would make the
 * loading screen claim the user has to go approve something.
 *
 * The ordering mirrors Recycle Bin's `RecycleView`: the token check happens
 * before the loading screen is ever shown, so `disconnected`/`reconnect` is only
 * rendered when there is genuinely nothing to load with.
 */
type DriveView =
  | 'disconnected'
  | 'reconnect'
  | 'connecting'
  | 'loading'
  | 'list'
  | 'error';

/** Explorer view mode, mirroring the four modes of My Computer. */
type DriveViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST' | 'DETAILS';

/**
 * Per-handle save state.
 *
 * The revision the buffer was read at travels with the handle instead of with
 * the window: a remote handle outlives any single render, and rebaselining here
 * is what keeps the user's own second save from reading as somebody else's edit.
 */
interface RemoteSaveState {
  baselineRevision: string | null;
}

/**
 * Menu items as MenuBar.js actually reads them.
 *
 * `src/types/os-gui.d.ts` predates the shipped contract: it types `enabled` as a
 * plain boolean, gives `checkbox` no `type`, and has no `radioItems` group form.
 * The difference is load-bearing — a `function` `enabled` is re-evaluated on every
 * menu open (`MenuBar.js:1050` dispatches `update`, `:673` reads both `enabled`
 * and `checkbox.check`), and `checkbox.type === 'radio'` is what turns the check
 * mark into the radio dot (`:705-708`). Widening the shared declaration is the
 * proper fix but sits outside this work unit's edit surface.
 */
type DriveMenuItem =
  | (Omit<OsGuiMenuItem, 'enabled' | 'checkbox' | 'submenu'> & {
      enabled?: boolean | (() => boolean);
      checkbox?: { type?: 'radio' | 'checkbox'; check?: () => boolean; toggle?: () => void };
      submenu?: DriveMenuItem[];
    })
  | ViewsRadioGroup<DriveViewMode>;

const DRIVE_ICON = '/images/icons/drive-32x32.svg';
const FILE_ICON = '/images/icons/notepad-file-16x16.png';
const FILE_ICON_LARGE = '/images/icons/notepad-file-32x32.png';
const MARKDOWN_EXTENSION_PATTERN = /\.md$/i;
const ILLEGAL_FILENAME_PATTERN = /[\\/:*?"<>|]/;
const MAX_FILENAME_LENGTH = 120;
const OPEN_FILE_APP_ID = 'markdownViewer';
const EDIT_FILE_APP_ID = 'notepad';
const DRIVE_APP_ID = 'driveApp';
const LOGO_LINE_SRC = '/images/icons/wvline.gif';

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

/** File glyph markup. Sizes above 20 use the 32×32 sheet. */
function fileIconMarkup(size: number): string {
  const src = size > 20 ? FILE_ICON_LARGE : FILE_ICON;
  return `<img src="${src}" width="${size}" height="${size}" alt="" style="pointer-events:none;image-rendering:pixelated">`;
}

/** True when the keystroke belongs to a text field and must not be stolen. */
function isTextEntry(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

/**
 * Opens the Google Drive window as a native os-gui window with the Explorer
 * chrome shared by My Computer and My Documents.
 *
 * Two state machines run side by side: `view` picks the screen (connect →
 * workspace list, with failures landing on the error view), while
 * `selectedFileId` and `currentView` drive the selection model inside the list
 * screen. Because MenuBar re-reads a `function` `enabled` every time a menu
 * opens, the menus stay in sync with the selection without being rebuilt; only
 * the toolbar buttons need an explicit `syncEnabled()` pass.
 *
 * Editing is not a screen of this window: `Edit` hands the file to Notepad
 * together with a {@link RemoteSaveHandle} that writes back through this
 * closure. The window keeps no buffer, so nothing here can lose one.
 */
export function launchDrive(): void {
  const $Window = window.$Window;
  const MenuBar = window.MenuBar;

  if (!$Window || !MenuBar) {
    console.error(
      'os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.',
    );
    return;
  }

  if (activeWindow !== null) {
    activeWindow.show();
    activeWindow.focus();
    return;
  }

  ensureDisabledFilter();

  // The token is NOT window state: it lives in `driveSession`, because the
  // Recycle Bin is a separate os-gui window that has to restore into the same
  // workspace and `osWindowRegistry` cannot carry data between windows. Neither
  // is the *session* window state any more: closing My Drive leaves it running,
  // because the other window that reads it may be open right now and a close
  // button is not a consent decision. Exactly three things end the session — the
  // token expiring, a 401, and the Disconnect menu item — so the next launch has
  // to pick a live session up instead of waiting on the connect screen. Storage
  // is unchanged either way: nothing reaches localStorage or sessionStorage.
  let view: DriveView = 'disconnected';
  let errorCode: DriveErrorCode | null = null;
  let notice: string | null = null;
  let workspaceFolder: DriveFolder | null = null;
  let files: DriveFile[] = [];
  let accountEmail: string | null = null;
  /**
   * The in-place rename editor, as closure state rather than a saved node.
   *
   * Every render rebuilds the rows from scratch (see the view builders), so an
   * editor that held an `<input>` reference would be editing a node that no
   * longer exists after the next repaint. What survives is the id of the file
   * being edited plus its draft; the builders turn that pair into a fresh input
   * on each pass. `renamingFileId` is also the commit guard: clearing it before
   * the request goes out means the `blur` fired by tearing the input down finds
   * no editor and cannot start a second rename.
   */
  let renamingFileId: string | null = null;
  let renameDraft = '';
  /**
   * The armed connect this window's link points at, or `null` while it is unarmed.
   *
   * Window state rather than module state on purpose: two windows can hold two armed
   * link *targets* at the same time without harm, because an arming only becomes
   * shared storage when it is clicked. Whichever of them is clicked is the one whose
   * verifier the exchange has to use.
   */
  let consentArming: DriveConnectArming | null = null;
  let connectLinkEl: HTMLAnchorElement | null = null;
  let busy = false;
  /**
   * Flipped by `$win.onClosed` and never cleared: a remote save handle outlives
   * the window it was handed out by, and after the window is gone every write it
   * owns has to report a failure instead of touching detached DOM.
   */
  let windowClosed = false;

  // ── Selection / chrome state ──
  let selectedFileId: string | null = null;
  let selectedRowEl: HTMLElement | null = null;
  // Large icons on purpose: the window opens on a folder of documents, and the
  // grid is the view that says "here is your stuff" before anyone picks a mode.
  let currentView: DriveViewMode = 'LARGE_ICONS';
  let statusBarVisible = true;
  let stdToolbarVisible = true;
  let addrBarVisible = true;
  /** Set by the screens that render a failure, reset on every render pass. */
  let statusKind: 'ready' | 'error' = 'ready';

  const title = tr('windowTitle');
  const $win = $Window({
    title,
    icons: {
      16: DRIVE_ICON,
      32: DRIVE_ICON,
    },
    // The standard-buttons toolbar needs ~610px of content (9 buttons at 54px,
    // 2 compound at 70px, 2 separators, drag handle). `.os-explorer .toolbar`
    // is `overflow: hidden` on desktop, so anything narrower silently clips
    // buttons instead of scrolling them.
    minWidth: 640,
    minHeight: 320,
  });

  $win.css({ width: '820px', height: '580px' });
  $win.center();
  const cascadeOffset = getCascadeOffset();
  $win.css({ left: parseInt($win.css('left')) + cascadeOffset, top: parseInt($win.css('top')) + cascadeOffset });
  activeWindow = $win;
  registerOsWindow($win, DRIVE_APP_ID, title, DRIVE_ICON);

  /**
   * Repaints the listing when the workspace changes under this window.
   *
   * The Recycle Bin restores into the same folder from its own os-gui window, so
   * without this the restored file stays invisible here until someone presses F5.
   * Gated on `canRefresh()` — the same predicate F5 and the toolbar button use —
   * because a notification that lands while a request is in flight, or on any
   * screen other than the list, has nothing to repaint, and a second concurrent
   * `loadWorkspace` would race the first one over `files` and the view state.
   */
  const unsubscribeWorkspace = subscribeDriveWorkspace(() => {
    if (windowClosed) return;
    if (!canRefresh()) return;
    void loadWorkspace();
  });

  $win.onClosed(() => {
    activeWindow = null;
    // The session outlives this window on purpose: `driveSession` owns it, the
    // Recycle Bin is a reader of the same token and may still be open, and the
    // window is not where the consent decision was made. So neither the token
    // nor the workspace folder id is cleared here — only the session's own exit
    // paths (expiry, a 401, Disconnect) end it. What does die here is window
    // state, and the guard below is what keeps a listener that outlives this
    // window from rebuilding the listing into a detached tree.
    accountEmail = null;
    windowClosed = true;
    // Unsubscribing is not optional, for the same reason the Recycle Bin does it:
    // a listener that outlives its window would rebuild the listing into a
    // detached tree on the next restore.
    unsubscribeWorkspace();
    document.removeEventListener('keydown', handleKeyDown);
  });

  // ══════════════════════════════════════════════════════════════════
  // EXPLORER CHROME
  // ══════════════════════════════════════════════════════════════════
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer';
  explorer.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
    font-size: 11px;
  `;

  // ── Toolbars ──
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  const menuToolbarEl = document.createElement('div');
  menuToolbarEl.className = 'toolbar';

  const stdToolbarEl: HTMLElement = document.createElement('div');
  stdToolbarEl.className = 'toolbar';
  stdToolbarEl.id = 'standard-buttons-toolbar';

  const stdDragHandle = document.createElement('div');
  stdDragHandle.className = 'toolbar-drag-handle';
  stdToolbarEl.appendChild(stdDragHandle);

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';
  stdToolbarEl.appendChild(stdButtons);

  const addrToolbarEl: HTMLElement = document.createElement('div');
  addrToolbarEl.className = 'toolbar';
  addrToolbarEl.id = 'address-bar-toolbar';

  const addrDragHandle = document.createElement('div');
  addrDragHandle.className = 'toolbar-drag-handle';
  addrToolbarEl.appendChild(addrDragHandle);

  const addrBar = document.createElement('div');
  addrBar.id = 'address-bar';

  const addrLabel = document.createElement('label');
  addrLabel.setAttribute('for', 'address');
  addrLabel.textContent = tr('addressLabel');
  addrBar.appendChild(addrLabel);

  const compoundInput = document.createElement('div');
  compoundInput.id = 'address-compound-input';
  compoundInput.className = 'inset-deep';

  const addrIcon = document.createElement('img');
  addrIcon.id = 'address-icon';
  addrIcon.width = 16;
  addrIcon.height = 16;
  addrIcon.src = DRIVE_ICON;
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  // Decorative, like in My Documents: the input is never edited, it only names
  // the folder.
  const addrInput = document.createElement('input');
  addrInput.type = 'text';
  addrInput.id = 'address';
  addrInput.autocomplete = 'off';
  addrInput.readOnly = true;
  compoundInput.appendChild(addrInput);

  const addrDropdown = document.createElement('button');
  addrDropdown.type = 'button';
  addrDropdown.id = 'address-dropdown-button';
  addrDropdown.className = 'lightweight';
  addrDropdown.disabled = true;
  addrDropdown.innerHTML = DROPDOWN_ARROW_SVG;
  compoundInput.appendChild(addrDropdown);

  addrBar.appendChild(compoundInput);
  addrToolbarEl.appendChild(addrBar);

  toolbars.append(menuToolbarEl, stdToolbarEl, addrToolbarEl);
  explorer.appendChild(toolbars);

  // ── Content area with the left info panel ──
  const contentArea = document.createElement('div');
  contentArea.className = 'content-with-panel inset-deep';

  const panelEl: HTMLElement = document.createElement('div');
  panelEl.id = 'panel';

  const panelFolderIcon: HTMLImageElement = document.createElement('img');
  panelFolderIcon.className = 'panel-folder-icon';
  panelFolderIcon.src = DRIVE_ICON;
  panelFolderIcon.width = 32;
  panelFolderIcon.height = 32;
  panelFolderIcon.alt = '';
  panelEl.appendChild(panelFolderIcon);

  const panelTitle: HTMLParagraphElement = document.createElement('p');
  panelTitle.className = 'panel-title';
  panelEl.appendChild(panelTitle);

  const logoLine = document.createElement('p');
  logoLine.className = 'panel-logoline';
  const logoImg = document.createElement('img');
  logoImg.src = LOGO_LINE_SRC;
  logoImg.width = 100;
  logoImg.height = 1;
  logoImg.style.width = '100%';
  logoImg.alt = '';
  logoLine.appendChild(logoImg);
  panelEl.appendChild(logoLine);

  const infoP = document.createElement('p');
  infoP.className = 'panel-info';
  const panelInfo: HTMLSpanElement = document.createElement('span');
  panelInfo.id = 'panel-info';
  infoP.appendChild(panelInfo);
  panelEl.appendChild(infoP);

  contentArea.appendChild(panelEl);

  const contentEl: HTMLElement = document.createElement('div');
  contentEl.id = 'content';
  contentArea.appendChild(contentEl);

  explorer.appendChild(contentArea);

  // ── Status bar ──
  const statusBarEl: HTMLElement = document.createElement('div');
  statusBarEl.id = 'status-bar';

  const statusLeftEl: HTMLElement = document.createElement('div');
  statusLeftEl.id = 'status-bar-left';
  statusLeftEl.className = 'inset-shallow';

  const statusMiddleEl: HTMLElement = document.createElement('div');
  statusMiddleEl.id = 'status-bar-middle';
  statusMiddleEl.className = 'inset-shallow';

  const statusRightEl: HTMLElement = document.createElement('div');
  statusRightEl.id = 'status-bar-right';
  statusRightEl.className = 'inset-shallow';

  statusBarEl.append(statusLeftEl, statusMiddleEl, statusRightEl);
  explorer.appendChild(statusBarEl);

  $win.$content.append(explorer);

  // ── Menu bar ──
  //
  // Built once. Every `enabled` is a thunk and every `checkbox.check` reads live
  // state, so opening a menu after a selection or view change shows the truth
  // without rebuilding the MenuBar.
  const menu: OsGuiMenuBar = createMenuBar({
    [tr('menuFile')]: [
      {
        label: tr('menuNew'),
        enabled: () => canCreateDocument(),
        // A real submenu, matching the Win98 folder menu: seven rows, one live
        // action. The greyed rows are the reference screenshot's shape, not
        // hidden features; creating folders, sounds and shortcuts is out of
        // scope for this window today.
        submenu: [
          { label: tr('menuNewFolder'), enabled: false },
          { label: tr('menuNewShortcut'), enabled: false },
          { label: tr('menuNewSound'), enabled: false },
          { label: tr('menuNewTextDocument'), action: () => void createNewDocument() },
          { label: tr('menuNewWordPad'), enabled: false },
          { label: tr('menuNewImage'), enabled: false },
          { label: tr('menuNewBriefcase'), enabled: false },
        ],
      },
      { separator: true },
      {
        label: tr('menuOpen'),
        shortcutLabel: 'Ctrl+O',
        enabled: () => hasSelection(),
        action: openSelectedInViewer,
      },
      {
        label: tr('menuDelete'),
        enabled: () => hasSelection(),
        action: trashSelected,
      },
      { label: tr('menuRename'), enabled: () => canRename(), action: renameSelected },
      { label: tr('menuProperties'), enabled: false },
      { separator: true },
      {
        label: tr('menuConnect'),
        enabled: () => connectLinkEl !== null,
        action: activateConnectLink,
      },
      {
        label: tr('menuDisconnect'),
        enabled: () => getDriveToken() !== null,
        action: disconnect,
      },
      { separator: true },
      { label: tr('menuClose'), action: closeCurrentView },
    ],
    [tr('menuEdit')]: [
      { label: tr('menuUndo'), shortcutLabel: 'Ctrl+Z', enabled: false },
      { separator: true },
      { label: tr('menuCut'), shortcutLabel: 'Ctrl+X', enabled: false },
      { label: tr('menuCopy'), shortcutLabel: 'Ctrl+C', enabled: false },
      { label: tr('menuPaste'), shortcutLabel: 'Ctrl+V', enabled: false },
    ],
    [tr('menuView')]: [
      {
        label: tr('menuToolbars'),
        submenu: [
          {
            label: tr('menuStandardButtons'),
            checkbox: {
              type: 'checkbox',
              check: () => stdToolbarVisible,
              toggle: () => {
                stdToolbarVisible = !stdToolbarVisible;
                syncChromeVisibility();
              },
            },
          },
          {
            label: tr('menuAddressBar'),
            checkbox: {
              type: 'checkbox',
              check: () => addrBarVisible,
              toggle: () => {
                addrBarVisible = !addrBarVisible;
                syncChromeVisibility();
              },
            },
          },
        ],
      },
      {
        label: tr('menuStatusBar'),
        checkbox: {
          type: 'checkbox',
          check: () => statusBarVisible,
          toggle: () => {
            statusBarVisible = !statusBarVisible;
            syncChromeVisibility();
          },
        },
      },
      { separator: true },
      viewModeGroup(),
      { separator: true },
      {
        label: tr('menuRefresh'),
        shortcutLabel: 'F5',
        enabled: () => canRefresh(),
        action: () => void loadWorkspace(),
      },
    ],
    [tr('menuHelp')]: [
      {
        label: tr('menuAbout'),
        action: () => {
          void showMessageBox({
            title: tr('aboutTitle'),
            message: fill(tr('aboutMessage'), { folder: DRIVE.WORKSPACE_FOLDER_NAME }),
            icon: 'info',
          });
        },
      },
    ],
  });

  menuToolbarEl.appendChild(menu.element);

  // ══════════════════════════════════════════════════════════════════
  // STATE PREDICATES
  // ══════════════════════════════════════════════════════════════════

  /** The list view is the only screen where a row can be selected. */
  function hasSelection(): boolean {
    return view === 'list' && selectedFile() !== null;
  }

  function canRefresh(): boolean {
    return !busy && view === 'list';
  }

  /** Screens with browsable content keep the descriptive left panel. */
  function hasLeftPanel(): boolean {
    return view === 'list';
  }

  /** Screens with actions to trigger show the standard buttons row. */
  function hasStandardToolbar(): boolean {
    return view === 'list' || view === 'error';
  }

  function selectedFile(): DriveFile | null {
    if (selectedFileId === null) return null;
    return files.find((file) => file.id === selectedFileId) ?? null;
  }

  // ══════════════════════════════════════════════════════════════════
  // CHROME SYNCHRONIZATION
  // ══════════════════════════════════════════════════════════════════

  /**
   * Applies the View > Toolbars / Status Bar toggles on top of what the current
   * screen allows. A screen can hide a bar, never force one the user turned off.
   */
  function syncChromeVisibility(): void {
    const withPanel = hasLeftPanel();
    panelEl.style.display = withPanel ? '' : 'none';
    contentArea.classList.toggle('drive-no-panel', !withPanel);
    stdToolbarEl.style.display = hasStandardToolbar() && stdToolbarVisible ? '' : 'none';
    addrToolbarEl.style.display = addrBarVisible ? '' : 'none';
    statusBarEl.style.display = statusBarVisible ? '' : 'none';
  }

  /** The address always names the workspace folder: editing happens elsewhere. */
  function syncAddressBar(): void {
    addrInput.value = workspaceFolder?.name ?? DRIVE.WORKSPACE_FOLDER_NAME;
  }

  function syncStatusBar(): void {
    const connected = hasLeftPanel() || view === 'error';
    statusLeftEl.textContent = connected ? fill(tr('fileCount'), { count: files.length }) : '';
    statusMiddleEl.textContent = view === 'connecting' ? tr('statusWaiting') : accountLabel();
    statusRightEl.textContent = busy
      ? tr('statusWorking')
      : statusKind === 'error'
        ? tr('statusError')
        : tr('statusReady');
  }

  /** The left panel always describes the selection, or prompts for one. */
  function syncPanel(): void {
    if (!hasLeftPanel()) return;

    panelFolderIcon.src = DRIVE_ICON;
    panelTitle.textContent = workspaceFolder?.name ?? DRIVE.WORKSPACE_FOLDER_NAME;
    const file = selectedFile();
    renderPanelInfo(file === null ? [tr('panelSelectPrompt')] : describeFile(file));
  }

  /** Panel lines: bold name first, then `Label: value` rows. */
  function describeFile(file: DriveFile): string[] {
    return [
      file.name,
      fill(tr('panelLineSize'), { value: formatSize(file.size) }),
      fill(tr('panelLineModified'), { value: formatDate(file.modifiedTime) }),
      fill(tr('panelLineType'), { value: tr('typeMarkdown') }),
      tr('panelLineOpenHint'),
    ];
  }

  /** Builds panel text with DOM nodes, never innerHTML: names come from Drive. */
  function renderPanelInfo(lines: string[]): void {
    clearChildren(panelInfo);
    const head = document.createElement('strong');
    head.textContent = lines[0] ?? '';
    panelInfo.appendChild(head);
    for (const line of lines.slice(1)) {
      panelInfo.appendChild(document.createElement('br'));
      panelInfo.appendChild(document.createTextNode(line));
    }
  }

  function setBusy(value: boolean): void {
    busy = value;
    syncStatusBar();
    syncEnabled();
  }

  // ══════════════════════════════════════════════════════════════════
  // STANDARD BUTTONS
  // ══════════════════════════════════════════════════════════════════

  let backBtn: HTMLDivElement | null = null;
  let forwardBtn: HTMLDivElement | null = null;
  let upBtn: HTMLButtonElement | null = null;
  let newBtn: HTMLButtonElement | null = null;
  let openBtn: HTMLButtonElement | null = null;
  let editBtn: HTMLButtonElement | null = null;
  let deleteBtn: HTMLButtonElement | null = null;
  let refreshBtn: HTMLButtonElement | null = null;
  let viewsBtn: HTMLDivElement | null = null;
  let retryBtn: HTMLButtonElement | null = null;

  /**
   * Rebuilds the standard buttons for the current screen.
   *
   * The row is rebuilt rather than hidden because the error screen offers a
   * different action (Retry) than the list screen.
   */
  function renderStandardButtons(): void {
    clearChildren(stdButtons);
    backBtn = null;
    forwardBtn = null;
    upBtn = null;
    newBtn = null;
    openBtn = null;
    editBtn = null;
    deleteBtn = null;
    refreshBtn = null;
    viewsBtn = null;
    retryBtn = null;

    if (!hasStandardToolbar()) return;

    if (view === 'error') {
      retryBtn = createToolbarButton(tr('retry'), SPRITE.refresh);
      retryBtn.addEventListener('click', () => void loadWorkspace());
      stdButtons.appendChild(retryBtn);
      return;
    }

    // Navigation buttons stay disabled for visual parity with My Computer: Drive
    // has a single folder, so there is nowhere to go back, forward or up to.
    backBtn = createCompoundButton(tr('back'), SPRITE.back, () => {}, () => {}, true);
    forwardBtn = createCompoundButton(tr('forward'), SPRITE.forward, () => {}, () => {}, true);
    stdButtons.append(backBtn, forwardBtn);

    upBtn = createToolbarButton(tr('up'), SPRITE.up);
    stdButtons.appendChild(upBtn);
    stdButtons.appendChild(createSeparator());

    newBtn = createToolbarButton(tr('newFile'), SPRITE.newFile);
    newBtn.addEventListener('click', () => void createNewDocument());

    openBtn = createToolbarButton(tr('open'), SPRITE.open);
    openBtn.addEventListener('click', openSelectedInViewer);

    editBtn = createToolbarButton(tr('edit'), SPRITE.edit);
    editBtn.addEventListener('click', openSelectedInEditor);

    deleteBtn = createToolbarButton(tr('trash'), SPRITE.delete);
    deleteBtn.addEventListener('click', trashSelected);

    stdButtons.append(newBtn, openBtn, editBtn, deleteBtn);
    stdButtons.appendChild(createSeparator());

    refreshBtn = createToolbarButton(tr('refresh'), SPRITE.refresh);
    refreshBtn.addEventListener('click', () => void loadWorkspace());

    viewsBtn = createCompoundButton(tr('views'), SPRITE.viewLargeIcons, cycleViewMode, openViewsMenu);

    stdButtons.append(refreshBtn, viewsBtn);
  }

  function setDisabled(button: HTMLButtonElement | null, disabled: boolean): void {
    if (button !== null) button.disabled = disabled;
  }

  /** A compound wrapper owns two controls; both have to track `disabled`. */
  function setCompoundDisabled(wrapper: HTMLDivElement | null, disabled: boolean): void {
    if (wrapper === null) return;
    wrapper.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = disabled;
    });
  }

  /**
   * Re-evaluates every toolbar button against the current selection and screen.
   *
   * This doubles as the double-click guard: `setBusy(true)` runs before each
   * Drive request, and every button that starts one reads `busy` here.
   */
  function syncEnabled(): void {
    const selectable = hasSelection();
    setCompoundDisabled(backBtn, true);
    setCompoundDisabled(forwardBtn, true);
    setDisabled(upBtn, true);
    setDisabled(newBtn, !canCreateDocument());
    setDisabled(openBtn, busy || !selectable);
    setDisabled(editBtn, busy || !selectable);
    setDisabled(deleteBtn, busy || !selectable);
    setDisabled(refreshBtn, busy || !canRefresh());
    setCompoundDisabled(viewsBtn, busy || view !== 'list');
    setDisabled(retryBtn, busy);
  }

  // ── Views dropdown ──

  /**
   * Cycles LARGE_ICONS → SMALL_ICONS → LIST → LARGE_ICONS, matching 98.js,
   * where the compound button advances instead of opening the dropdown.
   */
  function cycleViewMode(): void {
    if (view !== 'list') return;
    const cycle: DriveViewMode[] = ['LARGE_ICONS', 'SMALL_ICONS', 'LIST'];
    const index = cycle.indexOf(currentView);
    currentView = index === -1 ? 'LARGE_ICONS' : cycle[(index + 1) % cycle.length];
    renderView();
  }

  function setCurrentView(mode: DriveViewMode): void {
    if (view !== 'list' || currentView === mode) return;
    currentView = mode;
    renderView();
  }

  /** The four view modes as an os-gui radio group, shared by both entry points. */
  function viewModeGroup(): ViewsRadioGroup<DriveViewMode> {
    return {
      ariaLabel: tr('menuViewModeGroup'),
      getValue: () => currentView,
      setValue: (value) => setCurrentView(value),
      radioItems: [
        { label: tr('menuViewLargeIcons'), value: 'LARGE_ICONS', enabled: () => view === 'list' },
        { label: tr('menuViewSmallIcons'), value: 'SMALL_ICONS', enabled: () => view === 'list' },
        { label: tr('menuViewList'), value: 'LIST', enabled: () => view === 'list' },
        { label: tr('menuViewDetails'), value: 'DETAILS', enabled: () => view === 'list' },
      ],
    };
  }

  /**
   * Opens the Views dropdown through the shared helper, reusing the same radio
   * group the View menu uses so both entry points cannot disagree.
   */
  function openViewsMenu(event: Event): void {
    const group = viewModeGroup();
    openViewsDropdown({
      event,
      ariaLabel: group.ariaLabel,
      rows: group.radioItems,
      getValue: group.getValue,
      setValue: group.setValue,
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // KEYBOARD
  // ══════════════════════════════════════════════════════════════════

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;

    // Menus run their own keyboard handling and mark the event as handled.
    const active = document.activeElement;
    if (active !== null && active.closest('.menu-popup') !== null) return;

    if (event.ctrlKey || event.metaKey) {
      const key = event.key.toLowerCase();
      if (key === 'o') {
        event.preventDefault();
        if (hasSelection()) openSelectedInViewer();
      }
      return;
    }

    if (event.altKey) return;
    if (isTextEntry(event.target)) return;

    switch (event.key) {
      case 'F5':
        event.preventDefault();
        if (canRefresh()) void loadWorkspace();
        return;
      case 'Delete':
        if (hasSelection()) {
          event.preventDefault();
          trashSelected();
        }
        return;
      case 'Enter':
        if (hasSelection()) {
          event.preventDefault();
          openSelectedInViewer();
        }
        return;
      default:
        break;
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════

  function renderView(): void {
    statusKind = 'ready';
    connectLinkEl = null;

    renderStandardButtons();
    clearChildren(contentEl);

    switch (view) {
      case 'reconnect':
        buildConnectView(true);
        break;
      case 'connecting':
        buildConnectingView();
        break;
      case 'loading':
        buildLoadingView();
        break;
      case 'list':
        buildListView();
        break;
      case 'error':
        statusKind = 'error';
        buildErrorView();
        break;
      case 'disconnected':
      default:
        buildConnectView(false);
        break;
    }

    syncChromeVisibility();
    syncAddressBar();
    syncPanel();
    syncEnabled();
    syncStatusBar();

    // A view-mode change replaces every row, so the selected one has to take
    // focus back: without it the row is highlighted but inert, and keyboard
    // actions (Delete, Enter) would no longer reach the selection. While an
    // in-place rename is active the focus belongs to its input instead, and the
    // row focus would pull the caret out of it mid-edit.
    if (view === 'list' && renamingFileId !== null) {
      const renameInput = contentEl.querySelector<HTMLInputElement>('.drive-rename-input');
      if (renameInput !== null) {
        renameInput.focus();
        renameInput.select();
      }
    } else if (view === 'list' && selectedRowEl !== null) {
      selectedRowEl.focus();
    }
  }

  // ── Authorization ──

  /**
   * Render the connect (or reconnect) panel.
   *
   * The panel only *asks*: the actual link target is produced by `armConnectLink`,
   * so the flow cannot start before a verifier exists.
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
      statusKind = 'error';
      contentEl.appendChild(panel);
      return;
    }

    const link = document.createElement('a');
    link.className = 'drive-connect-link';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = tr(isReconnect ? 'reconnectButton' : 'connectButton');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => {
      const arming = consentArming;
      if (arming === null) {
        event.preventDefault();
        return;
      }
      const launch = launchDriveConnect(arming, connectMessages(), connectProgress());
      if (launch.started) return;
      // Another window owns the flow. Refusing the navigation is the whole point of
      // the claim: a second Google tab would publish a second code for one
      // single-use exchange, and the window that is waiting would lose the race for it.
      event.preventDefault();
      notice = tr('connectInProgress');
      renderView();
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

    contentEl.appendChild(panel);
    connectLinkEl = link;

    void armConnectLink(link, config);
  }

  /** `File > Connect` reuses the real link so the PKCE flow stays in one place. */
  function activateConnectLink(): void {
    connectLinkEl?.click();
  }

  /**
   * Failure copy for the shared flow, read from this window's own table.
   *
   * Built per launch rather than frozen at module scope: `tr` resolves the language
   * when it is called, so a table built at import time would answer in whatever
   * language was active while the bundle loaded.
   */
  function connectMessages(): DriveConnectMessages {
    return {
      configMissing: tr('configMissing'),
      timeout: tr('connectTimeout'),
      stateMismatch: tr('connectStateMismatch'),
      exchangeFailed: tr('connectExchangeFailed'),
    };
  }

  /**
   * How the shared flow paints itself in this window: the same states, the same
   * screens and the same order it built itself before the flow moved out of the
   * closure. Only the ownership moved.
   */
  function connectProgress(): DriveConnectProgress {
    return {
      onConnecting: () => {
        notice = null;
        view = 'connecting';
        renderView();
      },
      onFailed: (message) => {
        notice = message;
        view = 'disconnected';
        renderView();
      },
      onConnected: () => {
        // Dropped before the load: `loadWorkspace` never rebuilds the connect panel,
        // so an arming left behind would still be clickable behind the listing.
        consentArming = null;
        errorCode = null;
        void loadWorkspace();
      },
    };
  }

  /**
   * Generate the PKCE pair and point the connect link at Google's consent URL.
   *
   * The verifier and state have to reach `sessionStorage` before the browser
   * leaves this page, so they are generated here and persisted later, inside
   * the click handler — `launchDriveConnect` does that persist. The link is a
   * real `<a target="_blank">`, never `window.open`: the flow navigates away,
   * which a popup cannot survive reliably, and this avoids depending on popup
   * permissions.
   */
  async function armConnectLink(link: HTMLAnchorElement, config: DriveConfig): Promise<void> {
    consentArming = null;
    const arming = await prepareDriveConnect(config);
    if (arming === null) {
      renderNotice(tr('secureContextMissing'));
      return;
    }

    consentArming = arming;
    link.href = arming.consentUrl;
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
    clearChildren(contentEl);
    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr('connectHeading');

    const text = document.createElement('p');
    text.className = 'drive-panel-error';
    text.textContent = message;

    panel.append(heading, text);
    contentEl.appendChild(panel);
    statusKind = 'error';
  }

  // ── Workspace ──

  function disconnect(): void {
    clearDriveToken();
    clearDriveWorkspaceFolderId();
    workspaceFolder = null;
    files = [];
    accountEmail = null;
    errorCode = null;
    notice = null;
    selectedFileId = null;
    selectedRowEl = null;
    // The editor dies with the session it was editing against: reopening the
    // same file id after a reconnect would otherwise resurrect a draft.
    renamingFileId = null;
    renameDraft = '';
    view = 'disconnected';
    renderView();
  }

/** Return the live token, or drop to the reconnect screen when it is gone. */
  function requireToken(): DriveToken | null {
    const activeToken = getUsableDriveToken();
    if (activeToken === null) {
      clearDriveToken();
      view = 'reconnect';
      renderView();
      return null;
    }
    return activeToken;
  }

  function handleDriveError(error: DriveError): void {
    console.error(`Drive request failed (${error.code}): ${error.detail}`);
    if (error.code === 'auth-expired') {
      clearDriveToken();
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

    // A usable token is the whole difference between the connect screen and a load
    // in progress, so the loading screen goes up HERE, synchronously, before the
    // first `await`. Reopening the window with a live session used to leave the
    // connect screen on the DOM until the listing came back, which read as a
    // broken app. This is the same ordering Recycle Bin's `loadTrash` uses.
    //
    // `setBusy` first so the very first painted frame already says "Working…":
    // it only syncs the status bar and the buttons, not the content area, so the
    // `renderView` below is still what paints the spinner.
    view = 'loading';
    setBusy(true);
    renderView();

    const folder = await driveClient.ensureWorkspaceFolder(activeToken);
    if (!folder.ok) {
      setBusy(false);
      handleDriveError(folder.error);
      return;
    }
    workspaceFolder = folder.data;
    // Published so the Recycle Bin can restore into the same folder without
    // having to rediscover it: My Drive is the window that guarantees the
    // folder exists, and it cannot pass the id through `osWindowRegistry`.
    setDriveWorkspaceFolderId(folder.data.id);

    const listed = await driveClient.listFiles(activeToken, folder.data.id);
    if (!listed.ok) {
      setBusy(false);
      handleDriveError(listed.error);
      return;
    }
    files = listed.data;
    // Called here rather than next to the selection below, because
    // `loadAccountEmail` can bail out to the reconnect screen in between and
    // that early return has already replaced `files`. Placing it up here keeps
    // the invariant true on every path that can drop the edited file, not only
    // on the one that reaches the bottom of this function.
    dropEditorIfFileIsGone();

    const authorized = await loadAccountEmail(activeToken);
    setBusy(false);
    if (!authorized) {
      view = 'reconnect';
      renderView();
      return;
    }

    errorCode = null;
    // A refresh can drop the file that was selected; keep the selection only
    // when the refreshed listing still contains it.
    if (selectedFile() === null) selectedFileId = null;
    selectedRowEl = null;
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
      clearDriveToken();
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
    // The rows about to be built replace the current DOM, so the previous
    // row reference is already detached. Drop it before rebuilding; `bindItem`
    // re-points it at whichever row matches `selectedFileId`.
    selectedRowEl = null;

    if (files.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'drive-empty';
      empty.textContent = tr('emptyFolder');
      contentEl.appendChild(empty);
      return;
    }

    switch (currentView) {
      case 'LARGE_ICONS':
        contentEl.appendChild(buildLargeIconsView());
        break;
      case 'LIST':
        contentEl.appendChild(buildTableView(false));
        break;
      case 'DETAILS':
        contentEl.appendChild(buildTableView(true));
        break;
      case 'SMALL_ICONS':
      default:
        contentEl.appendChild(buildSmallIconsView());
        break;
    }
  }

  /** Builds the large icons view — a wrapping grid of 32×32 glyphs. */
  function buildLargeIconsView(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'drive-view drive-view-large';
    grid.setAttribute('role', 'listbox');

    for (const file of files) {
      const item = document.createElement('div');
      item.className = 'drive-item drive-item-large';
      item.title = file.name;
      item.setAttribute('role', 'option');

      const icon = document.createElement('div');
      icon.className = 'drive-item-icon';
      icon.innerHTML = fileIconMarkup(32);

      item.append(icon, buildNameNode(file, 'drive-item-label'));
      bindItem(item, file);
      grid.appendChild(item);
    }

    return grid;
  }

  /** Builds the small icons view — 16×16 glyphs with the label to the right. */
  function buildSmallIconsView(): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'drive-view drive-view-small';
    grid.setAttribute('role', 'listbox');

    for (const file of files) {
      const item = document.createElement('div');
      item.className = 'drive-item drive-item-small';
      item.title = file.name;
      item.setAttribute('role', 'option');

      const icon = document.createElement('span');
      icon.className = 'drive-item-icon';
      icon.innerHTML = fileIconMarkup(16);

      item.append(icon, buildNameNode(file, 'drive-item-label'));
      bindItem(item, file);
      grid.appendChild(item);
    }

    return grid;
  }

  /**
   * Builds the list and details views.
   *
   * Both are tables; Details adds the Type column, which is the difference
   * between "see the files" and "see what each file is".
   */
  function buildTableView(withType: boolean): HTMLElement {
    const table = document.createElement('table');
    table.className = 'drive-table';

    const headers: { label: string; width: string }[] = withType
      ? [
          { label: tr('columnName'), width: '40%' },
          { label: tr('columnSize'), width: '20%' },
          { label: tr('columnModified'), width: '20%' },
          { label: tr('columnType'), width: '20%' },
        ]
      : [
          { label: tr('columnName'), width: '55%' },
          { label: tr('columnSize'), width: '20%' },
          { label: tr('columnModified'), width: '25%' },
        ];

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const header of headers) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = header.label;
      th.style.width = header.width;
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const file of files) {
      const row = document.createElement('tr');
      row.className = 'drive-item drive-row';
      row.title = file.name;

      const nameCell = document.createElement('td');
      nameCell.className = 'drive-cell';
      const nameIcon = document.createElement('span');
      nameIcon.className = 'drive-cell-icon';
      nameIcon.innerHTML = fileIconMarkup(16);
      nameCell.append(nameIcon, buildNameNode(file, 'drive-cell-text'));

      const sizeCell = document.createElement('td');
      sizeCell.className = 'drive-cell';
      sizeCell.textContent = formatSize(file.size);

      const dateCell = document.createElement('td');
      dateCell.className = 'drive-cell';
      dateCell.textContent = formatDate(file.modifiedTime);

      row.append(nameCell, sizeCell, dateCell);

      if (withType) {
        const typeCell = document.createElement('td');
        typeCell.className = 'drive-cell';
        typeCell.textContent = tr('typeMarkdown');
        row.appendChild(typeCell);
      }

      bindItem(row, file);
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    return table;
  }

  /**
   * The name node of one row: an in-place editor while this file is being
   * renamed, and the plain label otherwise.
   *
   * Rebuilt from closure state on every pass instead of mutated in place, which
   * is the only shape that survives the builders replacing every row on each
   * render. Focus and selection are applied by `renderView` once the input is
   * attached, not here, so a builder running against a detached tree cannot
   * steal the caret.
   */
  function buildNameNode(file: DriveFile, labelClassName: string): HTMLElement {
    if (file.id !== renamingFileId) {
      const label = document.createElement('span');
      label.className = labelClassName;
      label.textContent = stripMarkdownExtension(file.name);
      return label;
    }

    const input = document.createElement('input');
    input.className = 'drive-rename-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.value = renameDraft;
    input.setAttribute('aria-label', tr('renameLabel'));
    input.addEventListener('input', () => {
      renameDraft = input.value;
    });
    // The row treats a double click as "open", which would fire while the user
    // is selecting a word in the editor. The row's single click only selects
    // the file, which is wanted here, so it is left alone.
    input.addEventListener('dblclick', (event) => event.stopPropagation());
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        void commitRename();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        cancelRename();
      }
    });
    // Win98 semantics: leaving the field confirms what was typed, `Esc` reverts.
    // The commit guard makes the blur that follows a commit a no-op.
    input.addEventListener('blur', () => void commitRename());
    return input;
  }

  /**
   * Wires interaction on one row and repaints the selection onto it.
   *
   * Every view builder runs again on each render, so the selection highlight has
   * to be re-applied here rather than only on click. Painting it from the
   * builders is what keeps the invariant "the toolbar is enabled only while a
   * row visibly looks selected" true across a view-mode change.
   */
  function bindItem(item: HTMLElement, file: DriveFile): void {
    item.tabIndex = 0;
    item.addEventListener('click', () => selectFile(file, item));
    item.addEventListener('dblclick', () => void openInViewer(file));

    if (file.id !== selectedFileId) return;
    item.classList.add('drive-item-selected');
    item.setAttribute('aria-selected', 'true');
    selectedRowEl = item;
  }

  /** Drops the highlight from the row that was selected until now. */
  function clearRowHighlight(row: HTMLElement | null): void {
    if (row === null) return;
    row.classList.remove('drive-item-selected');
    row.removeAttribute('aria-selected');
  }

  /** Highlights a row and republishes it to the panel and the toolbar. */
  function selectFile(file: DriveFile, row: HTMLElement): void {
    selectedFileId = file.id;
    if (selectedRowEl !== row) clearRowHighlight(selectedRowEl);
    selectedRowEl = row;
    row.classList.add('drive-item-selected');
    row.setAttribute('aria-selected', 'true');

    syncPanel();
    syncEnabled();
  }

  /**
   * The `File` payload both destinations receive.
   *
   * One builder for both: if the viewer's copy and the editor's copy drifted
   * apart, the same Drive file would show two different names depending on how
   * it was opened.
   */
  function toFilePayload(file: DriveFile, content: string): File {
    return {
      name: stripMarkdownExtension(file.name),
      content,
      rawContent: content,
      folder: DRIVE.WORKSPACE_FOLDER_NAME,
      date: formatDate(file.modifiedTime),
    };
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
        file: toFilePayload(file, content.data),
        windowKey: `drive/${file.id}`,
        title: file.name,
      },
    };
    window.dispatchEvent(new CustomEvent('desktop-open-app', { detail }));
  }

  /**
   * Hand the file to Notepad for editing, with the write path back to Drive.
   *
   * The buffer and the conflict logic live in the editor now, so this window
   * holds nothing that could be lost. `remoteSave` closes over the token and
   * over this window's state, which is why the payload is a live function rather
   * than a value: `openApp` hands the detail over by reference inside this same
   * realm, so the closure survives the `CustomEvent`.
   */
  async function openInNotepad(file: DriveFile): Promise<void> {
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
      appId: EDIT_FILE_APP_ID,
      appData: {
        file: toFilePayload(file, content.data),
        remoteSave: createRemoteSaveHandle(file),
      },
    };
    window.dispatchEvent(new CustomEvent('desktop-open-app', { detail }));
  }

  function openSelectedInViewer(): void {
    const file = selectedFile();
    if (file !== null) void openInViewer(file);
  }

  function openSelectedInEditor(): void {
    const file = selectedFile();
    if (file !== null) void openInNotepad(file);
  }

  function trashSelected(): void {
    const file = selectedFile();
    if (file !== null) void moveFileToTrash(file);
  }

  /** `File > Close` closes this window; there is no inner screen to step out of. */
  function closeCurrentView(): void {
    $win.close();
  }

  // ── Remote save ──

  /**
   * Build the write path handed to the editor alongside the file.
   *
   * Everything a save needs is captured here: the file is the one that was
   * opened, and the baseline revision travels with the handle so a save compares
   * against the revision its buffer was read at — not against whatever the window
   * happens to be showing when Save is pressed. The token is deliberately NOT
   * captured: a save re-reads whatever session is live when it runs and fails as
   * "signed out" when there is none, rather than writing with a token frozen at
   * open time. Rejecting a save after this window closed is the `windowClosed`
   * guard's job, not the token's.
   */
  function createRemoteSaveHandle(file: DriveFile): RemoteSaveHandle {
    const state: RemoteSaveState = { baselineRevision: file.headRevisionId };
    return {
      save: (content: string): Promise<RemoteSaveResult> => saveRemoteFile(file, content, state),
    };
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
  async function saveRemoteFile(
    file: DriveFile,
    content: string,
    state: RemoteSaveState,
  ): Promise<RemoteSaveResult> {
    // Checked before anything else: every path below repaints this window, and
    // the editor may still hold this handle long after the window is gone.
    if (windowClosed) return { ok: false, message: tr('remoteSaveWindowClosed') };

    const activeToken = requireToken();
    if (activeToken === null) return { ok: false, message: tr('remoteSaveSignedOut') };

    setBusy(true);
    const head = await driveClient.getHeadRevisionId(activeToken, file.id);
    if (!head.ok) {
      return failRemoteSave(head.error, file);
    }

    const remoteRevision = head.data;
    const changedElsewhere =
      state.baselineRevision !== null && remoteRevision !== null && remoteRevision !== state.baselineRevision;

    if (changedElsewhere) {
      setBusy(false);
      const answer = await showMessageBox({
        title: tr('conflictTitle'),
        message: fill(tr('conflictMessage'), { name: file.name }),
        icon: 'warning',
        buttons: 'YesNo',
      });
      if (answer !== 'yes') return { ok: false, message: tr('remoteSaveConflictAborted') };
      setBusy(true);
    }

    const written = await driveClient.updateTextFile(activeToken, file.id, content);
    if (!written.ok) {
      return failRemoteSave(written.error, file);
    }

    // Rebaseline first: the next save must compare against the revision this
    // write produced, or the user's own edit reads as somebody else's.
    state.baselineRevision = written.data.headRevisionId;

    const updated: DriveFile = {
      ...file,
      headRevisionId: written.data.headRevisionId,
      modifiedTime: written.data.modifiedTime,
      size: written.data.size,
    };
    files = files.map((entry) => (entry.id === file.id ? updated : entry));

    const saved: RemoteSaveResult = {
      ok: true,
      message: fill(tr('remoteSaveDone'), { name: file.name }),
    };

    // The window can close while the write is in flight. The write already
    // landed, so the result is a success either way; what is lost is the
    // listing refresh of a window nobody is looking at. A `renderView()` here
    // would also yank the caret out of the editor that just saved.
    if (windowClosed) return saved;

    setBusy(false);
    repaintListing();
    syncPanel();
    return saved;
  }

  /**
   * Rebuild the rows in place after a file changed underneath this window.
   *
   * Deliberately not `renderView()`: that ends by giving focus back to the
   * selected row, which would pull the caret out of the editor window that just
   * performed the save. `bindItem` re-applies the selection highlight on the new
   * nodes, so the highlight survives the swap.
   */
  function repaintListing(): void {
    clearChildren(contentEl);
    buildListView();
  }

  /**
   * Report a failed write to both audiences: the Drive window shows the error
   * screen it always showed, and the editor gets a message it can display
   * verbatim. A window that is already gone gets neither repainted nor blamed.
   */
  function failRemoteSave(error: DriveError, file: DriveFile): RemoteSaveResult {
    if (windowClosed) return { ok: false, message: tr('remoteSaveWindowClosed') };
    setBusy(false);
    handleDriveError(error);
    return { ok: false, message: fill(tr('remoteSaveFailed'), { name: file.name }) };
  }

  // ── New document / rename ──

  /** True when the New gesture can start from the current screen. */
  function canCreateDocument(): boolean {
    return view === 'list' && !busy && renamingFileId === null;
  }

  /** True when the selected row can enter the in-place rename editor. */
  function canRename(): boolean {
    return view === 'list' && !busy && renamingFileId === null && selectedFile() !== null;
  }

  /**
   * Create the text document the `Nuevo ▸ Documento de texto` row stands for.
   *
   * The file exists in Drive BEFORE the user types anything, under the localized
   * default name, and the editor opens on top of that. This is the point of the
   * Win98 gesture: the menu is not a form, so `Esc` cannot un-create the file —
   * it only abandons the name, leaving the default one in place.
   */
  async function createNewDocument(): Promise<void> {
    if (!canCreateDocument()) return;
    const folder = workspaceFolder;
    if (folder === null) return;
    const activeToken = requireToken();
    if (activeToken === null) return;

    const name = normalizeFileName(tr('newDocumentDefaultName'));
    if (name === null) return;

    setBusy(true);
    const created = await driveClient.createTextFile(activeToken, folder.id, name, '');
    setBusy(false);
    if (!created.ok) {
      handleDriveError(created.error);
      return;
    }

    files = [created.data, ...files];
    // Selected before the repaint that builds the input, so the editor opens on
    // the row the user just created rather than on whatever was selected.
    selectedFileId = created.data.id;
    selectedRowEl = null;
    beginRename(created.data);
  }

  /**
   * Open the in-place editor on one file, seeded with its name without the
   * markdown extension — the listing never shows the extension.
   */
  function beginRename(file: DriveFile, draft: string = stripMarkdownExtension(file.name)): void {
    renamingFileId = file.id;
    renameDraft = draft;
    selectedFileId = file.id;
    renderView();
  }

  function renameSelected(): void {
    const file = selectedFile();
    if (file !== null) beginRename(file);
  }

  /**
   * Stop editing without a request. The file keeps whatever name Drive already
   * has — the default one for a freshly created file — which is what `Esc`
   * means in Win98: abandon the edit, not the file.
   */
  function cancelRename(): void {
    if (renamingFileId === null) return;
    renamingFileId = null;
    renameDraft = '';
    renderView();
  }

  /**
   * Close the in-place editor when the file it was editing is no longer listed.
   *
   * `buildNameNode` renders the input only while iterating a file that is still
   * in `files`, so an editor left open on a dropped file would leave
   * `renamingFileId` pointing at nothing: no input to type in, no input to
   * `Esc`, and `canCreateDocument` / `canRename` — both gated on
   * `renamingFileId === null` — would keep New and Rename greyed until
   * Disconnect. Every path that removes a file from `files` owes this call.
   */
  function dropEditorIfFileIsGone(): void {
    if (renamingFileId === null) return;
    if (files.some((entry) => entry.id === renamingFileId)) return;
    renamingFileId = null;
    renameDraft = '';
  }

  /**
   * Confirm the edit and push the typed name to Drive.
   *
   * `renamingFileId` is cleared synchronously, before the first `await`: the
   * repaint that removes the input fires a `blur`, and without the guard that
   * blur would start a second rename of the same file. One edit, one request.
   */
  async function commitRename(): Promise<void> {
    const fileId = renamingFileId;
    if (fileId === null || windowClosed) return;

    const draft = renameDraft;
    renamingFileId = null;
    renameDraft = '';

    const file = files.find((entry) => entry.id === fileId);
    if (file === undefined) {
      renderView();
      return;
    }

    const name = normalizeFileName(draft);
    if (name === null) {
      // Keep editing so the typo is still there to fix instead of discarding it.
      await showMessageBox({
        title: tr('renameTitle'),
        message: tr('newFileInvalid'),
        icon: 'warning',
      });
      beginRename(file, draft);
      return;
    }

    // An unchanged name is not worth a request; the editor still closes.
    if (name === file.name) {
      renderView();
      return;
    }

    // Read last, so a typo never forces a reconnect: nothing above touches the
    // network.
    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const renamed = await driveClient.renameFile(activeToken, file.id, name);
    setBusy(false);
    if (!renamed.ok) {
      if (renamed.error.code === 'auth-expired') {
        handleDriveError(renamed.error);
        return;
      }
      // The create already landed, so the file exists with its previous name.
      // Sending the window to the error screen would hide a file that is really
      // there; the message box reports the failed second operation instead.
      await showMessageBox({
        title: tr('renameTitle'),
        message: fill(tr('renameFailed'), { name: file.name }),
        icon: 'warning',
      });
      renderView();
      return;
    }

    const updated: DriveFile = {
      ...file,
      name: renamed.data.name,
      modifiedTime: renamed.data.modifiedTime,
    };
    files = files.map((entry) => (entry.id === file.id ? updated : entry));
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
    if (selectedFileId === file.id) {
      selectedFileId = null;
      selectedRowEl = null;
    }
    // A trash can drop the very file the editor is open on. Not reachable today
    // (every trigger blurs the input first, and `commitRename` clears the editor
    // before the filter runs), but it is the same class as the refresh that drops
    // a file, so it pays the same call rather than relying on a caller's timing.
    dropEditorIfFileIsGone();
    renderView();

    // The Recycle Bin lists the same trash this write just changed, so it has to
    // hear about it. Without this the file only shows up there after F5.
    notifyDriveWorkspaceChanged();
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
    contentEl.appendChild(panel);
  }

  /**
   * The wait between "a usable token exists" and "here are the files".
   *
   * Reuses `.drive-spinner` instead of a second class: it is already this
   * stylesheet's own spinner, already carries the `prefers-reduced-motion`
   * block, and a byte-identical twin would only be a second place to keep in
   * sync. Distinct copy from `buildConnectingView` on purpose — that screen is
   * waiting on the reader, this one is waiting on Drive.
   */
  function buildLoadingView(): void {
    const panel = document.createElement('div');
    panel.className = 'drive-panel';

    const heading = document.createElement('p');
    heading.className = 'drive-panel-heading';
    heading.textContent = tr('loadingHeading');

    const text = document.createElement('p');
    text.className = 'drive-panel-text';
    text.textContent = fill(tr('loadingText'), { folder: DRIVE.WORKSPACE_FOLDER_NAME });

    const spinner = document.createElement('div');
    spinner.className = 'drive-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', tr('loadingHeading'));

    panel.append(heading, text, spinner);
    contentEl.appendChild(panel);
  }

  function buildErrorView(): void {
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

    contentEl.appendChild(panel);
  }

  renderView();
  // Reopened into a session that is still live: pick it up instead of sitting on
  // the connect screen until something changes, which is the only difference
  // between a first launch and a relaunch. `getUsableDriveToken` folds the expiry
  // check in, so a token that died while this window was closed still lands on
  // the connect screen rather than failing half way through the load.
  if (getUsableDriveToken() !== null) void loadWorkspace();
}

/**
 * Builds an os-gui MenuBar from the widened item shapes declared above.
 *
 * The single assertion is what bridges `src/types/os-gui.d.ts`, whose item
 * declaration is narrower than the contract MenuBar.js implements. See
 * {@link DriveMenuItem}.
 */
function createMenuBar(menus: Record<string, DriveMenuItem[]>): OsGuiMenuBar {
  return new window.MenuBar(menus as unknown as OsGuiMenuDefinition);
}

/**
 * Placeholder React component. The app registry requires a component, but the real
 * window is imperative os-gui DOM owned by launchDrive, like every other app here.
 */
export const DriveApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};