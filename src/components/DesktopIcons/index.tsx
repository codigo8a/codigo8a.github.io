import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import './index.css';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DesktopIcon {
  id: string;
  icon: string;
  label: string;
}

interface IconPosition {
  x: number;
  y: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'desktop-icon-positions';
const ICON_W = 72;  // 64px width + 8px padding
const ICON_H = 72;  // approximate height
const GAP = 8;
const LEFT = 4;
const TOP = 13;

const APP_ICONS: Record<string, React.ReactNode> = {
  winamp: (
    <img 
      src="/images/icons/winamp2-32x32.png" 
      alt="Winamp" 
      width={32} 
      height={32} 
    />
  ),
  iexplorer: (
    <img 
      src="/images/icons/iexplorer-32x32.png" 
      alt="Internet Explorer" 
      width={32} 
      height={32} 
    />
  ),
  myDocuments: (
    <img 
      src="/images/icons/my-documents-folder-32x32.png" 
      alt="My Documents" 
      width={32} 
      height={32} 
    />
  ),
  myComputer: (
    <img 
      src="/images/icons/my-computer-32x32.png" 
      alt="My Computer" 
      width={32} 
      height={32} 
    />
  ),
  network: (
    <img 
      src="/images/icons/network-32x32.png" 
      alt="Network Neighborhood" 
      width={32} 
      height={32} 
    />
  ),
  recycleBin: (
    <img 
      src="/images/icons/recycle-bin-32x32.png" 
      alt="Recycle Bin" 
      width={32} 
      height={32} 
    />
  ),
  notepad: (
    <img 
      src="/images/icons/notepad-32x32.png" 
      alt="Notepad" 
      width={32} 
      height={32} 
    />
  ),
  soundRecorder: (
    <img 
      src="/images/icons/speaker-32x32.png" 
      alt="Sound Recorder" 
      width={32} 
      height={32} 
    />
  ),
  msdos: (
    <img 
      src="/images/icons/msdos-32x32.png" 
      alt="MS-DOS Prompt" 
      width={32} 
      height={32} 
    />
  ),
  search: (
    <img 
      src="/images/icons/search.svg" 
      alt="Search" 
      width={32} 
      height={32} 
    />
  ),
  portfolio: (
    <img 
      src="/images/icons/paint-32x32.png" 
      alt="Portfolio" 
      width={32} 
      height={32} 
    />
  ),
};

/**
 * Grid positions (2 columns):
 *   col 0         | col 1
 *   My Computer   | My Documents
 *   Recycle Bin   | Search
 *   Internet Exp. | Portfolio
 *   Network...    | Winamp
 * Remaining icons flow below in col 0.
 */
const ICON_GRID: Record<string, [number, number]> = {
  myComputer:    [0, 0],
  recycleBin:    [0, 1],
  browser:       [0, 2],
  myDocuments:   [1, 0],
  search:        [1, 1],
  portfolio:     [1, 2],
  winamp:        [1, 3],
};

const DESKTOP_ICONS: DesktopIcon[] = [
  // Column 0, top to bottom
  { id: 'myComputer', icon: 'myComputer', label: 'My Computer' },
  { id: 'recycleBin', icon: 'recycleBin', label: 'Recycle Bin' },
  { id: 'browser', icon: 'iexplorer', label: 'Internet Explorer' },
  // Column 1, top to bottom (to the right of column 0)
  { id: 'myDocuments', icon: 'myDocuments', label: 'My Documents' },
  { id: 'search', icon: 'search', label: 'Search documents' },
  { id: 'portfolio', icon: 'portfolio', label: 'Portfolio' },
  { id: 'winamp', icon: 'winamp', label: 'Winamp' },
  // Rest
  { id: 'network', icon: 'network', label: 'Network Neighborhood' },
  { id: 'notepad', icon: 'notepad', label: 'Notepad' },
  { id: 'soundRecorder', icon: 'soundRecorder', label: 'Sound Recorder' },
  { id: 'msdos', icon: 'msdos', label: 'MS-DOS Prompt' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadPositions(): Record<string, IconPosition> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function savePositions(positions: Record<string, IconPosition>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function getDefaultPositions(): Record<string, IconPosition> {
  const positions: Record<string, IconPosition> = {};
  DESKTOP_ICONS.forEach((icon, i) => {
    const grid = ICON_GRID[icon.id];
    if (grid) {
      const [col, row] = grid;
      positions[icon.id] = {
        x: LEFT + col * (ICON_W + GAP),
        y: TOP + row * (ICON_H + GAP),
      };
    } else {
      // Remaining icons flow below the grid in column 0
      const row = 3 + (i - 7); // items 7+ go in rows 3+
      positions[icon.id] = {
        x: LEFT,
        y: TOP + row * (ICON_H + GAP),
      };
    }
  });
  return positions;
}

function getInitialPositions(): Record<string, IconPosition> {
  const saved = loadPositions();
  const defaults = getDefaultPositions();
  // Merge: use saved positions where available, defaults for the rest
  const result: Record<string, IconPosition> = {};
  DESKTOP_ICONS.forEach((icon) => {
    result[icon.id] = saved[icon.id] || defaults[icon.id];
  });
  return result;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const DesktopIcons: React.FC = () => {
  const { openApp, launchWinamp } = useDesktop();
  const [positions, setPositions] = useState<Record<string, IconPosition>>(getInitialPositions);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [dragging, setDragging] = useState<string | null>(null);

  // Keep a ref to latest positions for use inside event callbacks
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  // Drag state stored in ref (avoids stale closures)
  const drag = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  // Z-index counter for icons
  const zCounter = useRef(2);

  const handleOpenApp = useCallback((iconId: string) => {
    if (iconId === 'myDocuments') {
      openApp('fileExplorer');
    } else if (iconId === 'search') {
      openApp('search');
    } else if (iconId === 'browser') {
      openApp('iexplorer');
    } else if (iconId === 'winamp') {
      launchWinamp();
    } else if (iconId === 'portfolio') {
      openApp('portfolio');
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
  }, [openApp, launchWinamp]);

  // ── Mouse handlers ──

  const handleMouseDown = useCallback((e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    const pos = positionsRef.current[iconId];
    if (!pos) return;

    drag.current = {
      id: iconId,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };

    // Bring to front
    const z = zCounter.current++;
    setZIndexes((prev) => ({ ...prev, [iconId]: z }));
    setDragging(iconId);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const d = drag.current;
    if (!d) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      d.moved = true;
    }

    setPositions((prev) => ({
      ...prev,
      [d.id]: { x: d.origX + dx, y: d.origY + dy },
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    const d = drag.current;
    if (!d) {
      setDragging(null);
      return;
    }

    if (d.moved) {
      // Persist final positions
      setPositions((prev) => {
        savePositions(prev);
        return prev;
      });
    } else {
      // Was a click — open the app
      handleOpenApp(d.id);
    }

    drag.current = null;
    setDragging(null);
  }, [handleOpenApp]);

  // Global listeners while dragging
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  // ── Render ──

  return (
    <div className="desktop-icons">
      {DESKTOP_ICONS.map((icon) => {
        const pos = positions[icon.id];
        return (
          <div
            key={icon.id}
            className={
              'desktop-icon' + (dragging === icon.id ? ' dragging' : '')
            }
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: zIndexes[icon.id] ?? 0,
            }}
            onMouseDown={(e) => handleMouseDown(e, icon.id)}
          >
            <div className="desktop-icon-image">
              {APP_ICONS[icon.icon] ?? icon.icon}
            </div>
            <span className="desktop-icon-label">{icon.label}</span>
          </div>
        );
      })}
    </div>
  );
};
