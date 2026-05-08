import React from 'react';
import { Window } from './organisms/Window';
import { TaskBar } from './organisms/TaskBar';
import { StartMenu } from './organisms/StartMenu';
import { DesktopIcons } from './DesktopIcons';
import { Clippy } from './Clippy';
import { useDesktop, WALLPAPERS } from '../context/DesktopContext';
import { useStartMenu } from '../hooks/useWindow';
import { useUrlRouting } from '../hooks/useUrlRouting';
import { WindowConfig } from '../types';

export const Desktop: React.FC = () => {
  const {
    windows,
    activeWindowId,
    wallpaper,
    clippyEnabled,
    setClippyEnabled,
    handleWindowFocus,
    handleMinimize,
    handleRestore,
    handleClose,
    handleMaximize,
    handleWindowMove,
    openApp
  } = useDesktop();

  const { isOpen: isStartOpen, toggle: toggleStart, close: closeStart } = useStartMenu();

  // Use the new URL routing hook
  useUrlRouting(windows, openApp);

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStart();
  };

  const currentWallpaper = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0];

  return (
    <div className="desktop" style={{
      width: '100vw',
      height: '100dvh',
      minHeight: '100dvh',
      backgroundImage: `url(${currentWallpaper.path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <TaskBar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleWindowFocus}
        onRestore={handleRestore}
        isStartOpen={isStartOpen}
        onStartClick={handleStartClick}
        clippyEnabled={clippyEnabled}
        onClippyClick={() => setClippyEnabled(true)}
      />
      
      <DesktopIcons />
      
      {isStartOpen && (
        <StartMenu 
          onClose={closeStart}
          onOpenApp={openApp}
        />
      )}
      
      {windows.map((win: WindowConfig) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isActive={activeWindowId === win.id && !win.isMinimized}
          isMinimized={win.isMinimized}
          centered={win.centered}
          initialPosition={win.initialPosition}
          initialSize={win.initialSize}
          zIndex={win.zIndex}
          isMaximized={win.isMaximized}
          currentPosition={win.currentPosition}
          animationState={win.animationState}
          onFocus={handleWindowFocus}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
          onMove={handleWindowMove}
        >
          {win.content}
        </Window>
      ))}

      <Clippy enabled={clippyEnabled} onClose={() => setClippyEnabled(false)} />
    </div>
  );
};
