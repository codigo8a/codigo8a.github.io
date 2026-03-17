import { useEffect, useRef } from 'react';
import { useFileSystem } from './useFileSystem';
import { WindowConfig } from '../types';

export const useUrlRouting = (windows: WindowConfig[], openApp: (appId: string, appData?: any) => void) => {
  const { findFileByUrl } = useFileSystem();
  const initialPathRef = useRef<string | null>(null);

  // Handle initial URL routing on mount
  useEffect(() => {
    const path = decodeURIComponent(window.location.pathname.slice(1));
    if (path) {
      initialPathRef.current = path;
      const parts = path.split('/');
      if (parts.length >= 2) {
        const folder = parts[0];
        const filename = parts[1];
        
        const fileData = findFileByUrl(folder, filename);
        if (fileData) {
          const displayTitle = fileData.name.replace('.md', '');
          openApp('fileViewer', {
            file: {
              name: displayTitle,
              content: fileData.content,
              rawContent: fileData.rawContent,
              folder: fileData.folder,
              date: fileData.date
            },
            windowKey: `${fileData.folder}/${fileData.name}`,
            title: displayTitle
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL with window state (cleanup URL when no relevant windows are open)
  useEffect(() => {
    // Wait until initial routing has had a chance to open its window
    if (initialPathRef.current && windows.length === 0) {
      return;
    }

    const isAnyFileViewerOpen = windows.some(win => win.appId === 'fileViewer' && !win.isMinimized);
    
    if (!isAnyFileViewerOpen && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  }, [windows]);
};
