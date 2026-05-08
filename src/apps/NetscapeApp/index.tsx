import React, { useState, useRef, useEffect } from 'react';
import { useWindow } from '../../context/WindowContext';
import './index.css';

export const NetscapeApp: React.FC = () => {
  const [url, setUrl] = useState('https://nexocorporacion.com/');
  const [currentUrl, setCurrentUrl] = useState('https://nexocorporacion.com/');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const windowContext = useWindow();

  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    clearLoadTimeout();
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    setCurrentUrl(targetUrl);
    setIsLoading(true);
    setHasError(false);
    
    // Check at 1.5 seconds if iframe is blocked (about:blank)
    setTimeout(() => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const location = iframeRef.current.contentWindow.location;
          if (location.href === 'about:blank' || location.href === '') {
            clearLoadTimeout();
            setIsLoading(false);
            setHasError(true);
          }
        }
      } catch (e) {
        // Cross-origin error means it loaded but we can't access (good)
      }
    }, 1500);

    // Set a timeout - if page doesn't load in 3 seconds, show error
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasError(true);
    }, 3000);
  };

  const handleLoad = () => {
    clearLoadTimeout();
    setIsLoading(false);
    // Only clear error if we're actually successfully loading
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const location = iframeRef.current.contentWindow.location;
        if (location.href === 'about:blank') {
          setHasError(true);
        } else {
          setHasError(false);
        }
      }
    } catch (e) {
      // Cross-origin error means the page loaded but we can't access it (which is fine)
      setHasError(false);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleBack = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.back();
      } catch (e) {
        console.log('Navigation not allowed');
      }
    }
  };

  const handleForward = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.history.forward();
      } catch (e) {
        console.log('Navigation not allowed');
      }
    }
  };

  const handleHome = () => {
    setCurrentUrl('https://nexocorporacion.com/');
    setUrl('https://nexocorporacion.com/');
    setIsLoading(true);
    setHasError(false);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      iframeRef.current.src = currentUrl;
    }
  };

  const openInNewTab = () => {
    window.open(currentUrl, '_blank');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearLoadTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="netscape-container">
      {/* Toolbar */}
      <div className="netscape-toolbar">
        <div className="netscape-toolbar-buttons">
          <button 
            className="netscape-btn" 
            onClick={handleBack}
            title="Back"
            aria-label="Back"
          >
            ←
          </button>
          <button 
            className="netscape-btn" 
            onClick={handleForward}
            title="Forward"
            aria-label="Forward"
          >
            →
          </button>
          <button 
            className="netscape-btn" 
            onClick={handleReload}
            title="Reload"
            aria-label="Reload"
          >
            ↻
          </button>
          <button 
            className="netscape-btn home-btn" 
            onClick={handleHome}
            title="Home"
            aria-label="Home"
          >
            🏠
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
          <button type="submit" className="netscape-go-btn">
            Go
          </button>
        </form>
      </div>

      {/* Content Area */}
      <div className="netscape-content">
        {!hasError ? (
          <iframe
            ref={iframeRef}
            src={currentUrl}
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
            <p>This website has security restrictions (X-Frame-Options) that prevent it from loading inside an embedded browser.</p>
            <p style={{ fontSize: '10px', color: '#666', marginTop: '8px' }}>
              Note: Some websites like Google, Facebook, and banking sites block embedding for security reasons.
            </p>
            <p><strong>URL:</strong> <code style={{ background: '#eee', padding: '2px 4px' }}>{currentUrl}</code></p>
            <button 
              className="netscape-open-external-btn"
              onClick={openInNewTab}
            >
              Open in New Tab
            </button>
          </div>
        )}
        
        {isLoading && !hasError && (
          <div className="netscape-loading">
            <div className="netscape-loading-text">Loading...</div>
            <div className="progress-indicator segmented" style={{ width: '200px' }}>
              <span className="progress-indicator-bar" style={{ width: '100%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="netscape-status-bar">
        <div className="netscape-status-field">
          {hasError ? 'Error loading page' : (isLoading ? 'Transferring data...' : 'Done')}
        </div>
        <div className={`netscape-status-field netscape-security ${hasError ? 'error' : ''}`}>
          {hasError ? '❌ Connection Error' : '🔒 Secure Connection'}
        </div>
      </div>
    </div>
  );
};
