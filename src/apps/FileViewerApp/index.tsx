import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';

/**
 * Placeholder React component — FileViewerApp uses os-gui natively via launchFileViewer().
 * This component is never rendered through the React window system.
 */
export const FileViewerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ══════════════════════════════════════════
//  Translations
// ══════════════════════════════════════════

const TRANSLATIONS: Record<string, { es: string; en: string }> = {
  preview: { es: 'Vista Previa', en: 'Preview' },
  source: { es: 'Código Fuente', en: 'Source' },
  close: { es: '&Cerrar', en: '&Close' },
  aboutFileViewer: { es: 'Acerca de Visor de Archivos', en: 'About File Viewer' },
  fileViewerDesc: {
    es: 'Visor de Archivos para 98.js.org\n\nUn visor de documentos markdown.\nBasado en Windows 98.',
    en: 'File Viewer for 98.js.org\n\nA markdown document viewer.\nBased on Windows 98.',
  },
};

function getLang(): 'es' | 'en' {
  const saved = localStorage.getItem('language');
  return saved === 'es' ? 'es' : 'en';
}

function tr(key: string): string {
  const lang = getLang();
  return TRANSLATIONS[key]?.[lang] || key;
}

// ══════════════════════════════════════════
//  Simple Markdown Renderer
// ══════════════════════════════════════════

/**
 * Converts basic markdown to HTML.
 * Supports: headings (h1-h3), paragraphs, bold, italic, inline code,
 * unordered/ordered lists, links, images, blockquotes, horizontal rules.
 */
function renderMarkdown(md: string): string {
  // Escape HTML entities first to prevent XSS
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings (must come before bold/italic to avoid ** interference)
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)$/gm, '<hr />');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered list items: lines starting with - or * (not already inside a tag)
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');

  // Ordered list items: lines starting with number.
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Inline formatting
  html = html
    // Inline code (before bold to avoid conflicts)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Paragraphs: double newline = paragraph break
  // First unwrap any existing <p> wrapping, then re-wrap
  // Split by blank lines (two or more newlines)
  const blocks = html.split(/\n\n+/);
  const wrapped = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // If block already starts with a block-level tag, leave it as-is
      if (/^<(h[1-3]|ul|ol|li|blockquote|hr|pre|table|div|p)/i.test(trimmed)) {
        return trimmed;
      }
      // Single line = paragraph
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  // Clean up empty paragraphs and redundant wrapping
  let result = wrapped
    .replace(/\n{3,}/g, '\n\n')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<\/ul>\n*<ul>/g, '') // merge adjacent <ul> blocks
    .replace(/<li><\/li>/g, '');    // remove empty items

  return result;
}

// ══════════════════════════════════════════
//  Tab UI Helpers
// ══════════════════════════════════════════

type TabId = 'preview' | 'source';

function createTablist(
  activeTab: TabId,
  onTabChange: (tab: TabId) => void,
): HTMLMenuElement {
  const menu = document.createElement('menu');
  menu.className = 'fileviewer-tablist';
  menu.setAttribute('role', 'tablist');

  const tabs: { id: TabId; labelKey: string }[] = [
    { id: 'preview', labelKey: 'preview' },
    { id: 'source', labelKey: 'source' },
  ];

  for (const tab of tabs) {
    const li = document.createElement('li');
    li.setAttribute('role', 'tab');
    li.setAttribute('aria-selected', String(activeTab === tab.id));

    const a = document.createElement('a');
    a.href = '#';
    a.textContent = tr(tab.labelKey);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      onTabChange(tab.id);
    });

    li.appendChild(a);
    menu.appendChild(li);
  }

  return menu;
}

/**
 * Updates tablist aria-selected state and switches content.
 */
function switchTab(
  tabId: TabId,
  tablist: HTMLMenuElement,
  previewPanel: HTMLDivElement,
  sourcePanel: HTMLDivElement,
): void {
  // Update tab aria-selected
  const tabs = tablist.querySelectorAll<HTMLLIElement>('[role="tab"]');
  tabs.forEach((tab, index) => {
    const isSelected = (index === 0 && tabId === 'preview') ||
      (index === 1 && tabId === 'source');
    tab.setAttribute('aria-selected', String(isSelected));
  });

  // Toggle panels
  previewPanel.style.display = tabId === 'preview' ? '' : 'none';
  sourcePanel.style.display = tabId === 'source' ? '' : 'none';
}

