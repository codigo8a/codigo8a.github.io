import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';

const PROXY_BASE = 'https://corsproxy.io/?url=';

/**
 * Placeholder React component - Netscape uses os-gui natively.
 * This component is never rendered via the React window system.
 */
export const NetscapeApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

/**
 * Build the iframe src URL with optional CORS proxy.
 */
function buildSrc(targetUrl: string, proxy: boolean): string {
  if (!proxy) return targetUrl;
  return `${PROXY_BASE}${encodeURIComponent(targetUrl)}`;
}

/**
 * Launch a Netscape Navigator browser window using os-gui native windowing.
 * Creates a full Win98-style browser with menu bar, toolbar, address bar,
 * iframe content area, loading indicator, error handling, and status bar.
 */
export function launchNetscape(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // ──────────────────────────────────────
  //  State
  // ──────────────────────────────────────
  let currentUrl = 'https://masinfo.online/';
  let isLoading = false;
  let hasError = false;
  let useProxy = false;
  let loadTimeout: number | null = null;
  let checkTimeout: number | null = null;

  // ──────────────────────────────────────
  //  DOM refs (populated during build)
  // ──────────────────────────────────────
  let iframeEl: HTMLIFrameElement | null = null;
  let urlInput: HTMLInputElement | null = null;
  let statusField: HTMLDivElement | null = null;
  let secStatusSpan: HTMLSpanElement | null = null;
  let loadingDiv: HTMLDivElement | null = null;
  let loadingTextEl: HTMLDivElement | null = null;
  let errorDiv: HTMLDivElement | null = null;
  let errorMsgEl: HTMLParagraphElement | null = null;
  let errorUrlEl: HTMLParagraphElement | null = null;
  let errorActionsEl: HTMLDivElement | null = null;
  let proxyBanner: HTMLDivElement | null = null;
  let proxyBtnEl: HTMLButtonElement | null = null;

  // ──────────────────────────────────────
  //  Helper functions
  // ──────────────────────────────────────
  function clearTimeouts(): void {
    if (loadTimeout !== null) { clearTimeout(loadTimeout); loadTimeout = null; }
    if (checkTimeout !== null) { clearTimeout(checkTimeout); checkTimeout = null; }
  }

  function updateUi(): void {
    // Loading overlay
    if (loadingDiv) {
      loadingDiv.style.display = (isLoading && !hasError) ? '' : 'none';
    }
    if (loadingTextEl) {
      loadingTextEl.textContent = useProxy ? 'Loading via proxy...' : 'Loading...';
    }

    // Error overlay
    if (errorDiv) {
      errorDiv.style.display = hasError ? '' : 'none';
    }

    // Iframe visibility
    if (iframeEl) {
      iframeEl.style.display = hasError ? 'none' : '';
    }

    // Proxy banner
    if (proxyBanner) {
      proxyBanner.style.display = useProxy ? '' : 'none';
    }

    // Proxy button state
    if (proxyBtnEl) {
      proxyBtnEl.classList.toggle('active', useProxy);
      proxyBtnEl.title = useProxy
        ? 'Proxy ON \u2014 click to disable'
        : 'Proxy OFF \u2014 click to enable';
    }

    // Status bar text
    if (statusField) {
      if (hasError) {
        statusField.textContent = 'Error loading page';
      } else if (isLoading) {
        statusField.textContent = 'Transferring data...';
      } else if (useProxy) {
        statusField.textContent = 'Proxy active';
      } else {
        statusField.textContent = 'Done';
      }
    }

    // Security / connection status
    if (secStatusSpan) {
      if (hasError) {
        secStatusSpan.textContent = '\u274C Error';
        secStatusSpan.className = 'netscape-security error';
      } else if (useProxy) {
        secStatusSpan.textContent = '\u26A0\uFE0F Proxy';
        secStatusSpan.className = 'netscape-security';
      } else {
        secStatusSpan.textContent = '\uD83D\uDD12 Direct';
        secStatusSpan.className = 'netscape-security';
      }
    }

    // Error content
    if (hasError && errorMsgEl && errorUrlEl && errorActionsEl) {
      errorMsgEl.textContent = useProxy
        ? 'The proxy could not load this website. The site may be down, blocked by the proxy service, or the URL is invalid.'
        : 'This website has security restrictions (X-Frame-Options) that prevent it from loading inside an embedded browser.';
      errorUrlEl.innerHTML = `<strong>URL:</strong> <code style="background:#eee;padding:2px 4px">${currentUrl}</code>`;

      // Rebuild action buttons
      errorActionsEl.innerHTML = '';
      if (!useProxy) {
        const tryProxyBtn = document.createElement('button');
        tryProxyBtn.className = 'lightweight';
        tryProxyBtn.textContent = '\uD83D\uDD01 Try via Proxy';
        tryProxyBtn.addEventListener('click', toggleProxy);
        errorActionsEl.appendChild(tryProxyBtn);
      }
      const newTabBtn = document.createElement('button');
      newTabBtn.className = 'lightweight';
      newTabBtn.textContent = 'Open in New Tab';
      newTabBtn.addEventListener('click', () => openInNewTab());
      errorActionsEl.appendChild(newTabBtn);
    }
  }

  function navigate(targetUrl: string, proxy: boolean): void {
    clearTimeouts();
    currentUrl = targetUrl;
    isLoading = true;
    hasError = false;
    updateUi();

    if (iframeEl) {
      iframeEl.src = buildSrc(targetUrl, proxy);
    }

    // Non-proxy: check after 1.5s if the iframe is blocked (about:blank)
    if (!proxy) {
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
        } catch (_e) {
          // Cross-origin exception means the page loaded (good)
        }
      }, 1500);
    }

    // Timeout: page must load within this window (proxy is slower)
    loadTimeout = window.setTimeout(() => {
      isLoading = false;
      hasError = true;
      updateUi();
    }, proxy ? 8000 : 3000);
  }

  function handleNavigate(): void {
    if (!urlInput) return;
    let targetUrl = urlInput.value.trim();
    if (!targetUrl) return;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }
    navigate(targetUrl, useProxy);
  }

  function handleLoad(): void {
    clearTimeouts();
    isLoading = false;
    try {
      if (iframeEl && iframeEl.contentWindow) {
        const loc = iframeEl.contentWindow.location;
        if (loc.href === 'about:blank') {
          hasError = true;
        } else {
          hasError = false;
        }
      }
    } catch (_e) {
      // Cross-origin = page loaded successfully
      hasError = false;
    }
    updateUi();
  }

  function handleError(): void {
    isLoading = false;
    hasError = true;
    updateUi();
  }

  function handleBack(): void {
    if (iframeEl && iframeEl.contentWindow) {
      try {
        iframeEl.contentWindow.history.back();
      } catch (_e) { /* cross-origin: no-op */ }
    }
  }

  function handleForward(): void {
    if (iframeEl && iframeEl.contentWindow) {
      try {
        iframeEl.contentWindow.history.forward();
      } catch (_e) { /* cross-origin: no-op */ }
    }
  }

  function handleHome(): void {
    const homeUrl = 'https://masinfo.online/';
    if (urlInput) urlInput.value = homeUrl;
    navigate(homeUrl, useProxy);
  }

  function handleReload(): void {
    if (iframeEl) {
      isLoading = true;
      hasError = false;
      updateUi();
      iframeEl.src = buildSrc(currentUrl, useProxy);
    }
  }

  function toggleProxy(): void {
    useProxy = !useProxy;
    navigate(currentUrl, useProxy);
  }

  function stopLoading(): void {
    clearTimeouts();
    isLoading = false;
    if (iframeEl) {
      try {
        iframeEl.src = 'about:blank';
      } catch (_e) { /* no-op */ }
    }
    updateUi();
  }

  function openInNewTab(): void {
    window.open(currentUrl, '_blank');
  }

  function showAbout(): void {
    alert(
      'Netscape Navigator 4.08\n' +
      'Based on os-gui and 98.css\n' +
      '\n' +
      'Embedded browser with CORS proxy support.\n' +
      '\u00A9 2024-2026 C\u00F3digo 8A',
    );
  }

  // ──────────────────────────────────────
  //  Create the os-gui window
  // ──────────────────────────────────────
  const $win = $Window({
    title: 'Netscape Navigator',
    icons: {
      16: '/app/icons/browser.svg',
      any: '/app/icons/browser.svg',
    },
    minWidth: 600,
    minHeight: 400,
  });

  $win.css({
    width: '900px',
    height: '600px',
  });
  $win.center();
  registerOsWindow($win, 'netscape', 'Netscape Navigator', '/app/icons/browser.svg');

  // ──────────────────────────────────────
  //  Menu bar
  // ──────────────────────────────────────
  const menu = new MenuBar({
    '&File': [
      { label: 'E&xit', action: () => $win.close() },
    ],
    '&View': [
      { label: '&Stop', action: stopLoading },
      { label: '&Reload', action: handleReload },
    ],
    '&Help': [
      { label: '&About Netscape Navigator', action: showAbout },
    ],
  });
  $win.$titlebar.after(menu.element);

  // ──────────────────────────────────────
  //  Build the browser UI
  // ──────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'netscape-container';

  // ── Toolbar ──
  const toolbar = document.createElement('div');
  toolbar.className = 'netscape-toolbar';

  const btnGroup = document.createElement('div');
  btnGroup.className = 'netscape-toolbar-buttons';

  function makeToolBtn(
    text: string,
    title: string,
    onClick: () => void,
    extraClass?: string,
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = extraClass ? `lightweight ${extraClass}` : 'lightweight';
    btn.textContent = text;
    btn.title = title;
    btn.addEventListener('click', onClick);
    return btn;
  }

  btnGroup.appendChild(makeToolBtn('\u2190', 'Back', handleBack));
  btnGroup.appendChild(makeToolBtn('\u2192', 'Forward', handleForward));
  btnGroup.appendChild(makeToolBtn('\u21BB', 'Reload', handleReload));
  btnGroup.appendChild(makeToolBtn('\uD83C\uDFE0', 'Home', handleHome));

  proxyBtnEl = makeToolBtn(
    '\uD83D\uDD01',
    'Proxy OFF \u2014 click to enable',
    toggleProxy,
  );
  btnGroup.appendChild(proxyBtnEl);

  toolbar.appendChild(btnGroup);

  // ── Address bar (form) ──
  const addrForm = document.createElement('form');
  addrForm.className = 'netscape-address-bar';
  addrForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleNavigate();
  });

  const addrLabel = document.createElement('label');
  addrLabel.className = 'netscape-address-label';
  addrLabel.textContent = 'Location:';
  addrForm.appendChild(addrLabel);

  urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.className = 'netscape-address-input';
  urlInput.value = 'https://masinfo.online/';
  urlInput.placeholder = 'Enter URL...';
  addrForm.appendChild(urlInput);

  const goBtn = document.createElement('button');
  goBtn.type = 'submit';
  goBtn.className = 'lightweight';
  goBtn.textContent = 'Go';
  goBtn.style.fontWeight = 'bold';
  addrForm.appendChild(goBtn);

  toolbar.appendChild(addrForm);
  container.appendChild(toolbar);

  // ── Proxy banner ──
  proxyBanner = document.createElement('div');
  proxyBanner.className = 'netscape-proxy-banner';
  proxyBanner.textContent =
    '\u26A1 Proxy mode enabled \u2014 some sites may load slower or look different';
  proxyBanner.style.display = 'none';
  container.appendChild(proxyBanner);

  // ── Content Area ──
  const contentArea = document.createElement('div');
  contentArea.className = 'netscape-content';

  // Iframe
  iframeEl = document.createElement('iframe');
  iframeEl.className = 'netscape-iframe';
  iframeEl.title = 'Netscape Navigator';
  iframeEl.setAttribute(
    'sandbox',
    'allow-scripts allow-same-origin allow-forms allow-popups',
  );
  iframeEl.src = buildSrc(currentUrl, useProxy);
  iframeEl.addEventListener('load', handleLoad);
  iframeEl.addEventListener('error', handleError);
  contentArea.appendChild(iframeEl);

  // Loading overlay
  loadingDiv = document.createElement('div');
  loadingDiv.className = 'netscape-loading';
  loadingDiv.style.display = 'none';

  loadingTextEl = document.createElement('div');
  loadingTextEl.className = 'netscape-loading-text';
  loadingTextEl.textContent = 'Loading...';
  loadingDiv.appendChild(loadingTextEl);

  const progressBar = document.createElement('div');
  progressBar.className = 'netscape-progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'netscape-progress-fill';
  progressBar.appendChild(progressFill);

  loadingDiv.appendChild(progressBar);
  contentArea.appendChild(loadingDiv);

  // Error overlay
  errorDiv = document.createElement('div');
  errorDiv.className = 'netscape-error';
  errorDiv.style.display = 'none';

  const errorIcon = document.createElement('div');
  errorIcon.className = 'netscape-error-icon';
  errorIcon.textContent = '\u26A0\uFE0F';
  errorDiv.appendChild(errorIcon);

  const errorTitle = document.createElement('h3');
  errorTitle.textContent = 'Website cannot be displayed';
  errorDiv.appendChild(errorTitle);

  errorMsgEl = document.createElement('p');
  errorDiv.appendChild(errorMsgEl);

  errorUrlEl = document.createElement('p');
  errorDiv.appendChild(errorUrlEl);

  errorActionsEl = document.createElement('div');
  errorActionsEl.className = 'netscape-error-actions';
  errorDiv.appendChild(errorActionsEl);

  contentArea.appendChild(errorDiv);
  container.appendChild(contentArea);

  // ── Status Bar ──
  const statusBar = document.createElement('div');
  statusBar.className = 'netscape-status-bar';

  statusField = document.createElement('div');
  statusField.className = 'inset-shallow';
  statusField.style.cssText =
    'flex:1;padding:2px 6px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
  statusField.textContent = 'Done';
  statusBar.appendChild(statusField);

  const secStatus = document.createElement('div');
  secStatus.className = 'inset-shallow';
  secStatus.style.cssText =
    'padding:2px 6px;font-size:11px;white-space:nowrap;display:flex;align-items:center;gap:4px;';

  secStatusSpan = document.createElement('span');
  secStatusSpan.className = 'netscape-security';
  secStatusSpan.textContent = '\uD83D\uDD12 Direct';
  secStatus.appendChild(secStatusSpan);

  statusBar.appendChild(secStatus);
  container.appendChild(statusBar);

  // ── Append everything to the window ──
  $win.$content.append(container);
}
