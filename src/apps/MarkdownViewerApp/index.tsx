import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

/**
 * Placeholder React component — MarkdownViewerApp uses os-gui natively via launchFileViewer().
 * This component is never rendered through the React window system.
 */
export const MarkdownViewerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ══════════════════════════════════════════
//  Translations
// ══════════════════════════════════════════

const TRANSLATIONS: Record<string, { es: string; en: string }> = {
  view: { es: '&Vista', en: '&View' },
  viewsButton: { es: 'Vistas', en: 'Views' },
  preview: { es: 'Vista Previa', en: '&Preview' },
  source: { es: 'Código Fuente', en: '&Source' },
  close: { es: '&Cerrar', en: '&Close' },
  statusPreview: { es: 'Vista Previa', en: 'Preview' },
  statusSource: { es: 'Código Fuente', en: 'Source' },
  aboutMarkdownViewer: { es: 'Acerca de Visor Markdown', en: 'About Markdown Viewer' },
  markdownViewerDesc: {
    es: 'Visor Markdown\n\nUn visor de documentos markdown.\nBasado en Windows 98.',
    en: 'Markdown Viewer\n\nA markdown document viewer.\nBased on Windows 98.',
  },
  markdownViewerTitle: { es: 'Visor Markdown', en: 'Markdown Viewer' },
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
//  Markdown → HTML via react-markdown
// ══════════════════════════════════════════

/**
 * Renders markdown content to HTML using react-markdown + rehype-raw.
 * Supports: headings, paragraphs, bold, italic, inline code, fenced code
 * blocks with language tags, lists, links, images, blockquotes, HTML in
 * markdown, and more.
 */
function renderHtml(md: string): string {
  // Normalize CRLF → LF so markdown line-break rules work consistently
  const normalized = md.replace(/\r\n/g, '\n');
  return renderToString(
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{normalized}</ReactMarkdown>,
  );
}

// ══════════════════════════════════════════
//  Sprite helpers (same pattern as Prueba / FileExplorerApp)
// ══════════════════════════════════════════

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

// ══════════════════════════════════════════
//  Launch Function
// ══════════════════════════════════════════

/**
 * Creates a native os-gui Markdown Viewer window with Preview/Source views.
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
  const title = appData?.title || file?.name || tr('markdownViewerTitle');

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
  registerOsWindow($win, 'markdownViewer', title, '/app/icons/file-viewer.svg');

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
        label: tr('aboutMarkdownViewer'),
        action: () => showMessageBox({ title: tr('aboutMarkdownViewer'), message: tr('markdownViewerDesc'), icon: 'info' }),
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

  // View compound button — sprite index 38, main click toggles, dropdown opens menu
  let currentView: 'preview' | 'source' = 'preview';

  const viewCompound = createCompoundButton(
    tr('viewsButton'),
    SPRITE_VIEWS,
    () => {
      const next: 'preview' | 'source' = currentView === 'preview' ? 'source' : 'preview';
      switchToView(next);
    },
    (event) => openViewDropdown(event),
  );
  stdButtons.appendChild(viewCompound);

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
  addrLabel.textContent = 'Address';
  addrBar.appendChild(addrLabel);

  const compoundInput = document.createElement('div');
  compoundInput.id = 'address-compound-input';
  compoundInput.className = 'inset-deep';

  const addrIcon = document.createElement('img');
  addrIcon.id = 'address-icon';
  addrIcon.width = 16;
  addrIcon.height = 16;
  addrIcon.src = '/app/icons/file-viewer.svg';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  const addressInput = document.createElement('input');
  addressInput.type = 'text';
  addressInput.id = 'address';
  const displayPath = file ? `${file.folder}\\${file.name}` : '';
  addressInput.value = displayPath;
  addressInput.readOnly = true;
  addressInput.autocomplete = 'off';
  compoundInput.appendChild(addressInput);

  addrBar.appendChild(compoundInput);
  addrToolbar.appendChild(addrBar);
  toolbars.appendChild(addrToolbar);

  explorer.appendChild(toolbars);

  // ══════ Content area ══════
  const content = document.createElement('div');
  content.id = 'content';
  content.className = 'inset-deep';

  // Preview panel
  const previewPanel = document.createElement('div');
  previewPanel.className = 'mdviewer-preview';
  previewPanel.innerHTML = renderHtml(previewContent);
  content.appendChild(previewPanel);

  // Source panel (hidden by default) — shows the FULL raw markdown as-is
  const sourcePanel = document.createElement('div');
  sourcePanel.className = 'mdviewer-source';
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
  // Bring the new window to front and focus it (belt + suspenders on top of the nested RAF
  // in Window.js constructor, since focus events during RAF may re-bring source window)
  $win.focus();

  // ══════ View toggle logic ══════

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

  /**
   * Opens the View dropdown menu using a temporary MenuBar.
   */
  function openViewDropdown(event: Event): void {
    const dropBtn = event.currentTarget as HTMLElement;
    const wrapper = dropBtn.closest('.toolbar-compound-button-wrapper') as HTMLElement;
    const rect = wrapper.getBoundingClientRect();

    const dummyMenuBar = new MenuBar({
      "View": [
        {
          label: tr('preview'),
          type: 'radio',
          checked: currentView === 'preview',
          action: () => {
            switchToView('preview');
            cleanup();
          },
        },
        {
          label: tr('source'),
          type: 'radio',
          checked: currentView === 'source',
          action: () => {
            switchToView('source');
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
}
