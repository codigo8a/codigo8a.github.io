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
}

export const TaskBar: React.FC<TaskBarProps> = ({ 
  windows, 
  activeWindowId, 
  onWindowClick, 
  onRestore,
  isStartOpen,
  onStartClick 
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
      
      <div style={{ marginLeft: '8px', fontSize: '12px' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
    </div>
  );
};
