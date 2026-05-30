import React from 'react';
import './index.css';
import { registerOsWindow } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';

/**
 * Placeholder React component — Notepad uses os-gui natively via launchNotepad().
 * This component is never rendered through the React window system.
 */
export const NotepadApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

/**
 * Custom launch function that creates an authentic Win98 Notepad window
 * using os-gui $Window and MenuBar.
 *
 * Features:
 *   - Native os-gui window with Win98 titlebar, borders, resize handles
 *   - Menu bar (File, Edit, Help)
 *   - Large textarea with Ln/Col tracking in status bar
 *   - Time/Date insertion (F5 / Edit menu)
 */
export function launchNotepad(): void {
  const $Window = (window as any).$Window;
  const MenuBar = (window as any).MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // ── Create the os-gui window ──
  const $win = $Window({
    title: 'Untitled - Notepad',
    icons: {
      16: '/app/icons/notepad-16x16.png',
      32: '/app/icons/notepad-32x32.png',
    },
    minWidth: 300,
    minHeight: 200,
  });

  $win.css({
    width: '450px',
    height: '350px',
  });
  $win.center();
  registerOsWindow($win, 'notepad', 'Untitled - Notepad', '/app/icons/notepad-32x32.png');

  // ── Build Notepad layout ──
  const container = document.createElement('div');
  container.className = 'notepad-container-os';

  // ══════ Menu bar ══════
  const menu = new MenuBar({
    '&File': [
      {
        label: '&New',
        shortcutLabel: 'Ctrl+N',
        action: () => {
          if (textarea.value && !confirm('Save changes to Untitled?')) return;
          textarea.value = '';
          updateStatus();
        },
      },
      {
        label: '&Open...',
        shortcutLabel: 'Ctrl+O',
        action: () => showMessageBox({ title: 'Notepad', message: 'Open file dialog (not implemented)', icon: 'info' }),
      },
      {
        label: '&Save',
        shortcutLabel: 'Ctrl+S',
        action: () => showMessageBox({ title: 'Notepad', message: 'Save dialog (not implemented)', icon: 'info' }),
      },
      { separator: true },
      { label: 'E&xit', action: () => $win.close() },
    ],
    '&Edit': [
      { label: '&Undo', shortcutLabel: 'Ctrl+Z', enabled: false },
      { separator: true },
      {
        label: 'Cu&t',
        shortcutLabel: 'Ctrl+X',
        action: () => document.execCommand('cut'),
      },
      {
        label: '&Copy',
        shortcutLabel: 'Ctrl+C',
        action: () => document.execCommand('copy'),
      },
      {
        label: '&Paste',
        shortcutLabel: 'Ctrl+V',
        action: () => document.execCommand('paste'),
      },
      { separator: true },
      {
        label: 'Select &All',
        shortcutLabel: 'Ctrl+A',
        action: () => textarea.select(),
      },
      {
        label: '&Time/Date',
        shortcutLabel: 'F5',
        action: insertTimeDate,
      },
    ],
    '&Help': [
      {
        label: '&About Notepad',
        action: () =>
          showMessageBox({ title: 'About Notepad', message: 'Notepad\n\nA simple text editor built with os-gui.\nBased on Windows 98 Notepad.', icon: 'info' }),
      },
    ],
  });

  // Menu bar wrapper (toolbar style matching 98.js convention)
  const menuToolbar = document.createElement('div');
  menuToolbar.className = 'toolbar';
  menuToolbar.appendChild(menu.element);
  container.appendChild(menuToolbar);

  // ══════ Textarea (edit area) ══════
  const editArea = document.createElement('div');
  editArea.className = 'sunken-panel';
  editArea.style.cssText =
    'flex:1;margin:4px;display:flex;background:var(--Window);';

  const textarea = document.createElement('textarea');
  textarea.className = 'notepad-textarea-os';
  textarea.style.cssText = [
    'width: 100%;',
    'height: 100%;',
    'border: none;',
    'resize: none;',
    'outline: none;',
    'padding: 4px;',
    "font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;",
    'font-size: 11px;',
    'color: var(--WindowText);',
    'background: transparent;',
  ].join('');

  editArea.appendChild(textarea);
  container.appendChild(editArea);

  // ══════ Status bar ══════
  const statusBar = document.createElement('div');
  statusBar.className = 'notepad-statusbar-os';

  /** Recalculate cursor position and update status bar. */
  function updateStatus(): void {
    const text = textarea.value;
    const lines = text.split('\n');
    const lineCount = lines.length;
    const col = lines[lineCount - 1].length + 1;
    statusBar.textContent = `Ln ${lineCount}, Col ${col}`;
  }

  textarea.addEventListener('input', updateStatus);
  textarea.addEventListener('keyup', updateStatus);
  textarea.addEventListener('click', updateStatus);
  updateStatus();

  // ══════ Time/Date insertion ══════
  function insertTimeDate(): void {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const stamp = `${hh}:${mm} ${month}/${day}/${year}`;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.setRangeText(stamp, start, end, 'end');
    textarea.focus();
    updateStatus();
  }

  container.appendChild(statusBar);

  // ── Append everything to the os-gui window ──
  $win.$content.append(container);
}
