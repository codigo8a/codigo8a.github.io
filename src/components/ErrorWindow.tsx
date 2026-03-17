import React, { useState, useRef } from 'react';

interface ErrorWindowProps {
  error: Error | null;
  onReset: () => void;
}

export const ErrorWindow: React.FC<ErrorWindowProps> = ({ error, onReset }) => {
  const errorMessage = error?.message || 'An unknown error occurred';
  const errorStack = error?.stack || '';
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.title-bar')) {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        posX: 0, // Simplified for now
        posY: 0
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const el = document.querySelector('.error-window') as HTMLElement;
      if (el) {
        el.style.left = `calc(50% + ${dx}px)`;
        el.style.top = '50%';
        el.style.transform = 'translate(-50%, -50%)';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="error-window"
      style={{
        width: '400px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        cursor: isDragging ? 'move' : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Error</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onReset} />
          </div>
        </div>
        <div className="window-body" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '32px' }}>⚠️</span>
            <span style={{ fontWeight: 'bold' }}>Application Error</span>
          </div>
          <p style={{ marginBottom: '15px' }}>{errorMessage}</p>
          <details style={{ textAlign: 'left', fontSize: '11px' }}>
            <summary>Technical Details</summary>
            <pre style={{ 
              background: '#c0c0c0', 
              padding: '10px', 
              overflow: 'auto',
              maxHeight: '150px',
              border: '2px inset #fff'
            }}>
              {errorStack}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};
