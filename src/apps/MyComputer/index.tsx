import React from 'react';
import {
  extractDate,
  extractContentWithoutDate,
  extractRawContent,
} from '../../utils/fileUtils';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

/**
 * All markdown files loaded eagerly via Vite's import.meta.glob.
 */
const files: Record<string, string> = import.meta.glob(
  '../../data/files/**/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST';

interface FileItem {
  name: string;
  folder: string;
  date: string;
}

interface FolderItem {
  name: string;
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

/**
 * Returns an <img> HTML string for a folder icon using authentic Win98 PNGs.
 * Uses folder-32x32.png for sizes > 20, folder-16x16.png for smaller.
 */
function getFolderIcon(size: number = 32): string {
  const src = size > 20 ? '/app/icons/folder-32x32.png' : '/app/icons/folder-16x16.png';
  return `<img src="${src}" width="${size}" height="${size}" alt="" style="pointer-events:none;image-rendering:pixelated">`;
}

/**
 * Returns an <img> HTML string for a file icon using authentic Win98 PNGs.
 * Uses notepad-file-32x32.png for sizes > 20, notepad-file-16x16.png for smaller.
 */
function getFileIcon(size: number = 32): string {
  const src = size > 20 ? '/app/icons/notepad-file-32x32.png' : '/app/icons/notepad-file-16x16.png';
  return `<img src="${src}" width="${size}" height="${size}" alt="" style="pointer-events:none;image-rendering:pixelated">`;
}

/**
 * Returns a "My Computer" icon (a monitor) SVG.
 */
function getMyComputerIconSvg(size: number = 32): string {
  return `<svg viewBox="0 0 32 32" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="28" height="20" rx="2" fill="#C0C0C0" stroke="#808080" stroke-width="1"/>
    <rect x="2" y="2" width="28" height="20" rx="2" fill="none" stroke="#fff" stroke-width="1" transform="translate(1,1)"/>
    <rect x="4" y="4" width="24" height="14" fill="#000080"/>
    <line x1="8" y1="24" x2="24" y2="24" stroke="#808080" stroke-width="2"/>
    <rect x="10" y="24" width="12" height="4" rx="1" fill="#C0C0C0" stroke="#808080" stroke-width="1"/>
  </svg>`;
}

// ─── Folder listing helpers ────────────────────────────────────────────────────

/**
 * Returns the list of top-level folder names from the glob result.
 */
function getFolders(): FolderItem[] {
  const folderSet = new Set<string>();
  Object.keys(files).forEach((path) => {
    const folder = path.replace('../../data/files/', '').split('/')[0];
    folderSet.add(folder);
  });
  return Array.from(folderSet)
    .sort()
    .map((name) => ({ name }));
}

/**
 * Returns all files in a given folder, sorted by name.
 */
function getFilesInFolder(folderName: string): FileItem[] {
  const result: FileItem[] = [];
  Object.entries(files).forEach(([path, content]) => {
    const parts = path.replace('../../data/files/', '').split('/');
    if (parts[0] === folderName) {
      result.push({
        name: parts[1],
        folder: parts[0],
        date: extractDate(content),
      });
    }
  });
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

// ─── Action helper ────────────────────────────────────────────────────────────

function openFileViewer(name: string, folder: string, date: string): void {
  const contentPath = `../../data/files/${folder}/${name}`;
  const content = files[contentPath];
  const rawContent = content ? extractRawContent(content) : '';
  const processedContent = content ? extractContentWithoutDate(content) : '';

  window.dispatchEvent(
    new CustomEvent('desktop-open-app', {
      detail: {
        appId: 'markdownViewer',
        appData: {
          file: {
            name: name.replace('.md', ''),
            content: processedContent,
            rawContent,
            folder,
            date,
          },
          windowKey: `${folder}/${name}`,
          title: name.replace('.md', ''),
        },
      },
    }),
  );
}

// ─── os-gui DOM helpers ───────────────────────────────────────────────────────

const SPRITE_BACK = 0;
const SPRITE_FORWARD = 1;
const SPRITE_UP = 44;
const SPRITE_VIEWS = 38;

const DROPDOWN_ARROW_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="fill:currentColor;display:inline-block;vertical-align:middle"><path style="transform:rotate(90deg);transform-origin:center" d="m5 6 4 4-4 4z"></path></svg>`;

function createSpriteIcon(spriteIndex: number): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'icon';
  div.style.backgroundPosition = `-${spriteIndex * 20}px 0px`;
  return div;
}

function createToolbarButton(
  label: string,
  spriteIndex: number,
  disabled: boolean = false,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'toolbar-button lightweight';
  if (disabled) btn.disabled = true;
  btn.appendChild(createSpriteIcon(spriteIndex));
  const labelSpan = document.createElement('span');
  labelSpan.className = 'label-text';
  labelSpan.textContent = label;
  btn.appendChild(labelSpan);
  return btn;
}

function createCompoundButton(
  label: string,
  spriteIndex: number,
  mainAction: () => void,
  dropdownAction: (event: Event) => void,
  disabled: boolean = false,
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'toolbar-compound-button-wrapper';
  const mainBtn = createToolbarButton(label, spriteIndex, disabled);
  mainBtn.addEventListener('click', mainAction);
  wrapper.appendChild(mainBtn);
  const dropBtn = document.createElement('button');
  dropBtn.className = 'toolbar-dropdown-button lightweight';
  if (disabled) dropBtn.disabled = true;
  dropBtn.innerHTML = DROPDOWN_ARROW_SVG;
  dropBtn.addEventListener('click', dropdownAction);
  wrapper.appendChild(dropBtn);
  return wrapper;
}

function createSeparator(): HTMLHRElement {
  const hr = document.createElement('hr');
  hr.setAttribute('aria-orientation', 'vertical');
  return hr;
}

function ensureDisabledFilter(): void {
  if (document.getElementById('mycomputer-disabled-filter')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'mycomputer-disabled-filter';
  svg.setAttribute('style', 'position: absolute; pointer-events: none; bottom: 100%;');
  svg.innerHTML = `
    <defs>
      <filter id="disabled-inset-filter" x="0" y="0" width="1px" height="1px">
        <feColorMatrix in="SourceGraphic" type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 4 0"
          result="dark-parts-isolated"/>
        <feFlood result="shadow-color" flood-color="var(--ButtonShadow)"/>
        <feFlood result="hilight-color" flood-color="var(--ButtonHilight)"/>
        <feOffset in="dark-parts-isolated" dx="1" dy="1" result="offset"/>
        <feComposite in="hilight-color" in2="offset" operator="in" result="hilight-colored-offset"/>
        <feComposite in="shadow-color" in2="dark-parts-isolated" operator="in" result="shadow-colored"/>
        <feMerge>
          <feMergeNode in="hilight-colored-offset"/>
          <feMergeNode in="shadow-colored"/>
        </feMerge>
      </filter>
    </defs>`;
  document.body.appendChild(svg);
}

// ─── React placeholder ────────────────────────────────────────────────────────

export const MyComputerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ─── os-gui launch function ───────────────────────────────────────────────────

/**
 * Launches "My Computer" as a native os-gui window with folder navigation
 * through the data/files directory structure.
 */
export function launchMyComputer(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded.');
    return;
  }

  ensureDisabledFilter();

  // ── Navigation state ──
  // Each path entry: null = root (My Computer), string = folder name
  const navHistory: (string | null)[] = [null];
  let navIndex = 0;
  let currentView: ViewMode = 'LARGE_ICONS';

  // DOM references
  let contentEl: HTMLElement;
  let statusBarEl: HTMLElement;
  let statusLeftEl: HTMLElement;
  let statusMiddleEl: HTMLElement;
  let statusRightEl: HTMLElement;
  let addrInput: HTMLInputElement;
  let backBtn: HTMLButtonElement;
  let forwardBtn: HTMLButtonElement;
  let upBtn: HTMLButtonElement;
  let statusBarVisible = true;
  let stdToolbarVisible = true;
  let addrBarVisible = true;

  /**
   * Returns the current folder name, or null for root.
   */
  function currentFolder(): string | null {
    return navHistory[navIndex];
  }

  /**
   * Updates Back/Forward/Up button states based on navigation position.
   */
  function updateNavButtons(): void {
    backBtn.disabled = navIndex <= 0;
    forwardBtn.disabled = navIndex >= navHistory.length - 1;
    upBtn.disabled = currentFolder() === null;
  }

  /**
   * Navigates to a given folder (or null = root) and pushes to history.
   */
  function navigateTo(folder: string | null): void {
    // Truncate forward history
    navHistory.splice(navIndex + 1);
    navHistory.push(folder);
    navIndex = navHistory.length - 1;
    renderCurrentFolder();
  }

  /**
   * Navigates back in history.
   */
  function goBack(): void {
    if (navIndex > 0) {
      navIndex--;
      renderCurrentFolder();
    }
  }

  /**
   * Navigates forward in history.
   */
  function goForward(): void {
    if (navIndex < navHistory.length - 1) {
      navIndex++;
      renderCurrentFolder();
    }
  }

  /**
   * Navigates up one level (to parent folder, or root).
   */
  function goUp(): void {
    const folder = currentFolder();
    if (folder !== null) {
      navigateTo(null);
    }
  }

  function cycleViewMode(): void {
    const cycle: ViewMode[] = ['LARGE_ICONS', 'SMALL_ICONS', 'LIST'];
    const idx = cycle.indexOf(currentView);
    currentView = cycle[(idx + 1) % cycle.length];
    renderCurrentFolder();
  }

  function openViewsDropdown(event: Event): void {
    const dropBtn = event.currentTarget as HTMLElement;
    const wrapper = dropBtn.closest('.toolbar-compound-button-wrapper') as HTMLElement;
    const rect = wrapper.getBoundingClientRect();

    const dummyMenuBar = new MenuBar({
      "Views": [
        {
          label: "as &Web Page",
          enabled: false,
          type: 'checkbox',
          checked: false,
          action: () => {},
        },
        { separator: true },
        {
          label: "Lar&ge Icons",
          type: 'radio',
          checked: currentView === 'LARGE_ICONS',
          action: () => { currentView = 'LARGE_ICONS'; renderCurrentFolder(); cleanup(); },
        },
        {
          label: "S&mall Icons",
          type: 'radio',
          checked: currentView === 'SMALL_ICONS',
          action: () => { currentView = 'SMALL_ICONS'; renderCurrentFolder(); cleanup(); },
        },
        {
          label: "&List",
          type: 'radio',
          checked: currentView === 'LIST',
          action: () => { currentView = 'LIST'; renderCurrentFolder(); cleanup(); },
        },
      ],
    });

    const dummyEl = document.createElement('div');
    dummyEl.style.cssText = `position: absolute; left: ${rect.left}px; top: ${rect.top}px; visibility: hidden; pointer-events: none;`;
    dummyEl.appendChild(dummyMenuBar.element);
    document.body.appendChild(dummyEl);

    const menuButton = dummyEl.querySelector('.menu-button') as HTMLElement;
    if (menuButton) {
      menuButton.dispatchEvent(new PointerEvent('pointerdown'));
      menuButton.addEventListener('release', () => {
        if (document.body.contains(dummyEl)) document.body.removeChild(dummyEl);
      });
    }

    function cleanup(): void {
      if (document.body.contains(dummyEl)) document.body.removeChild(dummyEl);
    }
  }

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'My Computer',
    icons: {
      16: '/app/icons/my-computer-16x16.png',
      32: '/app/icons/my-computer-32x32.png',
    },
    minWidth: 600,
    minHeight: 400,
  });

  $win.css({ width: '780px', height: '540px' });
  $win.center();
  registerOsWindow($win, 'myComputer', 'My Computer', '/app/icons/my-computer-32x32.png');

  // ── Root explorer container ──
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer';
  explorer.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
    font-size: 11px;
  `;

  // ══════════════════════════════════════════════════════════════════
  // TOOLBARS
  // ══════════════════════════════════════════════════════════════════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu bar toolbar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  const menu = new MenuBar({
    '&File': [
      { label: '&New', submenu: [
        { label: '&Folder', enabled: false },
        { label: '&Shortcut', enabled: false },
      ]},
      { separator: true },
      { label: '&Delete', enabled: false },
      { label: 'Rena&me', enabled: false },
      { label: 'P&roperties', enabled: false },
      { separator: true },
      { label: '&Close', action: () => $win.close() },
    ],
    '&Edit': [
      { label: '&Undo', shortcutLabel: 'Ctrl+Z', enabled: false },
      { separator: true },
      { label: 'Cu&t', shortcutLabel: 'Ctrl+X', enabled: false },
      { label: '&Copy', shortcutLabel: 'Ctrl+C', enabled: false },
      { label: '&Paste', shortcutLabel: 'Ctrl+V', enabled: false },
      { separator: true },
      { label: 'Select &All', shortcutLabel: 'Ctrl+A', action: () => {} },
      { label: '&Invert Selection', action: () => {} },
    ],
    '&View': [
      {
        label: '&Toolbars',
        submenu: [
          {
            label: '&Standard Buttons',
            checked: true,
            action: () => {
              stdToolbarVisible = !stdToolbarVisible;
              document.getElementById('standard-buttons-toolbar')!.style.display = stdToolbarVisible ? '' : 'none';
            },
          },
          {
            label: '&Address Bar',
            checked: true,
            action: () => {
              addrBarVisible = !addrBarVisible;
              document.getElementById('address-bar-toolbar')!.style.display = addrBarVisible ? '' : 'none';
            },
          },
        ],
      },
      {
        label: 'Status &Bar',
        checked: true,
        action: () => {
          statusBarVisible = !statusBarVisible;
          statusBarEl.style.display = statusBarVisible ? '' : 'none';
        },
      },
      { separator: true },
      {
        label: 'Arrange &Icons',
        submenu: [
          { label: 'by &Name', type: 'radio', checked: true, action: () => { renderCurrentFolder(); } },
          { label: 'by &Type', type: 'radio', action: () => { renderCurrentFolder(); } },
          { label: 'by &Size', type: 'radio', action: () => { renderCurrentFolder(); } },
          { label: 'by &Date', type: 'radio', action: () => { renderCurrentFolder(); } },
        ],
      },
      { separator: true },
      { label: '&Refresh', shortcutLabel: 'F5', action: () => renderCurrentFolder() },
    ],
    '&Help': [
      {
        label: '&About My Computer',
        action: () => {
          showMessageBox({
            title: 'About My Computer',
            message: 'My Computer\n\nBrowse files and folders organized on your system.\n\nVersion 1.0',
            icon: 'info',
          });
        },
      },
    ],
  });

  menuToolbar.appendChild(menu.element);
  toolbars.appendChild(menuToolbar);

  // ── Standard Buttons toolbar ──
  const stdToolbarEl = document.createElement('div');
  stdToolbarEl.className = 'toolbar';
  stdToolbarEl.id = 'standard-buttons-toolbar';

  const stdDragHandle = document.createElement('div');
  stdDragHandle.className = 'toolbar-drag-handle';
  stdToolbarEl.appendChild(stdDragHandle);

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';

  // Back (compound)
  backBtn = createToolbarButton('Back', SPRITE_BACK, true);
  backBtn.addEventListener('click', goBack);
  stdButtons.appendChild(backBtn);

  // Forward (compound)
  forwardBtn = createToolbarButton('Forward', SPRITE_FORWARD, true);
  forwardBtn.addEventListener('click', goForward);
  stdButtons.appendChild(forwardBtn);

  // Up
  upBtn = createToolbarButton('Up', SPRITE_UP, true);
  upBtn.addEventListener('click', goUp);
  stdButtons.appendChild(upBtn);

  stdButtons.appendChild(createSeparator());

  stdButtons.appendChild(
    createCompoundButton('Views', SPRITE_VIEWS, cycleViewMode, openViewsDropdown),
  );

  stdToolbarEl.appendChild(stdButtons);
  toolbars.appendChild(stdToolbarEl);

  // ── Address bar toolbar ──
  const addrToolbarEl = document.createElement('div');
  addrToolbarEl.className = 'toolbar';
  addrToolbarEl.id = 'address-bar-toolbar';

  const addrDragHandle = document.createElement('div');
  addrDragHandle.className = 'toolbar-drag-handle';
  addrToolbarEl.appendChild(addrDragHandle);

  const addrBar = document.createElement('div');
  addrBar.id = 'address-bar';

  const addrLabel = document.createElement('label');
  addrLabel.setAttribute('for', 'address');
  addrLabel.textContent = 'Address';
  addrBar.appendChild(addrLabel);

  const compoundInput = document.createElement('div');
  compoundInput.id = 'address-compound-input';
  compoundInput.className = 'inset-deep';

  const addrIcon = document.createElement('img');
  addrIcon.id = 'address-icon';
  addrIcon.width = 16;
  addrIcon.height = 16;
  addrIcon.src = '/app/icons/my-computer-16x16.png';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  addrInput = document.createElement('input');
  addrInput.type = 'text';
  addrInput.id = 'address';
  addrInput.readOnly = true;
  addrInput.autocomplete = 'off';
  compoundInput.appendChild(addrInput);

  addrBar.appendChild(compoundInput);
  addrToolbarEl.appendChild(addrBar);
  toolbars.appendChild(addrToolbarEl);

  explorer.appendChild(toolbars);

  // ══════════════════════════════════════════════════════════════════
  // CONTENT AREA
  // ══════════════════════════════════════════════════════════════════
  contentEl = document.createElement('div');
  contentEl.id = 'content';
  contentEl.className = 'inset-deep';
  explorer.appendChild(contentEl);

  // ══════════════════════════════════════════════════════════════════
  // STATUS BAR
  // ══════════════════════════════════════════════════════════════════
  statusBarEl = document.createElement('div');
  statusBarEl.id = 'status-bar';

  statusLeftEl = document.createElement('div');
  statusLeftEl.id = 'status-bar-left';
  statusLeftEl.className = 'inset-shallow';
  statusBarEl.appendChild(statusLeftEl);

  statusMiddleEl = document.createElement('div');
  statusMiddleEl.id = 'status-bar-middle';
  statusMiddleEl.className = 'inset-shallow';
  statusBarEl.appendChild(statusMiddleEl);

  statusRightEl = document.createElement('div');
  statusRightEl.id = 'status-bar-right';
  statusRightEl.className = 'inset-shallow';
  statusBarEl.appendChild(statusRightEl);

  explorer.appendChild(statusBarEl);

  // ── Append explorer to window ──
  $win.$content.append(explorer);

  // ══════════════════════════════════════════════════════════════════
  // CONTENT BUILDERS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Renders the root view showing all top-level folders as large icons.
   */
  function renderRootView(): void {
    const folderList = getFolders();

    switch (currentView) {
      case 'SMALL_ICONS':
        contentEl.appendChild(buildFoldersSmallIcons(folderList));
        break;
      case 'LIST':
        contentEl.appendChild(buildFoldersList(folderList));
        break;
      case 'LARGE_ICONS':
      default:
        contentEl.appendChild(buildFoldersLargeIcons(folderList));
        break;
    }

    statusLeftEl.textContent = `${folderList.length} object(s)`;
    statusMiddleEl.textContent = '';
    statusRightEl.textContent = 'Ready';
  }

  /**
   * Renders a folder view showing the .md files inside.
   */
  function renderFolderView(folderName: string): void {
    const fileList = getFilesInFolder(folderName);

    switch (currentView) {
      case 'SMALL_ICONS':
        contentEl.appendChild(buildFilesSmallIcons(fileList));
        break;
      case 'LIST':
        contentEl.appendChild(buildFilesList(fileList));
        break;
      case 'LARGE_ICONS':
      default:
        contentEl.appendChild(buildFilesLargeIcons(fileList));
        break;
    }

    statusLeftEl.textContent = `${fileList.length} object(s)`;
    statusMiddleEl.textContent = '';
    statusRightEl.textContent = 'Ready';
  }

  function renderCurrentFolder(): void {
    // Clear content
    while (contentEl.firstChild) {
      contentEl.removeChild(contentEl.firstChild);
    }

    updateNavButtons();

    const folder = currentFolder();
    if (folder === null) {
      addrInput.value = 'My Computer';
      renderRootView();
    } else {
      addrInput.value = `My Computer \\ ${folder}`;
      renderFolderView(folder);
    }
  }

  // ── Root: large folder icons ──
  function buildFoldersLargeIcons(folders: FolderItem[]): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 12px;
      align-content: flex-start;
    `;

    folders.forEach((f) => {
      const iconDiv = document.createElement('div');
      iconDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
        padding: 4px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 2px;
      `;

      iconDiv.addEventListener('mouseenter', () => {
        iconDiv.style.background = '#c0e0ff';
        iconDiv.style.borderColor = '#000080';
      });
      iconDiv.addEventListener('mouseleave', () => {
        iconDiv.style.background = '';
        iconDiv.style.borderColor = 'transparent';
      });
      iconDiv.addEventListener('mousedown', () => {
        iconDiv.style.background = '#000080';
      });
      iconDiv.addEventListener('mouseup', () => {
        iconDiv.style.background = '#c0e0ff';
      });
      iconDiv.addEventListener('click', () => {
        navigateTo(f.name);
      });

      const svgContainer = document.createElement('div');
      svgContainer.style.cssText = `
        width: 48px;
        height: 48px;
        margin-bottom: 2px;
        pointer-events: none;
      `;
      svgContainer.innerHTML = getFolderIcon(48);
      iconDiv.appendChild(svgContainer);

      const label = document.createElement('span');
      label.style.cssText = `
        font-size: 11px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        text-align: center;
        word-wrap: break-word;
        max-width: 76px;
        pointer-events: none;
        line-height: 1.2;
      `;
      label.textContent = f.name;

      const labelSmall = document.createElement('span');
      labelSmall.style.cssText = `
        font-size: 10px;
        color: #666;
        text-align: center;
        pointer-events: none;
        line-height: 1.2;
      `;

      if (f.name === 'content') {
        labelSmall.textContent = 'Content files';
      } else if (f.name === 'internet') {
        labelSmall.textContent = 'Internet resources';
      } else if (f.name === 'system') {
        labelSmall.textContent = 'System files';
      } else if (f.name === 'web') {
        labelSmall.textContent = 'Web projects';
      } else if (f.name === 'youtube') {
        labelSmall.textContent = 'YouTube tutorials';
      }

      iconDiv.appendChild(label);
      if (labelSmall.textContent) {
        iconDiv.appendChild(labelSmall);
      }

      grid.appendChild(iconDiv);
    });

    return grid;
  }

  // ── Root: small folder icons ──
  function buildFoldersSmallIcons(folders: FolderItem[]): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 4px;
      align-content: flex-start;
    `;

    folders.forEach((f) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 3px;
        width: 180px;
        padding: 2px 4px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 2px;
      `;

      item.addEventListener('mouseenter', () => {
        item.style.background = '#c0e0ff';
        item.style.borderColor = '#000080';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
        item.style.borderColor = 'transparent';
      });
      item.addEventListener('dblclick', () => {
        navigateTo(f.name);
      });

      const icon = document.createElement('span');
      icon.style.cssText = `
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        pointer-events: none;
      `;
      icon.innerHTML = getFolderIcon(16);

      const label = document.createElement('span');
      label.style.cssText = `
        font-size: 11px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      `;
      label.textContent = f.name;

      item.appendChild(icon);
      item.appendChild(label);
      grid.appendChild(item);
    });

    return grid;
  }

  // ── Root: list view ──
  function buildFoldersList(folders: FolderItem[]): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      table-layout: fixed;
    `;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText = 'position: sticky; top: 0; z-index: 1;';

    const headers = [
      { label: 'Name', width: '40%' },
      { label: 'Type', width: '30%' },
      { label: 'Total Files', width: '30%' },
    ];

    headers.forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h.label;
      th.style.cssText = `
        text-align: left;
        background: #c0c0c0;
        padding: 3px 6px;
        font-weight: normal;
        font-size: 11px;
        border-bottom: 1px solid #808080;
        width: ${h.width};
      `;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    folders.forEach((f) => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';

      row.addEventListener('mouseenter', () => { row.style.background = '#c0e0ff'; });
      row.addEventListener('mouseleave', () => { row.style.background = ''; });
      row.addEventListener('dblclick', () => { navigateTo(f.name); });

      const filesInFolder = getFilesInFolder(f.name);

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 6px; font-size: 11px; display: flex; align-items: center; gap: 4px; border: none;';
      const nameIcon = document.createElement('span');
      nameIcon.style.cssText = 'width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; pointer-events: none;';
      nameIcon.innerHTML = getFolderIcon(16);
      nameCell.appendChild(nameIcon);
      const nameText = document.createElement('span');
      nameText.textContent = f.name;
      nameCell.appendChild(nameText);

      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      typeCell.textContent = 'File Folder';

      const countCell = document.createElement('td');
      countCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      countCell.textContent = `${filesInFolder.length}`;

      row.appendChild(nameCell);
      row.appendChild(typeCell);
      row.appendChild(countCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  // ── Files: large icons ──
  function buildFilesLargeIcons(fileList: FileItem[]): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px;
      align-content: flex-start;
    `;

    fileList.forEach((file) => {
      const iconDiv = document.createElement('div');
      iconDiv.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 72px;
        padding: 4px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 2px;
      `;
      iconDiv.title = `${file.name} — ${file.date}`;

      iconDiv.addEventListener('mouseenter', () => {
        iconDiv.style.background = '#c0e0ff';
        iconDiv.style.borderColor = '#000080';
      });
      iconDiv.addEventListener('mouseleave', () => {
        iconDiv.style.background = '';
        iconDiv.style.borderColor = 'transparent';
      });
      iconDiv.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      const svgContainer = document.createElement('div');
      svgContainer.style.cssText = `
        width: 32px;
        height: 32px;
        margin-bottom: 2px;
        pointer-events: none;
      `;
      svgContainer.innerHTML = getFileIcon(32);
      iconDiv.appendChild(svgContainer);

      const label = document.createElement('span');
      label.style.cssText = `
        font-size: 11px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        text-align: center;
        word-wrap: break-word;
        max-width: 68px;
        pointer-events: none;
        line-height: 1.2;
      `;
      label.textContent = file.name.replace('.md', '');
      iconDiv.appendChild(label);

      grid.appendChild(iconDiv);
    });

    return grid;
  }

  // ── Files: small icons ──
  function buildFilesSmallIcons(fileList: FileItem[]): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 4px;
      align-content: flex-start;
    `;

    fileList.forEach((file) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 3px;
        width: 160px;
        padding: 2px 4px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 2px;
      `;
      item.title = `${file.name} — ${file.date}`;

      item.addEventListener('mouseenter', () => {
        item.style.background = '#c0e0ff';
        item.style.borderColor = '#000080';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
        item.style.borderColor = 'transparent';
      });
      item.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      const icon = document.createElement('span');
      icon.style.cssText = `
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        pointer-events: none;
      `;
      icon.innerHTML = getFileIcon(16);

      const label = document.createElement('span');
      label.style.cssText = `
        font-size: 11px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      `;
      label.textContent = file.name.replace('.md', '');

      item.appendChild(icon);
      item.appendChild(label);
      grid.appendChild(item);
    });

    return grid;
  }

  // ── Files: list view ──
  function buildFilesList(fileList: FileItem[]): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      table-layout: fixed;
    `;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText = 'position: sticky; top: 0; z-index: 1;';

    const headers = [
      { label: 'Name', width: '40%' },
      { label: 'Date', width: '25%' },
      { label: 'Type', width: '35%' },
    ];

    headers.forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h.label;
      th.style.cssText = `
        text-align: left;
        background: #c0c0c0;
        padding: 3px 6px;
        font-weight: normal;
        font-size: 11px;
        border-bottom: 1px solid #808080;
        width: ${h.width};
      `;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    fileList.forEach((file) => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';

      row.addEventListener('mouseenter', () => { row.style.background = '#c0e0ff'; });
      row.addEventListener('mouseleave', () => { row.style.background = ''; });
      row.addEventListener('click', () => { openFileViewer(file.name, file.folder, file.date); });

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 6px; font-size: 11px; display: flex; align-items: center; gap: 4px; border: none;';
      const nameIcon = document.createElement('span');
      nameIcon.style.cssText = 'width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; pointer-events: none;';
      nameIcon.innerHTML = getFileIcon(16);
      nameCell.appendChild(nameIcon);
      const nameText = document.createElement('span');
      nameText.textContent = file.name.replace('.md', '');
      nameCell.appendChild(nameText);

      const dateCell = document.createElement('td');
      dateCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      dateCell.textContent = file.date;

      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      typeCell.textContent = 'Markdown Document';

      row.appendChild(nameCell);
      row.appendChild(dateCell);
      row.appendChild(typeCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  // ══════════════════════════════════════════════════════════════════
  // INITIAL RENDER
  // ══════════════════════════════════════════════════════════════════
  renderCurrentFolder();
}
