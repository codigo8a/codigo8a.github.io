import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import './index.css';

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
}

const APP_ICONS: Record<string, React.ReactNode> = {
  winamp: (
    <img 
      src="/app/icons/winamp2-32x32.png" 
      alt="Winamp" 
      width={32} 
      height={32} 
    />
  ),
  iexplorer: (
    <img 
      src="/app/icons/iexplorer-32x32.png" 
      alt="Internet Explorer" 
      width={32} 
      height={32} 
    />
  ),
  myDocuments: (
    <img 
      src="/app/icons/my-documents-folder-32x32.png" 
      alt="My Documents" 
      width={32} 
      height={32} 
    />
  ),
};

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'myDocuments', icon: 'myDocuments', label: 'My Documents' },
  { id: 'find', icon: '🔍', label: 'Find' },
  { id: 'browser', icon: 'iexplorer', label: 'Internet Explorer' },
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
      openApp('iexplorer');
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
            {APP_ICONS[icon.icon] ?? icon.icon}
          </div>
          <span className="desktop-icon-label">
            {icon.label}
          </span>
        </div>
      ))}
    </div>
  );
};
