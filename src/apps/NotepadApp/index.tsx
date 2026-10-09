import React from 'react';
import './index.css';
import { registerOsWindow, setOsWindowTitle } from '../../utils/osWindowRegistry';
import { showMessageBox } from '../../utils/messageBox';
import { applyCascadeAndFit } from '../../utils/cascadePosition';
import type { AppData, RemoteSaveHandle } from '../../types';

/**
 * Placeholder React component — Notepad uses os-gui natively via launchNotepad().
 * This component is never rendered through the React window system.
 */
export const NotepadApp: React.FC = () => {
  return <div data-os-gui-placeholder />;
};

/** File name used before the document is named by the user. */
const UNTITLED = 'Untitled';

// ── Document store ───────────────────────────────────────────────────────────

/** A markdown document held by the Notepad store. */
interface NotepadDocument {
  /** File name without the `.md` extension, e.g. `notes`. */
  name: string;
  content: string;
}

/**
 * Module-level in-memory document store, shared by every Notepad window so a
 * document saved in one window can be opened in another.
 *
 * Nothing here is persisted on purpose: no localStorage, no sessionStorage, no
 * IndexedDB, no backend. Every document is lost on page reload. That trade-off
 * is intentional — the real markdown sources under `src/data/files/` are
 * resolved at build time by `import.meta.glob`, so the site has no runtime
 * write path for them.
 */
const documents = new Map<string, NotepadDocument>();

/**
 * Titlebar/taskbar text for a document name + dirty state.
 * Clean: `notes.md - Notepad`. Dirty: `notes.md * - Notepad`.
 */
function buildWindowTitle(name: string, dirty: boolean): string {
  return `${name}.md${dirty ? ' *' : ''} - Notepad`;
}

/** One Markdown format toolbar button, described as data then built as DOM. */
interface FormatButtonDef {
  /** Text glyph — there are no image assets for these actions. */
  glyph: string;
  /** Accessible name and tooltip. */
  label: string;
  /** Optional extra class for glyphs needing different width or typography. */
  glyphClass?: string;
  /** Runs the action; focus/caret handling lives in the shared helpers. */
  action: () => void;
}

/**
 * Custom launch function that creates an authentic Win98 Notepad window
 * using os-gui $Window and MenuBar.
 *
 * Features:
 *   - Native os-gui window with Win98 titlebar, borders, resize handles
 *   - Menu bar (File, Edit, Help)
 *   - Markdown formatting toolbar with correct caret placement
 *   - Large textarea with Ln/Col tracking in status bar
 *   - Time/Date insertion (F5 / Edit menu)
 *   - File New/Open/Save backed by the module-level in-memory store
 *
 * Two optional payload members redirect that last row:
 *   - `file` seeds the document name and the buffer (Drive opens its markdown
 *     files here instead of editing them in its own window)
 *   - `remoteSave` makes `File > Save` write to the destination that handed it
 *     over instead of the store. The destination owns every word the save shows,
 *     so this window never describes what a write to it means.
 */
