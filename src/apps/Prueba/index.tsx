import React from 'react';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

/**
 * Placeholder React component - the Prueba app uses os-gui natively.
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
  dropdownAction: () => void,
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
 * Sample file/folder items for the content area.
 */
const SAMPLE_ITEMS = [
  { name: 'My Pictures', type: 'folder' },
  { name: 'My Music', type: 'folder' },
  { name: 'My Videos', type: 'folder' },
  { name: 'letter.doc', type: 'word' },
  { name: 'budget.xls', type: 'excel' },
  { name: 'photo.jpg', type: 'image' },
  { name: 'readme.txt', type: 'text' },
  { name: 'presentation.ppt', type: 'powerpoint' },
  { name: 'My eBooks', type: 'folder' },
  { name: 'notes.txt', type: 'text' },
  { name: 'screenshot.png', type: 'image' },
  { name: 'backup.zip', type: 'zip' },
];

/**
 * Returns an SVG icon for a sample file/folder type.
 */
function getFileIcon(type: string): string {
  switch (type) {
    case 'folder':
      return `<img src="/images/icons/folder-32x32.png" width="32" height="32" alt="" style="pointer-events:none;image-rendering:pixelated">`;
    case 'text':
      return `<img src="/images/icons/notepad-file-32x32.png" width="32" height="32" alt="" style="pointer-events:none;image-rendering:pixelated">`;
    case 'image':
      return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="26" height="24" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
        <rect x="3" y="4" width="26" height="6" fill="#C0C0C0" stroke="#808080" stroke-width="1"/>
        <circle cx="11" cy="18" r="3" fill="#FF8C00"/>
        <polygon points="14,16 20,22 24,18 28,24 28,28 4,28 4,22" fill="#4682B4"/>
      </svg>`;
    case 'word':
      return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
        <rect x="4" y="2" width="24" height="6" rx="2" fill="#2B579A" stroke="#2B579A" stroke-width="1"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="20" x2="22" y2="20" stroke="#000" stroke-width="1"/>
        <text x="8" y="9" font-size="5" fill="#fff" font-weight="bold">W</text>
      </svg>`;
    case 'excel':
      return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
        <rect x="4" y="2" width="24" height="6" rx="2" fill="#217346" stroke="#217346" stroke-width="1"/>
        <line x1="8" y1="14" x2="24" y2="14" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="18" x2="24" y2="18" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="22" x2="24" y2="22" stroke="#000" stroke-width="1"/>
        <text x="8" y="9" font-size="5" fill="#fff" font-weight="bold">X</text>
      </svg>`;
    case 'powerpoint':
      return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
        <rect x="4" y="2" width="24" height="6" rx="2" fill="#D24726" stroke="#D24726" stroke-width="1"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#000" stroke-width="1"/>
        <text x="8" y="9" font-size="5" fill="#fff" font-weight="bold">P</text>
      </svg>`;
    case 'zip':
      return `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="24" height="28" rx="2" fill="#fff" stroke="#808080" stroke-width="1"/>
        <rect x="4" y="2" width="24" height="6" rx="2" fill="#C0C0C0" stroke="#808080" stroke-width="1"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="16" x2="20" y2="16" stroke="#000" stroke-width="1"/>
        <text x="10" y="10" font-size="4" fill="#000" font-weight="bold">ZIP</text>
      </svg>`;
    default:
      return `<img src="/images/icons/notepad-file-32x32.png" width="32" height="32" alt="" style="pointer-events:none;image-rendering:pixelated">`;
  }
}

/**
 * Custom launch function that creates a faithful replica
 * of the 98.js Explorer "Portfolio" window using os-gui.
 */
