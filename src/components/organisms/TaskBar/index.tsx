import React from 'react';
import { useClock } from '../../../hooks/useWindow';
import { WindowConfig } from '../../../types';
import type { OsWindowEntry } from '../../../utils/osWindowRegistry';
import './index.css';

interface TaskBarProps {
  windows: WindowConfig[];
  osWindows: OsWindowEntry[];
  activeWindowId: string | null;
  onWindowClick: (id: string) => void;
  onRestore: (id: string) => void;
  onRestoreOsWindow: (id: string) => void;
  isStartOpen: boolean;
  onStartClick: (e: React.MouseEvent) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  windows,
  osWindows,
  activeWindowId,
  onWindowClick,
  onRestore,
  onRestoreOsWindow,
  isStartOpen,
  onStartClick,
}) => {
  const time = useClock();

  return (
    <div className="taskbar">
      {/* Start button — 98.js authentic */}
      <button
        className={`start-button toggle${isStartOpen ? ' selected' : ''}`}
        onClick={onStartClick}
      >
        <img src="/images/start.png" alt="" />
        <b>Start</b>
      </button>

      <div className="taskbar-divider" />

      {/* Task buttons — 98.js style */}
      <div className="tasks">
        {windows.map(win => (
          <button
            key={win.id}
            className={`task toggle${activeWindowId === win.id && !win.isMinimized ? ' selected' : ''}`}
            onClick={() => win.isMinimized ? onRestore(win.id) : onWindowClick(win.id)}
          >
            {win.icon && <img src={win.icon} alt="" />}
            <span className="title">{win.title}</span>
          </button>
        ))}
        {/* os-gui native windows (e.g. Welcome, Notepad, FileExplorer, …) */}
        {osWindows.map(win => (
          <button
            key={win.id}
            className={`task toggle${!win.isMinimized ? ' selected' : ''}`}
            onClick={() => onRestoreOsWindow(win.id)}
          >
            <img src={win.icon} alt="" />
            <span className="title">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="taskbar-divider" />

      {/* Tray — clock + icons */}
      <div className="tray inset-shallow">
        <div className="tray-icons">
          <img className="tray-icon" src="/images/icons/task-scheduler-16x16.png" alt="" />
          <img className="tray-icon" src="/images/icons/audio-okay-16x16.png" alt="" />
        </div>
        <div className="taskbar-time">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