// ══════════════════════════════════════════
//  Launch Function
// ══════════════════════════════════════════

/**
 * Creates a native os-gui File Viewer window with Preview/Source tabs.
 *
 * Expected appData shape:
 * {
 *   file: {
 *     name: string;        // file name without .md
 *     content: string;     // markdown content without date line
 *     rawContent?: string; // full raw content including date line
 *     folder: string;      // folder name
 *     date?: string;       // date string
 *   },
 *   title?: string;        // window title (defaults to file name)
 * }
 */
export function launchFileViewer(appData?: any): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  const file = appData?.file;
  const title = appData?.title || file?.name || tr('fileViewerTitle');

  // Use rawContent if available (includes date header), fallback to content
  const displayContent = file?.rawContent || file?.content || '';

  // ── Create the os-gui window ──
  const $win = $Window({
    title: title,
    icons: {
      16: '/app/icons/file-viewer.svg',
      any: '/app/icons/file-viewer.svg',
    },
    minWidth: 350,
    minHeight: 200,
  });

  $win.css({
    width: '700px',
    height: '500px',
  });
  $win.center();
  registerOsWindow($win, 'fileViewer', title, '/app/icons/file-viewer.svg');

  // ── Build the viewer layout ──
  const container = document.createElement('div');
  container.className = 'fileviewer-os-container';

  // ══════ Menu bar ══════
  const menu = new MenuBar({
    [tr('file') || '&File']: [
      {
        label: tr('close'),
        action: () => $win.close(),
      },
    ],
    '&Help': [
      {
        label: tr('aboutFileViewer'),
        action: () => alert(tr('fileViewerDesc')),
      },
    ],
  });

  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';
  menuToolbar.appendChild(menu.element);
  container.appendChild(menuToolbar);

  // ══════ Tab State ══════
  let activeTab: TabId = 'preview';

  // ══════ Tablist ══════
  const tablist = createTablist(activeTab, (newTab) => {
    activeTab = newTab;
    switchTab(activeTab, tablist, previewPanel, sourcePanel);
  });
  container.appendChild(tablist);

  // ══════ Content panels ══════
  const panelsWrapper = document.createElement('div');
  panelsWrapper.className = 'window';
  panelsWrapper.style.cssText =
    'flex:1;display:flex;flex-direction:column;margin:0;border:none;box-shadow:none;overflow:hidden;';

  const panelsBody = document.createElement('div');
  panelsBody.className = 'window-body';
  panelsBody.style.cssText =
    'flex:1;display:flex;flex-direction:column;margin:0;padding:4px;background:#c0c0c0;overflow:hidden;';

  // ── Preview panel ──
  const previewPanel = document.createElement('div');
  previewPanel.className = 'fileviewer-markdown sunken-panel';
  previewPanel.style.cssText =
    'flex:1;overflow:auto;background:#fff;padding:10px;';
  previewPanel.innerHTML = renderMarkdown(displayContent);

  // ── Source panel (hidden by default) ──
  const sourcePanel = document.createElement('div');
  sourcePanel.className = 'sunken-panel';
  sourcePanel.style.cssText =
    'flex:1;overflow:auto;background:#fff;display:none;';

  const sourcePre = document.createElement('pre');
  sourcePre.className = 'fileviewer-source';
  sourcePre.style.cssText =
    'margin:0;padding:10px;border:none;overflow:visible;width:max-content;min-width:100%;';
  sourcePre.textContent = displayContent;
  sourcePanel.appendChild(sourcePre);

  panelsBody.appendChild(previewPanel);
  panelsBody.appendChild(sourcePanel);
  panelsWrapper.appendChild(panelsBody);
  container.appendChild(panelsWrapper);

  // ── Append everything to the os-gui window ──
  $win.$content.append(container);
}
