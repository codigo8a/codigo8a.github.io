import React from 'react';
import {
  extractDate,
  extractContentWithoutDate,
  extractRawContent,
} from '../../utils/fileUtils';
import { registerOsWindow } from '../../utils/osWindowRegistry';

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

type ViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST' | 'DETAILS';
type SortMode = 'name' | 'date' | 'type' | 'size';

interface FileItem {
  name: string;
  folder: string;
  date: string;
}

/**
 * Returns a flat list of all files, sorted by the given criterion.
 */
function getAllFilesFlat(sortBy: SortMode = 'date'): FileItem[] {
  const result: FileItem[] = [];
  Object.entries(files).forEach(([path, content]) => {
    const parts = path.replace('../../data/files/', '').split('/');
    result.push({
      name: parts[1],
      folder: parts[0],
      date: extractDate(content),
    });
  });
  result.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date': {
        const da = new Date(a.date.split('/').reverse().join('-')).getTime();
        const db = new Date(b.date.split('/').reverse().join('-')).getTime();
        return db - da;
      }
      case 'type': {
        const extA = a.name.split('.').pop() || '';
        const extB = b.name.split('.').pop() || '';
        const cmp = extA.localeCompare(extB);
        if (cmp !== 0) return cmp;
        return a.name.localeCompare(b.name);
      }
      default:
        return 0;
    }
  });
  return result;
}

/**
 * Counts folders and total files across all folders.
 */
