import React from 'react';
import './index.css';
import { applyCascadeAndFit } from '../../utils/cascadePosition';
import { showMessageBox } from '../../utils/messageBox';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import {
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
  isDriveConnectInFlight,
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
  getDriveWorkspaceFolderId,
  getUsableDriveToken,
  notifyDriveWorkspaceChanged,
  setDriveWorkspaceFolderId,
  subscribeDriveToken,
  subscribeDriveWorkspace,
} from '../../services/googleDrive/driveSession';
import { createDriveError, getDriveErrorMessage } from '../../services/googleDrive/errors';
import { DRIVE, LOCAL_STORAGE_KEYS } from '../../constants';
import type {
  DriveError,
  DriveErrorCode,
  DriveFile,
  DriveResult,
  DriveToken,
} from '../../services/googleDrive/types';
import type {
  OsGuiMenuBar,
  OsGuiMenuDefinition,
  OsGuiMenuItem,
  OsGuiWindow,
} from '../../types/os-gui';

/**
 * Placeholder React component. The app registry requires a component, but the real
 * window is imperative os-gui DOM owned by launchRecycleBin, like every other app here.
 */
export const RecycleBinApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ─── Translations ─────────────────────────────────────────────────────────────
//
// Local table on purpose, like DriveApp and MarkdownViewerApp: these windows are
// built outside React, so `useTranslation()` is not reachable from here.

const TRANSLATIONS: Record<string, { es: string; en: string }> = {
  windowTitle: { es: 'Papelera', en: 'Recycle Bin' },
  trashLocation: { es: 'Papelera de Google Drive', en: 'Google Drive trash' },
  addressLabel: { es: 'Dirección', en: 'Address' },
  // ── States ──
  //
  // The connect copy is this window's own, not My Drive's: connecting here buys read
  // access to the account's trash and creates nothing in Drive. Saying so is the
  // point — the folder promise belongs to the other window.
  disconnectedHeading: {
    es: 'Sin conexión con Google Drive',
    en: 'Not connected to Google Drive',
  },
  disconnectedText: {
    es: 'Esta ventana muestra los archivos que Mi unidad mandó a la papelera de Google Drive.',
    en: 'This window shows the files My Drive moved to the Google Drive trash.',
  },
  disconnectedHint: {
    es: 'Conectá con Google para verlos y poder restaurarlos. Esta ventana no crea carpetas en tu Drive.',
    en: 'Connect to Google to see them and restore them. This window never creates folders in your Drive.',
  },
  connectButton: { es: 'Conectar con Google', en: 'Connect with Google' },
  connectHint: {
    es: 'Se abrirá una pestaña nueva para aprobar el acceso. Volvé a la Papelera cuando termines.',
    en: 'A new tab opens to approve access. Come back to the Recycle Bin when you are done.',
  },
  connectingHeading: { es: 'Conectando con Google', en: 'Connecting to Google' },
  connectingText: {
    es: 'Aprobá el acceso en la pestaña nueva. Esta ventana espera el código de autorización y después lee la papelera.',
    en: 'Approve access in the new tab. This window waits for the authorization code and then reads the trash.',
  },
  connectInProgress: {
    es: 'Ya hay una conexión en curso en otra ventana. Esperá a que termine.',
    en: 'A connection is already in progress in another window. Wait for it to finish.',
  },
  // The same five failures the shared flow can produce, in this window's own table.
  // The wording matches My Drive's because the failure is identical, not because the
  // screen is: this window never had to promise a folder to explain them.
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
  loadingHeading: { es: 'Leyendo la papelera', en: 'Reading the trash' },
  loadingText: {
    es: 'Buscando los archivos que la app mandó a la papelera de Google.',
    en: 'Looking for the files the app moved to the Google trash.',
  },
  emptyHeading: { es: 'La papelera está vacía', en: 'The Recycle Bin is empty' },
  emptyText: {
    es: 'No hay nada en la papelera de Google. Cuando uses "Papelera" en Mi unidad, el archivo va a aparecer acá.',
    en: 'There is nothing in the Google trash. When you use "Trash" in My Drive, the file shows up here.',
  },
  errorHeading: { es: 'No se pudo leer la papelera', en: 'The trash could not be read' },
  unknownError: {
    es: 'Ocurrió un error inesperado.',
    en: 'An unexpected error occurred.',
  },
  // ── Listing ──
  columnName: { es: 'Nombre', en: 'Name' },
  columnSize: { es: 'Tamaño', en: 'Size' },
  columnDeleted: { es: 'Eliminado', en: 'Deleted' },
  // Only the details view shows this, and it is the one fact about a trashed file
  // that the folder listing cannot show: whether Drive will still accept a
  // restore for it, which is also what decides whether Restore is enabled.
  columnRestorable: { es: 'Restaurable', en: 'Restorable' },
  restorableYes: { es: 'Sí', en: 'Yes' },
  restorableNo: { es: 'No', en: 'No' },
  // `canUntrash === null` is "the listing did not ask", not "Drive said no".
  restorableUnknown: { es: '?', en: '?' },
  fileCount: { es: '{count} archivo(s)', en: '{count} file(s)' },
  restoreTarget: { es: 'Restaurar en: {folder}', en: 'Restores to: {folder}' },
  restoreDone: {
    es: '"{name}" volvió a "{folder}".',
    en: '"{name}" went back to "{folder}".',
  },
  sizeUnknown: { es: '?', en: '?' },
  dateUnknown: { es: 'sin fecha', en: 'no date' },
  typeMarkdown: { es: 'Documento Markdown', en: 'Markdown Document' },
  // ── Toolbar ──
  restore: { es: 'Restaurar', en: 'Restore' },
  up: { es: 'Subir', en: 'Up' },
  refresh: { es: 'Actualizar', en: 'Refresh' },
  views: { es: 'Vistas', en: 'Views' },
  retry: { es: 'Reintentar', en: 'Retry' },
  cannotRestore: {
    es: 'Este archivo no se puede restaurar todavía.',
    en: 'This file cannot be restored yet.',
  },
  folderMissingTitle: { es: 'No se encontró la carpeta', en: 'Folder not found' },
  folderMissingMessage: {
    es: 'La carpeta "{folder}" no está en tu Drive. Abrí Mi unidad y conectate de nuevo para crearla.',
    en: 'The "{folder}" folder is not in your Drive. Open My Drive and connect again to create it.',
  },
  // ── Status bar ──
  statusReady: { es: 'Listo', en: 'Ready' },
  statusWorking: { es: 'Trabajando...', en: 'Working...' },
  statusError: { es: 'Error', en: 'Error' },
  // ── Menus ──
  menuFile: { es: '&Archivo', en: '&File' },
  menuRestore: { es: '&Restaurar', en: '&Restore' },
  menuRefresh: { es: '&Actualizar', en: '&Refresh' },
  menuConnect: { es: '&Conectar', en: '&Connect' },
  menuClose: { es: '&Cerrar', en: '&Close' },
  menuView: { es: '&Ver', en: '&View' },
  menuHelp: { es: 'A&yuda', en: '&Help' },
  menuToolbars: { es: '&Barras de herramientas', en: '&Toolbars' },
  menuStandardButtons: { es: 'Botones &estándar', en: '&Standard Buttons' },
  menuAddressBar: { es: 'Barra de &dirección', en: '&Address Bar' },
  menuStatusBar: { es: 'Barra de &estado', en: 'Status &Bar' },
  menuViewModeGroup: { es: 'Modo de vista', en: 'View mode' },
  menuViewLargeIcons: { es: 'Iconos &grandes', en: 'Lar&ge Icons' },
  menuViewSmallIcons: { es: 'Iconos &pequeños', en: 'S&mall Icons' },
  menuViewList: { es: '&Lista', en: '&List' },
  menuViewDetails: { es: '&Detalles', en: '&Details' },
  menuAbout: { es: '&Acerca de la Papelera', en: '&About Recycle Bin' },
  aboutTitle: { es: 'Acerca de la Papelera', en: 'About Recycle Bin' },
  aboutMessage: {
    es:
      'Papelera\n\nLos archivos que Mi unidad mandó a la papelera de Google Drive, restaurables de vuelta a la carpeta "{folder}".\n\nNo hay borrado definitivo: Google los conserva 30 días.\n\nVersión 1.0',
    en:
      'Recycle Bin\n\nThe files My Drive moved to the Google Drive trash, restorable back into the "{folder}" folder.\n\nThere is no permanent delete: Google keeps them for 30 days.\n\nVersion 1.0',
  },
};

