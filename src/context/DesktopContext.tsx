/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getAppById } from '../apps/apps';
import { WindowConfig } from '../types';

interface DesktopContextType {
  windows: WindowConfig[];
  activeWindowId: string | null;
  handleWindowFocus: (id: string) => void;
  handleMinimize: (id: string) => void;
  handleRestore: (id: string) => void;
  handleClose: (id: string) => void;
  handleMaximize: (id: string) => void;
  handleWindowMove: (id: string, position: { x: number; y: number }) => void;
  addWindow: (windowConfig: Partial<WindowConfig> & { appId: string; content: ReactNode }) => void;
  openApp: (appId: string, appData?: any) => void;
  isWindowOpen: (appId: string) => boolean;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const DesktopProvider: React.FC<{ children: ReactNode; initialWindows?: any[] }> = ({ children, initialWindows = [] }) => {
  const [windows, setWindows] = useState<WindowConfig[]>(initialWindows);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(initialWindows[0]?.id || null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  const bringToFront = useCallback((id: string) => {
    const newZIndex = zIndexCounter + 1;
    setZIndexCounter(newZIndex);
    
    setActiveWindowId(id);
    setWindows(prev => prev.map(win => ({
      ...win,
      isActive: win.id === id,
      zIndex: win.id === id ? newZIndex : win.zIndex
    })));
  }, [zIndexCounter]);

  const handleWindowFocus = useCallback((id: string) => {
    bringToFront(id);
  }, [bringToFront]);

  const handleMinimize = useCallback((id: string) => {
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: true } : win
    ));
    const visibleWindows = windows.filter(w => !w.isMinimized && w.id !== id);
    if (visibleWindows.length > 0) {
      setActiveWindowId(visibleWindows[0].id);
    }
  }, [windows]);

  const handleRestore = useCallback((id: string) => {
    bringToFront(id);
    
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, isMinimized: false, isActive: true } : { ...win, isActive: false }
    ));
    setActiveWindowId(id);
  }, [bringToFront]);

  const handleClose = useCallback((id: string) => {
    setWindows(prev => {
      const remaining = prev.filter(win => win.id !== id);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      }
      return remaining;
    });
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
    setWindows(prev => prev.map(win => 
      win.id === id ? { ...win, currentPosition: position } : win
    ));
  }, []);

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
      windowKey: windowConfig.windowKey
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
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
      addWindow({
        appId: app.id,
        windowKey: windowKey,
        title: appData?.title || app.title,
        initialSize: app.defaultSize,
        centered: app.centered,
        content: <AppComponent file={appData?.file} />
      });
    }
  }, [windows, zIndexCounter, addWindow]);

  const isWindowOpen = useCallback((appId: string) => {
    return windows.some(w => w.appId === appId);
  }, [windows]);

  const value = {
    windows,
    activeWindowId,
    handleWindowFocus,
    handleMinimize,
    handleRestore,
    handleClose,
    handleMaximize,
    handleWindowMove,
    addWindow,
    openApp,
    isWindowOpen
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
