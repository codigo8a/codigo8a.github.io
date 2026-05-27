import type { MenuItem, MenuDefinition } from '../components/molecules/MenuBar';

// Common menu items
export const MENU_DIVIDER: MenuItem = { label: '', separator: true };

export const createDefaultMenus = (customActions?: {
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  onSaveAs?: () => void;
  onExit?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onFind?: () => void;
  onViewSource?: () => void;
  onReload?: () => void;
  onBack?: () => void;
  onForward?: () => void;
  onHome?: () => void;
}): MenuDefinition => {
  const fileMenu: MenuItem[] = [];
  if (customActions?.onNew) fileMenu.push({ label: '&New', shortcut: 'Ctrl+N', action: customActions.onNew });
  if (customActions?.onOpen) fileMenu.push({ label: '&Open...', shortcut: 'Ctrl+O', action: customActions.onOpen });
  if (customActions?.onSave) fileMenu.push({ label: '&Save', shortcut: 'Ctrl+S', action: customActions.onSave });
  if (customActions?.onSaveAs) fileMenu.push({ label: 'Save &As...', action: customActions.onSaveAs });
  if (fileMenu.length > 0) fileMenu.push(MENU_DIVIDER);
  if (customActions?.onExit) fileMenu.push({ label: 'E&xit', action: customActions.onExit });

  const editMenu: MenuItem[] = [];
  if (customActions?.onUndo) editMenu.push({ label: '&Undo', shortcut: 'Ctrl+Z', action: customActions.onUndo });
  if (customActions?.onRedo) editMenu.push({ label: '&Redo', shortcut: 'Ctrl+Y', action: customActions.onRedo });
  if (editMenu.length > 0) editMenu.push(MENU_DIVIDER);
  if (customActions?.onCut) editMenu.push({ label: 'Cu&t', shortcut: 'Ctrl+X', action: customActions.onCut });
  if (customActions?.onCopy) editMenu.push({ label: '&Copy', shortcut: 'Ctrl+C', action: customActions.onCopy });
  if (customActions?.onPaste) editMenu.push({ label: '&Paste', shortcut: 'Ctrl+V', action: customActions.onPaste });
  if (customActions?.onDelete) editMenu.push({ label: '&Delete', shortcut: 'Del', action: customActions.onDelete });
  if (customActions?.onSelectAll) editMenu.push({ label: 'Select &All', shortcut: 'Ctrl+A', action: customActions.onSelectAll });

  const viewMenu: MenuItem[] = [];
  if (customActions?.onReload) viewMenu.push({ label: '&Reload', shortcut: 'F5', action: customActions.onReload });
  if (customActions?.onViewSource) viewMenu.push({ label: 'View &Source', action: customActions.onViewSource });

  const navigateMenu: MenuItem[] = [];
  if (customActions?.onBack) navigateMenu.push({ label: '&Back', shortcut: 'Alt+←', action: customActions.onBack });
  if (customActions?.onForward) navigateMenu.push({ label: '&Forward', shortcut: 'Alt+→', action: customActions.onForward });
  if (customActions?.onHome) navigateMenu.push({ label: '&Home', shortcut: 'Alt+Home', action: customActions.onHome });

  const helpMenu: MenuItem[] = [
    { label: '&About', action: () => alert('Windows 98 Desktop\nVersion 1.0\nA React implementation of Windows 98') },
  ];

  const menus: MenuDefinition = {};
  if (fileMenu.length > 0) menus['&File'] = fileMenu;
  if (editMenu.length > 0) menus['&Edit'] = editMenu;
  if (viewMenu.length > 0) menus['&View'] = viewMenu;
  if (navigateMenu.length > 0) menus['&Navigate'] = navigateMenu;
  menus['&Help'] = helpMenu;

  return menus;
};

// Minimal menu for simple apps
export const minimalMenu: MenuDefinition = {
  '&File': [
    MENU_DIVIDER,
    { label: 'E&xit', action: () => window.close() },
  ].filter(Boolean) as any,
  '&Help': [
    { label: '&About', action: () => alert('Windows 98 Desktop\nVersion 1.0') },
  ],
};