export function launchNotepad(appData?: AppData): void {
  const $Window = window.$Window;
  const MenuBar = window.MenuBar;

  if (!$Window || !MenuBar) {
    console.error('os-gui not loaded. Make sure jQuery and os-gui scripts are loaded.');
    return;
  }

  // A seeded document is named after the file it came from, so the titlebar and
  // the store speak about the same thing before the first keystroke.
  const seedName = appData?.file?.name ?? UNTITLED;
  const seedContent = appData?.file?.content ?? '';

  // ── Create the os-gui window ──
  const $win = $Window({
    title: buildWindowTitle(seedName, false),
    icons: {
      16: '/images/icons/notepad-16x16.png',
      32: '/images/icons/notepad-32x32.png',
    },
    minWidth: 300,
    minHeight: 200,
  });

  $win.css({
    width: '450px',
    height: '400px',
  });
  $win.center();
  applyCascadeAndFit($win, 450, 400);
  const windowId = registerOsWindow($win, 'notepad', buildWindowTitle(seedName, false), '/images/icons/notepad-32x32.png');

  // ── Per-window state ──
  /** Name of the document in the textarea ('Untitled' until saved under a name). */
  let documentName = seedName;
  /** True when the textarea holds changes that are not in the store. */
  let isDirty = false;
  /** Write path to a remote destination; null means the store is the destination. */
  let remoteSave: RemoteSaveHandle | null = appData?.remoteSave ?? null;
  /**
   * True while a remote write is in flight. A remote save is a network round
   * trip, so the menu item stays clickable while it runs and a second trigger
   * has to be dropped instead of racing the first write.
   */
  let isSavingRemote = false;

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
          if (!confirmDiscard()) return;
          detachRemoteSave();
          textarea.value = '';
          documentName = UNTITLED;
          isDirty = false;
          updateStatus();
          applyWindowTitle();
          textarea.focus();
        },
      },
      {
        label: '&Open...',
        shortcutLabel: 'Ctrl+O',
        action: () => {
          if (documents.size === 0) {
            showMessageBox({
              title: 'Notepad',
              message: 'There are no saved documents in this session yet.\n\nUse File > Save to store the current document.',
              icon: 'info',
            });
            return;
          }
          if (!confirmDiscard()) return;
          const available = Array.from(documents.keys()).join(', ');
          const answer = prompt(`Open which document?\n\nSaved in this session: ${available}`, documentName);
          if (answer === null) return;
          const wanted = answer.trim();
          const doc = documents.get(wanted);
          if (!doc) {
            showMessageBox({
              title: 'Notepad',
              message: wanted
                ? `"${wanted}" is not a document saved in this session.`
                : 'Type the name of a document to open.',
              icon: 'warning',
            });
            return;
          }
          detachRemoteSave();
          textarea.value = doc.content;
          documentName = doc.name;
          isDirty = false;
          updateStatus();
          applyWindowTitle();
          textarea.focus();
        },
      },
      {
        label: '&Save',
        shortcutLabel: 'Ctrl+S',
        action: saveDocument,
      },
      { separator: true },
      {
        label: 'E&xit',
        action: () => {
          if (!confirmDiscard()) return;
          $win.close();
        },
      },
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

  // ══════ Markdown format toolbar ══════
  // Sits between the menu bar and the sunken edit area, and takes its natural
  // height (the container is a column flexbox and the edit area is flex:1).
  const formatToolbar = document.createElement('div');
  formatToolbar.className = 'notepad-format-toolbar';
  formatToolbar.setAttribute('role', 'toolbar');
  formatToolbar.setAttribute('aria-label', 'Markdown formatting');

  // 1-3 wrap the selection (or insert an empty pair), 4-6 toggle a line
  // prefix, 7-8 ask for a URL because their closing half needs one.
  const formatButtons: FormatButtonDef[] = [
    {
      glyph: 'B',
      label: 'Bold — wrap selection in **',
      glyphClass: 'is-bold',
      action: () => wrapSelection('**', '**', 2),
    },
    {
      glyph: 'I',
      label: 'Italic — wrap selection in _',
      glyphClass: 'is-italic',
      action: () => wrapSelection('_', '_', 1),
    },
    {
      glyph: '</>',
      label: 'Inline code — wrap selection in `',
      glyphClass: 'is-mono',
      action: () => wrapSelection('`', '`', 1),
    },
    {
      glyph: 'H',
      label: 'Heading — toggle ## on the current line',
      action: () => toggleLinePrefix('## '),
    },
    {
      glyph: '•',
      label: 'Bullet list — toggle - on the current line',
      action: () => toggleLinePrefix('- '),
    },
    {
      glyph: '”',
      label: 'Quote — toggle > on the current line',
      action: () => toggleLinePrefix('> '),
    },
    {
      glyph: '[..]',
      label: 'Link — insert [text](url)',
      glyphClass: 'is-mono is-wide',
      action: () => {
        if (hasSelection()) {
          wrapSelection('[', '](url)', 1);
          return;
        }
        const url = prompt('Link URL:');
        if (url === null) return;
        wrapSelection('[', `](${url})`, 1);
      },
    },
    {
      glyph: '![..]',
      label: 'Image — insert ![alt](url)',
      glyphClass: 'is-mono is-wide',
      action: () => {
        if (hasSelection()) {
          wrapSelection('![', '](url)', 2);
          return;
        }
        const url = prompt('Image URL:');
        if (url === null) return;
        wrapSelection('![', `](${url})`, 2);
      },
    },
  ];

  formatButtons.forEach((def, index) => {
    // Separator between the inline group (bold/italic/code) and the block group.
    if (index === 3) formatToolbar.appendChild(createFormatSeparator());
    formatToolbar.appendChild(createFormatButton(def));
  });

  container.appendChild(formatToolbar);

  // ══════ Textarea (edit area) ══════
  const editArea = document.createElement('div');
  editArea.className = 'sunken-panel';
  editArea.style.cssText =
    'flex:1;margin:4px;display:flex;background:var(--Window);';

  const textarea = document.createElement('textarea');
  textarea.className = 'notepad-textarea-os';
  // Seeded before the listeners and the first `updateStatus()` so the window
  // opens already holding the document, with Ln/Col matching its real content.
  textarea.value = seedContent;
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

  // ── Title / dirty state ──

  /**
   * Single place that applies the window title, so the titlebar, the os-gui
   * task and the React taskbar button never drift apart.
   */
  function applyWindowTitle(): void {
    const title = buildWindowTitle(documentName, isDirty);
    $win.title(title);
    setOsWindowTitle(windowId, title);
  }

  /** Flag unsaved buffer changes and refresh the dirty marker in the title. */
  function markDirty(): void {
    isDirty = true;
    applyWindowTitle();
  }

  /** Ask before throwing away unsaved edits. */
  function confirmDiscard(): boolean {
    if (!isDirty) return true;
    return confirm(`Save changes to ${documentName}.md?`);
  }

  // ── Save ──

  /**
   * Drop the remote destination, so the buffer belongs to this session again.
   *
   * A document that replaced the seeded one — `File > New` and `File > Open` —
   * cannot keep writing to the file it replaced: the name in the titlebar would
   * no longer be the file being written.
   */
  function detachRemoteSave(): void {
    remoteSave = null;
  }

  /** `File > Save`: to the destination that launched this window, else to the store. */
  function saveDocument(): void {
    const handle = remoteSave;
    if (handle === null) {
      saveLocal();
      return;
    }
    void saveToRemote(handle);
  }

  /** Save into the in-memory store, asking for a name only while untitled. */
  function saveLocal(): void {
    let name = documentName;
    if (name === UNTITLED) {
      const answer = prompt('Save as (name without the .md extension):', UNTITLED);
      // A cancelled or empty prompt means "do not save".
      if (answer === null) return;
      name = answer.trim();
      if (!name) return;
    }
    documents.set(name, { name, content: textarea.value });
    documentName = name;
    isDirty = false;
    applyWindowTitle();
    showMessageBox({ title: 'Notepad', message: `Saved ${name}.md`, icon: 'info' });
  }

  /**
   * Hand the buffer to the destination that launched this window.
   *
   * The dirty marker survives until the write is acknowledged: a failed save
   * leaves the buffer unsaved on purpose, so closing the window still warns.
   * The outcome is displayed verbatim because the destination wrote it in the
   * user's language, which this window cannot know.
   */
  async function saveToRemote(handle: RemoteSaveHandle): Promise<void> {
    if (isSavingRemote) return;
    isSavingRemote = true;
    const result = await handle.save(textarea.value);
    isSavingRemote = false;

    if (result.ok) {
      isDirty = false;
      applyWindowTitle();
    }

    await showMessageBox({
      title: 'Notepad',
      message: result.message,
      icon: result.ok ? 'info' : 'warning',
    });
  }

  // ── Markdown insertion helpers ──

  /** True when the textarea has a non-empty selection. */
  function hasSelection(): boolean {
    return textarea.selectionStart !== textarea.selectionEnd;
  }

  /**
   * Wrap the current selection in an inline delimiter pair.
   *
   * With a selection the pair wraps it and the caret ends up after the closing
   * delimiter. With no selection the empty pair is inserted and the caret is
   * parked at `emptyCaretIndex` (measured from the start of the inserted text)
   * so the user types inside the delimiters.
   */
  function wrapSelection(before: string, after: string, emptyCaretIndex: number): void {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.slice(start, end);
    const inserted = `${before}${selected}${after}`;
    textarea.setRangeText(inserted, start, end, 'end');
    const caret = start + (selected ? selected.length + after.length : emptyCaretIndex);
    textarea.setSelectionRange(caret, caret);
    textarea.focus();
    markDirty();
    updateStatus();
  }

  /**
   * Toggle a line prefix on the caret line, or on every line of a multi-line
   * selection. Lines that already carry the exact prefix have it removed, so
   * pressing the button twice never stacks the prefix.
   */
  function toggleLinePrefix(prefix: string): void {
    const value = textarea.value;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    // selectionStart === 0 must short-circuit: lastIndexOf('\n', -1) clamps its
    // start to index 0, so a document beginning with a newline would report the
    // caret line as starting one character late and prefix the wrong line.
    const blockStart = selectionStart === 0 ? 0 : value.lastIndexOf('\n', selectionStart - 1) + 1;
    const newlineAfter = value.indexOf('\n', selectionEnd);
    const blockEnd = newlineAfter === -1 ? value.length : newlineAfter;

    const lines = value.slice(blockStart, blockEnd).split('\n');
    const remove = lines.every((line) => line.startsWith(prefix));
    const updated = lines
      .map((line) => (remove ? line.slice(prefix.length) : `${prefix}${line}`))
      .join('\n');

    textarea.setRangeText(updated, blockStart, blockEnd, 'end');
    const delta = updated.length - (blockEnd - blockStart);
    textarea.setSelectionRange(
      Math.max(blockStart, selectionStart + delta),
      Math.max(blockStart, selectionEnd + delta),
    );
    textarea.focus();
    markDirty();
    updateStatus();
  }

  /** Build one format toolbar button: text glyph, tooltip, accessible name. */
  function createFormatButton(def: FormatButtonDef): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = def.glyphClass ? `notepad-format-button ${def.glyphClass}` : 'notepad-format-button';
    btn.title = def.label;
    btn.setAttribute('aria-label', def.label);

    const glyph = document.createElement('span');
    glyph.className = 'notepad-format-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = def.glyph;
    btn.appendChild(glyph);

    btn.addEventListener('click', def.action);
    return btn;
  }

  /** Vertical separator between toolbar groups. */
  function createFormatSeparator(): HTMLHRElement {
    const hr = document.createElement('hr');
    hr.className = 'notepad-format-separator';
    hr.setAttribute('aria-orientation', 'vertical');
    return hr;
  }

  /** Flag typing as unsaved without touching the title from the listeners. */
  function handleInput(): void {
    isDirty = true;
    applyWindowTitle();
  }

  textarea.addEventListener('input', handleInput);
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
    markDirty();
    updateStatus();
  }

  applyWindowTitle();
  container.appendChild(statusBar);

  // ── Append everything to the os-gui window ──
  $win.$content.append(container);
}