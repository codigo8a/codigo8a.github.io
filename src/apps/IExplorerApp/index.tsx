import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

const PROXY_BASE = 'https://corsproxy.io/?url=';

// ── Sprite indices matching 98.js browse-ui-icons sheet (20×20 per icon) ──
const SPRITE_BACK = 0;
const SPRITE_FORWARD = 1;
const SPRITE_STOP = 2;
const SPRITE_REFRESH = 3;
const SPRITE_HOME = 4;
const SPRITE_SEARCH = 5;
const SPRITE_FAVORITES = 6;
const SPRITE_PRINT = 7;
const SPRITE_MAIL = 12;

const DROPDOWN_ARROW_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="fill:currentColor;display:inline-block;vertical-align:middle"><path style="transform:rotate(90deg);transform-origin:center" d="m5 6 4 4-4 4z"></path></svg>`;

/**
 * Placeholder React component — IExplorerApp uses os-gui natively.
 */
export const IExplorerApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

// ── Helper: ensure disabled-inset SVG filter exists ──
function ensureDisabledFilter(): void {
  if (document.getElementById('iexplorer-disabled-filter')) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'iexplorer-disabled-filter';
  svg.setAttribute('style', 'position: absolute; pointer-events: none; bottom: 100%;');
  svg.innerHTML = `
    <defs>
      <filter id="ie-disabled-inset-filter" x="0" y="0" width="1px" height="1px">
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

// ── DOM helpers ──
function createSpriteIcon(spriteIndex: number): HTMLDivElement {
  const div = document.createElement('div');
  div.className = 'icon';
  div.style.backgroundPosition = `-${spriteIndex * 20}px 0px`;
  return div;
}

function createToolbarBtn(
  label: string,
  spriteIndex: number,
  disabled: boolean = false,
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'toolbar-button lightweight';
  if (disabled) btn.disabled = true;
  btn.appendChild(createSpriteIcon(spriteIndex));
  const span = document.createElement('span');
  span.className = 'label-text';
  span.textContent = label;
  btn.appendChild(span);
  return btn;
}

