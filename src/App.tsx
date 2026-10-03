import { useState, useEffect } from 'react';
import { Desktop } from './components/Desktop';
import { DesktopProvider } from './context/DesktopContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { APPS } from './apps/apps';
import { LOCAL_STORAGE_KEYS } from './constants';
import { WindowConfig } from './types';
import {
  isAuthorizationCallback,
  publishAuthorizationCode,
  readAuthorizationResponse,
} from './services/googleDrive/auth';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

/**
 * Guard for the Drive authorization callback.
 *
 * The callback tab publishes the code and closes itself. React StrictMode runs
 * effects twice in development, and publishing the same single-use code twice
 * would leave a stale code in storage for a later connect attempt to pick up.
 */
let authorizationCallbackHandled = false;

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

  // Hand the Google authorization code to the main window and close this tab
  useEffect(() => {
    if (authorizationCallbackHandled) return;
    if (!isAuthorizationCallback()) return;
    authorizationCallbackHandled = true;
    if (!publishAuthorizationCode(readAuthorizationResponse())) {
      console.error('Drive authorization response could not be published; the tab stays open.');
    }
  }, []);

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
