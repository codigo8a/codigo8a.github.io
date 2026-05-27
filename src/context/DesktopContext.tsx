/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { getAppById } from '../apps/apps';
import { WindowConfig } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

export type WallpaperId = 'teal' | 'brick' | 'marble' | 'ocean' | 'grid' | 'purple';

export interface WallpaperOption {
  id: WallpaperId;
  name: string;
  path: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  { id: 'teal', name: 'Teal', path: '/wallpapers/teal.svg' },
  { id: 'brick', name: 'Brick', path: '/wallpapers/brick.svg' },
  { id: 'marble', name: 'Green Marble', path: '/wallpapers/marble.svg' },
  { id: 'ocean', name: 'Ocean', path: '/wallpapers/ocean.svg' },
  { id: 'grid', name: 'Gray Grid', path: '/wallpapers/grid.svg' },
  { id: 'purple', name: 'Purple Stone', path: '/wallpapers/purple.svg' },
];

interface DesktopContextType {
  windows: WindowConfig[];
  activeWindowId: string | null;
  wallpaper: WallpaperId;
  setWallpaper: (wallpaper: WallpaperId) => void;
  clippyEnabled: boolean;
  setClippyEnabled: (enabled: boolean) => void;
  handleWindowFocus: (id: string) => void;
  handleMinimize: (id: string) => void;
  handleRestore: (id: string) => void;
  handleClose: (id: string) => void;
  handleMaximize: (id: string) => void;
  handleWindowMove: (id: string, position: { x: number; y: number }) => void;
  handleWindowResize: (id: string, size: { width: number; height: number }) => void;
  addWindow: (windowConfig: Partial<WindowConfig> & { appId: string; content: ReactNode }) => void;
  openApp: (appId: string, appData?: any) => void;
  isWindowOpen: (appId: string) => boolean;
  launchWinamp: () => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const DesktopProvider: React.FC<{ children: ReactNode; initialWindows?: any[] }> = ({ children, initialWindows = [] }) => {
  const [windows, setWindows] = useState<WindowConfig[]>(initialWindows);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(initialWindows[0]?.id || null);
  const [zIndexCounter, setZIndexCounter] = useState(10);
  
  // Load wallpaper from localStorage on mount
  const [wallpaper, setWallpaperState] = useState<WallpaperId>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WALLPAPER);
    return (saved as WallpaperId) || 'teal';
  });

  // Persist wallpaper to localStorage
  const setWallpaper = useCallback((newWallpaper: WallpaperId) => {
    setWallpaperState(newWallpaper);
    localStorage.setItem(LOCAL_STORAGE_KEYS.WALLPAPER, newWallpaper);
  }, []);

  // Load clippy state from localStorage
  const [clippyEnabled, setClippyEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CLIPPY_ENABLED);
    return saved === null ? true : saved === 'true';
  });

  // Persist clippy state
  const setClippyEnabled = useCallback((enabled: boolean) => {
    setClippyEnabledState(enabled);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CLIPPY_ENABLED, String(enabled));
  }, []);

  // Guardar estado de ventana (posición y tamaño) en localStorage
  const saveWindowState = useCallback((appId: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    try {
      const savedStates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WINDOW_STATES) || '{}');
      savedStates[appId] = { position, size, timestamp: Date.now() };
      localStorage.setItem(LOCAL_STORAGE_KEYS.WINDOW_STATES, JSON.stringify(savedStates));
    } catch (e) {
      console.error('Error saving window state:', e);
    }
  }, []);

  // Cargar estado de ventana desde localStorage
  const loadWindowState = useCallback((appId: string) => {
    try {
      const savedStates = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.WINDOW_STATES) || '{}');
      const state = savedStates[appId];
      if (state) {
        // Verificar que la posición esté dentro de la pantalla visible
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight - 30; // taskbar
        
        const x = Math.max(0, Math.min(state.position.x, maxWidth - 100));
        const y = Math.max(30, Math.min(state.position.y, maxHeight - 100));
        
        return {
          position: { x, y },
          size: state.size
        };
      }
    } catch (e) {
      console.error('Error loading window state:', e);
    }
    return null;
  }, []);

  // Normalizar z-index cuando el contador crece demasiado
  const normalizeZIndexes = useCallback(() => {
    setWindows(currentWindows => {
      // Ordenar ventanas por z-index actual
      const sortedWindows = [...currentWindows].sort((a, b) => a.zIndex - b.zIndex);
      // Asignar nuevos z-index secuenciales desde 10
      const normalizedWindows = sortedWindows.map((win, index) => ({
        ...win,
        zIndex: 10 + index
      }));
      setZIndexCounter(10 + normalizedWindows.length);
      return normalizedWindows;
    });
  }, []);

  const bringToFront = useCallback((id: string) => {
    // Normalizar si el contador está creciendo demasiado
    if (zIndexCounter > 1000) {
      normalizeZIndexes();
    }
    
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    
    setActiveWindowId(id);
    setWindows(prev => prev.map(win => ({
      ...win,
      isActive: win.id === id,
      zIndex: win.id === id ? newZIndex : win.zIndex
    })));
  }, [zIndexCounter, normalizeZIndexes]);

  const handleWindowFocus = useCallback((id: string) => {
    bringToFront(id);
  }, [bringToFront]);

  const handleMinimize = useCallback((id: string) => {
    // Start minimize animation
    setWindows(prev => prev.map(win =>
      win.id === id ? { ...win, animationState: 'minimizing' as const } : win
    ));

    // After animation completes, actually minimize
    setTimeout(() => {
      setWindows(prev => prev.map(win =>
        win.id === id ? { ...win, isMinimized: true, animationState: null } : win
      ));
      const visibleWindows = windows.filter(w => !w.isMinimized && w.id !== id);
      if (visibleWindows.length > 0) {
        setActiveWindowId(visibleWindows[0].id);
      }
    }, 200);
  }, [windows]);

  const handleRestore = useCallback((id: string) => {
    bringToFront(id);

    // Start restoring animation
    setWindows(prev => prev.map(win =>
      win.id === id ? { ...win, isMinimized: false, animationState: 'restoring' as const } : { ...win, isActive: false }
    ));
    setActiveWindowId(id);

    // Clear animation state after it completes
    setTimeout(() => {
      setWindows(prev => prev.map(win =>
        win.id === id ? { ...win, animationState: null, isActive: true } : win
      ));
    }, 200);
  }, [bringToFront]);

  const handleClose = useCallback((id: string) => {
    // Start closing animation
    setWindows(prev => prev.map(win =>
      win.id === id ? { ...win, animationState: 'closing' as const } : win
    ));

    // After animation completes, actually remove
    setTimeout(() => {
      setWindows(prev => {
        const remaining = prev.filter(win => win.id !== id);
        if (remaining.length > 0) {
          setActiveWindowId(remaining[remaining.length - 1].id);
        }
        return remaining;
      });
    }, 150);
  }, []);

  const handleMaximize = useCallback((id: string) => {
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        const willBeMaximized = !win.isMaximized;
        return { 
          ...win, 
          isMaximized: willBeMaximized,
          isActive: true, 
          zIndex: newZIndex 
        };
      }
      return { ...win, isActive: false };
    }));
    setActiveWindowId(id);
  }, [zIndexCounter]);

  const handleWindowMove = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win) {
        // Guardar estado de posición
        saveWindowState(win.appId, position, win.initialSize);
      }
      return prev.map(w =>
        w.id === id ? { ...w, currentPosition: position } : w
      );
    });
  }, [saveWindowState]);

  const handleWindowResize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (win && win.currentPosition) {
        // Guardar estado de tamaño
        saveWindowState(win.appId, win.currentPosition, size);
      }
      return prev.map(w =>
        w.id === id ? { ...w, initialSize: size } : w
      );
    });
  }, [saveWindowState]);

  const addWindow = useCallback((windowConfig: Partial<WindowConfig> & { appId: string; content: ReactNode }) => {
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    
    // Calculate offset based on number of windows instead of zIndex to prevent "drifting"
    const windowCount = windows.length;
    const offset = (windowCount % 10) * 20;
    
    const defaultWidth = windowConfig.initialSize?.width || 400;
    const defaultHeight = windowConfig.initialSize?.height || 300;
    
    // Ensure window fits within the screen (subtracting taskbar height)
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight - 30; // 30 is taskbar height
    
    const finalWidth = Math.min(defaultWidth, maxWidth - 40);
    const finalHeight = Math.min(defaultHeight, maxHeight - 40);
    
    let initialX = windowConfig.initialPosition?.x ?? (100 + offset);
    let initialY = windowConfig.initialPosition?.y ?? (100 + offset);

    if (windowConfig.centered) {
      initialX = (maxWidth - finalWidth) / 2;
      initialY = (maxHeight - finalHeight) / 2;
    }
    
    // Constrain position to keep window visible
    const finalX = Math.max(0, Math.min(initialX, maxWidth - finalWidth));
    const finalY = Math.max(30, Math.min(initialY, maxHeight - finalHeight));
    
    const newWindow: WindowConfig = {
      appId: windowConfig.appId,
      id: windowConfig.appId + '-' + Date.now(),
      title: windowConfig.title || 'Window',
      isMinimized: false,
      isActive: true,
      isMaximized: false,
      initialPosition: { x: finalX, y: finalY },
      initialSize: { width: finalWidth, height: finalHeight },
      currentPosition: null,
      centered: windowConfig.centered || false,
      zIndex: newZIndex,
      content: windowConfig.content,
      windowKey: windowConfig.windowKey,
      animationState: 'opening'
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);

    // Clear opening animation after it completes
    setTimeout(() => {
      setWindows(prev => prev.map(win =>
        win.id === newWindow.id ? { ...win, animationState: null } : win
      ));
    }, 200);
  }, [zIndexCounter, windows.length]);

  const openApp = useCallback((appId: string, appData: any = null) => {
    const app = getAppById(appId);
    if (!app) return;

    const windowKey = appData?.windowKey || null;
    const allowMultiple = app.singleInstance === false;
    
    let existingWindow = null;
    if (windowKey) {
      existingWindow = windows.find(w => w.appId === appId && w.windowKey === windowKey);
    } else if (allowMultiple !== true) {
      existingWindow = windows.find(w => w.appId === appId);
    }
    
    if (existingWindow) {
      const newZIndex = zIndexCounter + 1;
      setZIndexCounter(newZIndex);
      
      setWindows(prev => prev.map(win => 
        win.id === existingWindow!.id
          ? { ...win, zIndex: newZIndex, isMinimized: false, isActive: true }
          : { ...win, isActive: false }
      ));
      setActiveWindowId(existingWindow.id);
    } else {
      const AppComponent = app.component;
      
      // Cargar estado guardado si existe
      const savedState = loadWindowState(app.id);
      
      addWindow({
        appId: app.id,
        windowKey: windowKey,
        title: appData?.title || app.title,
        initialSize: savedState?.size || app.defaultSize,
        initialPosition: savedState?.position,
        centered: savedState ? false : app.centered, // Si hay estado guardado, no centrar
        content: <AppComponent file={appData?.file} />
      });
    }
  }, [windows, zIndexCounter, addWindow, loadWindowState]);

  const isWindowOpen = useCallback((appId: string) => {
    return windows.some(w => w.appId === appId);
  }, [windows]);

  // ── Floating Winamp (no window) ──
  const webampRef = useRef<any>(null);
  const webampClosedRef = useRef(false);

  const launchWinamp = useCallback(async () => {
    if (webampRef.current && !webampClosedRef.current) {
      return;
    }
    if (webampRef.current && webampClosedRef.current) {
      webampRef.current.reopen();
      webampClosedRef.current = false;
      return;
    }
    try {
      // Create a dedicated container for Webamp (separate from #root)
      let container = document.getElementById('webamp-root');
      if (!container) {
        container = document.createElement('div');
        container.id = 'webamp-root';
        container.style.cssText =
          'position:fixed;top:0;left:0;width:100%;height:100%;z-index:500;';
        document.body.appendChild(container);
      }

      // Inject CSS: container passes clicks through, Winamp windows stay interactive
      if (!document.getElementById('webamp-pointer-css')) {
        const s = document.createElement('style');
        s.id = 'webamp-pointer-css';
        s.textContent = `
          #webamp-root { pointer-events: none; }
          #webamp-root .main-window,
          #webamp-root .equalizer-window,
          #webamp-root .playlist { pointer-events: auto; }
        `;
        document.head.appendChild(s);
      }

      const mod = await import('webamp');
      const WebampClass = mod.default;
      
      // Load saved Winamp state from localStorage
      const savedWinampState = localStorage.getItem(LOCAL_STORAGE_KEYS.WINAMP_STATE);
      const initialSkin = savedWinampState ? JSON.parse(savedWinampState) : undefined;
      
      const webamp = new WebampClass({ 
        zIndex: 501,
        initialSkin
      });

      // Save state when closing to persist window positions
      webamp.onClose(() => { 
        webampClosedRef.current = true;
        // Use type assertion to access serialize method if available
        const webampAny = webamp as any;
        if (webampAny.serialize) {
          const state = webampAny.serialize();
          if (state) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.WINAMP_STATE, JSON.stringify(state));
          }
        }
      });
      webampRef.current = webamp;

      // Render into the dedicated container, NOT the desktop's #root
      await webamp.renderWhenReady(container);
    } catch (e) {
      console.error('Failed to launch Winamp:', e);
    }
  }, []);

  const value = {
    windows,
    activeWindowId,
    wallpaper,
    setWallpaper,
    clippyEnabled,
    setClippyEnabled,
    handleWindowFocus,
    handleMinimize,
    handleRestore,
    handleClose,
    handleMaximize,
    handleWindowMove,
    handleWindowResize,
    addWindow,
    openApp,
    isWindowOpen,
    launchWinamp
  };

  return (
    <DesktopContext.Provider value={value}>
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