export function launchPortfolio(): void {
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
      16: '/images/icons/folder-16x16.png',
      any: '/images/icons/folder-32x32.png',
    },
    minWidth: 500,
    minHeight: 400,
  });

  $win.css({
    width: '700px',
    height: '480px',
  });
  $win.center();
  registerOsWindow($win, 'portfolio', 'Portfolio', '/images/icons/folder-32x32.png');

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

  // Back (compound) — sprite index 0
  stdButtons.appendChild(
    createCompoundButton('Back', SPRITE_BACK, () => showMessageBox({ title: 'Portfolio', message: 'Back', icon: 'info' }), () => showMessageBox({ title: 'Portfolio', message: 'Back history', icon: 'info' }), true),
  );

  // Forward (compound) — sprite index 1
  stdButtons.appendChild(
    createCompoundButton('Forward', SPRITE_FORWARD, () => showMessageBox({ title: 'Portfolio', message: 'Forward', icon: 'info' }), () => showMessageBox({ title: 'Portfolio', message: 'Forward history', icon: 'info' }), true),
  );

  // Up — sprite index 44
  const upBtn = createToolbarButton('Up', SPRITE_UP);
  upBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Up one level', icon: 'info' }));
  stdButtons.appendChild(upBtn);

  stdButtons.appendChild(createSeparator());

  // Cut — sprite index 21
  const cutBtn = createToolbarButton('Cut', SPRITE_CUT);
  cutBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Cut', icon: 'info' }));
  stdButtons.appendChild(cutBtn);

  // Copy — sprite index 22
  const copyBtn = createToolbarButton('Copy', SPRITE_COPY);
  copyBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Copy', icon: 'info' }));
  stdButtons.appendChild(copyBtn);

  // Paste — sprite index 23
  const pasteBtn = createToolbarButton('Paste', SPRITE_PASTE);
  pasteBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Paste', icon: 'info' }));
  stdButtons.appendChild(pasteBtn);

  stdButtons.appendChild(createSeparator());

  // Undo — sprite index 24
  const undoBtn = createToolbarButton('Undo', SPRITE_UNDO);
  undoBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Undo', icon: 'info' }));
  stdButtons.appendChild(undoBtn);

  stdButtons.appendChild(createSeparator());

  // Delete — sprite index 26
  const deleteBtn = createToolbarButton('Delete', SPRITE_DELETE);
  deleteBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Delete', icon: 'info' }));
  stdButtons.appendChild(deleteBtn);

  // Properties — sprite index 31
  const propsBtn = createToolbarButton('Properties', SPRITE_PROPERTIES);
  propsBtn.addEventListener('click', () => showMessageBox({ title: 'Portfolio', message: 'Properties', icon: 'info' }));
  stdButtons.appendChild(propsBtn);

  stdButtons.appendChild(createSeparator());

  // Views (compound) — sprite index 38
  stdButtons.appendChild(
    createCompoundButton('Views', SPRITE_VIEWS, () => showMessageBox({ title: 'Portfolio', message: 'Cycle view mode', icon: 'info' }), () => showMessageBox({ title: 'Portfolio', message: 'Views dropdown', icon: 'info' })),
  );

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
  addrIcon.src = '/images/icons/folder-16x16.png';
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

  // ══════ Content area ══════
  const content = document.createElement('div');
  content.id = 'content';
  content.className = 'inset-deep';

  // Create file icon grid
  const gridContainer = document.createElement('div');
  gridContainer.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    align-content: flex-start;
  `;

  for (const item of SAMPLE_ITEMS) {
    const iconDiv = document.createElement('div');
    iconDiv.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 72px;
      padding: 4px;
      cursor: default;
      user-select: none;
    `;
    iconDiv.addEventListener('dblclick', () => {
      showMessageBox({ title: 'Portfolio', message: `Open: ${item.name}`, icon: 'info' });
    });

    const iconSvg = document.createElement('div');
    iconSvg.style.cssText = `
      width: 32px;
      height: 32px;
      margin-bottom: 2px;
      pointer-events: none;
    `;
    iconSvg.innerHTML = getFileIcon(item.type);

    const label = document.createElement('span');
    label.style.cssText = `
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      text-align: center;
      word-wrap: break-word;
      max-width: 68px;
      color: var(--WindowText);
      pointer-events: none;
    `;
    label.textContent = item.name;

    iconDiv.appendChild(iconSvg);
    iconDiv.appendChild(label);
    gridContainer.appendChild(iconDiv);
  }

  content.appendChild(gridContainer);
  explorer.appendChild(content);

  // ══════ Status Bar ══════
  const statusBar = document.createElement('div');
  statusBar.id = 'status-bar';

  const statusLeft = document.createElement('div');
  statusLeft.id = 'status-bar-left';
  statusLeft.className = 'inset-shallow';
  statusLeft.textContent = '12 object(s)';
  statusBar.appendChild(statusLeft);

  const statusMiddle = document.createElement('div');
  statusMiddle.id = 'status-bar-middle';
  statusMiddle.className = 'inset-shallow';
  statusBar.appendChild(statusMiddle);

  const statusRight = document.createElement('div');
  statusRight.id = 'status-bar-right';
  statusRight.className = 'inset-shallow';
  statusRight.textContent = 'My Computer';
  statusBar.appendChild(statusRight);

  explorer.appendChild(statusBar);

  // ── Append to window content ──
  $win.$content.append(explorer);
}
