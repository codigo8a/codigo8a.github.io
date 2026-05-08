import React from 'react';
import { useClock } from '../../../hooks/useWindow';
import { WindowConfig } from '../../../types';
import './index.css';

interface TaskBarProps {
  windows: WindowConfig[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onRestore: (id: string) => void;
  isStartOpen: boolean;
  onStartClick: (e: React.MouseEvent) => void;
  clippyEnabled?: boolean;
  onClippyClick?: () => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  windows,
  activeWindowId,
  onWindowClick,
  onRestore,
  isStartOpen,
  onStartClick,
  clippyEnabled = true,
  onClippyClick
}) => {
  const time = useClock();

  return (
    <div className="taskbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      padding: '2px 4px',
      background: '#c0c0c0',
      borderBottom: '2px solid #808080',
      zIndex: 1000
    }}>
      <button 
        className={`start-button ${isStartOpen ? 'active' : ''}`}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontWeight: 'bold',
          marginRight: '8px'
        }}
        onClick={onStartClick}
      >
        <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" width="16" height="16" alt="" />
        Start
      </button>
      
      <div style={{ 
        borderLeft: '2px solid #808080', 
        borderRight: '2px solid #fff',
        height: '20px',
        marginRight: '8px'
      }} />
      
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {windows.map(win => (
          <button
            key={win.id}
            className={activeWindowId === win.id && !win.isMinimized ? 'active' : ''}
            style={{
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left'
            }}
            onClick={() => win.isMinimized ? onRestore(win.id) : onWindowClick(win.id)}
          >
            {win.title}
          </button>
        ))}
      </div>
      
      <div style={{
        borderLeft: '2px solid #808080',
        borderRight: '2px solid #fff',
        height: '20px',
        marginLeft: '8px'
      }} />

      {!clippyEnabled && onClippyClick && (
        <button
          className="clippy-taskbar-icon"
          onClick={onClippyClick}
          title="Show Clippy"
          style={{
            marginLeft: '8px',
            padding: '2px',
            background: '#c0c0c0',
            border: '2px outset #fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="clipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8e8e8" />
                <stop offset="50%" stopColor="#c0c0c0" />
                <stop offset="100%" stopColor="#a0a0a0" />
              </linearGradient>
            </defs>
            <path
              d="M30 20 Q30 5, 50 5 Q70 5, 70 25 L70 85 Q70 95, 60 95 Q50 95, 50 85 L50 35 Q50 30, 45 30 Q40 30, 40 35 L40 90 Q40 105, 55 105 Q70 105, 70 90 L70 100 Q70 115, 55 115 Q35 115, 35 95 L35 25 Q35 15, 45 15 Q55 15, 55 25 L55 85 Q55 90, 60 90 Q65 90, 65 85 L65 25 Q65 10, 50 10 Q35 10, 35 25 Z"
              fill="url(#clipGrad)"
              stroke="#808080"
              strokeWidth="2"
            />
            <ellipse cx="43" cy="50" rx="4" ry="6" fill="#fff" stroke="#666" strokeWidth="1" />
            <ellipse cx="44" cy="50" rx="1.5" ry="2.5" fill="#000" />
            <ellipse cx="57" cy="50" rx="4" ry="6" fill="#fff" stroke="#666" strokeWidth="1" />
            <ellipse cx="58" cy="50" rx="1.5" ry="2.5" fill="#000" />
          </svg>
        </button>
      )}

      <div style={{ marginLeft: '8px', fontSize: '12px' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
};
