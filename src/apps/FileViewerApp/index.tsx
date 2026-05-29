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
  view: { es: '&Vista', en: '&View' },
  preview: { es: 'Vista Previa', en: '&Preview' },
  source: { es: 'Código Fuente', en: '&Source' },
  close: { es: '&Cerrar', en: '&Close' },
  statusPreview: { es: 'Vista Previa', en: 'Preview' },
  statusSource: { es: 'Código Fuente', en: 'Source' },
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
 * fenced code blocks (with optional language), unordered/ordered lists,
 * links, images, blockquotes, horizontal rules.
 * Preserves HTML tags found in the source (img, p, hr, br, a, b, etc.).
 */
function renderMarkdown(md: string): string {
  // Normalize Windows line endings so all regex works consistently
  md = md.replace(/\r\n/g, '\n');

  // ── Step 0: Extract fenced code blocks (```...```) into placeholders ──
  // Must happen BEFORE HTML tag extraction so tags inside code blocks
  // are escaped rather than preserved.
  const codeBlockMap = new Map<string, string>();
  let codeCounter = 0;
  let processed = md.replace(
    /^```(\S*)\r?\n([\s\S]*?)\r?\n```[ \t]*/gm,
    (match, lang, code) => {
      const key = `\x00CODE_BLOCK_${codeCounter++}\x00`;
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const langClass = lang ? ` class="language-${lang}"` : '';
      codeBlockMap.set(key, `<pre><code${langClass}>${escaped}</code></pre>`);
      return key;
    },
  );

  // ── Step 1: Extract existing HTML tags into placeholders ──
  const htmlTagMap = new Map<string, string>();
  let tagCounter = 0;
  const extractHtml = processed.replace(
    /<[a-zA-Z\/][^>]*>/g,
    (match) => {
      const key = `\x00HTML_TAG_${tagCounter++}\x00`;
      htmlTagMap.set(key, match);
      return key;
    },
  );

  // ── Step 2: Escape HTML entities (safe now — tags are in placeholders) ──
  let html = extractHtml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // ── Step 3: Restore HTML tags from placeholders ──
  for (const [key, tag] of htmlTagMap) {
    html = html.replace(key, tag);
  }

  // ── Step 4: Markdown processing ──

  // Headings (must come before bold/italic to avoid ** interference)
  html = html
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)$/gm, '<hr />');

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Unordered list items
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Inline formatting
  html = html
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // ── Step 4b: Restore code blocks BEFORE paragraph wrapping ──
  // This ensures <pre><code> blocks are not wrapped in <p>
  for (const [key, htmlBlock] of codeBlockMap) {
    html = html.replace(key, htmlBlock);
  }

  // ── Step 5: Paragraph wrapping ──
  const blocks = html.split(/\n\n+/);
  const wrapped = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-3]|ul|ol|li|blockquote|hr|pre|table|div|p|img)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  // ── Step 6: Cleanup ──
  let result = wrapped
    .replace(/\n{3,}/g, '\n\n')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<\/ul>\n*<ul>/g, '')
    .replace(/<li><\/li>/g, '');

  return result;
}

// ══════════════════════════════════════════
//  Sprite helpers (same pattern as Prueba)
// ══════════════════════════════════════════

const SPRITE_VIEWS = 38;

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

// ══════════════════════════════════════════
//  Launch Function
// ══════════════════════════════════════════

/**
 * Creates a native os-gui File Viewer window with Preview/Source views.
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

  // Preview: cleaned content without date/YAML frontmatter
  const previewContent = file?.content || file?.rawContent || '';
  // Source: full raw markdown as-is (with date header, YAML frontmatter, etc.)
  const sourceContent = file?.rawContent || '';

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

  // ── Build the explorer-style layout ──
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer';

  // ══════ Toolbars container ══════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu bar toolbar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';
  menuToolbar.id = 'menu-bar-toolbar';

  const menuDragHandle = document.createElement('div');
  menuDragHandle.className = 'toolbar-drag-handle';
  menuToolbar.appendChild(menuDragHandle);

  const menu = new MenuBar({
    [tr('file') || '&File']: [
      {
        label: tr('close'),
        action: () => $win.close(),
      },
    ],
    [tr('view') || '&View']: [
      {
        label: tr('preview'),
        type: 'radio',
        checked: true,
        action: () => { switchToView('preview'); },
      },
      {
        label: tr('source'),
        type: 'radio',
        action: () => { switchToView('source'); },
      },
    ],
    '&Help': [
      {
        label: tr('aboutFileViewer'),
        action: () => alert(tr('fileViewerDesc')),
      },
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

  // View button — sprite index 38, toggles Preview/Source
  const viewBtn = createToolbarButton(tr('view'), SPRITE_VIEWS);
  stdButtons.appendChild(viewBtn);

  stdToolbar.appendChild(stdButtons);
  toolbars.appendChild(stdToolbar);

  explorer.appendChild(toolbars);

  // ══════ Content area ══════
  const content = document.createElement('div');
  content.id = 'content';
  content.className = 'inset-deep';

  // Preview panel
  const previewPanel = document.createElement('div');
  previewPanel.className = 'fileviewer-preview';
  previewPanel.innerHTML = renderMarkdown(previewContent);
  content.appendChild(previewPanel);

  // Source panel (hidden by default) — shows the FULL raw markdown as-is
  const sourcePanel = document.createElement('div');
  sourcePanel.className = 'fileviewer-source';
  const sourcePre = document.createElement('pre');
  sourcePre.textContent = sourceContent;
  sourcePanel.appendChild(sourcePre);
  content.appendChild(sourcePanel);

  explorer.appendChild(content);

  // ══════ Status Bar ══════
  const statusBar = document.createElement('div');
  statusBar.id = 'status-bar';

  const statusLeft = document.createElement('div');
  statusLeft.id = 'status-bar-left';
  statusLeft.className = 'inset-shallow';
  statusLeft.textContent = tr('statusPreview');
  statusBar.appendChild(statusLeft);

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

  // ══════ View toggle logic ══════
  let currentView: 'preview' | 'source' = 'preview';

  function switchToView(view: 'preview' | 'source'): void {
    currentView = view;
    if (view === 'preview') {
      previewPanel.style.display = 'block';
      sourcePanel.style.display = 'none';
      statusLeft.textContent = tr('statusPreview');
    } else {
      previewPanel.style.display = 'none';
      sourcePanel.style.display = 'block';
      statusLeft.textContent = tr('statusSource');
    }
  }

  viewBtn.addEventListener('click', () => {
    const next: 'preview' | 'source' = currentView === 'preview' ? 'source' : 'preview';
    switchToView(next);

    // Update menu radio state
    const menuData = (window as any).menuData;
    // Rebuild the View menu items with updated checked state
    // (os-gui MenuBar doesn't support dynamic checked state updates directly,
    //  so we toggle via the radio group behavior built into the menu)
  });
}
