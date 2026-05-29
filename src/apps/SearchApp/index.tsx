import React from 'react';
import {
  extractDate,
  extractContentWithoutDate,
  extractRawContent,
} from '../../utils/fileUtils';
import { registerOsWindow } from '../../utils/osWindowRegistry';

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
 * Launches the Search app as a native os-gui window with MenuBar.
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
      16: '/app/icons/search.svg',
      any: '/app/icons/search.svg',
    },
    minWidth: 520,
    minHeight: 380,
  });

  $win.css({ width: '640px', height: '460px' });
  $win.center();
  registerOsWindow($win, 'search', 'Search: Files', '/app/icons/search.svg');

  // ── Root container ──
  const container = document.createElement('div');
  container.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #c0c0c0;
    font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
    font-size: 11px;
  `;

  // ══════ MenuBar ══════
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
          alert(
            'Search: Files\n\nSearch through markdown files by name or content.\n\nVersion 1.0',
          );
        },
      },
    ],
  });
  container.appendChild(menuBar.element);

  // ══════ Search input area ══════
  const inputArea = document.createElement('div');
  inputArea.style.cssText = `
    padding: 8px 8px 4px 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  const label = document.createElement('label');
  label.textContent = 'Search:';
  label.style.whiteSpace = 'nowrap';
  inputArea.appendChild(label);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.style.flex = '1';
  searchInput.placeholder = 'Type a word...';
  inputArea.appendChild(searchInput);

  container.appendChild(inputArea);

  // ══════ Results area (sunken panel) ══════
  const resultsWrapper = document.createElement('div');
  resultsWrapper.style.cssText = `
    flex: 1;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  const resultsPanel = document.createElement('div');
  resultsPanel.className = 'sunken-panel';
  resultsPanel.style.cssText = `
    flex: 1;
    overflow: auto;
    background: #fff;
    margin: 0;
  `;

  // ── Empty state placeholder ──
  const emptyState = document.createElement('div');
  emptyState.style.cssText = `
    padding: 16px;
    color: #666;
  `;
  emptyState.textContent = 'Type a word to search in files';
  resultsPanel.appendChild(emptyState);

  resultsWrapper.appendChild(resultsPanel);
  container.appendChild(resultsWrapper);

  // ══════ Status bar ══════
  const statusBar = document.createElement('div');
  statusBar.style.cssText = `
    display: flex;
    border-top: 1px solid #808080;
  `;

  const statusLeft = document.createElement('div');
  statusLeft.className = 'inset-shallow';
  statusLeft.style.cssText = `
    flex: 1;
    padding: 2px 6px;
    font-size: 11px;
  `;
  statusLeft.textContent = 'No search';

  const statusRight = document.createElement('div');
  statusRight.className = 'inset-shallow';
  statusRight.style.cssText = `
    padding: 2px 6px;
    font-size: 11px;
    min-width: 60px;
  `;
  statusRight.textContent = 'Ready';

  statusBar.appendChild(statusLeft);
  statusBar.appendChild(statusRight);
  container.appendChild(statusBar);

  // ══════ Search logic ══════
  function renderResults(term: string): void {
    // Clear existing children (keep the emptyState reference in memory)
    while (resultsPanel.firstChild) {
      resultsPanel.removeChild(resultsPanel.firstChild);
    }

    const trimmed = term.trim();

    if (!trimmed) {
      // Empty state
      const empty = document.createElement('div');
      empty.style.cssText = 'padding: 16px; color: #666;';
      empty.textContent = 'Type a word to search in files';
      resultsPanel.appendChild(empty);

      statusLeft.textContent = 'No search';
      statusRight.textContent = 'Ready';
      return;
    }

    const results = searchFiles(term);

    if (results.length === 0) {
      // No results state
      const noResults = document.createElement('div');
      noResults.style.cssText = 'padding: 16px; color: #666;';
      noResults.textContent = `No files found matching "${term}"`;
      resultsPanel.appendChild(noResults);

      statusLeft.textContent = '0 results';
      statusRight.textContent = 'Ready';
      return;
    }

    // ── Build results table ──
    const table = document.createElement('table');
    table.className = 'interactive';
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
      typeCell.textContent = file.matchType === 'title' ? 'Title' : 'Content';
      row.appendChild(typeCell);

      row.addEventListener('click', () => openFileInViewer(file));
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsPanel.appendChild(table);

    // Update status bar
    statusLeft.textContent = `${results.length} results`;
    statusRight.textContent = 'Ready';
  }

  // ── Wire up input ──
  searchInput.addEventListener('input', () => {
    renderResults(searchInput.value);
  });

  // ── Append the container to the window ──
  $win.$content.append(container);

  // ── Focus the input once the window is shown ──
  // Use a small delay to ensure DOM is attached
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