// ─── Local types ──────────────────────────────────────────────────────────────

/**
 * The five screens of this window. "empty" is not one of them: it is the
 * `list` screen with zero rows, which is a different message but the same layout.
 *
 * `connecting` waits on the *user* (they have to approve access in another tab) and
 * `loading` waits on the *network*, so they are distinct screens with distinct copy,
 * exactly as in My Drive.
 */
type RecycleView = 'disconnected' | 'connecting' | 'loading' | 'list' | 'error';

/** Explorer view mode, mirroring the four modes of My Drive. */
type RecycleViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST' | 'DETAILS';

/**
 * Menu items as MenuBar.js actually reads them.
 *
 * Same widening DriveApp documents, for the same two reasons:
 * `src/types/os-gui.d.ts` types a checkbox as `{ check?, toggle? }` with no
 * `type`, so a literal carrying `type: 'checkbox'` is an excess property for the
 * compiler; and it has no `radioItems` group form at all, so the view-mode group
 * has to be described here before the union below admits it. The cast happens
 * once, in {@link createMenuBar}, rather than at every call site.
 */
type RecycleMenuItem =
  | (Omit<OsGuiMenuItem, 'enabled' | 'checkbox' | 'submenu'> & {
      enabled?: boolean | (() => boolean);
      checkbox?: { type?: 'radio' | 'checkbox'; check?: () => boolean; toggle?: () => void };
      submenu?: RecycleMenuItem[];
    })
  | ViewsRadioGroup<RecycleViewMode>;

const BIN_ICON = '/images/icons/recycle-bin-32x32.png';
const BIN_ICON_SMALL = '/images/icons/recycle-bin-16x16.png';
const FILE_ICON = '/images/icons/notepad-file-16x16.png';
/** The large-icons view needs the 32×32 glyph; My Drive keeps the same pair. */
const FILE_ICON_LARGE = '/images/icons/notepad-file-32x32.png';
const RECYCLE_BIN_APP_ID = 'recycleBin';

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
  return name.replace(/\.md$/i, '');
}

function clearChildren(element: HTMLElement): void {
  while (element.firstChild) element.removeChild(element.firstChild);
}

/**
 * The file glyph, built as DOM so no markup string is ever parsed here.
 *
 * `boxClass` is the layout context, not the glyph: `rb-cell-icon` inside a table
 * cell, `rb-item-icon` inside an icon view. Keeping them apart is what lets the
 * icon views size the box to 32px without a table rule leaking into them.
 */
