import type { MenuDefinition } from '../components/molecules/MenuBar';

// Menu definitions per app type
export const getAppMenu = (appId: string, actions?: any): MenuDefinition | null => {
  switch (appId) {
    case 'notepad':
      return {
        '&File': [
          { label: '&New', shortcut: 'Ctrl+N', action: () => actions?.onNew?.() },
          { label: '&Open...', shortcut: 'Ctrl+O', action: () => actions?.onOpen?.() },
          { label: '&Save', shortcut: 'Ctrl+S', action: () => actions?.onSave?.() },
          { label: 'Save &As...', shortcut: 'Ctrl+Shift+S', action: () => actions?.onSaveAs?.() },
          { separator: true },
          { label: 'E&xit', shortcut: 'Alt+F4', action: () => actions?.onExit?.() },
        ],
        '&Edit': [
          { label: '&Undo', shortcut: 'Ctrl+Z', action: () => actions?.onUndo?.() },
          { label: '&Redo', shortcut: 'Ctrl+Y', action: () => actions?.onRedo?.() },
          { separator: true },
          { label: 'Cu&t', shortcut: 'Ctrl+X', action: () => actions?.onCut?.() },
          { label: '&Copy', shortcut: 'Ctrl+C', action: () => actions?.onCopy?.() },
          { label: '&Paste', shortcut: 'Ctrl+V', action: () => actions?.onPaste?.() },
          { label: '&Delete', shortcut: 'Del', action: () => actions?.onDelete?.() },
          { separator: true },
          { label: 'Select &All', shortcut: 'Ctrl+A', action: () => actions?.onSelectAll?.() },
          { label: '&Find...', shortcut: 'Ctrl+F', action: () => actions?.onFind?.() },
        ],
        '&Help': [
          { label: '&About Notepad', action: () => alert('Notepad\nWindows 98 Desktop Edition') },
        ],
      };

    case 'fileViewer':
      return {
        '&File': [
          { label: '&Open...', shortcut: 'Ctrl+O', action: () => actions?.onOpen?.() },
          { label: '&Close', shortcut: 'Ctrl+W', action: () => actions?.onClose?.() },
          { separator: true },
          { label: 'E&xit', shortcut: 'Alt+F4', action: () => actions?.onExit?.() },
        ],
        '&View': [
          { label: '&Preview', action: () => actions?.onPreview?.() },
          { label: '&Source', shortcut: 'Ctrl+U', action: () => actions?.onSource?.() },
          { separator: true },
          { label: 'View &Source', action: () => actions?.onViewSource?.() },
        ],
        '&Help': [
          { label: '&About File Viewer', action: () => alert('File Viewer\nWindows 98 Desktop Edition') },
        ],
      };

    case 'search':
      return {
        '&Search': [
          { label: '&Find Files...', shortcut: 'Ctrl+F', action: () => actions?.onFind?.() },
          { label: 'Find &Next', shortcut: 'F3', action: () => actions?.onFindNext?.() },
        ],
        '&Help': [
          { label: '&About Search', action: () => alert('Search\nWindows 98 Desktop Edition') },
        ],
      };

    case 'settings':
      return {
        '&Settings': [
          { label: '&General', action: () => actions?.onGeneral?.() },
          { label: '&Desktop', action: () => actions?.onDesktop?.() },
        ],
        '&Help': [
          { label: '&About Settings', action: () => alert('Settings\nWindows 98 Desktop Edition') },
        ],
      };

    case 'iexplorer':
      return {
        '&File': [
          { label: '&Open...', shortcut: 'Ctrl+L', action: () => actions?.onOpen?.() },
          { label: 'E&xit', shortcut: 'Alt+F4', action: () => actions?.onExit?.() },
        ],
        '&Navigate': [
          { label: '&Back', shortcut: 'Alt+←', action: () => actions?.onBack?.() },
          { label: '&Forward', shortcut: 'Alt+→', action: () => actions?.onForward?.() },
          { label: '&Home', shortcut: 'Alt+Home', action: () => actions?.onHome?.() },
          { separator: true },
          { label: '&Refresh', shortcut: 'F5', action: () => actions?.onReload?.() },
        ],
        '&View': [
          { label: 'View &Source', shortcut: 'Ctrl+U', action: () => actions?.onViewSource?.() },
          { label: '&Stop', shortcut: 'Esc', action: () => actions?.onStop?.() },
        ],
        '&Help': [
          { label: '&About Browser', action: () => alert('Browser\nWindows 98 Desktop Edition') },
        ],
      };

    case 'welcome':
    case 'fileExplorer':
      return {
        '&File': [
          { label: '&Close', shortcut: 'Alt+F4', action: () => actions?.onClose?.() },
        ],
        '&Help': [
          { label: '&About', action: () => actions?.onAbout?.() },
        ],
      };

    default:
      return {
        '&File': [
          { label: 'E&xit', action: () => window.close() },
        ],
        '&Help': [
          { label: '&About', action: () => alert('Windows 98 Desktop\nVersion 1.0') },
        ],
      };
  }
};