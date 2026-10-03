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
} from '../../utils/explorerChrome';
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
import { GoogleAuthError } from '../../services/googleDrive/auth';
import { driveClient } from '../../services/googleDrive/client';
import { getDriveErrorMessage } from '../../services/googleDrive/errors';
import { isDriveTokenExpired } from '../../services/googleDrive/types';
import { DRIVE, LOCAL_STORAGE_KEYS } from '../../constants';
import type { DriveError, DriveErrorCode, DriveFile, DriveFolder, DriveToken } from '../../services/googleDrive/types';
import type {
  OsGuiMenuBar,
  OsGuiMenuDefinition,
  OsGuiMenuItem,
  OsGuiWindow,
} from '../../types/os-gui';
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
  newFile: { es: 'Nuevo', en: 'New' },
  newFileTitle: { es: 'Nuevo archivo', en: 'New file' },
  newFileHint: {
    es: 'Se crea un archivo markdown vacío. Si no escribís ".md", se agrega solo. Enter crea el archivo y Esc lo cancela.',
    en: 'An empty markdown file is created. The ".md" extension is added when missing. Enter creates the file and Esc cancels it.',
  },
  newFileInvalid: {
    es: 'Ese nombre no sirve. No puede estar vacío ni llevar / \\ : * ? " < > |',
    en: 'That name will not work. It cannot be empty or contain / \\ : * ? " < > |',
  },
  fileNameLabel: { es: 'Nombre del archivo', en: 'File name' },
  refresh: { es: 'Actualizar', en: 'Refresh' },
  open: { es: 'Abrir', en: 'Open' },
  edit: { es: 'Editar', en: 'Edit' },
  trash: { es: 'Papelera', en: 'Trash' },
  save: { es: 'Guardar', en: 'Save' },
  back: { es: 'Volver', en: 'Back' },
  forward: { es: 'Adelante', en: 'Forward' },
  up: { es: 'Subir', en: 'Up' },
  views: { es: 'Vistas', en: 'Views' },
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
  statusReady: { es: 'Listo', en: 'Ready' },
  statusError: { es: 'Error', en: 'Error' },
  fileCount: { es: '{count} archivo(s)', en: '{count} file(s)' },
  sizeUnknown: { es: '?', en: '?' },
  dateUnknown: { es: 'sin fecha', en: 'no date' },
  editorLabel: { es: 'Contenido del archivo', en: 'File content' },
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
  menuSave: { es: '&Guardar', en: '&Save' },
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
  menuSelectAll: { es: 'Seleccionar &todo', en: 'Select &All' },
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

type DriveView = 'disconnected' | 'reconnect' | 'connecting' | 'list' | 'editor' | 'newFile' | 'error';

/** Explorer view mode, mirroring the four modes of My Computer. */
type DriveViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST' | 'DETAILS';

interface DriveConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
}

interface ConsentAttempt {
  readonly verifier: string;
  readonly state: string;
}

/** One row of an os-gui radio group (`radioItems`, see MenuBar.js:930-950). */
interface DriveRadioItem {
  label: string;
  value: DriveViewMode;
  enabled?: boolean | (() => boolean);
}

/**
 * A radio group as os-gui models it: the group owns the value, MenuBar derives
 * each row's `checkbox.check` / `checkbox.toggle` from `getValue` / `setValue`.
 * A group has to be used instead of four independent `action` items because an
 * item carrying `checkbox` never runs `action` — MenuBar only calls
 * `checkbox.toggle` for those (MenuBar.js:879-889).
 */