function createCompoundBtn(
  label: string,
  spriteIndex: number,
  mainAction: () => void,
  dropdownAction: () => void,
  disabled: boolean = false,
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'toolbar-compound-button-wrapper';
  const mainBtn = createToolbarBtn(label, spriteIndex, disabled);
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

// ── Launch ──
export function launchIExplorer(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;
  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded.');
    return;
  }

  ensureDisabledFilter();

  // ── State ──
  let currentUrl = 'https://masinfo.online/';
  let isLoading = false;
  let hasError = false;
  let useProxy = false;
  let loadTimeout: number | null = null;
  let checkTimeout: number | null = null;

  // ── History stacks (for Back/Forward) ──
  const backStack: string[] = [];
  const forwardStack: string[] = [];

  // ── DOM refs ──
  let iframeEl: HTMLIFrameElement | null = null;
  let urlInput: HTMLInputElement | null = null;
  let statusLeftEl: HTMLDivElement | null = null;
  let statusRightEl: HTMLDivElement | null = null;
  let loadingDiv: HTMLDivElement | null = null;
  let loadingTextEl: HTMLDivElement | null = null;
  let errorDiv: HTMLDivElement | null = null;
  let errorMsgEl: HTMLParagraphElement | null = null;
  let errorUrlEl: HTMLParagraphElement | null = null;
  let errorActionsEl: HTMLDivElement | null = null;
  let proxyBanner: HTMLDivElement | null = null;
  let proxyBtnEl: HTMLButtonElement | null = null;
  let statusBarEl: HTMLDivElement | null = null;

  // Toolbar button refs for enabling/disabling
  let backBtn: HTMLButtonElement | null = null;
  let backDropBtn: HTMLButtonElement | null = null;
  let forwardBtn: HTMLButtonElement | null = null;
  let forwardDropBtn: HTMLButtonElement | null = null;
  let stopBtn: HTMLButtonElement | null = null;
  let refreshBtn: HTMLButtonElement | null = null;
  let homeBtn: HTMLButtonElement | null = null;

  function buildSrc(targetUrl: string, proxy: boolean): string {
    if (!proxy) return targetUrl;
    return `${PROXY_BASE}${encodeURIComponent(targetUrl)}`;
  }

  function clearTimeouts(): void {
    if (loadTimeout !== null) { clearTimeout(loadTimeout); loadTimeout = null; }
    if (checkTimeout !== null) { clearTimeout(checkTimeout); checkTimeout = null; }
  }

  function updateUi(): void {
    if (loadingDiv) loadingDiv.style.display = (isLoading && !hasError) ? '' : 'none';
    if (loadingTextEl) loadingTextEl.textContent = useProxy ? 'Loading via proxy...' : 'Loading...';
    if (errorDiv) errorDiv.style.display = hasError ? '' : 'none';
    if (iframeEl) iframeEl.style.display = hasError ? 'none' : '';
    if (proxyBanner) proxyBanner.style.display = useProxy ? '' : 'none';
    if (proxyBtnEl) {
      proxyBtnEl.classList.toggle('active', useProxy);
      proxyBtnEl.title = useProxy ? 'Proxy ON — click to disable' : 'Proxy OFF — click to enable';
    }
    if (statusLeftEl) {
      if (hasError) statusLeftEl.textContent = 'Error loading page';
      else if (isLoading) statusLeftEl.textContent = 'Transferring data...';
      else if (useProxy) statusLeftEl.textContent = 'Proxy active';
      else statusLeftEl.textContent = 'Done';
    }
    if (statusRightEl) {
      if (hasError) statusRightEl.textContent = '⚠ Error';
      else if (useProxy) statusRightEl.textContent = '⚡ Proxy';
      else statusRightEl.textContent = '🔒 Internet';
    }
    if (hasError && errorMsgEl && errorUrlEl && errorActionsEl) {
      errorMsgEl.textContent = useProxy
        ? 'The proxy could not load this website. The site may be down, blocked by the proxy service, or the URL is invalid.'
        : 'This website has security restrictions (X-Frame-Options) that prevent it from loading inside an embedded browser.';
      errorUrlEl.innerHTML = `<strong>URL:</strong> <code style="background:#eee;padding:2px 4px">${currentUrl}</code>`;
      errorActionsEl.innerHTML = '';
      if (!useProxy) {
        const tryProxy = document.createElement('button');
        tryProxy.className = 'lightweight';
        tryProxy.textContent = '🔁 Try via Proxy';
        tryProxy.addEventListener('click', toggleProxy);
        errorActionsEl.appendChild(tryProxy);
      }
      const newTab = document.createElement('button');
      newTab.className = 'lightweight';
      newTab.textContent = 'Open in New Tab';
      newTab.addEventListener('click', () => window.open(currentUrl, '_blank'));
      errorActionsEl.appendChild(newTab);
    }
  }

  function updateNavButtons(): void {
    const canBack = backStack.length > 0;
    const canForward = forwardStack.length > 0;
    if (backBtn) backBtn.disabled = !canBack;
    if (backDropBtn) backDropBtn.disabled = !canBack;
    if (forwardBtn) forwardBtn.disabled = !canForward;
    if (forwardDropBtn) forwardDropBtn.disabled = !canForward;
  }

  function navigate(targetUrl: string, historyAction: 'go' | 'back' | 'forward' | 'init' = 'go'): void {
    clearTimeouts();
    if (historyAction === 'go') {
      if (currentUrl && currentUrl !== targetUrl) {
        backStack.push(currentUrl);
        forwardStack.length = 0;
      }
    } else if (historyAction === 'back') {
      forwardStack.push(currentUrl);
    } else if (historyAction === 'forward') {
      backStack.push(currentUrl);
    }
    currentUrl = targetUrl;
    isLoading = true;
    hasError = false;
    updateUi();
    updateNavButtons();

    if (urlInput) urlInput.value = targetUrl;
    if (iframeEl) iframeEl.src = buildSrc(targetUrl, useProxy);

    if (!useProxy) {
      checkTimeout = window.setTimeout(() => {
        try {
          if (iframeEl && iframeEl.contentWindow) {
            const loc = iframeEl.contentWindow.location;
            if (loc.href === 'about:blank' || loc.href === '') {
              clearTimeouts();
              isLoading = false;
              hasError = true;
              updateUi();
            }
          }
        } catch (_e) { /* cross-origin means page loaded */ }
      }, 1500);
    }
    loadTimeout = window.setTimeout(() => {
      isLoading = false;
      if (!hasError) { hasError = true; updateUi(); }
    }, useProxy ? 8000 : 3000);
  }

  function handleNavigate(): void {
    if (!urlInput) return;
    let target = urlInput.value.trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
    navigate(target, 'go');
  }

  function handleLoad(): void {
    clearTimeouts();
    isLoading = false;
    try {
      if (iframeEl && iframeEl.contentWindow) {
        const loc = iframeEl.contentWindow.location;
        hasError = loc.href === 'about:blank';
      }
    } catch (_e) { hasError = false; }
    updateUi();
    updateNavButtons();
  }

  function handleError(): void {
    isLoading = false;
    hasError = true;
    updateUi();
  }

  function goBack(): void {
    if (backStack.length === 0) return;
    navigate(backStack.pop()!, 'back');
  }

  function goForward(): void {
    if (forwardStack.length === 0) return;
    navigate(forwardStack.pop()!, 'forward');
  }

  function goHome(): void {
    const home = 'https://masinfo.online/';
    navigate(home, 'go');
  }

  function goRefresh(): void {
    navigate(currentUrl, 'init');
  }

  function stopLoading(): void {
    clearTimeouts();
    isLoading = false;
    if (iframeEl) {
      try { iframeEl.src = 'about:blank'; } catch (_e) { /* no-op */ }
    }
    updateUi();
  }

  function toggleProxy(): void {
    useProxy = !useProxy;
    navigate(currentUrl, 'init');
  }

  // ── Create window ──
  const $win = $Window({
    title: 'Internet Explorer',
    icons: { 16: '/app/icons/iexplorer-16x16.png', 32: '/app/icons/iexplorer-32x32.png' },
    minWidth: 600,
    minHeight: 400,
  });
  $win.css({ width: '900px', height: '650px' });
  $win.center();
  registerOsWindow($win, 'iexplorer', 'Internet Explorer', '/app/icons/iexplorer-32x32.png');

  // ── Root container ──
  const explorer = document.createElement('div');
  explorer.className = 'os-explorer iexplorer-container';

  // ═══════════════════════════════════════
  // TOOLBARS
  // ═══════════════════════════════════════
  const toolbars = document.createElement('div');
  toolbars.className = 'toolbars';

  // ── Menu Bar ──
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';

  const menu = new MenuBar({
    '&File': [
      {
        label: '&New',
        submenu: [
          { label: '&Window', action: () => launchIExplorer() },
          { label: '&Message', action: () => showMessageBox({ title: 'Internet Explorer', message: 'No mail client configured.', icon: 'info' }) },
          { label: '&Post', enabled: false },
          { label: '&Contact', enabled: false },
          { separator: true },
          { label: '&Internet Call', enabled: false },
        ],
      },
      {
        label: '&Open...',
        action: () => {
          const url = prompt('Enter URL to open:', currentUrl);
          if (url) navigate(url, 'go');
        },
      },
      {
        label: '&Edit',
        shortcutLabel: 'Ctrl+E',
        action: () => {
          if (urlInput) { urlInput.focus(); urlInput.select(); }
        },
      },
      {
        label: '&Save As...',
        shortcutLabel: 'Ctrl+S',
        enabled: false,
      },
      { separator: true },
      {
        label: '&Page Setup...',
        enabled: false,
      },
      {
        label: '&Print',
        shortcutLabel: 'Ctrl+P',
        action: () => {
          try { if (iframeEl?.contentWindow) iframeEl.contentWindow.print(); }
          catch (_e) { showMessageBox({ title: 'Internet Explorer', message: 'Print is not available for this page.', icon: 'warning' }); }
        },
      },
      { separator: true },
      {
        label: '&Work Offline',
        checkbox: {
          check: () => true,
          toggle: () => {},
        },
      },
      { separator: true },
      {
        label: '&Close',
        action: () => $win.close(),
      },
    ],
    '&Edit': [
      {
        label: '&Select All',
        shortcutLabel: 'Ctrl+A',
        action: () => {
          try { if (iframeEl?.contentWindow?.getSelection) iframeEl.contentWindow.getSelection()?.selectAllChildren(iframeEl.contentDocument?.body!); }
          catch (_e) { /* cross-origin */ }
        },
      },
      { separator: true },
      {
        label: '&Find (on This Page)...',
        shortcutLabel: 'Ctrl+F',
        enabled: false,
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
              const el = document.getElementById('standard-buttons-toolbar');
              if (el) {
                el.style.display = el.style.display === 'none' ? '' : 'none';
              }
            },
          },
          {
            label: '&Address Bar',
            checked: true,
            action: () => {
              const el = document.getElementById('address-bar-toolbar');
              if (el) {
                el.style.display = el.style.display === 'none' ? '' : 'none';
              }
            },
          },
        ],
      },
      {
        label: 'Status &Bar',
        checked: true,
        action: () => {
          const el = document.getElementById('status-bar');
          if (el) {
            el.style.display = el.style.display === 'none' ? '' : 'none';
          }
        },
      },
      { separator: true },
      {
        label: '&Stop',
        shortcutLabel: 'Esc',
        action: stopLoading,
      },
      {
        label: '&Refresh',
        shortcutLabel: 'F5',
        action: goRefresh,
      },
      { separator: true },
      {
        label: '&Source',
        action: () => {
          try {
            const doc = iframeEl?.contentDocument;
            if (doc) {
              const w = window.open('', '_blank');
              if (w) {
                w.document.write(`<pre>${doc.documentElement.outerHTML.replace(/</g, '&lt;')}</pre>`);
                w.document.close();
              }
            }
          } catch (_e) { showMessageBox({ title: 'Internet Explorer', message: 'Cannot view source for cross-origin pages.', icon: 'warning' }); }
        },
      },
      {
        label: '&Full Screen',
        shortcutLabel: 'F11',
        action: () => {
          try { document.body.requestFullscreen?.(); } catch (_e) { /* no-op */ }
        },
      },
    ],
    '&Go': [
      {
        label: '&Back',
        shortcutLabel: 'Alt+←',
        action: goBack,
      },
      {
        label: '&Forward',
        shortcutLabel: 'Alt+→',
        action: goForward,
      },
      { separator: true },
      {
        label: '&Home Page',
        shortcutLabel: 'Alt+Home',
        action: goHome,
      },
    ],
    'F&avorites': [
      {
        label: '&Add to Favorites...',
        action: () => showMessageBox({ title: 'Internet Explorer', message: 'Add to Favorites is not supported.', icon: 'info' }),
      },
      {
        label: '&Organize Favorites...',
        enabled: false,
      },
      { separator: true },
      {
        label: '(Empty)',
        enabled: false,
      },
    ],
    '&Tools': [
      {
        label: '&Internet Options...',
        action: () => {
          // Open Settings app as a proxy for Internet Options
          window.dispatchEvent(
            new CustomEvent('desktop-open-app', { detail: { appId: 'settings' } }),
          );
        },
      },
    ],
    '&Help': [
      {
        label: '&About Internet Explorer',
        action: () => {
          showMessageBox({ title: 'About Internet Explorer', message: 'Internet Explorer\n\nEmbedded web browser with CORS proxy support.\n\nVersion 5.0\n© 2024-2026 Código 8A', icon: 'info' })
        },
      },
    ],
  });

  menuToolbar.appendChild(menu.element);
  toolbars.appendChild(menuToolbar);

  // ── Standard Buttons toolbar ──
  const stdToolbar = document.createElement('div');
  stdToolbar.className = 'toolbar';
  stdToolbar.id = 'standard-buttons-toolbar';

  const stdDrag = document.createElement('div');
  stdDrag.className = 'toolbar-drag-handle';
  stdToolbar.appendChild(stdDrag);

  const stdButtons = document.createElement('div');
  stdButtons.id = 'standard-buttons';

  // Back (compound)
  const backWrapper = createCompoundBtn('Back', SPRITE_BACK, goBack, () => {}, true);
  backBtn = backWrapper.querySelector('.toolbar-button') as HTMLButtonElement;
  backDropBtn = backWrapper.querySelector('.toolbar-dropdown-button') as HTMLButtonElement;
  stdButtons.appendChild(backWrapper);

  // Forward (compound)
  const fwdWrapper = createCompoundBtn('Forward', SPRITE_FORWARD, goForward, () => {}, true);
  forwardBtn = fwdWrapper.querySelector('.toolbar-button') as HTMLButtonElement;
  forwardDropBtn = fwdWrapper.querySelector('.toolbar-dropdown-button') as HTMLButtonElement;
  stdButtons.appendChild(fwdWrapper);

  stdButtons.appendChild(createSeparator());

  // Stop
  stopBtn = createToolbarBtn('Stop', SPRITE_STOP);
  stopBtn.addEventListener('click', stopLoading);
  stdButtons.appendChild(stopBtn);

  // Refresh
  refreshBtn = createToolbarBtn('Refresh', SPRITE_REFRESH);
  refreshBtn.addEventListener('click', goRefresh);
  stdButtons.appendChild(refreshBtn);

  // Home
  homeBtn = createToolbarBtn('Home', SPRITE_HOME);
  homeBtn.addEventListener('click', goHome);
  stdButtons.appendChild(homeBtn);

  stdButtons.appendChild(createSeparator());

  // Search
  const searchBtn = createToolbarBtn('Search', SPRITE_SEARCH);
  searchBtn.addEventListener('click', () => {
    navigate('https://www.google.com/webhp?igu=1', 'go');
  });
  stdButtons.appendChild(searchBtn);

  // Favorites
  const favBtn = createToolbarBtn('Favorites', SPRITE_FAVORITES);
  favBtn.addEventListener('click', () => showMessageBox({ title: 'Internet Explorer', message: 'Favorites not supported.', icon: 'info' }));
  stdButtons.appendChild(favBtn);

  // History — uses sprite 12 from browse-ui-icons
  const histBtn = createToolbarBtn('History', 12);
  histBtn.addEventListener('click', () => showMessageBox({ title: 'Internet Explorer', message: 'History not supported.', icon: 'info' }));
  stdButtons.appendChild(histBtn);

  stdButtons.appendChild(createSeparator());

  // Print
  const printBtn = createToolbarBtn('Print', SPRITE_PRINT);
  printBtn.addEventListener('click', () => {
    try { if (iframeEl?.contentWindow) iframeEl.contentWindow.print(); }
    catch (_e) { showMessageBox({ title: 'Internet Explorer', message: 'Print is not available for this page.', icon: 'warning' }); }
  });
  stdButtons.appendChild(printBtn);

  // Proxy toggle button (custom, not in IE but useful)
  stdButtons.appendChild(createSeparator());
  proxyBtnEl = document.createElement('button');
  proxyBtnEl.className = 'toolbar-button lightweight';
  proxyBtnEl.title = 'Proxy OFF — click to enable';
  const proxyIcon = document.createElement('div');
  proxyIcon.className = 'icon';
  proxyIcon.style.cssText = 'display:flex;align-items:center;justify-content:center;width:20px;height:20px;position:absolute;top:2px;';
  proxyIcon.innerHTML = `<svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="8" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1" fill="none"/><path d="M7 8V5a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="13" r="1.5" fill="currentColor"/></svg>`;
  proxyBtnEl.appendChild(proxyIcon);
  const proxyLabel = document.createElement('span');
  proxyLabel.className = 'label-text';
  proxyLabel.textContent = 'Proxy';
  proxyBtnEl.appendChild(proxyLabel);
  proxyBtnEl.addEventListener('click', toggleProxy);
  stdButtons.appendChild(proxyBtnEl);

  stdToolbar.appendChild(stdButtons);
  toolbars.appendChild(stdToolbar);

  // ── Address bar toolbar ──
  const addrToolbar = document.createElement('div');
  addrToolbar.className = 'toolbar';
  addrToolbar.id = 'address-bar-toolbar';

  const addrDrag = document.createElement('div');
  addrDrag.className = 'toolbar-drag-handle';
  addrToolbar.appendChild(addrDrag);

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
  addrIcon.src = '/app/icons/html-16x16.png';
  addrIcon.alt = '';
  compoundInput.appendChild(addrIcon);

  urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.id = 'address';
  urlInput.value = currentUrl;
  urlInput.autocomplete = 'off';
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleNavigate();
  });
  compoundInput.appendChild(urlInput);

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

  // ── Proxy Banner ──
  proxyBanner = document.createElement('div');
  proxyBanner.className = 'ie-proxy-banner';
  proxyBanner.textContent = '⚡ Proxy mode enabled — some sites may load slower or look different';
  proxyBanner.style.display = 'none';
  explorer.appendChild(proxyBanner);

  // ═══════════════════════════════════════
  // CONTENT AREA
  // ═══════════════════════════════════════
  const contentEl = document.createElement('div');
  contentEl.id = 'content';
  contentEl.className = 'inset-deep';
  contentEl.style.position = 'relative';

  // Iframe
  iframeEl = document.createElement('iframe');
  iframeEl.className = 'ie-iframe';
  iframeEl.title = 'Internet Explorer';
  iframeEl.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
  iframeEl.src = buildSrc(currentUrl, useProxy);
  iframeEl.addEventListener('load', handleLoad);
  iframeEl.addEventListener('error', handleError);
  contentEl.appendChild(iframeEl);

  // Loading overlay
  loadingDiv = document.createElement('div');
  loadingDiv.className = 'ie-loading';
  loadingDiv.style.display = 'none';
  loadingTextEl = document.createElement('div');
  loadingTextEl.className = 'ie-loading-text';
  loadingTextEl.textContent = 'Loading...';
  loadingDiv.appendChild(loadingTextEl);
  contentEl.appendChild(loadingDiv);

  // Error overlay
  errorDiv = document.createElement('div');
  errorDiv.className = 'ie-error';
  errorDiv.style.display = 'none';
  const errIcon = document.createElement('div');
  errIcon.className = 'ie-error-icon';
  errIcon.textContent = '⚠️';
  errorDiv.appendChild(errIcon);
  const errTitle = document.createElement('h3');
  errTitle.textContent = 'Website cannot be displayed';
  errorDiv.appendChild(errTitle);
  errorMsgEl = document.createElement('p');
  errorDiv.appendChild(errorMsgEl);
  errorUrlEl = document.createElement('p');
  errorDiv.appendChild(errorUrlEl);
  errorActionsEl = document.createElement('div');
  errorActionsEl.className = 'ie-error-actions';
  errorDiv.appendChild(errorActionsEl);
  contentEl.appendChild(errorDiv);

  explorer.appendChild(contentEl);

  // ═══════════════════════════════════════
  // STATUS BAR
  // ═══════════════════════════════════════
  statusBarEl = document.createElement('div');
  statusBarEl.id = 'status-bar';

  statusLeftEl = document.createElement('div');
  statusLeftEl.id = 'status-bar-left';
  statusLeftEl.className = 'inset-shallow';
  statusLeftEl.textContent = 'Done';
  statusBarEl.appendChild(statusLeftEl);

  const statusMiddleEl = document.createElement('div');
  statusMiddleEl.id = 'status-bar-middle';
  statusMiddleEl.className = 'inset-shallow';
  statusBarEl.appendChild(statusMiddleEl);

  statusRightEl = document.createElement('div');
  statusRightEl.id = 'status-bar-right';
  statusRightEl.className = 'inset-shallow';
  statusRightEl.textContent = '🔒 Internet';
  statusBarEl.appendChild(statusRightEl);

  explorer.appendChild(statusBarEl);

  // ── Append to window ──
  $win.$content.append(explorer);

  // ── Initial navigation ──
  navigate(currentUrl, 'init');
}
