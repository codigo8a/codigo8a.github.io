import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/translations';
import './index.css';

export const WinampApp: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const webampRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;

    const initWebamp = async () => {
      try {
        const Webamp = (await import('webamp')).default;

        if (disposed || !containerRef.current) return;

        if (!Webamp.browserIsSupported()) {
          setError('Your browser does not support Webamp. Try using Chrome, Firefox, or Edge.');
          return;
        }

        const webamp = new Webamp({
          zIndex: 500,
        });

        webampRef.current = webamp;

        await webamp.renderWhenReady(containerRef.current);
        if (!disposed) {
          setIsLoaded(true);
        }
      } catch (err) {
        if (!disposed) {
          setError('Failed to load Winamp. Please try again.');
          console.error('Webamp init error:', err);
        }
      }
    };

    initWebamp();

    return () => {
      disposed = true;
      if (webampRef.current) {
        try {
          webampRef.current.dispose();
        } catch (_e) {
          // dispose may throw if already cleaned up
        }
        webampRef.current = null;
      }
    };
  }, []);

  return (
    <div className="winamp-container">
      <div ref={containerRef} className="winamp-content">
        {error && (
          <div className="winamp-error">
            <div className="winamp-error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}
      </div>
      <div className="winamp-status-bar">
        <p className="winamp-status-field">
          {error
            ? 'Error'
            : isLoaded
              ? 'Winamp loaded — drag & drop audio files or use the playlist'
              : 'Loading Winamp...'}
        </p>
        {isLoaded && (
          <p className="winamp-status-field winamp-status-right">
            🎵 Drag MP3 files to play
          </p>
        )}
      </div>
    </div>
  );
};
