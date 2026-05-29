import React, { useState, useRef, useEffect } from 'react';
import { TitleBar } from '../../molecules/TitleBar';
import { MenuBar } from '../../molecules/MenuBar';
import { WindowProvider } from '../../../context/WindowContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { useWindowResize } from '../../../hooks/useWindowResize';
import type { MenuDefinition } from '../../molecules/MenuBar';
import './index.css';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  isActive?: boolean;
  isMinimized?: boolean;
  centered?: boolean;
  zIndex?: number;
  isMaximized?: boolean;
  currentPosition?: { x: number; y: number } | null;
  animationState?: 'opening' | 'closing' | 'minimizing' | 'restoring' | null;
  onFocus?: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onClose?: (id: string) => void;
  onMove?: (id: string, position: { x: number; y: number }) => void;
  onResize?: (id: string, size: { width: number; height: number }, position?: { x: number; y: number }) => void;
  icon?: string;
  menu?: MenuDefinition;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 400, height: 300 },
  isActive = false,
  isMinimized = false,
  centered = false,
  zIndex = 10,
  isMaximized = false,
  currentPosition = null,
  animationState = null,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onMove,
  onResize,
  icon,
  menu
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0, width: 0, height: 0 });
  const isMobile = useIsMobile();

  // Compute default initial position (for newly opened windows)
  const defaultPosition = currentPosition ?? (
    centered
      ? {
          x: Math.max(0, (window.innerWidth - initialSize.width) / 2),
          y: Math.max(30, (window.innerHeight - initialSize.height) / 2),
        }
      : initialPosition
  );

  const {
    size,
    position,
    isResizing,
    onResizeStart,
    setSize,
    setPosition,
  } = useWindowResize({
    initialSize,
    initialPosition: defaultPosition,
    minWidth: 200,
    minHeight: 150,
    taskbarHeight: 30,
    id,
    onResize,
    onMove,
  });

  // Sync currentPosition prop → hook position (e.g. after restore/reopen)
  useEffect(() => {
    if (currentPosition) {
      setPosition(currentPosition);
    }
  }, [currentPosition, setPosition]);

  // Reposicionar ventana si queda fuera de pantalla al hacer resize
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized) return;
      
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - 30; // taskbar
      
      // Asegurar que la ventana no quede fuera de los límites
      const newX = Math.max(0, Math.min(position.x, maxWidth - Math.min(size.width, maxWidth - 20)));
      const newY = Math.max(30, Math.min(position.y, maxHeight - Math.min(size.height, maxHeight - 20)));
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
        onMove?.(id, { x: newX, y: newY });
      }
      
      // Si la ventana es más grande que la pantalla, ajustar tamaño
      const newWidth = Math.min(size.width, maxWidth - 20);
      const newHeight = Math.min(size.height, maxHeight - 20);
      
      if (newWidth !== size.width || newHeight !== size.height) {
        setSize({ width: newWidth, height: newHeight });
        onResize?.(id, { width: newWidth, height: newHeight });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, size, isMaximized, id, onMove, onResize]);

  const handleMinimize = () => {
    onMinimize?.(id);
  };

  const handleClose = () => {
    onClose?.(id);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.title-bar')) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
        width: size.width,
        height: size.height
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      const newX = dragStart.current.posX + dx;
      const newY = dragStart.current.posY + dy;
      
      // Boundary constraints
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - 30; // 30 is taskbar height
      
      const boundedX = Math.max(0, Math.min(newX, maxWidth - size.width));
      const boundedY = Math.max(30, Math.min(newY, maxHeight - size.height));
      
      setPosition({
        x: boundedX,
        y: boundedY
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onMove?.(id, position);
    }
  };

  if (isMinimized) {
    return null;
  }

  // En móviles, siempre tratamos la ventana como maximizada
  const effectiveMaximized = isMaximized || isMobile;

  const renderContent = () => (
    <WindowProvider id={id} onClose={handleClose}>
      <TitleBar 
        title={title}
        onMinimize={handleMinimize}
        onMaximize={isMobile ? () => {} : () => onMaximize?.(id)}
        onClose={handleClose}
        active={isActive}
        icon={icon}
      />
      {menu && <MenuBar menus={menu} inactive={!isActive} />}
      <div className="window-body">
        {children}
      </div>
      {!effectiveMaximized && (
        <>
          <div className="window-resize-handle window-resize-n" onMouseDown={(e) => onResizeStart('n', e)} />
          <div className="window-resize-handle window-resize-s" onMouseDown={(e) => onResizeStart('s', e)} />
          <div className="window-resize-handle window-resize-e" onMouseDown={(e) => onResizeStart('e', e)} />
          <div className="window-resize-handle window-resize-w" onMouseDown={(e) => onResizeStart('w', e)} />
          <div className="window-resize-handle window-resize-ne" onMouseDown={(e) => onResizeStart('ne', e)} />
          <div className="window-resize-handle window-resize-nw" onMouseDown={(e) => onResizeStart('nw', e)} />
          <div className="window-resize-handle window-resize-se" onMouseDown={(e) => onResizeStart('se', e)} />
          <div className="window-resize-handle window-resize-sw" onMouseDown={(e) => onResizeStart('sw', e)} />
          <div className="window-resize-grip" />
        </>
      )}
    </WindowProvider>
  );

  const getAnimationClass = () => {
    if (animationState === 'opening') return 'window-opening';
    if (animationState === 'closing') return 'window-closing';
    if (animationState === 'minimizing') return 'window-minimizing';
    if (animationState === 'restoring') return 'window-restoring';
    return '';
  };

  if (effectiveMaximized) {
    return (
      <div
        className={`window ${isActive ? 'active' : ''} window-maximized ${getAnimationClass()}`}
        style={{
          position: 'fixed',
          width: '100%',
          height: '100dvh',
          maxHeight: 'calc(100dvh - 30px)',
          zIndex,
          left: '0px',
          top: '30px',
        }}
        onClick={() => onFocus?.(id)}
      >
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      className={`window ${isActive ? 'active' : ''} ${getAnimationClass()} ${isResizing ? 'window-resizing' : ''}`}
      style={{
        position: 'absolute',
        width: size.width,
        height: size.height,
        zIndex,
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'move' : 'default',
        userSelect: isDragging ? 'none' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => onFocus?.(id)}
    >
      {renderContent()}
    </div>
  );
};
