import React from 'react';
import {
  extractDate,
  extractContentWithoutDate,
  extractRawContent,
} from '../../utils/fileUtils';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';
import { getCascadeOffset } from '../../utils/cascadePosition';

/**
 * All markdown files loaded eagerly via Vite's import.meta.glob.
 * This is a build-time feature, so it cannot live inside a React hook.
 */
const files: Record<string, string> = import.meta.glob('../../data/files/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface FileData {
  folder: string;
  name: string;
  content: string;
  date: string;
}

interface SearchResult extends FileData {
  matchType: 'title' | 'content';
}

// ─── Sprite indices for toolbar buttons ──────────────────────────────────────

const SPRITE_BACK = 0;
const SPRITE_FORWARD = 1;

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

function createSeparator(): HTMLHRElement {
  const hr = document.createElement('hr');
  hr.setAttribute('aria-orientation', 'vertical');
  return hr;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a flat list of all files from the glob result.
 */
function getAllFiles(): FileData[] {
  const result: FileData[] = [];
  Object.entries(files).forEach(([path, content]) => {
    const parts = path.replace('../../data/files/', '').split('/');
    const folder = parts[0];
    const filename = parts[1];
    result.push({
      folder,
      name: filename,
      content: extractContentWithoutDate(content),
      date: extractDate(content),
    });
  });
  return result;
}

/**
 * Filters the file list by name OR content (case-insensitive).
 */
function searchFiles(term: string): SearchResult[] {
  const query = term.toLowerCase().trim();
  if (!query) return [];
  return getAllFiles().filter((file) => {
    const nameMatch = file.name.toLowerCase().includes(query);
    const contentMatch = !nameMatch && file.content.toLowerCase().includes(query);
    return nameMatch || contentMatch;
  }).map((file) => {
    const nameMatch = file.name.toLowerCase().includes(query);
    return {
      ...file,
      matchType: nameMatch ? 'title' : 'content',
    };
  });
}

/**
 * Dispatches a custom event to open a file in FileViewer
 * (matching the convention used by other os-gui apps).
 */
function openFileInViewer(file: FileData): void {
  const rawContent = extractRawContent(
    files[`../../data/files/${file.folder}/${file.name}`],
  );
  window.dispatchEvent(
    new CustomEvent('desktop-open-app', {
      detail: {
        appId: 'markdownViewer',
        appData: {
          file: {
            name: file.name.replace('.md', ''),
            content: file.content,
            rawContent,
            folder: file.folder,
            date: file.date,
          },
          windowKey: `${file.folder}/${file.name}`,
          title: file.name.replace('.md', ''),
        },
      },
    }),
  );
}

// ─── os-gui launch function ───────────────────────────────────────────────────

/**
 * Launches the Search app as a native os-gui window with toolbar,
 * address-bar search, and status bar, matching the os-explorer pattern.
 */
export function launchSearch(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'Search: Files',
    icons: {
      16: '/images/icons/search.svg',
      any: '/images/icons/search.svg',
    },
    minWidth: 520,
    minHeight: 380,
  });

  $win.css({ width: '640px', height: '460px' });
  $win.center();
  const cascadeOffset = getCascadeOffset();
  $win.css({ left: parseInt($win.css('left')) + cascadeOffset, top: parseInt($win.css('top')) + cascadeOffset });
  registerOsWindow($win, 'search', 'Search: Files', '/images/icons/search.svg');

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

  // ── Menu bar toolbar (no drag handle) ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  const menuBar = new MenuBar({
    '&File': [
      { label: 'E&xit', action: () => $win.close() },
    ],
    '&Edit': [
      { label: 'Cu&t', shortcutLabel: 'Ctrl+X', enabled: false },
      { label: '&Copy', shortcutLabel: 'Ctrl+C', enabled: false },
      { label: '&Paste', shortcutLabel: 'Ctrl+V', enabled: false },
      { separator: true },
      { label: 'Select &All', shortcutLabel: 'Ctrl+A', enabled: false },
    ],
    '&View': [
      { label: 'Status &Bar', checked: true, enabled: false },
    ],
    '&Help': [
      {
        label: '&About Search: Files',
        action: () => {
          showMessageBox({ title: 'About Search: Files', message: 'Search: Files\n\nSearch through markdown files by name or content.\n\nVersion 1.0', icon: 'info' });
        },
      },
    ],
  });

  menuToolbar.appendChild(menuBar.element);
  toolbars.appendChild(menuToolbar);

  // ── Standard Buttons toolbar (with drag handle) ──
  const stdToolbar = document.createElement('div');
  stdToolbar.className = 'toolbar';
  stdToolbar.id = 'standard-buttons-toolbar';

  const stdDragHandle = document.createElement('div');
  stdDragHandle.className = 'toolbar-drag-handle';
  stdToolbar.appendChild(stdDragHandle);

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';

  // Back (disabled)
  stdButtons.appendChild(createToolbarButton('Back', SPRITE_BACK, true));

  // Forward (disabled)
  stdButtons.appendChild(createToolbarButton('Forward', SPRITE_FORWARD, true));

  stdToolbar.appendChild(stdButtons);
  toolbars.appendChild(stdToolbar);

  // ── Address bar toolbar (with drag handle) ──
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
  addrLabel.textContent = 'Search';
  addrBar.appendChild(addrLabel);

  const compoundInput = document.createElement('div');
  compoundInput.id = 'address-compound-input';
  compoundInput.className = 'inset-deep';

  const addrIcon = document.createElement('img');
  addrIcon.id = 'address-icon';
  addrIcon.width = 16;
  addrIcon.height = 16;
  addrIcon.src = '/images/icons/search.svg';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'address';
  searchInput.value = '';
  searchInput.placeholder = 'Type a word...';
  searchInput.autocomplete = 'off';
  compoundInput.appendChild(searchInput);

  addrBar.appendChild(compoundInput);
  addrToolbar.appendChild(addrBar);
  toolbars.appendChild(addrToolbar);

  explorer.appendChild(toolbars);

  // ══════════════════════════════════════════════════════════════════
  // CONTENT AREA (results)
  // ══════════════════════════════════════════════════════════════════
  const content = document.createElement('div');
  content.id = 'content';
  content.className = 'inset-deep';
  content.style.overflow = 'auto';

  // ── Empty state placeholder ──
  const emptyState = document.createElement('div');
  emptyState.style.cssText = `
    padding: 16px;
    color: #666;
  `;
  emptyState.textContent = 'Type a word to search in files';
  content.appendChild(emptyState);

  explorer.appendChild(content);

  // ══════════════════════════════════════════════════════════════════
  // STATUS BAR
  // ══════════════════════════════════════════════════════════════════
  const statusBar = document.createElement('div');
  statusBar.id = 'status-bar';

  const statusLeft = document.createElement('div');
  statusLeft.id = 'status-bar-left';
  statusLeft.className = 'inset-shallow';
  statusLeft.textContent = 'No search';
  statusBar.appendChild(statusLeft);

  const statusMiddle = document.createElement('div');
  statusMiddle.id = 'status-bar-middle';
  statusMiddle.className = 'inset-shallow';
  statusBar.appendChild(statusMiddle);

  const statusRight = document.createElement('div');
  statusRight.id = 'status-bar-right';
  statusRight.className = 'inset-shallow';
  statusRight.textContent = 'Ready';
  statusBar.appendChild(statusRight);

  explorer.appendChild(statusBar);

  // ══════════════════════════════════════════════════════════════════
  // SEARCH LOGIC
  // ══════════════════════════════════════════════════════════════════
  function renderResults(term: string): void {
    // Clear existing children
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }

    const trimmed = term.trim();

    if (!trimmed) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 16px; color: #666;';
      empty.textContent = 'Type a word to search in files';
      content.appendChild(empty);

      statusLeft.textContent = 'No search';
      statusRight.textContent = 'Ready';
      return;
    }

    const results = searchFiles(term);

    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.style.cssText = 'padding: 16px; color: #666;';
      noResults.textContent = `No files found matching "${term}"`;
      content.appendChild(noResults);

      statusLeft.textContent = '0 results';
      statusRight.textContent = 'Ready';
      return;
    }

    // ── Build results table ──
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      border: none;
      table-layout: fixed;
    `;

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.cssText = 'position: sticky; top: 0; z-index: 1;';

    const headers = [
      { label: 'Name', width: '45%' },
      { label: 'Location', width: '30%' },
      { label: 'Type', width: '25%' },
    ];

    headers.forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h.label;
      th.style.cssText = `
        text-align: left;
        background: #c0c0c0;
        padding: 2px 6px;
        font-weight: normal;
        font-size: 11px;
        width: ${h.width};
      `;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    results.forEach((file) => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';

      row.addEventListener('mouseenter', () => {
        row.style.background = '#c0e0ff';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = '';
      });

      // Name cell
      const nameCell = document.createElement('td');
      nameCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      nameCell.textContent = file.name;
      row.appendChild(nameCell);

      // Location cell
      const locCell = document.createElement('td');
      locCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      locCell.textContent = file.folder;
      row.appendChild(locCell);

      // Type cell
      const typeCell = document.createElement('td');
      typeCell.style.cssText = 'padding: 2px 6px; font-size: 11px;';
      typeCell.textContent = file.matchType === 'title' ? 'Match in Title' : 'Match in Content';
      row.appendChild(typeCell);

      row.addEventListener('click', () => openFileInViewer(file));
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    content.appendChild(table);

    // Update status bar
    statusLeft.textContent = `${results.length} results`;
    statusRight.textContent = 'Ready';
  }

  // ── Wire up input ──
  searchInput.addEventListener('input', () => {
    renderResults(searchInput.value);
  });

  // ── Append to window ──
  $win.$content.append(explorer);

  // ── Focus the input once the window is shown ──
  setTimeout(() => searchInput.focus(), 50);
}

// ─── React placeholder ────────────────────────────────────────────────────────

/**
 * Placeholder React component — SearchApp uses os-gui natively.
 * This component is never rendered via the React window system;
 * the launchSearch() function is called instead.
 */
export const SearchApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};
