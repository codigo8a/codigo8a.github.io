import React, { useState, useRef } from 'react';
import { TitleBar } from '../../molecules/TitleBar';
import { WindowProvider } from '../../../context/WindowContext';
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
  onFocus?: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onClose?: (id: string) => void;
  onMove?: (id: string, position: { x: number; y: number }) => void;
  onResize?: (id: string, size: { width: number; height: number }) => void;
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
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
  onMove,
  onResize
}) => {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(() => {
    if (currentPosition) return currentPosition;
    if (centered) {
      return {
        x: (window.innerWidth - initialSize.width) / 2,
        y: (window.innerHeight - initialSize.height) / 2
      };
    }
    return initialPosition;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0, width: 0, height: 0 });

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

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
      width: size.width,
      height: size.height
    };
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
    if (isResizing) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - 30;
      
      const newWidth = Math.max(200, Math.min(dragStart.current.width + dx, maxWidth - position.x));
      const newHeight = Math.max(150, Math.min(dragStart.current.height + dy, maxHeight - position.y));
      
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onMove?.(id, position);
    }
    if (isResizing) {
      setIsResizing(false);
      onResize?.(id, size);
    }
  };

  if (isMinimized) {
    return null;
  }

  const renderContent = () => (
    <WindowProvider id={id} onClose={handleClose}>
      <TitleBar 
        title={title}
        onMinimize={handleMinimize}
        onMaximize={() => onMaximize?.(id)}
        onClose={handleClose}
        active={isActive}
      />
      <div className="window-body">
        {children}
      </div>
      {!isMaximized && <div className="window-resize-handle" onMouseDown={handleResizeMouseDown} />}
    </WindowProvider>
  );

  if (isMaximized) {
    return (
      <div 
        className={`window ${isActive ? 'active' : ''}`}
        style={{
          position: 'absolute',
          width: '100%',
          height: 'calc(100% - 30px)',
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
      className={`window ${isActive ? 'active' : ''}`}
      style={{
        position: 'absolute',
        width: size.width,
        height: size.height,
        zIndex,
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'move' : 'default',
        userSelect: isDragging || isResizing ? 'none' : 'auto'
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
