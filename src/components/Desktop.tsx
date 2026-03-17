import React from 'react';
import { Window } from './organisms/Window';
import { TaskBar } from './organisms/TaskBar';
import { StartMenu } from './organisms/StartMenu';
import { DesktopIcons } from './DesktopIcons';
import { useDesktop } from '../context/DesktopContext';
import { useStartMenu } from '../hooks/useWindow';
import { useUrlRouting } from '../hooks/useUrlRouting';
import { WindowConfig } from '../types';

export const Desktop: React.FC = () => {
  const {
    windows,
    activeWindowId,
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

  return (
    <div className="desktop" style={{
      width: '100vw',
      height: '100vh',
      background: '#008080',
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
          onFocus={handleWindowFocus}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
          onMove={handleWindowMove}
        >
          {win.content}
        </Window>
      ))}
    </div>
  );
};
