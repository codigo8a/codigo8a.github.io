import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import './index.css';

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'myDocuments', icon: '📁', label: 'My Documents' },
  { id: 'find', icon: '🔍', label: 'Find' },
];

export const DesktopIcons: React.FC = () => {
  const { openApp } = useDesktop();

  const handleIconClick = (iconId: string) => {
    if (iconId === 'myDocuments') {
      openApp('fileExplorer');
    } else if (iconId === 'find') {
      openApp('search');
    }
  };

  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.map((icon) => (
        <div
          key={icon.id}
          className="desktop-icon"
          onClick={() => handleIconClick(icon.id)}
        >
          <div className="desktop-icon-image">{icon.icon}</div>
          <span className="desktop-icon-label">
            {icon.label}
          </span>
        </div>
      ))}
    </div>
  );
};
