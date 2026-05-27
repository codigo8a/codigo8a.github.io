import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import './index.css';

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
}

const WINAMP_ICON = (
  <img 
    src="/app/icons/winamp-logo.svg" 
    alt="Winamp" 
    width={32} 
    height={32} 
    style={{ imageRendering: 'auto' }} 
  />
);

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'myDocuments', icon: '📁', label: 'My Documents' },
  { id: 'find', icon: '🔍', label: 'Find' },
  { id: 'browser', icon: '🌐', label: 'Browser' },
  { id: 'winamp', icon: 'winamp', label: 'Winamp' },
  { id: 'prueba', icon: '🧪', label: 'Prueba' },
];

export const DesktopIcons: React.FC = () => {
  const { openApp, launchWinamp } = useDesktop();

  const handleIconClick = (iconId: string) => {
    if (iconId === 'myDocuments') {
      openApp('fileExplorer');
    } else if (iconId === 'find') {
      openApp('search');
    } else if (iconId === 'browser') {
      openApp('netscape');
    } else if (iconId === 'winamp') {
      launchWinamp();
    } else if (iconId === 'prueba') {
      openApp('prueba');
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
          <div className="desktop-icon-image">
            {icon.icon === 'winamp' ? WINAMP_ICON : icon.icon}
          </div>
          <span className="desktop-icon-label">
            {icon.label}
          </span>
        </div>
      ))}
    </div>
  );
};
