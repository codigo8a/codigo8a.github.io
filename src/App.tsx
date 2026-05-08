import { useState } from 'react';
import { Desktop } from './components/Desktop';
import { DesktopProvider } from './context/DesktopContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { APPS } from './apps/apps';
import { LOCAL_STORAGE_KEYS } from './constants';
import { WindowConfig } from './types';

const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

const getInitialWindows = (): WindowConfig[] => {
  const showWelcome = localStorage.getItem(LOCAL_STORAGE_KEYS.SHOW_WELCOME) !== 'false';
  
  // Si el usuario desmarcó "mostrar al inicio", verificar si han pasado 6 horas
  if (!showWelcome) {
    const hiddenAt = localStorage.getItem(LOCAL_STORAGE_KEYS.WELCOME_HIDDEN_AT);
    if (hiddenAt) {
      const hiddenTime = parseInt(hiddenAt, 10);
      const now = Date.now();
      // Si NO han pasado 6 horas, no mostrar
      if (now - hiddenTime < SIX_HOURS_IN_MS) {
        return [];
      }
      // Si ya pasaron 6 horas, limpiar el timestamp para que vuelva a mostrarse
      localStorage.removeItem(LOCAL_STORAGE_KEYS.WELCOME_HIDDEN_AT);
    }
    return [];
  }

  return [
    {
      appId: 'welcome',
      id: 'welcome-' + Date.now(),
      title: 'Welcome',
      isMinimized: false,
      isActive: true,
      isMaximized: false,
      currentPosition: null,
      initialPosition: { x: 0, y: 0 },
      initialSize: APPS.welcome.defaultSize,
      centered: APPS.welcome.centered,
      zIndex: 10,
      content: <APPS.welcome.component />
    }
  ];
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const initialWindows = getInitialWindows();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

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