function getStats(): { folderCount: number; fileCount: number } {
  let fileCount = 0;
  Object.entries(files).forEach(([path]) => {
    // Each entry is a file
    fileCount++;
  });
  // Count unique folders
  const folderSet = new Set<string>();
  Object.keys(files).forEach((path) => {
    const folder = path.replace('../../data/files/', '').split('/')[0];
    folderSet.add(folder);
  });
  return { folderCount: folderSet.size, fileCount };
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

/**
 * Returns an inline SVG string for a folder or file icon (32×32).
 */
function getFileIcon(isFolder: boolean): string {
  if (isFolder) {
    return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="28" height="24" rx="1" fill="#FFD700" stroke="#8B6914" stroke-width="1"/>
      <polygon points="2,14 2,6 12,6 15,10 30,10 30,14" fill="#FFD700" stroke="#8B6914" stroke-width="1"/>
      <rect x="4" y="16" width="8" height="2" rx="1" fill="#B8860B"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
    <rect x="4" y="2" width="24" height="6" rx="2" fill="#C0C0C0" stroke="#808080" stroke-width="1"/>
    <line x1="8" y1="12" x2="24" y2="12" stroke="#000" stroke-width="1"/>
    <line x1="8" y1="16" x2="22" y2="16" stroke="#000" stroke-width="1"/>
    <line x1="8" y1="20" x2="20" y2="20" stroke="#000" stroke-width="1"/>
  </svg>`;
}

/**
 * Returns the display type label for a file based on its extension.
 */
function getFileTypeLabel(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'md':
      return 'Markdown Document';
    case 'txt':
      return 'Text Document';
    case 'pdf':
      return 'PDF Document';
    default:
      return `${ext.toUpperCase()} File`;
  }
}

// ─── Action helper ────────────────────────────────────────────────────────────

/**
 * Dispatches a custom event to open a file in FileViewer
 * (matching the convention used by other os-gui apps).
 */
function openFileViewer(name: string, folder: string, date: string): void {
  const contentPath = `../../data/files/${folder}/${name}`;
  const content = files[contentPath];
  const rawContent = content ? extractRawContent(content) : '';
  const processedContent = content ? extractContentWithoutDate(content) : '';

  window.dispatchEvent(
    new CustomEvent('desktop-open-app', {
      detail: {
        appId: 'fileViewer',
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

// ─── os-gui DOM helpers (mirrors Prueba pattern) ──────────────────────────────

/**
 * Sprite indices for standard toolbar buttons, matching 98.js
 * browse-ui-icons sprite sheet. Each icon is 20×20 px.
 */
const SPRITE_BACK = 0;
const SPRITE_FORWARD = 1;
const SPRITE_UP = 44;
const SPRITE_CUT = 21;
const SPRITE_COPY = 22;
const SPRITE_PASTE = 23;

const SPRITE_VIEWS = 38;

/**
 * Shared SVG for dropdown arrow (▶ rotated 90° — identical to 98.js).
 */
const DROPDOWN_ARROW_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="fill:currentColor;display:inline-block;vertical-align:middle"><path style="transform:rotate(90deg);transform-origin:center" d="m5 6 4 4-4 4z"></path></svg>`;



/**
 * Creates a sprite-based icon div (20×20 px with the correct sprite position).
 */
function createSpriteIcon(spriteIndex: number): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'icon';
  div.style.backgroundPosition = `-${spriteIndex * 20}px 0px`;
  return div;
}

/**
 * Creates a toolbar button element with the authentic 98.js sprite icon.
 */
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

/**
 * Creates a compound toolbar button (main + dropdown), matching 98.js.
 */
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

/**
 * Creates a vertical toolbar separator.
 */
function createSeparator(): HTMLHRElement {
  const hr = document.createElement('hr');
  hr.setAttribute('aria-orientation', 'vertical');
  return hr;
}

/**
 * Adds the disabled-inset SVG filter to the document body.
 */
function ensureDisabledFilter(): void {
  if (document.getElementById('prueba-disabled-filter')) return;
  const svg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );
  svg.id = 'prueba-disabled-filter';
  svg.setAttribute(
    'style',
    'position: absolute; pointer-events: none; bottom: 100%;',
  );
  svg.innerHTML = `
    <defs>
      <filter id="disabled-inset-filter" x="0" y="0" width="1px" height="1px">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 4 0"
          result="dark-parts-isolated"
        />
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
    </defs>
  `;
  document.body.appendChild(svg);
}

// ─── React placeholder ────────────────────────────────────────────────────────

/**
 * Placeholder React component — FileExplorerApp uses os-gui natively.
 * This component is never rendered via the React window system;
 * the launchFileExplorer() function is called instead.
 */
export const FileExplorerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ─── os-gui launch function ───────────────────────────────────────────────────

/**
 * Launches the File Explorer ("My Documents") as a native os-gui window
 * with MenuBar, toolbar, address bar, three view modes, and status bar.
 */
export function launchFileExplorer(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error(
      'os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.',
    );
    return;
  }

  // ── Ensure disabled-inset SVG filter ──
  ensureDisabledFilter();

  // ── Mutable state ──
  let currentView: ViewMode = 'LARGE_ICONS';
  let currentSort: SortMode = 'date';
  let statusBarVisible = true;
  let stdToolbarVisible = true;
  let addrBarVisible = true;

  /**
   * Cycles through view modes: LARGE_ICONS → SMALL_ICONS → LIST → LARGE_ICONS.
   * DETAILS is excluded from the cycle, matching 98.js behavior.
   */
  function cycleViewMode(): void {
    const cycle: ViewMode[] = ['LARGE_ICONS', 'SMALL_ICONS', 'LIST'];
    const idx = cycle.indexOf(currentView);
    if (idx === -1) {
      currentView = 'LARGE_ICONS';
    } else {
      currentView = cycle[(idx + 1) % cycle.length];
    }
    refreshContent();
  }

  /**
   * Opens the Views dropdown menu using a temporary MenuBar
   * appended off-screen, then programmatically dispatching pointerdown.
   */
  function openViewsDropdown(event: Event): void {
    // Position the dummy MenuBar at the Views button location so the
    // dropdown opens at the correct position (matching 98.js approach).
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
          action: () => {
            currentView = 'LARGE_ICONS';
            refreshContent();
            cleanup();
          },
        },
        {
          label: "S&mall Icons",
          type: 'radio',
          checked: currentView === 'SMALL_ICONS',
          action: () => {
            currentView = 'SMALL_ICONS';
            refreshContent();
            cleanup();
          },
        },
        {
          label: "&List",
          type: 'radio',
          checked: currentView === 'LIST',
          action: () => {
            currentView = 'LIST';
            refreshContent();
            cleanup();
          },
        },
        {
          label: "&Details",
          type: 'radio',
          checked: currentView === 'DETAILS',
          enabled: false,
          action: () => {
            currentView = 'DETAILS';
            refreshContent();
            cleanup();
          },
        },
      ],
    });

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

    const menuButton = dummyEl.querySelector('.menu-button') as HTMLElement;
    if (menuButton) {
      menuButton.dispatchEvent(new PointerEvent('pointerdown'));
      // Clean up when the dropdown closes
      menuButton.addEventListener('release', () => {
        if (document.body.contains(dummyEl)) {
          document.body.removeChild(dummyEl);
        }
      });
    }

    function cleanup(): void {
      if (document.body.contains(dummyEl)) {
        document.body.removeChild(dummyEl);
      }
    }
  }

  // DOM element references (assigned after creation)
  let contentEl: HTMLElement;
  let statusBarEl: HTMLElement;
  let statusLeftEl: HTMLElement;
  let statusMiddleEl: HTMLElement;
  let statusRightEl: HTMLElement;
  let stdToolbarEl: HTMLElement;
  let addrToolbarEl: HTMLElement;

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'My Documents',
    icons: {
      16: '/app/icons/my-documents-16x16.png',
      32: '/app/icons/my-documents-folder-32x32.png',
    },
    minWidth: 600,
    minHeight: 400,
  });

  $win.css({
    width: '780px',
    height: '540px',
  });
  $win.center();
  registerOsWindow($win, 'fileExplorer', 'My Documents', '/app/icons/my-documents-folder-32x32.png');

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

  // ── Menu bar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  /**
   * Prevents TypeScript from narrowing the `let` variable
   * when used inside the MenuBar object literal.
   */
  function isSortActive(mode: SortMode): boolean {
    return currentSort === mode;
  }

  /**
   * Helper: re-render the content area after state changes.
   */
  function refreshContent(): void {
    // Clear content
    while (contentEl.firstChild) {
      contentEl.removeChild(contentEl.firstChild);
    }

    const currentFiles = getAllFilesFlat(currentSort);
    const stats = getStats();

    switch (currentView) {
      case 'DETAILS':
        contentEl.appendChild(buildDetailsView(currentFiles));
        break;
      case 'SMALL_ICONS':
        contentEl.appendChild(buildSmallIconsView(currentFiles));
        break;
      case 'LIST':
        contentEl.appendChild(buildListView(currentFiles));
        break;
      case 'LARGE_ICONS':
      default:
        contentEl.appendChild(buildLargeIconsView(currentFiles));
        break;
    }

    updateStatusBar(stats.fileCount, stats.folderCount);
  }

  /**
   * Updates the status bar text.
   */
  function updateStatusBar(
    fileCount: number,
    folderCount: number,
  ): void {
    statusLeftEl.textContent = `${folderCount} folder(s)`;
    statusMiddleEl.textContent = `${fileCount} object(s)`;
    statusRightEl.textContent = 'Ready';
  }

  // Build menus
  const menu = new MenuBar({
    '&File': [
      {
        label: '&New',
        submenu: [
          { label: '&Folder', enabled: false },
          { label: '&Shortcut', enabled: false },
        ],
      },
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
      {
        label: 'Select &All',
        shortcutLabel: 'Ctrl+A',
        action: () => {
          /* no-op for read-only browser */
        },
      },
      {
        label: '&Invert Selection',
        action: () => {
          /* no-op for read-only browser */
        },
      },
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
              stdToolbarEl.style.display = stdToolbarVisible ? '' : 'none';
              // Update menu checked state
              const items = (menu as any).menuItems;
              if (items) {
                // Items is a nested structure
              }
            },
          },
          {
            label: '&Address Bar',
            checked: true,
            action: () => {
              addrBarVisible = !addrBarVisible;
              addrToolbarEl.style.display = addrBarVisible ? '' : 'none';
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
          {
            label: 'by &Name',
            type: 'radio',
            checked: isSortActive('name'),
            action: () => {
              currentSort = 'name';
              refreshContent();
            },
          },
          {
            label: 'by &Type',
            type: 'radio',
            checked: isSortActive('type'),
            action: () => {
              currentSort = 'type';
              refreshContent();
            },
          },
          {
            label: 'by &Size',
            type: 'radio',
            checked: isSortActive('size'),
            action: () => {
              currentSort = 'size';
              refreshContent();
            },
          },
          {
            label: 'by &Date',
            type: 'radio',
            checked: isSortActive('date'),
            action: () => {
              currentSort = 'date';
              refreshContent();
            },
          },
        ],
      },
      { separator: true },
      {
        label: '&Refresh',
        shortcutLabel: 'F5',
        action: () => refreshContent(),
      },
    ],
    '&Help': [
      {
        label: '&About My Documents',
        action: () => {
          alert(
            'My Documents\n\n' +
              'Browse, search, and view markdown files organized by folder.\n\n' +
              'Four view modes: Large Icons, Small Icons, List, Details.\n\n' +
              'Version 1.0',
          );
        },
      },
    ],
  });

  menuToolbar.appendChild(menu.element);
  toolbars.appendChild(menuToolbar);

  // ── Standard Buttons toolbar ──
  stdToolbarEl = document.createElement('div');
  stdToolbarEl.className = 'toolbar';
  stdToolbarEl.id = 'standard-buttons-toolbar';

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';

  // Back (compound, disabled)
  stdButtons.appendChild(
    createCompoundButton(
      'Back',
      SPRITE_BACK,
      () => {},
      () => {},
      true,
    ),
  );

  // Forward (compound, disabled)
  stdButtons.appendChild(
    createCompoundButton(
      'Forward',
      SPRITE_FORWARD,
      () => {},
      () => {},
      true,
    ),
  );

  // Up
  stdButtons.appendChild(createToolbarButton('Up', SPRITE_UP, true));

  stdButtons.appendChild(createSeparator());

  // Cut
  stdButtons.appendChild(createToolbarButton('Cut', SPRITE_CUT, true));

  // Copy
  stdButtons.appendChild(
    createToolbarButton('Copy', SPRITE_COPY, true),
  );

  // Paste
  stdButtons.appendChild(
    createToolbarButton('Paste', SPRITE_PASTE, true),
  );

  stdButtons.appendChild(createSeparator());

  stdButtons.appendChild(
    createCompoundButton(
      'Views',
      SPRITE_VIEWS,
      cycleViewMode,
      openViewsDropdown,
    ),
  );

  stdToolbarEl.appendChild(stdButtons);
  toolbars.appendChild(stdToolbarEl);

  // ── Address bar toolbar ──
  addrToolbarEl = document.createElement('div');
  addrToolbarEl.className = 'toolbar';
  addrToolbarEl.id = 'address-bar-toolbar';

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
  addrIcon.src = '/app/icons/my-documents-16x16.png';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  const addrInput = document.createElement('input');
  addrInput.type = 'text';
  addrInput.id = 'address';
  addrInput.value = 'My Documents';
  addrInput.autocomplete = 'off';
  compoundInput.appendChild(addrInput);

  const addrDropdown = document.createElement('button');
  addrDropdown.id = 'address-dropdown-button';
  addrDropdown.className = 'lightweight';
  addrDropdown.disabled = true;
  addrDropdown.innerHTML = DROPDOWN_ARROW_SVG;
  compoundInput.appendChild(addrDropdown);

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
   * Builds the large icons view — grid of 32×32 file icons sorted flat.
   */
  function buildLargeIconsView(fileList: FileItem[]): HTMLElement {
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
      iconDiv.title = `${file.folder}/${file.name} — ${file.date}`;

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
        openFileViewer(file.name, file.folder, file.date);
      });

      // SVG icon
      const svgContainer = document.createElement('div');
      svgContainer.style.cssText = `
        width: 32px;
        height: 32px;
        margin-bottom: 2px;
        pointer-events: none;
      `;
      svgContainer.innerHTML = getFileIcon(false);
      iconDiv.appendChild(svgContainer);

      // Label
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

  /**
   * Builds the details view — table with Name, Location, Type columns.
   */
  function buildDetailsView(fileList: FileItem[]): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      table-layout: fixed;
    `;

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText =
      'position: sticky; top: 0; z-index: 1;';

    const headers = [
      { label: 'Name', width: '40%' },
      { label: 'Location', width: '30%' },
      { label: 'Type', width: '30%' },
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

    // Body
    const tbody = document.createElement('tbody');
    fileList.forEach((file) => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';

      row.addEventListener('mouseenter', () => {
        row.style.background = '#c0e0ff';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      row.addEventListener('mousedown', () => {
        row.style.background = '#000080';
        row.style.color = '#fff';
      });
      row.addEventListener('mouseup', () => {
        row.style.background = '#c0e0ff';
        row.style.color = '';
      });

      row.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      // Name
      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      nameCell.textContent = file.name.replace('.md', '');
      row.appendChild(nameCell);

      // Location (folder)
      const locCell = document.createElement('td');
      locCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      locCell.textContent = file.folder;
      row.appendChild(locCell);

      // Type
      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      typeCell.textContent = getFileTypeLabel(file.name);
      row.appendChild(typeCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  /**
   * Builds the small icons view — grid of 16×16 file icons with label to the right.
   */
  function buildSmallIconsView(fileList: FileItem[]): HTMLElement {
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
      item.title = `${file.folder}/${file.name} — ${file.date}`;

      item.addEventListener('mouseenter', () => {
        item.style.background = '#c0e0ff';
        item.style.borderColor = '#000080';
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
        item.style.borderColor = 'transparent';
      });
      item.addEventListener('mousedown', () => {
        item.style.background = '#000080';
      });
      item.addEventListener('mouseup', () => {
        item.style.background = '#c0e0ff';
      });

      item.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      // 16×16 icon
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
      icon.innerHTML = getFileIcon(false).replace(
        'width="32" height="32"',
        'width="16" height="16"',
      );

      // Label
      const label = document.createElement('span');
      label.style.cssText = `
        font-size: 11px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        line-height: 1.2;
      `;
      label.textContent = file.name.replace('.md', '');

      item.appendChild(icon);
      item.appendChild(label);
      grid.appendChild(item);
    });

    return grid;
  }

  /**
   * Builds the list view — vertical single-column list of files.
   */
  function buildListView(fileList: FileItem[]): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      table-layout: fixed;
    `;

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText = 'position: sticky; top: 0; z-index: 1;';

    const headers = [
      { label: 'Name', width: '30%' },
      { label: 'Date', width: '20%' },
      { label: 'Location', width: '25%' },
      { label: 'Type', width: '25%' },
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

    // Body
    const tbody = document.createElement('tbody');
    fileList.forEach((file) => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';

      row.addEventListener('mouseenter', () => {
        row.style.background = '#c0e0ff';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });
      row.addEventListener('mousedown', () => {
        row.style.background = '#000080';
        row.style.color = '#fff';
      });
      row.addEventListener('mouseup', () => {
        row.style.background = '#c0e0ff';
        row.style.color = '';
      });

      row.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      // Name (with icon)
      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 6px; font-size: 11px; display: flex; align-items: center; gap: 4px; border: none;';
      const nameIcon = document.createElement('span');
      nameIcon.style.cssText = `
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        pointer-events: none;
      `;
      nameIcon.innerHTML = getFileIcon(false).replace(
        'width="32" height="32"',
        'width="16" height="16"',
      );
      nameCell.appendChild(nameIcon);
      const nameText = document.createElement('span');
      nameText.textContent = file.name.replace('.md', '');
      nameCell.appendChild(nameText);

      // Date
      const dateCell = document.createElement('td');
      dateCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      dateCell.textContent = file.date;

      // Location (folder)
      const locCell = document.createElement('td');
      locCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      locCell.textContent = file.folder;

      // Type
      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      typeCell.textContent = getFileTypeLabel(file.name);

      row.appendChild(nameCell);
      row.appendChild(dateCell);
      row.appendChild(locCell);
      row.appendChild(typeCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }



  // ══════════════════════════════════════════════════════════════════
  // INITIAL RENDER
  // ══════════════════════════════════════════════════════════════════
  refreshContent();
}