interface DriveRadioGroup {
  ariaLabel: string;
  radioItems: DriveRadioItem[];
  getValue: () => DriveViewMode;
  setValue: (value: DriveViewMode) => void;
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
  | DriveRadioGroup;

const DRIVE_ICON = '/images/icons/drive-32x32.svg';
const FILE_ICON = '/images/icons/notepad-file-16x16.png';
const FILE_ICON_LARGE = '/images/icons/notepad-file-32x32.png';
const MARKDOWN_EXTENSION_PATTERN = /\.md$/i;
const ILLEGAL_FILENAME_PATTERN = /[\\/:*?"<>|]/;
const MAX_FILENAME_LENGTH = 120;
const OPEN_FILE_APP_ID = 'markdownViewer';
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

function describeAuthorizationFailure(error: unknown, fallback: string): string {
  if (error instanceof GoogleAuthError) {
    return `${fallback}\n\nGoogle: ${error.code} — ${error.description}`;
  }
  return `${fallback}\n\n${error instanceof Error ? error.message : String(error)}`;
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
 * workspace list → editor, with failures landing on the error view), while
 * `selectedFileId` and `currentView` drive the selection model inside the list
 * screen. Because MenuBar re-reads a `function` `enabled` every time a menu
 * opens, the menus stay in sync with the selection without being rebuilt; only
 * the toolbar buttons need an explicit `syncEnabled()` pass.
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

  // The token is scoped to this window on purpose: closing the Drive window
  // ends the Google session, so the next launch always starts from the connect
  // screen. It never reaches `localStorage` or `sessionStorage` either.
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
  let editorTextareaEl: HTMLTextAreaElement | null = null;
  let newFileName = '';
  let consentAttempt: ConsentAttempt | null = null;
  let connectLinkEl: HTMLAnchorElement | null = null;
  let busy = false;

  // ── Selection / chrome state ──
  let selectedFileId: string | null = null;
  let selectedRowEl: HTMLElement | null = null;
  let currentView: DriveViewMode = 'SMALL_ICONS';
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
  $win.onClosed(() => {
    activeWindow = null;
    token = null;
    accountEmail = null;
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
  // the folder (or the file, while the editor is open).
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
        enabled: () => view === 'list',
        action: startNewFile,
      },
      { separator: true },
      {
        label: tr('menuOpen'),
        shortcutLabel: 'Ctrl+O',
        enabled: () => hasSelection(),
        action: openSelectedInViewer,
      },
      {
        label: tr('menuSave'),
        shortcutLabel: 'Ctrl+S',
        enabled: () => view === 'editor',
        action: () => void saveEditor(),
      },
      { separator: true },
      {
        label: tr('menuDelete'),
        enabled: () => hasSelection(),
        action: trashSelected,
      },
      { label: tr('menuRename'), enabled: false },
      { label: tr('menuProperties'), enabled: false },
      { separator: true },
      {
        label: tr('menuConnect'),
        enabled: () => connectLinkEl !== null,
        action: activateConnectLink,
      },
      {
        label: tr('menuDisconnect'),
        enabled: () => token !== null,
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
      { separator: true },
      {
        label: tr('menuSelectAll'),
        shortcutLabel: 'Ctrl+A',
        enabled: () => view === 'editor',
        action: selectEditorText,
      },
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
    return !busy && (view === 'list' || view === 'editor');
  }

  /** Screens with browsable content keep the descriptive left panel. */
  function hasLeftPanel(): boolean {
    return view === 'list' || view === 'editor' || view === 'newFile';
  }

  /** Screens with actions to trigger show the standard buttons row. */
  function hasStandardToolbar(): boolean {
    return view === 'list' || view === 'editor' || view === 'error';
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

  /** The address names the workspace folder, or the open file in the editor. */
  function syncAddressBar(): void {
    const folderName = workspaceFolder?.name ?? DRIVE.WORKSPACE_FOLDER_NAME;
    addrInput.value = view === 'editor' && editorFile !== null ? editorFile.name : folderName;
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

    if (view === 'editor' && editorFile !== null) {
      panelFolderIcon.src = FILE_ICON_LARGE;
      panelTitle.textContent = stripMarkdownExtension(editorFile.name);
      renderPanelInfo(describeFile(editorFile));
      return;
    }

    panelFolderIcon.src = DRIVE_ICON;
    if (view === 'newFile') {
      panelTitle.textContent = tr('newFileTitle');
      renderPanelInfo([tr('newFileTitle'), tr('newFileHint')]);
      return;
    }

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
  let saveBtn: HTMLButtonElement | null = null;
  let deleteBtn: HTMLButtonElement | null = null;
  let refreshBtn: HTMLButtonElement | null = null;
  let viewsBtn: HTMLDivElement | null = null;
  let retryBtn: HTMLButtonElement | null = null;

  /**
   * Rebuilds the standard buttons for the current screen.
   *
   * The row is rebuilt rather than hidden because the error screen offers a
   * different pair of actions (Retry) than the list and editor screens.
   */
  function renderStandardButtons(): void {
    clearChildren(stdButtons);
    backBtn = null;
    forwardBtn = null;
    upBtn = null;
    newBtn = null;
    openBtn = null;
    editBtn = null;
    saveBtn = null;
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
    backBtn = createCompoundButton(tr('back'), SPRITE.back, leaveEditor, () => {}, true);
    forwardBtn = createCompoundButton(tr('forward'), SPRITE.forward, () => {}, () => {}, true);
    stdButtons.append(backBtn, forwardBtn);

    upBtn = createToolbarButton(tr('up'), SPRITE.up);
    stdButtons.appendChild(upBtn);
    stdButtons.appendChild(createSeparator());

    newBtn = createToolbarButton(tr('newFile'), SPRITE.newFile);
    newBtn.addEventListener('click', startNewFile);

    openBtn = createToolbarButton(tr('open'), SPRITE.open);
    openBtn.addEventListener('click', openSelectedInViewer);

    editBtn = createToolbarButton(tr('edit'), SPRITE.edit);
    editBtn.addEventListener('click', openSelectedInEditor);

    saveBtn = createToolbarButton(tr('save'), SPRITE.save);
    saveBtn.addEventListener('click', () => void saveEditor());

    deleteBtn = createToolbarButton(tr('trash'), SPRITE.delete);
    deleteBtn.addEventListener('click', trashSelected);

    stdButtons.append(newBtn, openBtn, editBtn, saveBtn, deleteBtn);
    stdButtons.appendChild(createSeparator());

    refreshBtn = createToolbarButton(tr('refresh'), SPRITE.refresh);
    refreshBtn.addEventListener('click', () => void loadWorkspace());

    viewsBtn = createCompoundButton(tr('views'), SPRITE.viewLargeIcons, cycleViewMode, openViewsDropdown);

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
    setCompoundDisabled(backBtn, view !== 'editor');
    setCompoundDisabled(forwardBtn, true);
    setDisabled(upBtn, true);
    setDisabled(newBtn, view !== 'list');
    setDisabled(openBtn, busy || !selectable);
    setDisabled(editBtn, busy || !selectable);
    setDisabled(saveBtn, busy || view !== 'editor');
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
  function viewModeGroup(): DriveRadioGroup {
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
   * Opens the Views dropdown with a temporary off-screen MenuBar parked at the
   * button's position, then programmatically pressing it (the 98.js approach).
   */
  function openViewsDropdown(event: Event): void {
    const dropBtn = event.currentTarget as HTMLElement | null;
    const wrapper = dropBtn?.closest('.toolbar-compound-button-wrapper') as HTMLElement | null;
    if (wrapper === null) return;
    const rect = wrapper.getBoundingClientRect();

    const dummyMenuBar = createMenuBar({ [tr('views')]: [viewModeGroup()] });
    const dummyEl = document.createElement('div');
    dummyEl.style.cssText = `
      position: absolute;
      left: ${rect.left}px;
      top: ${rect.top}px;
      visibility: hidden;
      pointer-events: none;
    `;
    dummyEl.appendChild(dummyMenuBar.element);
    document.body.appendChild(dummyEl);

    const cleanup = (): void => {
      if (document.body.contains(dummyEl)) document.body.removeChild(dummyEl);
    };

    const menuButton = dummyEl.querySelector('.menu-button') as HTMLElement | null;
    if (menuButton === null) {
      cleanup();
      return;
    }

    menuButton.dispatchEvent(new PointerEvent('pointerdown'));
    menuButton.addEventListener('release', cleanup);
    // MenuBar closes a popup it opened without signalling the opener, so a
    // pick (or a click elsewhere) can leave the parked bar behind.
    window.addEventListener('pointerup', cleanup, { once: true });
  }

  // ══════════════════════════════════════════════════════════════════
  // KEYBOARD
  // ══════════════════════════════════════════════════════════════════

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;

    // Menus run their own keyboard handling and mark the event as handled.
    const active = document.activeElement;
    if (active !== null && active.closest('.menu-popup') !== null) return;

    // Backspace leaves the editor, but only from an empty buffer so it can never
    // eat content. Checked before the text-entry guard: in that screen the
    // textarea holds the focus.
    if (event.key === 'Backspace' && view === 'editor') {
      if (editorContent === '') {
        event.preventDefault();
        leaveEditor();
      }
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      const key = event.key.toLowerCase();
      if (key === 'o') {
        event.preventDefault();
        if (hasSelection()) openSelectedInViewer();
      } else if (key === 's') {
        event.preventDefault();
        if (view === 'editor') void saveEditor();
      } else if (key === 'a' && !isTextEntry(event.target)) {
        event.preventDefault();
        if (view === 'editor') selectEditorText();
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
    editorTextareaEl = null;

    renderStandardButtons();
    clearChildren(contentEl);

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
    // actions (Delete, Enter) would no longer reach the selection. Scoped to the
    // list view so it cannot steal focus from the editor textarea or the
    // new-file input.
    if (view === 'list' && selectedRowEl !== null) selectedRowEl.focus();
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

    contentEl.appendChild(panel);
    connectLinkEl = link;

    void prepareConsent(link, config);
  }

  /** `File > Connect` reuses the real link so the PKCE flow stays in one place. */
  function activateConnectLink(): void {
    connectLinkEl?.click();
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
      clearPendingAuth();
      consentAttempt = null;
      notice = describeAuthorizationFailure(error, tr('connectExchangeFailed'));
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
    selectedFileId = null;
    selectedRowEl = null;
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

      const label = document.createElement('span');
      label.className = 'drive-item-label';
      label.textContent = stripMarkdownExtension(file.name);

      item.append(icon, label);
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

      const label = document.createElement('span');
      label.className = 'drive-item-label';
      label.textContent = stripMarkdownExtension(file.name);

      item.append(icon, label);
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
      const nameText = document.createElement('span');
      nameText.className = 'drive-cell-text';
      nameText.textContent = stripMarkdownExtension(file.name);
      nameCell.append(nameIcon, nameText);

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

  function openSelectedInViewer(): void {
    const file = selectedFile();
    if (file !== null) void openInViewer(file);
  }

  function openSelectedInEditor(): void {
    const file = selectedFile();
    if (file !== null) void openEditor(file);
  }

  function trashSelected(): void {
    const file = selectedFile();
    if (file !== null) void moveFileToTrash(file);
  }

  // ── Editor ──

  function leaveEditor(): void {
    if (view !== 'editor') return;
    editorFile = null;
    editorBaselineRevision = null;
    editorContent = '';
    view = 'list';
    renderView();
  }

  function selectEditorText(): void {
    editorTextareaEl?.select();
  }

  /**
   * `File > Close` (and the toolbar Back) step out of whatever is open before it
   * closes the window, which is what Win98 does from a folder view.
   */
  function closeCurrentView(): void {
    if (view === 'editor') {
      leaveEditor();
      return;
    }
    if (view === 'newFile') {
      cancelNewFile();
      return;
    }
    $win.close();
  }

  function buildEditorView(): void {
    const file = editorFile;
    if (file === null) {
      view = 'list';
      renderView();
      return;
    }

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
    contentEl.appendChild(editor);
    editorTextareaEl = textarea;
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

  function startNewFile(): void {
    if (view !== 'list') return;
    newFileName = '';
    view = 'newFile';
    renderView();
  }

  function cancelNewFile(): void {
    if (view !== 'newFile') return;
    newFileName = '';
    view = 'list';
    renderView();
  }

  function buildNewFileView(): void {
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
      if (event.key === 'Enter') {
        void createFile();
        return;
      }
      if (event.key === 'Escape') cancelNewFile();
    });

    const hint = document.createElement('p');
    hint.className = 'drive-panel-hint';
    hint.textContent = tr('newFileHint');

    panel.append(label, input, hint);
    contentEl.appendChild(panel);
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
    if (selectedFileId === file.id) {
      selectedFileId = null;
      selectedRowEl = null;
    }
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