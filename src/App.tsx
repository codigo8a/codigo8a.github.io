import { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { DesktopProvider } from './context/DesktopContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { APPS } from './apps/apps';
import { LOCAL_STORAGE_KEYS } from './constants';
import { WindowConfig } from './types';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

/** Determina si Welcome debe mostrarse al inicio (respeta cooldown de 6h) */
const shouldShowWelcomeAtStart = (): boolean => {
  const showWelcome = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOW_WELCOME) !== 'false';
  if (!showWelcome) {
    const hiddenAt = localStorage.getItem(LOCAL_STORAGE_KEYS.WELCOME_HIDDEN_AT);
    if (hiddenAt) {
      const hiddenTime = parseInt(hiddenAt, 10);
      const now = Date.now();
      if (now - hiddenTime < SIX_HOURS_IN_MS) return false;
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME_HIDDEN_AT);
    }
    return false;
  }
  return true;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // No more initial windows — all apps use customLaunch (os-gui native)
  const initialWindows: WindowConfig[] = [];

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Launch welcome at startup AFTER providers are mounted
  useEffect(() => {
    if (!isLoading && shouldShowWelcomeAtStart()) {
      // Pequeño retardo para asegurar que os-gui esté listo
      const timer = setTimeout(() => {
        const welcomeApp = APPS.welcome;
        if (welcomeApp.customLaunch) {
          welcomeApp.customLaunch();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <ErrorBoundary>
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <LanguageProvider>
          <DesktopProvider initialWindows={initialWindows}>
            <Desktop />
          </DesktopProvider>
        </LanguageProvider>
      )}
    </ErrorBoundary>
  );
}

export default App;
