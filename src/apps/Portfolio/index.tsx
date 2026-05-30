import React from 'react';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';
import {
  extractDate,
  extractContentWithoutDate,
  extractRawContent,
} from '../../utils/fileUtils';

// Eagerly load all markdown files (relative to src/apps/Portfolio/)
const allFiles: Record<string, string> = import.meta.glob('../../data/files/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

interface PortfolioFile {
  name: string;
  folder: string;
  content: string;
  rawContent: string;
  date: string;
}

/** Files filtered to only web/ system folders */
const portfolioFiles: PortfolioFile[] = (() => {
  const result: PortfolioFile[] = [];
  Object.entries(allFiles).forEach(([path, raw]) => {
    const parts = path.replace('../../data/files/', '').split('/');
    const folder = parts[0];
    if (folder === 'web' || folder === 'system') {
      result.push({
        folder,
        name: parts[1],
        content: extractContentWithoutDate(raw),
        rawContent: extractRawContent(raw),
        date: extractDate(raw),
      });
    }
  });
  return result;
})();

const FOLDER_DESCRIPTIONS: Record<string, string> = {
  web: 'Páginas web y plantillas profesionales',
  system: 'Sistematización de procesos empresariales',
};

/**
 * Placeholder React component - the Portfolio app uses os-gui natively.
 * This component is never rendered via the React window system.
 */
export const PortfolioApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

/**
 * Sprite indices for standard toolbar buttons, matching the 98.js
 * browse-ui-icons sprite sheet exactly. Each icon is 20×20 px.
 *
 * Order from explorer.js:
 *   0=Back, 1=Forward, 44=Up, 21=Cut, 22=Copy, 23=Paste,
 *   24=Undo, 26=Delete, 31=Properties, 38=Views
 */
const SPRITE_BACK = 0;
const SPRITE_FORWARD = 1;
const SPRITE_UP = 44;
const SPRITE_CUT = 21;
const SPRITE_COPY = 22;
const SPRITE_PASTE = 23;
const SPRITE_UNDO = 24;
const SPRITE_DELETE = 26;
const SPRITE_PROPERTIES = 31;
const SPRITE_VIEWS = 38;
const SPRITE_SHARE = 29;

/**
 * Shared SVG for dropdown arrow (▶ rotated 90° – identical to 98.js)
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
 * Creates a compound toolbar button (main + dropdown), matching 98.js exactly.
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
 * Creates a vertical toolbar separator ─ identical to 98.js.
 */
function createSeparator(): HTMLHRElement {
  const hr = document.createElement('hr');
  hr.setAttribute('aria-orientation', 'vertical');
  return hr;
}

/**
 * Adds the disabled-inset SVG filter to the document body.
 * This is the exact same filter 98.js uses to give disabled
 * toolbar icons that authentic Win98 "sunken" look.
 */
function ensureDisabledFilter(): void {
  if (document.getElementById('portfolio-disabled-filter')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'portfolio-disabled-filter';
  svg.setAttribute('style', 'position: absolute; pointer-events: none; bottom: 100%;');
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

/**
 * Folder descriptors for the portfolio root view.
 */
const PORTFOLIO_FOLDERS = ['web', 'system'];

/**
 * Returns an icon HTML string for a file type.
 */
function getFileIcon(size: 16 | 32): string {
  const s = size;
  return `<img src="/images/icons/notepad-file-${s}x${s}.png" width="${s}" height="${s}" alt="" style="pointer-events:none;image-rendering:pixelated">`;
}

/**
 * Dispatches a custom event to open a file in the Markdown viewer.
 */
function openFileViewer(name: string, folder: string, date: string): void {
  const contentPath = `../../data/files/${folder}/${name}`;
  const content = allFiles[contentPath] as string | undefined;
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

/**
 * Custom launch function that creates a faithful replica
 * of the 98.js Explorer "Portfolio" window using os-gui.
 */
export function launchPortfolio(appData?: { folder?: string }): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // ── Ensure the disabled-inset SVG filter is present ──
  ensureDisabledFilter();

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'Portfolio',
    icons: {
      16: '/images/icons/paint-32x32.png',
      any: '/images/icons/paint-32x32.png',
    },
    minWidth: 500,
    minHeight: 400,
  });

  $win.css({
    width: '700px',
    height: '480px',
  });
  $win.center();
  registerOsWindow($win, 'portfolio', 'Portfolio', '/images/icons/paint-32x32.png');

  // ── Build Explorer layout ──
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer';

  // ══════ Toolbars ══════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu bar toolbar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';
  menuToolbar.id = 'menu-bar-toolbar';

  // Build menus matching Windows 98 Explorer
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
      { label: 'Create &Shortcut', enabled: false },
      { label: '&Delete', action: () => showMessageBox({ title: 'Portfolio', message: 'Delete', icon: 'info' }) },
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
      { label: 'Select &All', shortcutLabel: 'Ctrl+A', action: () => showMessageBox({ title: 'Portfolio', message: 'Select All', icon: 'info' }) },
      { label: '&Invert Selection', action: () => showMessageBox({ title: 'Portfolio', message: 'Invert Selection', icon: 'info' }) },
    ],
    '&View': [
      {
        label: '&Toolbars',
        submenu: [
          { label: '&Standard Buttons', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Toggle Standard Buttons', icon: 'info' }) },
          { label: '&Address Bar', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Toggle Address Bar', icon: 'info' }) },
          { label: '&Text Labels', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Toggle Text Labels', icon: 'info' }) },
        ],
      },
      { label: 'Status &Bar', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Toggle Status Bar', icon: 'info' }) },
      { separator: true },
      { label: 'as &Web Page', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Toggle Web View', icon: 'info' }) },
      { separator: true },
      {
        label: 'Arrange &Icons',
        submenu: [
          { label: 'by &Name', type: 'radio', checked: true, action: () => showMessageBox({ title: 'Portfolio', message: 'Sort by Name', icon: 'info' }) },
          { label: 'by &Type', type: 'radio', action: () => showMessageBox({ title: 'Portfolio', message: 'Sort by Type', icon: 'info' }) },
          { label: 'by &Size', type: 'radio', action: () => showMessageBox({ title: 'Portfolio', message: 'Sort by Size', icon: 'info' }) },
          { label: 'by &Date', type: 'radio', action: () => showMessageBox({ title: 'Portfolio', message: 'Sort by Date', icon: 'info' }) },
        ],
      },
      { separator: true },
      { label: '&Refresh', shortcutLabel: 'F5', action: () => showMessageBox({ title: 'Portfolio', message: 'Refresh', icon: 'info' }) },
    ],
    '&Go': [
      { label: '&Back', shortcutLabel: 'Alt+Left Arrow', enabled: false },
      { label: '&Forward', shortcutLabel: 'Alt+Right Arrow', enabled: false },
      { label: '&Up One Level', enabled: false },
      { separator: true },
      { label: 'My &Computer', action: () => showMessageBox({ title: 'Portfolio', message: 'My Computer', icon: 'info' }) },
    ],
    'F&avorites': [
      { label: '&Add to Favorites...', enabled: false },
      { label: '&Organize Favorites...', enabled: false },
      { separator: true },
      { label: '(Empty)', enabled: false },
    ],
    '&Tools': [
      { label: 'Map &Network Drive...', enabled: false },
      { label: '&Disconnect Network Drive...', enabled: false },
    ],
    '&Help': [
      { label: '&About', action: () => window.open('https://github.com/1j01/98#readme') },
    ],
  });

  menuToolbar.appendChild(menu.element);
  toolbars.appendChild(menuToolbar);

  // ── Standard Buttons toolbar ──
  const stdToolbar = document.createElement('div');
  stdToolbar.className = 'toolbar';
  stdToolbar.id = 'standard-buttons-toolbar';

  const stdDragHandle = document.createElement('div');
  stdDragHandle.className = 'toolbar-drag-handle';
  stdToolbar.appendChild(stdDragHandle);

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';

  // Back (compound) — sprite 0, wired below
  const backBtnWrapper = createCompoundButton('Back', SPRITE_BACK, () => {}, () => showMessageBox({ title: 'Portfolio', message: 'Back history', icon: 'info' }), true);
  const backMainBtn = backBtnWrapper.querySelector('.toolbar-button') as HTMLButtonElement;
  stdButtons.appendChild(backBtnWrapper);

  // Forward (compound) — sprite 1, disabled
  stdButtons.appendChild(
    createCompoundButton('Forward', SPRITE_FORWARD, () => showMessageBox({ title: 'Portfolio', message: 'Forward', icon: 'info' }), () => showMessageBox({ title: 'Portfolio', message: 'Forward history', icon: 'info' }), true),
  );

  // Up — sprite 44, wired below
  const upBtn = createToolbarButton('Up', SPRITE_UP);
  stdButtons.appendChild(upBtn);

  stdButtons.appendChild(createSeparator());

  // Views (compound) — sprite 38, with dropdown
  type ViewMode = 'LARGE_ICONS' | 'SMALL_ICONS' | 'LIST' | 'DETAILS';
  let currentView: ViewMode = 'LARGE_ICONS';
  let currentFolder: string | null = null;

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
    renderContent();
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
          label: 'Lar&ge Icons',
          type: 'radio',
          checked: currentView === 'LARGE_ICONS',
          action: () => {
            currentView = 'LARGE_ICONS';
            renderContent();
            cleanup();
          },
        },
        {
          label: 'S&mall Icons',
          type: 'radio',
          checked: currentView === 'SMALL_ICONS',
          action: () => {
            currentView = 'SMALL_ICONS';
            renderContent();
            cleanup();
          },
        },
        {
          label: '&List',
          type: 'radio',
          checked: currentView === 'LIST',
          action: () => {
            currentView = 'LIST';
            renderContent();
            cleanup();
          },
        },
        {
          label: '&Details',
          type: 'radio',
          checked: currentView === 'DETAILS',
          enabled: false,
          action: () => {
            currentView = 'DETAILS';
            renderContent();
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

  stdButtons.appendChild(
    createCompoundButton('Views', SPRITE_VIEWS, cycleViewMode, openViewsDropdown),
  );

  stdButtons.appendChild(createSeparator());

  // Share — sprite 29, copies portfolio URL (includes folder path if inside a folder)
  const shareBtn = createToolbarButton('Compartir', SPRITE_SHARE);
  shareBtn.addEventListener('click', () => {
    const baseUrl = 'https://juandavid.site/portfolio';
    const url = currentFolder ? `${baseUrl}/${currentFolder}` : baseUrl;
    navigator.clipboard.writeText(url).catch(() => {});
    showMessageBox({
      title: 'Compartir',
      message: `URL copiada al portapapeles\n\n${url}\n\nPégala en WhatsApp, Telegram o donde quieras para compartir tu portafolio.`,
      icon: 'info',
    });
  });
  stdButtons.appendChild(shareBtn);

  stdToolbar.appendChild(stdButtons);
  toolbars.appendChild(stdToolbar);

  // ── Address bar toolbar ──
  const addrToolbar = document.createElement('div');
  addrToolbar.className = 'toolbar';
  addrToolbar.id = 'address-bar-toolbar';

  const addrDragHandle = document.createElement('div');
  addrDragHandle.className = 'toolbar-drag-handle';
  addrToolbar.appendChild(addrDragHandle);

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
  addrIcon.src = '/images/icons/paint-32x32.png';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  const addrInput = document.createElement('input');
  addrInput.type = 'text';
  addrInput.id = 'address';
  addrInput.value = 'Portfolio';
  addrInput.autocomplete = 'off';
  compoundInput.appendChild(addrInput);

  const addrDropdown = document.createElement('button');
  addrDropdown.id = 'address-dropdown-button';
  addrDropdown.className = 'lightweight';
  addrDropdown.disabled = true;
  addrDropdown.innerHTML = DROPDOWN_ARROW_SVG;
  compoundInput.appendChild(addrDropdown);

  addrBar.appendChild(compoundInput);
  addrToolbar.appendChild(addrBar);
  toolbars.appendChild(addrToolbar);

  explorer.appendChild(toolbars);

  // ══════════════════════════════════════════════════════════════════
  // CONTENT AREA (with left info panel)
  // ══════════════════════════════════════════════════════════════════

  // ── DOM refs ──
  let panelEl: HTMLElement;
  let panelIcon: HTMLImageElement;
  let panelTitle: HTMLParagraphElement;
  let panelInfo: HTMLSpanElement;
  let contentEl: HTMLElement;
  let statusLeftEl: HTMLElement;

  const contentArea = document.createElement('div');
  contentArea.className = 'content-with-panel inset-deep';

  // ── Left panel ──
  panelEl = document.createElement('div');
  panelEl.id = 'panel';

  panelIcon = document.createElement('img');
  panelIcon.className = 'panel-folder-icon';
  panelIcon.src = '/images/icons/paint-32x32.png';
  panelIcon.width = 32;
  panelIcon.height = 32;
  panelIcon.alt = '';
  panelEl.appendChild(panelIcon);

  panelTitle = document.createElement('p');
  panelTitle.className = 'panel-title';
  panelTitle.textContent = 'Portfolio';
  panelEl.appendChild(panelTitle);

  const logoLine = document.createElement('p');
  logoLine.className = 'panel-logoline';
  const logoImg = document.createElement('img');
  logoImg.src = '/images/icons/wvline.gif';
  logoImg.width = 100;
  logoImg.height = 1;
  logoImg.style.width = '100%';
  logoLine.appendChild(logoImg);
  panelEl.appendChild(logoLine);

  const infoP = document.createElement('p');
  infoP.className = 'panel-info';
  panelInfo = document.createElement('span');
  panelInfo.id = 'panel-info';
  panelInfo.textContent = 'Selecciona un elemento para ver su descripción.';
  infoP.appendChild(panelInfo);
  panelEl.appendChild(infoP);

  contentArea.appendChild(panelEl);

  // ── Right content ──
  contentEl = document.createElement('div');
  contentEl.id = 'content';
  contentArea.appendChild(contentEl);

  explorer.appendChild(contentArea);

  // ══════ Status Bar ══════
  const statusBar = document.createElement('div');
  statusBar.id = 'status-bar';

  statusLeftEl = document.createElement('div');
  statusLeftEl.id = 'status-bar-left';
  statusLeftEl.className = 'inset-shallow';
  statusBar.appendChild(statusLeftEl);

  const statusMiddle = document.createElement('div');
  statusMiddle.id = 'status-bar-middle';
  statusMiddle.className = 'inset-shallow';
  statusBar.appendChild(statusMiddle);

  const statusRight = document.createElement('div');
  statusRight.id = 'status-bar-right';
  statusRight.className = 'inset-shallow';
  statusBar.appendChild(statusRight);

  explorer.appendChild(statusBar);

  // ── Append to window content ──
  $win.$content.append(explorer);

  // ══════════════════════════════════════════════════════════════════
  // RENDER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  /** Renders the root view based on current view mode */
  function renderRoot(): void {
    currentFolder = null;
    upBtn.disabled = true;
    addrInput.value = 'Portfolio';
    panelIcon.src = '/images/icons/paint-32x32.png';
    panelTitle.textContent = 'Portfolio';
    panelInfo.textContent = 'Selecciona una carpeta para ver su contenido.';

    contentEl.innerHTML = '';

    switch (currentView) {
      case 'SMALL_ICONS':
        contentEl.appendChild(buildRootSmallIconsView());
        break;
      case 'LIST':
        contentEl.appendChild(buildRootListView());
        break;
      case 'DETAILS':
        contentEl.appendChild(buildRootDetailsView());
        break;
      case 'LARGE_ICONS':
      default:
        contentEl.appendChild(buildRootLargeIconsView());
        break;
    }

    statusLeftEl.textContent = `${PORTFOLIO_FOLDERS.length} folder(s)`;
    statusRight.textContent = 'Portfolio';
  }

  /** Root: large icons grid for web/system folders */
  function buildRootLargeIconsView(): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `display:flex;flex-wrap:wrap;gap:4px;padding:8px;align-content:flex-start;`;

    for (const folder of PORTFOLIO_FOLDERS) {
      const div = document.createElement('div');
      div.style.cssText = `display:flex;flex-direction:column;align-items:center;width:72px;padding:4px;cursor:pointer;user-select:none;border:1px solid transparent;border-radius:2px;`;

      div.addEventListener('mouseenter', () => {
        div.style.background = '#c0e0ff';
        div.style.borderColor = '#000080';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folder === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folder];
      });
      div.addEventListener('mouseleave', () => {
        div.style.background = '';
        div.style.borderColor = 'transparent';
        panelIcon.src = '/images/icons/paint-32x32.png';
        panelTitle.textContent = 'Portfolio';
        panelInfo.textContent = 'Selecciona una carpeta para ver su contenido.';
      });
      div.addEventListener('click', () => renderFolder(folder));

      const icon = document.createElement('div');
      icon.style.cssText = 'width:32px;height:32px;margin-bottom:2px;pointer-events:none;';
      icon.innerHTML = '<img src="/images/icons/folder-32x32.png" width="32" height="32" alt="" style="pointer-events:none;image-rendering:pixelated">';
      div.appendChild(icon);

      const label = document.createElement('span');
      label.style.cssText = 'font-size:11px;font-family:\'MS Sans Serif\',\'Segoe UI\',sans-serif;text-align:center;word-wrap:break-word;max-width:68px;pointer-events:none;line-height:1.2;';
      label.textContent = folder === 'web' ? 'Web' : 'System';
      div.appendChild(label);

      grid.appendChild(div);
    }
    return grid;
  }

  /** Root: small icons with label to the right for web/system folders */
  function buildRootSmallIconsView(): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `display:flex;flex-wrap:wrap;gap:2px;padding:4px;align-content:flex-start;`;

    for (const folder of PORTFOLIO_FOLDERS) {
      const item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:3px;width:140px;padding:2px 4px;cursor:pointer;user-select:none;border:1px solid transparent;border-radius:2px;';

      item.addEventListener('mouseenter', () => {
        item.style.background = '#c0e0ff';
        item.style.borderColor = '#000080';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folder === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folder];
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
        item.style.borderColor = 'transparent';
        panelIcon.src = '/images/icons/paint-32x32.png';
        panelTitle.textContent = 'Portfolio';
        panelInfo.textContent = 'Selecciona una carpeta para ver su contenido.';
      });
      item.addEventListener('click', () => renderFolder(folder));

      const icon = document.createElement('span');
      icon.style.cssText = 'width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none;';
      icon.innerHTML = '<img src="/images/icons/folder-16x16.png" width="16" height="16" alt="" style="pointer-events:none;image-rendering:pixelated">';
      item.appendChild(icon);

      const label = document.createElement('span');
      label.style.cssText = 'font-size:11px;font-family:\'MS Sans Serif\',\'Segoe UI\',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;line-height:1.2;';
      label.textContent = folder === 'web' ? 'Web' : 'System';
      item.appendChild(label);

      grid.appendChild(item);
    }
    return grid;
  }

  /** Root: vertical list of folders */
  function buildRootListView(): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;border:none;font-size:11px;font-family:\'MS Sans Serif\',\'Segoe UI\',sans-serif;table-layout:fixed;';

    for (const folder of PORTFOLIO_FOLDERS) {
      const row = document.createElement('tr');
      row.style.cssText = 'cursor:pointer;';

      row.addEventListener('mouseenter', () => {
        row.style.outline = '1px dotted #000080';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folder === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folder];
      });
      row.addEventListener('mouseleave', () => {
        row.style.outline = '';
        panelIcon.src = '/images/icons/paint-32x32.png';
        panelTitle.textContent = 'Portfolio';
        panelInfo.textContent = 'Selecciona una carpeta para ver su contenido.';
      });
      row.addEventListener('click', () => renderFolder(folder));

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      nameCell.innerHTML = '<img src="/images/icons/folder-16x16.png" width="16" height="16" alt="" style="pointer-events:none;image-rendering:pixelated;vertical-align:middle;margin-right:4px;"> ' + (folder === 'web' ? 'Web' : 'System');
      row.appendChild(nameCell);

      table.appendChild(row);
    }
    return table;
  }

  /** Root: details table with Name and Type columns */
  function buildRootDetailsView(): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;border:none;font-size:11px;font-family:\'MS Sans Serif\',\'Segoe UI\',sans-serif;table-layout:fixed;';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText = 'position:sticky;top:0;z-index:1;';

    [{label:'Name',width:'60%'},{label:'Type',width:'40%'}].forEach(h => {
      const th = document.createElement('th');
      th.textContent = h.label;
      th.style.cssText = `text-align:left;background:#c0c0c0;padding:3px 6px;font-weight:normal;font-size:11px;border-bottom:1px solid #808080;width:${h.width};`;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const folder of PORTFOLIO_FOLDERS) {
      const row = document.createElement('tr');
      row.style.cssText = 'cursor:pointer;';

      row.addEventListener('mouseenter', () => {
        row.style.background = '#c0e0ff';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folder === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folder];
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
        panelIcon.src = '/images/icons/paint-32x32.png';
        panelTitle.textContent = 'Portfolio';
        panelInfo.textContent = 'Selecciona una carpeta para ver su contenido.';
      });
      row.addEventListener('click', () => renderFolder(folder));

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      nameCell.textContent = folder === 'web' ? 'Web' : 'System';
      row.appendChild(nameCell);

      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding:2px 4px;';
      typeCell.textContent = 'Folder';
      row.appendChild(typeCell);

      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    return table;
  }

  /** Renders a folder view based on current view mode */
  function renderFolder(folder: string): void {
    currentFolder = folder;
    upBtn.disabled = false;
    addrInput.value = `Portfolio\\${folder === 'web' ? 'Web' : 'System'}`;
    panelIcon.src = '/images/icons/folder-32x32.png';
    panelTitle.textContent = folder === 'web' ? 'Web' : 'System';
    panelInfo.textContent = FOLDER_DESCRIPTIONS[folder];

    const files = portfolioFiles.filter(f => f.folder === folder);
    contentEl.innerHTML = '';

    switch (currentView) {
      case 'SMALL_ICONS':
        contentEl.appendChild(buildSmallIconsView(files, folder));
        break;
      case 'LIST':
        contentEl.appendChild(buildListView(files, folder));
        break;
      case 'DETAILS':
        contentEl.appendChild(buildDetailsView(files, folder));
        break;
      case 'LARGE_ICONS':
      default:
        contentEl.appendChild(buildLargeIconsView(files, folder));
        break;
    }

    statusLeftEl.textContent = `${files.length} object(s)`;
    statusRight.textContent = `Portfolio\\${folder === 'web' ? 'Web' : 'System'}`;
  }

  /** Builds the large icons view — 32×32 grid of file icons */
  function buildLargeIconsView(files: PortfolioFile[], folderName: string): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px;
      align-content: flex-start;
    `;

    for (const file of files) {
      const div = document.createElement('div');
      div.style.cssText = `
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

      div.addEventListener('mouseenter', () => {
        div.style.background = '#c0e0ff';
        div.style.borderColor = '#000080';
        panelIcon.src = '/images/icons/notepad-file-32x32.png';
        panelTitle.textContent = file.name.replace('.md', '');
        panelInfo.innerHTML = `
          <strong>${file.name.replace('.md', '')}</strong><br>
          Carpeta: ${file.folder}<br>
          Fecha: ${file.date}<br>
          Tipo: Documento Markdown
        `;
      });
      div.addEventListener('mouseleave', () => {
        div.style.background = '';
        div.style.borderColor = 'transparent';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folderName === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folderName];
      });

      div.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      // Large icon
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = 'width: 32px; height: 32px; margin-bottom: 2px; pointer-events: none;';
      iconContainer.innerHTML = getFileIcon(32);
      div.appendChild(iconContainer);

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
      div.appendChild(label);

      grid.appendChild(div);
    }

    return grid;
  }

  /** Builds the small icons view — 16×16 icons with label to the right */
  function buildSmallIconsView(files: PortfolioFile[], folderName: string): HTMLElement {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 4px;
      align-content: flex-start;
    `;

    for (const file of files) {
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

      item.addEventListener('mouseenter', () => {
        item.style.background = '#c0e0ff';
        item.style.borderColor = '#000080';
        panelIcon.src = '/images/icons/notepad-file-32x32.png';
        panelTitle.textContent = file.name.replace('.md', '');
        panelInfo.innerHTML = `
          <strong>${file.name.replace('.md', '')}</strong><br>
          Carpeta: ${file.folder}<br>
          Fecha: ${file.date}<br>
          Tipo: Documento Markdown
        `;
      });
      item.addEventListener('mouseleave', () => {
        item.style.background = '';
        item.style.borderColor = 'transparent';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folderName === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folderName];
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
      icon.innerHTML = getFileIcon(16);

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
    }

    return grid;
  }

  /** Builds the list view — single-column vertical list of files */
  function buildListView(files: PortfolioFile[], folderName: string): HTMLElement {
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      table-layout: fixed;
    `;

    for (const file of files) {
      const row = document.createElement('tr');
      row.style.cssText = 'cursor: pointer;';

      row.addEventListener('mouseenter', () => {
        row.style.outline = '1px dotted #000080';
        panelIcon.src = '/images/icons/notepad-file-32x32.png';
        panelTitle.textContent = file.name.replace('.md', '');
        panelInfo.innerHTML = `
          <strong>${file.name.replace('.md', '')}</strong><br>
          Carpeta: ${file.folder}<br>
          Fecha: ${file.date}<br>
          Tipo: Documento Markdown
        `;
      });
      row.addEventListener('mouseleave', () => {
        row.style.outline = '';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folderName === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folderName];
      });

      row.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      const nameCell = document.createElement('td');
      nameCell.style.cssText = `
        padding: 2px 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      nameCell.innerHTML = getFileIcon(16) + ' ' + file.name.replace('.md', '');
      row.appendChild(nameCell);

      table.appendChild(row);
    }

    return table;
  }

  /** Builds the details view — table with Name, Date, Type columns */
  function buildDetailsView(files: PortfolioFile[], folderName: string): HTMLElement {
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

    // Body
    const tbody = document.createElement('tbody');
    for (const file of files) {
      const row = document.createElement('tr');
      row.style.cssText = 'cursor: pointer;';

      row.addEventListener('mouseenter', () => {
        row.style.background = '#c0e0ff';
        panelIcon.src = '/images/icons/notepad-file-32x32.png';
        panelTitle.textContent = file.name.replace('.md', '');
        panelInfo.innerHTML = `
          <strong>${file.name.replace('.md', '')}</strong><br>
          Carpeta: ${file.folder}<br>
          Fecha: ${file.date}<br>
          Tipo: Documento Markdown
        `;
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
        panelIcon.src = '/images/icons/folder-32x32.png';
        panelTitle.textContent = folderName === 'web' ? 'Web' : 'System';
        panelInfo.textContent = FOLDER_DESCRIPTIONS[folderName];
      });

      row.addEventListener('click', () => {
        openFileViewer(file.name, file.folder, file.date);
      });

      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
      nameCell.textContent = file.name.replace('.md', '');
      row.appendChild(nameCell);

      const dateCell = document.createElement('td');
      dateCell.style.cssText = 'padding: 2px 4px;';
      dateCell.textContent = file.date;
      row.appendChild(dateCell);

      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 4px;';
      typeCell.textContent = 'Markdown Document';
      row.appendChild(typeCell);

      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    return table;
  }

  /**
   * Dispatches to renderRoot or renderFolder based on currentFolder state.
   * Called by the Views toggle and dropdown after changing view mode.
   */
  function renderContent(): void {
    if (currentFolder === null) {
      renderRoot();
    } else {
      renderFolder(currentFolder);
    }
  }

  // ── Wire up the Up button to navigate to root ──
  upBtn.disabled = true;
  upBtn.onclick = () => {
    if (currentFolder !== null) {
      renderRoot();
    }
  };

  // ── Wire up Back button to navigate to root ──
  backMainBtn.disabled = false;
  backMainBtn.onclick = () => {
    if (currentFolder !== null) {
      renderRoot();
    }
  };

  // ── Initial render ──
  if (appData?.folder && (appData.folder === 'web' || appData.folder === 'system')) {
    renderFolder(appData.folder);
  } else {
    renderRoot();
  }
}