function createFileIcon(size: 16 | 32, boxClass: string): HTMLSpanElement {
  const icon = document.createElement('span');
  icon.className = `rb-file-icon ${boxClass}`;
  const image = document.createElement('img');
  image.src = size > 20 ? FILE_ICON_LARGE : FILE_ICON;
  image.width = size;
  image.height = size;
  image.alt = '';
  icon.appendChild(image);
  return icon;
}

/**
 * Opens the Recycle Bin as a native os-gui window: the Explorer chrome, the list
 * of files this app trashed, and a Restore action that puts one back into the
 * workspace folder.
 *
 * It reads the session from `driveSession`, never from My Drive. That is what
 * makes this window independent: it can be opened first, it can outlive My
 * Drive, and it works whether or not that window was ever launched.
 *
 * It deliberately takes NO `AppData`. The token travels through the session
 * module, and accepting a payload here would advertise a second handoff path
 * that must never exist.
 */
export function launchRecycleBin(): void {
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

  let view: RecycleView = 'disconnected';
  let errorCode: DriveErrorCode | null = null;
  let notice: string | null = null;
  let trashedFiles: DriveFile[] = [];
  let busy = false;
  /**
   * The armed connect this window's link points at, or `null` while it is unarmed.
   *
   * Window state on purpose: My Drive arms its own link at the same time without
   * either of them interfering, because an arming only becomes shared storage when it
   * is clicked. Whoever clicks first owns the single authorization code.
   */
  let connectArming: DriveConnectArming | null = null;
  let connectLinkEl: HTMLAnchorElement | null = null;
  /** Set by `$win.onClosed` and never cleared, so no late write touches dead DOM. */
  let windowClosed = false;
  /**
   * Breaks the notify → load → clear → notify cycle.
   *
   * Ending the session publishes a change, this window is one of the listeners,
   * and the load it starts is what may decide the session is gone. Without this
   * guard that chain recurses until the stack gives out.
   */
  let loadInFlight = false;
  /**
   * True only while this window is publishing its own workspace change.
   *
   * Restoring publishes, and this window is subscribed to that channel, so
   * without the flag a restore would be answered by a second `listTrashedFiles`
   * for a listing it had just re-read. It is window state rather than a counter
   * because the channel is account-wide: the *other* window's notifications are
   * exactly the ones that must still reload. `loadInFlight` cannot stand in for
   * it — it is released when `loadTrash` resolves, which happens strictly before
   * the publish, so the subscriber would find it already false.
   */
  let selfNotifiedWorkspace = false;

  // ── Selection / chrome state ──
  let selectedFileId: string | null = null;
  let selectedRowEl: HTMLElement | null = null;
  let currentView: RecycleViewMode = 'SMALL_ICONS';
  let statusBarVisible = true;
  let stdToolbarVisible = true;
  let addrBarVisible = true;
  /** Set by the screen that renders a failure, reset on every render pass. */
  let statusKind: 'ready' | 'error' = 'ready';

  const title = tr('windowTitle');
  const $win = $Window({
    title,
    icons: { 16: BIN_ICON_SMALL, 32: BIN_ICON },
    minWidth: 480,
    minHeight: 300,
  });

  $win.css({ width: '620px', height: '420px' });
  $win.center();
  applyCascadeAndFit($win, 620, 420);
  activeWindow = $win;
  registerOsWindow($win, RECYCLE_BIN_APP_ID, title, BIN_ICON);

  // ══════════════════════════════════════════════════════════════════
  // EXPLORER CHROME
  // ══════════════════════════════════════════════════════════════════
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer rb-explorer';

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
  addrIcon.src = BIN_ICON_SMALL;
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  // Decorative, like the address bar of My Drive: it names the one location this
  // window can be in and is never edited.
  const addrInput = document.createElement('input');
  addrInput.type = 'text';
  addrInput.id = 'address';
  addrInput.autocomplete = 'off';
  addrInput.readOnly = true;
  addrInput.value = tr('trashLocation');
  compoundInput.appendChild(addrInput);

  // No history dropdown here, unlike My Drive: this window addresses exactly one
  // location and there is nothing to pick from. My Drive's copy of the button is
  // permanently `disabled`, so dropping it costs no behaviour — and it is also how
  // this app keeps its DOM built entirely from nodes, since the arrow glyph exists
  // only as an SVG string that would have to be parsed as markup.
  addrBar.appendChild(compoundInput);
  addrToolbarEl.appendChild(addrBar);

  toolbars.append(menuToolbarEl, stdToolbarEl, addrToolbarEl);
  explorer.appendChild(toolbars);

  const contentEl: HTMLElement = document.createElement('div');
  contentEl.id = 'content';
  contentEl.className = 'inset-deep';
  explorer.appendChild(contentEl);

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
  // state, so opening a menu after a selection change shows the truth without
  // rebuilding the MenuBar.
  const menu: OsGuiMenuBar = createMenuBar({
    [tr('menuFile')]: [
      {
        label: tr('menuRestore'),
        enabled: () => canRestoreSelection(),
        action: () => void restoreSelected(),
      },
      { separator: true },
      {
        label: tr('menuRefresh'),
        shortcutLabel: 'F5',
        enabled: () => !busy,
        action: () => void loadTrash(),
      },
      { separator: true },
      // Mirrors My Drive's entry point into the same flow: reuses the real link, so
      // the PKCE handoff stays in one place and the menu cannot open a Google tab by
      // itself.
      {
        label: tr('menuConnect'),
        enabled: () => connectLinkEl !== null,
        action: activateConnectLink,
      },
      { separator: true },
      { label: tr('menuClose'), action: () => $win.close() },
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
      // Declared before its definition below: function declarations hoist, and the
      // whole menu bar is built once, so the group can be built now and read live
      // state later.
      viewModeGroup(),
      { separator: true },
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

  function selectedFile(): DriveFile | null {
    if (selectedFileId === null) return null;
    return trashedFiles.find((file) => file.id === selectedFileId) ?? null;
  }

  /**
   * `canUntrash` is an output-only Drive capability, and only an explicit `false`
   * is a refusal — `null` means the listing did not ask for it, which is not the
   * same as being told no.
   */
  function canRestore(file: DriveFile | null): boolean {
    return file !== null && file.canUntrash !== false;
  }

  function canRestoreSelection(): boolean {
    return !busy && canRestore(selectedFile());
  }

  // ══════════════════════════════════════════════════════════════════
  // CHROME SYNCHRONIZATION
  // ══════════════════════════════════════════════════════════════════

  function syncChromeVisibility(): void {
    stdToolbarEl.style.display = hasStandardToolbar() && stdToolbarVisible ? '' : 'none';
    addrToolbarEl.style.display = addrBarVisible ? '' : 'none';
    statusBarEl.style.display = statusBarVisible ? '' : 'none';
  }

  function syncStatusBar(): void {
    // A count with no session behind it is a claim about a listing nobody read,
    // so the cell stays blank until there is one — same rule as My Drive.
    statusLeftEl.textContent =
      view === 'list' || view === 'error'
        ? fill(tr('fileCount'), { count: trashedFiles.length })
        : '';
    // The middle cell doubles as the action log: the restore destination is what
    // it shows by default, and the outcome of the last restore replaces it until
    // the next action clears it. A transient timeout would need to survive the
    // window closing; a piece of state does not.
    statusMiddleEl.textContent =
      notice ?? fill(tr('restoreTarget'), { folder: DRIVE.WORKSPACE_FOLDER_NAME });
    statusRightEl.textContent = busy
      ? tr('statusWorking')
      : statusKind === 'error'
        ? tr('statusError')
        : tr('statusReady');
  }

  function setBusy(value: boolean): void {
    busy = value;
    syncStatusBar();
    syncEnabled();
  }

  // ══════════════════════════════════════════════════════════════════
  // STANDARD BUTTONS
  // ══════════════════════════════════════════════════════════════════

  let upBtn: HTMLButtonElement | null = null;
  let restoreBtn: HTMLButtonElement | null = null;
  let refreshBtn: HTMLButtonElement | null = null;
  let viewsBtn: HTMLDivElement | null = null;
  let retryBtn: HTMLButtonElement | null = null;

  /** The error screen has one action (Retry) and the list screen has three. */
  function hasStandardToolbar(): boolean {
    return view === 'list' || view === 'error';
  }

  function renderStandardButtons(): void {
    clearChildren(stdButtons);
    upBtn = null;
    restoreBtn = null;
    refreshBtn = null;
    viewsBtn = null;
    retryBtn = null;

    if (!hasStandardToolbar()) return;

    if (view === 'error') {
      retryBtn = createToolbarButton(tr('retry'), SPRITE.refresh);
      retryBtn.addEventListener('click', () => void loadTrash());
      stdButtons.appendChild(retryBtn);
      return;
    }

    // Up stays disabled for visual parity with My Drive: the trash is one flat
    // account-wide list, so there is no parent folder to navigate to.
    upBtn = createToolbarButton(tr('up'), SPRITE.up, true);
    stdButtons.appendChild(upBtn);
    stdButtons.appendChild(createSeparator());

    // The sprite sheet has no "restore" glyph, so Restore borrows the edit pencil
    // and leans on its label. What the button does is stated, not implied.
    restoreBtn = createToolbarButton(tr('restore'), SPRITE.edit);
    restoreBtn.addEventListener('click', () => void restoreSelected());
    stdButtons.appendChild(restoreBtn);
    stdButtons.appendChild(createSeparator());

    refreshBtn = createToolbarButton(tr('refresh'), SPRITE.refresh);
    refreshBtn.addEventListener('click', () => void loadTrash());
    stdButtons.appendChild(refreshBtn);

    // The glyph is fixed rather than tracking `currentView`: the main half of a
    // 98.js compound button is an action, not a state readout, and My Drive pins
    // it to the same sprite.
    viewsBtn = createCompoundButton(tr('views'), SPRITE.viewLargeIcons, cycleViewMode, openViewsMenu);
    stdButtons.appendChild(viewsBtn);
  }

  /** A compound wrapper owns two controls; both have to track `disabled`. */
  function setCompoundDisabled(wrapper: HTMLDivElement | null, disabled: boolean): void {
    if (wrapper === null) return;
    wrapper.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      button.disabled = disabled;
    });
  }

  /**
   * Re-evaluates the buttons against the current selection.
   *
   * Also the double-click guard: `setBusy(true)` runs before each Drive request
   * and everything here reads `busy`.
   */
  function syncEnabled(): void {
    if (upBtn !== null) upBtn.disabled = true;
    if (restoreBtn !== null) {
      const file = selectedFile();
      restoreBtn.disabled = busy || !canRestore(file);
      // The reason a Restore is unavailable has to be visible somewhere: a
      // disabled button with no explanation reads as a bug.
      restoreBtn.title = canRestore(file) ? '' : tr('cannotRestore');
    }
    if (refreshBtn !== null) refreshBtn.disabled = busy;
    // Re-rendering a view mode only means something on a listing. On any other
    // screen there are no rows, so the button would cycle state nobody can see.
    setCompoundDisabled(viewsBtn, busy || view !== 'list');
    if (retryBtn !== null) retryBtn.disabled = busy;
  }

  // ── Views ──

  /**
   * Cycles LARGE_ICONS → SMALL_ICONS → LIST → LARGE_ICONS, matching 98.js and
   * My Drive, where the compound button advances instead of opening the dropdown.
   *
   * DETAILS is deliberately outside the cycle: it is reachable from the dropdown
   * and from the View menu only, which is why `cycle.indexOf` returns -1 for it
   * and the next click lands on LARGE_ICONS.
   */
  function cycleViewMode(): void {
    if (view !== 'list') return;
    const cycle: RecycleViewMode[] = ['LARGE_ICONS', 'SMALL_ICONS', 'LIST'];
    const index = cycle.indexOf(currentView);
    currentView = index === -1 ? 'LARGE_ICONS' : cycle[(index + 1) % cycle.length];
    renderView();
  }

  function setCurrentView(mode: RecycleViewMode): void {
    if (view !== 'list' || currentView === mode) return;
    currentView = mode;
    renderView();
  }

  /** The four view modes as an os-gui radio group, shared by both entry points. */
  function viewModeGroup(): ViewsRadioGroup<RecycleViewMode> {
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

  /**
   * F5 only, and scoped to this window's own element.
   *
   * My Drive installs a document-level handler for the same key, so a document
   * listener here would make one F5 refresh *both* windows. `Window.js:129`
   * exposes the root node as `element` (not `$element`).
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLInputElement) return;
    if (event.key !== 'F5') return;

    event.preventDefault();
    if (!busy) void loadTrash();
  }

  $win.element.addEventListener('keydown', handleKeyDown);

  // ══════════════════════════════════════════════════════════════════
  // SESSION WIRING
  // ══════════════════════════════════════════════════════════════════

  /**
   * Repaints when the session changes.
   *
   * This is the whole reason the window is independent: connecting or
   * disconnecting in My Drive reaches this window without either of them knowing
   * the other exists.
   */
  const unsubscribeSession = subscribeDriveToken(() => {
    if (windowClosed) return;
    void loadTrash();
  });

  /**
   * Repaints the trash when the workspace changes under this window.
   *
   * My Drive trashes into the same Google trash this window lists, so without this
   * a file deleted over there stays invisible here until someone presses F5.
   *
   * Unlike My Drive this subscription is deliberately *not* gated on the current
   * screen. The two gates it would need are already free here: on `disconnected`
   * `requireToken` ends the call before any HTTP request, and on `loading`
   * `loadInFlight` drops it. Gating on `view === 'list'` would add the one real
   * cost instead — a notification arriving during the initial load would be
   * discarded, and nothing else would re-read the trash afterwards.
   */
  const unsubscribeWorkspace = subscribeDriveWorkspace(() => {
    if (windowClosed) return;
    // This window's own restore already re-read the trash; answering its own
    // notification would only spend a second round trip on the same listing.
    if (selfNotifiedWorkspace) return;
    void loadTrash();
  });

  $win.onClosed(() => {
    activeWindow = null;
    windowClosed = true;
    // Unsubscribing is not optional. A listener that outlives its window would
    // build DOM into a detached tree on the next connect, which is the same
    // class of failure as the missing os-gui property that killed every dialog.
    // Both channels, for the same reason.
    unsubscribeSession();
    unsubscribeWorkspace();
    $win.element.removeEventListener('keydown', handleKeyDown);
  });

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════

  function renderView(): void {
    statusKind = 'ready';
    connectLinkEl = null;

    renderStandardButtons();
    clearChildren(contentEl);

    switch (view) {
      case 'connecting':
        buildConnectingView();
        break;
      case 'loading':
        buildSpinnerView();
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
        buildDisconnectedView();
        break;
    }

    syncChromeVisibility();
    syncStatusBar();
    syncEnabled();

    // A refresh rebuilds every row, so the selected one has to take focus back or
    // it stays highlighted but inert.
    if (view === 'list' && selectedRowEl !== null) selectedRowEl.focus();
  }

  /**
   * Disconnected: this window can start the OAuth flow itself, so it offers the link
   * rather than sending the user to another window.
   */
  function buildDisconnectedView(): void {
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const heading = document.createElement('p');
    heading.className = 'rb-panel-heading';
    heading.textContent = tr('disconnectedHeading');
    panel.appendChild(heading);

    const text = document.createElement('p');
    text.className = 'rb-panel-text';
    text.textContent = tr('disconnectedText');
    panel.appendChild(text);

    const hint = document.createElement('p');
    hint.className = 'rb-panel-hint';
    hint.textContent = tr('disconnectedHint');
    panel.appendChild(hint);

    if (notice !== null) {
      const noticeEl = document.createElement('p');
      noticeEl.className = 'rb-panel-notice';
      noticeEl.textContent = notice;
      panel.appendChild(noticeEl);
    }

    const config = readDriveConfig();
    if (config === null) {
      const missing = document.createElement('p');
      missing.className = 'rb-panel-error';
      missing.textContent = tr('configMissing');
      panel.appendChild(missing);
      statusKind = 'error';
      contentEl.appendChild(panel);
      return;
    }

    // Another window is already authorizing. Said here so the link does not look like
    // it would do something it cannot: the click is refused until that flow ends, and
    // the link is deliberately NOT hidden. A failed flow releases the claim without
    // publishing anything, so a panel that waited for a repaint before offering the
    // link again would sit there claiming a connection that no longer exists.
    if (isDriveConnectInFlight()) {
      const waiting = document.createElement('p');
      waiting.className = 'rb-panel-hint';
      waiting.textContent = tr('connectInProgress');
      panel.appendChild(waiting);
    }

    const link = document.createElement('a');
    link.className = 'rb-connect-link';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = tr('connectButton');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', (event) => {
      const arming = connectArming;
      if (arming === null) {
        event.preventDefault();
        return;
      }
      const launch = launchDriveConnect(arming, connectMessages(), connectProgress());
      if (launch.started) return;
      // Refused: another window owns the flow. Following the link anyway would open a
      // second Google tab publishing a second code for one single-use exchange, and
      // the window that is waiting would lose the race for it.
      event.preventDefault();
      notice = tr('connectInProgress');
      renderView();
    });
    panel.appendChild(link);

    const linkHint = document.createElement('p');
    linkHint.className = 'rb-panel-hint';
    linkHint.textContent = tr('connectHint');
    panel.appendChild(linkHint);

    contentEl.appendChild(panel);
    connectLinkEl = link;

    void armConnectLink(link, config);
  }

  /** The wait between "the user approved access" and "here is the trash". */
  function buildConnectingView(): void {
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const heading = document.createElement('p');
    heading.className = 'rb-panel-heading';
    heading.textContent = tr('connectingHeading');

    const text = document.createElement('p');
    text.className = 'rb-panel-text';
    text.textContent = tr('connectingText');

    const spinner = document.createElement('div');
    spinner.className = 'rb-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', tr('connectingHeading'));

    panel.append(heading, text, spinner);
    contentEl.appendChild(panel);
  }

  /**
   * Replace the connect panel with a single message.
   *
   * For a failure the panel cannot recover from (no WebCrypto in this context): the
   * panel builder re-arms the link, and the link is what just failed to arm.
   */
  function renderConnectNotice(message: string): void {
    clearChildren(contentEl);
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const heading = document.createElement('p');
    heading.className = 'rb-panel-heading';
    heading.textContent = tr('disconnectedHeading');

    const text = document.createElement('p');
    text.className = 'rb-panel-error';
    text.textContent = message;

    panel.append(heading, text);
    contentEl.appendChild(panel);
    statusKind = 'error';
  }

  /**
   * Generate the PKCE pair and point the connect link at Google's consent URL.
   *
   * Nothing is persisted here: the verifier and state have to be in sessionStorage
   * before the browser leaves the page, so they are written inside the click handler,
   * which `launchDriveConnect` does. The link is a real `<a target="_blank">`, never
   * `window.open` — the flow navigates away, which a popup cannot survive reliably,
   * and browsers block scripted popups across the OAuth redirect.
   */
  async function armConnectLink(link: HTMLAnchorElement, config: DriveConfig): Promise<void> {
    connectArming = null;
    const arming = await prepareDriveConnect(config);
    if (arming === null) {
      renderConnectNotice(tr('secureContextMissing'));
      return;
    }

    connectArming = arming;
    link.href = arming.consentUrl;
    link.removeAttribute('aria-disabled');
  }

  /** Failure copy for the shared flow, read from this window's own table. */
  function connectMessages(): DriveConnectMessages {
    return {
      configMissing: tr('configMissing'),
      timeout: tr('connectTimeout'),
      stateMismatch: tr('connectStateMismatch'),
      exchangeFailed: tr('connectExchangeFailed'),
    };
  }

  /**
   * How the shared flow paints itself here. `onConnected` deliberately goes through
   * `loadTrash` and nothing else: reading the trash creates nothing in Drive, so
   * connecting from this window can never put the workspace folder in the user's
   * account as a side effect. `resolveWorkspaceFolderId` stays on `findWorkspaceFolder`.
   */
  function connectProgress(): DriveConnectProgress {
    return {
      onConnecting: () => {
        if (windowClosed) return;
        notice = null;
        view = 'connecting';
        renderView();
      },
      onFailed: (message) => {
        if (windowClosed) return;
        notice = message;
        view = 'disconnected';
        renderView();
      },
      onConnected: () => {
        if (windowClosed) return;
        connectArming = null;
        errorCode = null;
        void loadTrash();
      },
    };
  }

  /** `File > Connect` reuses the real link so the PKCE flow stays in one place. */
  function activateConnectLink(): void {
    connectLinkEl?.click();
  }

  function buildSpinnerView(): void {
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const heading = document.createElement('p');
    heading.className = 'rb-panel-heading';
    heading.textContent = tr('loadingHeading');
    panel.appendChild(heading);

    const text = document.createElement('p');
    text.className = 'rb-panel-text';
    text.textContent = tr('loadingText');
    panel.appendChild(text);

    const spinner = document.createElement('div');
    spinner.className = 'rb-spinner';
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', tr('loadingHeading'));
    panel.appendChild(spinner);

    contentEl.appendChild(panel);
  }

  function buildErrorView(): void {
    const panel = document.createElement('div');
    panel.className = 'rb-panel';

    const heading = document.createElement('p');
    heading.className = 'rb-panel-heading';
    heading.textContent = tr('errorHeading');
    panel.appendChild(heading);

    const message = document.createElement('p');
    message.className = 'rb-panel-error';
    message.textContent =
      errorCode === null ? tr('unknownError') : getDriveErrorMessage(errorCode, getLang());
    panel.appendChild(message);

    contentEl.appendChild(panel);
  }

  function buildListView(): void {
    // The rows about to be built replace the current DOM, so the previous row
    // reference is already detached. `bindItem` re-points it at whichever row
    // matches `selectedFileId`.
    selectedRowEl = null;

    if (trashedFiles.length === 0) {
      const panel = document.createElement('div');
      panel.className = 'rb-panel';

      const heading = document.createElement('p');
      heading.className = 'rb-panel-heading';
      heading.textContent = tr('emptyHeading');
      panel.appendChild(heading);

      const text = document.createElement('p');
      text.className = 'rb-panel-text';
      text.textContent = tr('emptyText');
      panel.appendChild(text);

      contentEl.appendChild(panel);
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
    grid.className = 'rb-view rb-view-large';
    grid.setAttribute('role', 'listbox');

    for (const file of trashedFiles) {
      const item = document.createElement('div');
      item.className = 'rb-item rb-item-large';
      item.title = file.name;
      item.setAttribute('role', 'option');

      const icon = createFileIcon(32, 'rb-item-icon');

      const label = document.createElement('span');
      label.className = 'rb-item-label';
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
    grid.className = 'rb-view rb-view-small';
    grid.setAttribute('role', 'listbox');

    for (const file of trashedFiles) {
      const item = document.createElement('div');
      item.className = 'rb-item rb-item-small';
      item.title = file.name;
      item.setAttribute('role', 'option');

      const icon = createFileIcon(16, 'rb-item-icon');

      const label = document.createElement('span');
      label.className = 'rb-item-label';
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
   * Both are tables, and both keep the Deleted column: how long ago a file was
   * trashed is what tells the user how much of the 30-day window is left before
   * Drive removes it for good. Details adds the Restorable column, which answers
   * the other half of that question — whether Drive will still take the file
   * back — and which is the same fact that disables Restore on a row.
   *
   * The icon views deliberately show neither: there is no room for a second
   * column of dates there, and the label is what has to stay legible.
   */
  function buildTableView(withRestorable: boolean): HTMLElement {
    const table = document.createElement('table');
    table.className = 'rb-table';

    const headers: { label: string; width: string }[] = withRestorable
      ? [
          { label: tr('columnName'), width: '40%' },
          { label: tr('columnSize'), width: '15%' },
          { label: tr('columnDeleted'), width: '25%' },
          { label: tr('columnRestorable'), width: '20%' },
        ]
      : [
          { label: tr('columnName'), width: '55%' },
          { label: tr('columnSize'), width: '20%' },
          { label: tr('columnDeleted'), width: '25%' },
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
    for (const file of trashedFiles) {
      const row = document.createElement('tr');
      row.className = 'rb-item rb-row';
      row.title = file.name;

      const nameCell = document.createElement('td');
      nameCell.className = 'rb-cell';
      nameCell.appendChild(createFileIcon(16, 'rb-cell-icon'));
      const nameText = document.createElement('span');
      nameText.className = 'rb-cell-text';
      nameText.textContent = stripMarkdownExtension(file.name);
      nameCell.appendChild(nameText);

      const sizeCell = document.createElement('td');
      sizeCell.className = 'rb-cell';
      sizeCell.textContent = formatSize(file.size);

      const deletedCell = document.createElement('td');
      deletedCell.className = 'rb-cell';
      deletedCell.textContent = formatDate(file.trashedTime);

      row.append(nameCell, sizeCell, deletedCell);

      if (withRestorable) {
        // The same three-way reading `canRestore` applies: only an explicit
        // `false` is a refusal, and "the listing did not ask" is not that claim.
        const restorableCell = document.createElement('td');
        restorableCell.className = 'rb-cell';
        restorableCell.textContent =
          file.canUntrash === null
            ? tr('restorableUnknown')
            : file.canUntrash
              ? tr('restorableYes')
              : tr('restorableNo');
        row.appendChild(restorableCell);
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
   * Every render rebuilds the rows, so the highlight has to be re-applied here
   * rather than only on click. That is what keeps "Restore is enabled only while a
   * row visibly looks selected" true after a refresh.
   */
  function bindItem(item: HTMLElement, file: DriveFile): void {
    item.tabIndex = 0;
    item.addEventListener('click', () => selectFile(file, item));

    if (file.id !== selectedFileId) return;
    item.classList.add('rb-item-selected');
    item.setAttribute('aria-selected', 'true');
    selectedRowEl = item;
  }

  function clearRowHighlight(row: HTMLElement | null): void {
    if (row === null) return;
    row.classList.remove('rb-item-selected');
    row.removeAttribute('aria-selected');
  }

  function selectFile(file: DriveFile, row: HTMLElement): void {
    selectedFileId = file.id;
    if (selectedRowEl !== row) clearRowHighlight(selectedRowEl);
    selectedRowEl = row;
    row.classList.add('rb-item-selected');
    row.setAttribute('aria-selected', 'true');

    syncStatusBar();
    syncEnabled();
  }

  // ══════════════════════════════════════════════════════════════════
  // SESSION ACTIONS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Returns the live token, or drops to the disconnected screen when it is gone.
   *
   * Clearing here also normalises the expiry case: an expired token is not a
   * session, and the window has to stop acting as if it were one.
   */
  function requireToken(): DriveToken | null {
    const activeToken = getUsableDriveToken();
    if (activeToken === null) {
      clearDriveToken();
      view = 'disconnected';
      renderView();
      return null;
    }
    return activeToken;
  }

  function handleDriveError(error: DriveError): void {
    console.error(`Drive request failed (${error.code}): ${error.detail}`);
    if (error.code === 'auth-expired') {
      clearDriveToken();
      view = 'disconnected';
      renderView();
      return;
    }
    errorCode = error.code;
    view = 'error';
    renderView();
  }

  /** Read the trash, or leave the screen explaining why it could not. */
  async function loadTrash(): Promise<void> {
    if (loadInFlight) return;
    loadInFlight = true;
    try {
      const activeToken = requireToken();
      if (activeToken === null) return;

      notice = null;
      view = 'loading';
      renderView();
      setBusy(true);

      const listed = await driveClient.listTrashedFiles(activeToken);
      setBusy(false);
      if (!listed.ok) {
        handleDriveError(listed.error);
        return;
      }

      trashedFiles = listed.data;
      errorCode = null;
      // A refresh can drop the file that was selected; keep the selection only
      // when the refreshed listing still contains it.
      if (selectedFile() === null) selectedFileId = null;
      selectedRowEl = null;
      view = 'list';
      renderView();
    } finally {
      loadInFlight = false;
    }
  }

  /**
   * Publishes a workspace change that this window caused, so it can recognize
   * its own notification and not answer it.
   *
   * The flag is held across the call and never outside it. `publish` walks the
   * subscriber set synchronously, so the subscriber observes the flag while the
   * publish is in progress and never after it — an exception in another window's
   * listener cannot leave the flag stuck and swallow a real change.
   */
  function publishOwnWorkspaceChange(): void {
    selfNotifiedWorkspace = true;
    try {
      notifyDriveWorkspaceChanged();
    } finally {
      selfNotifiedWorkspace = false;
    }
  }

  /**
   * Find the workspace folder to restore into, without creating anything.
   *
   * My Drive publishes the id it discovered, which is the common case. The
   * lookup below covers the other one: this window opened first, so nobody has
   * resolved the folder yet. `ensureWorkspaceFolder` is deliberately NOT used —
   * pressing Restore should never put a folder in the user's Drive as a side
   * effect of not finding one.
   */
  async function resolveWorkspaceFolderId(activeToken: DriveToken): Promise<DriveResult<string>> {
    const published = getDriveWorkspaceFolderId();
    if (published !== null) return { ok: true, data: published };

    const found = await driveClient.findWorkspaceFolder(activeToken);
    if (!found.ok) return found;
    if (found.data === null) {
      return {
        ok: false,
        error: createDriveError('not-found', null, `folder ${DRIVE.WORKSPACE_FOLDER_NAME} not found`),
      };
    }

    setDriveWorkspaceFolderId(found.data.id);
    return { ok: true, data: found.data.id };
  }

  /**
   * Put the selected file back into the workspace folder, then re-read the trash.
   *
   * The row disappearing *is* the confirmation — a message box on every restore
   * would be noise for an operation the list already reports. What the status bar
   * adds is the destination, so the user can see where the file went.
   */
  async function restoreSelected(): Promise<void> {
    if (busy) return;
    const file = selectedFile();
    // Spelled out rather than delegated to `canRestore`: the helper returns a
    // boolean, which cannot narrow `file` for the compiler.
    if (file === null || !canRestore(file)) return;

    const activeToken = requireToken();
    if (activeToken === null) return;

    setBusy(true);
    const folder = await resolveWorkspaceFolderId(activeToken);
    if (!folder.ok) {
      setBusy(false);
      if (folder.error.code === 'not-found') {
        await showMessageBox({
          title: tr('folderMissingTitle'),
          message: fill(tr('folderMissingMessage'), { folder: DRIVE.WORKSPACE_FOLDER_NAME }),
          icon: 'warning',
        });
        return;
      }
      handleDriveError(folder.error);
      return;
    }

    const restored = await driveClient.restoreFile(activeToken, file.id, folder.data);
    setBusy(false);
    if (!restored.ok) {
      handleDriveError(restored.error);
      return;
    }

    // The refreshed listing is what removes the row, so the file that was
    // restored can no longer be the selection.
    selectedFileId = null;
    selectedRowEl = null;
    // Announced only once Drive accepted the restore, and in `finally`: My Drive
    // would otherwise keep advertising the file as trashed until someone pressed
    // F5, and a refresh that fails *here* must not keep it doing so.
    try {
      await loadTrash();
    } finally {
      publishOwnWorkspaceChange();
    }

    // The notice goes *after* the refresh: `loadTrash` clears it on entry, so
    // setting it before would wipe the message with the very call that proves it.
    notice = fill(tr('restoreDone'), {
      name: stripMarkdownExtension(file.name),
      folder: DRIVE.WORKSPACE_FOLDER_NAME,
    });
    syncStatusBar();
  }

  renderView();
  // Opened into an existing session (My Drive connected first): pick it up
  // instead of sitting on the disconnected screen until something changes.
  if (getUsableDriveToken() !== null) void loadTrash();
}

/**
 * Builds an os-gui MenuBar from the widened item shape declared above.
 *
 * The single assertion is what bridges `src/types/os-gui.d.ts`, whose item
 * declaration is narrower than the contract MenuBar.js implements. See
 * {@link RecycleMenuItem}.
 */
function createMenuBar(menus: Record<string, RecycleMenuItem[]>): OsGuiMenuBar {
  return new window.MenuBar(menus as unknown as OsGuiMenuDefinition);
}