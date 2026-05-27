import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWindow } from '../../context/WindowContext';
import './index.css';

const PROXY_BASE = 'https://corsproxy.io/?url=';

export const NetscapeApp: React.FC = () => {
  const [url, setUrl] = useState('https://masinfo.online/');
  const [currentUrl, setCurrentUrl] = useState('https://masinfo.online/');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const windowContext = useWindow();

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (checkRef.current) { clearTimeout(checkRef.current); checkRef.current = null; }
  }, []);

  const buildSrc = useCallback((targetUrl: string, proxy: boolean): string => {
    if (!proxy) return targetUrl;
    return `${PROXY_BASE}${encodeURIComponent(targetUrl)}`;
  }, []);

  const navigate = useCallback((targetUrl: string, proxy: boolean) => {
    clearTimeouts();
    setCurrentUrl(targetUrl);
    setIsLoading(true);
    setHasError(false);

    // Check at 1.5s if iframe is blocked (about:blank) — only when NOT using proxy
    if (!proxy) {
      checkRef.current = setTimeout(() => {
        try {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            const loc = iframeRef.current.contentWindow.location;
            if (loc.href === 'about:blank' || loc.href === '') {
              clearTimeouts();
              setIsLoading(false);
              setHasError(true);
            }
          }
        } catch (_e) {
          // Cross-origin = page loaded (good)
        }
      }, 1500);
    }

    // Timeout: if page doesn't load in 8s (proxy is slower), show error
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, proxy ? 8000 : 3000);
  }, [clearTimeouts]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    navigate(targetUrl, useProxy);
  };

  const handleLoad = () => {
    clearTimeouts();
    setIsLoading(false);
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const loc = iframeRef.current.contentWindow.location;
        if (loc.href === 'about:blank') {
          setHasError(true);
        } else {
          setHasError(false);
        }
      }
    } catch (_e) {
      setHasError(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleBack = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try { iframeRef.current.contentWindow.history.back(); } catch (_e) { /* no-op */ }
    }
  };

  const handleForward = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try { iframeRef.current.contentWindow.history.forward(); } catch (_e) { /* no-op */ }
    }
  };

  const handleHome = () => {
    const homeUrl = 'https://masinfo.online/';
    setUrl(homeUrl);
    navigate(homeUrl, useProxy);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      iframeRef.current.src = buildSrc(currentUrl, useProxy);
    }
  };

  const toggleProxy = () => {
    const next = !useProxy;
    setUseProxy(next);
    // Reload current page with new proxy setting
    navigate(currentUrl, next);
  };

  const openInNewTab = () => {
    window.open(currentUrl, '_blank');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const iframeSrc = buildSrc(currentUrl, useProxy);

  return (
    <div className="netscape-container">
      {/* Toolbar */}
      <div className="netscape-toolbar">
        <div className="netscape-toolbar-buttons">
          <button className="netscape-btn" onClick={handleBack} title="Back" aria-label="Back">←</button>
          <button className="netscape-btn" onClick={handleForward} title="Forward" aria-label="Forward">→</button>
          <button className="netscape-btn" onClick={handleReload} title="Reload" aria-label="Reload">↻</button>
          <button className="netscape-btn home-btn" onClick={handleHome} title="Home" aria-label="Home">🏠</button>
          <button
            className={`netscape-btn proxy-btn${useProxy ? ' active' : ''}`}
            onClick={toggleProxy}
            title={useProxy ? 'Proxy ON — click to disable' : 'Proxy OFF — click to enable'}
            aria-label="Toggle Proxy"
          >
            🔁
          </button>
        </div>

        <form className="netscape-address-bar" onSubmit={handleNavigate}>
          <label className="netscape-address-label">Location:</label>
          <input
            type="text"
            className="netscape-address-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL..."
          />
          <button type="submit" className="netscape-go-btn">Go</button>
        </form>
      </div>

      {/* Proxy banner */}
      {useProxy && (
        <div className="netscape-proxy-banner">
          ⚡ Proxy mode enabled — some sites may load slower or look different
        </div>
      )}

      {/* Content Area */}
      <div className="netscape-content">
        {!hasError ? (
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            className="netscape-iframe"
            title="Netscape Navigator"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleLoad}
            onError={handleError}
          />
        ) : (
          <div className="netscape-error">
            <div className="netscape-error-icon">⚠️</div>
            <h3>Website cannot be displayed</h3>
            <p>
              {useProxy
                ? 'The proxy could not load this website. The site may be down, blocked by the proxy service, or the URL is invalid.'
                : 'This website has security restrictions (X-Frame-Options) that prevent it from loading inside an embedded browser.'
              }
            </p>
            <p>
              <strong>URL:</strong>{' '}
              <code style={{ background: '#eee', padding: '2px 4px' }}>{currentUrl}</code>
            </p>
            <div className="netscape-error-actions">
              {!useProxy && (
                <button className="netscape-open-external-btn" onClick={toggleProxy}>
                  🔁 Try via Proxy
                </button>
              )}
              <button className="netscape-open-external-btn" onClick={openInNewTab}>
                Open in New Tab
              </button>
            </div>
          </div>
        )}

        {isLoading && !hasError && (
          <div className="netscape-loading">
            <div className="netscape-loading-text">
              {useProxy ? 'Loading via proxy...' : 'Loading...'}
            </div>
            <div className="progress-indicator segmented" style={{ width: '200px' }}>
              <span className="progress-indicator-bar" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="netscape-status-bar">
        <div className="netscape-status-field">
          {hasError
            ? 'Error loading page'
            : isLoading
              ? 'Transferring data...'
              : useProxy
                ? 'Proxy active'
                : 'Done'
          }
        </div>
        <div className="netscape-status-field" style={{ display: 'flex', gap: '8px' }}>
          {useProxy && <span className="netscape-proxy-badge">🔁 Proxy</span>}
          <span className={`netscape-security ${hasError ? 'error' : ''}`}>
            {hasError ? '❌ Error' : useProxy ? '⚠️ Proxy' : '🔒 Direct'}
          </span>
        </div>
      </div>
    </div>
  );
};
