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
  myComputer: (
    <img 
      src="/app/icons/my-computer-32x32.png" 
      alt="My Computer" 
      width={32} 
      height={32} 
    />
  ),
  network: (
    <img 
      src="/app/icons/network-32x32.png" 
      alt="Network Neighborhood" 
      width={32} 
      height={32} 
    />
  ),
  recycleBin: (
    <img 
      src="/app/icons/recycle-bin-32x32.png" 
      alt="Recycle Bin" 
      width={32} 
      height={32} 
    />
  ),
  notepad: (
    <img 
      src="/app/icons/notepad-32x32.png" 
      alt="Notepad" 
      width={32} 
      height={32} 
    />
  ),
  soundRecorder: (
    <img 
      src="/app/icons/speaker-32x32.png" 
      alt="Sound Recorder" 
      width={32} 
      height={32} 
    />
  ),
  msdos: (
    <img 
      src="/app/icons/msdos-32x32.png" 
      alt="MS-DOS Prompt" 
      width={32} 
      height={32} 
    />
  ),
};

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'myComputer', icon: 'myComputer', label: 'My Computer' },
  { id: 'myDocuments', icon: 'myDocuments', label: 'My Documents' },
  { id: 'network', icon: 'network', label: 'Network Neighborhood' },
  { id: 'recycleBin', icon: 'recycleBin', label: 'Recycle Bin' },
  { id: 'find', icon: '🔍', label: 'Find' },
  { id: 'browser', icon: 'iexplorer', label: 'Internet Explorer' },
  { id: 'notepad', icon: 'notepad', label: 'Notepad' },
  { id: 'soundRecorder', icon: 'soundRecorder', label: 'Sound Recorder' },
  { id: 'msdos', icon: 'msdos', label: 'MS-DOS Prompt' },
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
    } else if (iconId === 'myComputer') {
      openApp('myComputer');
    } else if (iconId === 'network') {
      openApp('network');
    } else if (iconId === 'recycleBin') {
      openApp('recycleBin');
    } else if (iconId === 'notepad') {
      openApp('notepad');
    } else if (iconId === 'soundRecorder') {
      openApp('soundRecorder');
    } else if (iconId === 'msdos') {
      openApp('msdos');
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
