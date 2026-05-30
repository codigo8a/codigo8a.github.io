/**
 * messageBox — Windows 98-style message box dialog using os-gui.
 *
 * Replaces native `alert()` with an authentic Win98 dialog window.
 * Supports icon types (error, warning, info, question) and common
 * button combinations (OK, OKCancel, YesNo, etc.).
 *
 * Usage:
 *   import { showMessageBox } from '../../utils/messageBox';
 *   await showMessageBox({ title: 'Error', message: 'Something went wrong', icon: 'error' });
 *   const result = await showMessageBox({ title: 'Confirm', message: 'Continue?', buttons: 'YesNo' });
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageBoxIcon = 'error' | 'warning' | 'info' | 'question';
export type MessageBoxButtons =
  | 'OK'
  | 'OKCancel'
  | 'YesNo'
  | 'YesNoCancel'
  | 'RetryCancel'
  | 'AbortRetryIgnore';
export type MessageBoxResult = 'ok' | 'cancel' | 'yes' | 'no' | 'retry' | 'abort' | 'ignore';

export interface MessageBoxOptions {
  title: string;
  message: string;
  icon?: MessageBoxIcon;
  buttons?: MessageBoxButtons;
}

// ─── Icon paths (authentic Windows 98 32×32 PNGs from 98.js.org) ─────────────

const ICON_PATHS: Record<MessageBoxIcon, string> = {
  error: '/images/icons/error-32x32.png',
  warning: '/images/icons/warning-32x32.png',
  info: '/images/icons/info-32x32.png',
  question: '/images/icons/question-32x32.png',
};

// ─── Button definitions ───────────────────────────────────────────────────────

interface ButtonDef {
  label: string;
  value: MessageBoxResult;
  default: boolean;
}

const BUTTON_SETS: Record<MessageBoxButtons, ButtonDef[]> = {
  OK: [{ label: 'OK', value: 'ok', default: true }],
  OKCancel: [
    { label: 'OK', value: 'ok', default: true },
    { label: 'Cancel', value: 'cancel', default: false },
  ],
  YesNo: [
    { label: 'Yes', value: 'yes', default: true },
    { label: 'No', value: 'no', default: false },
  ],
  YesNoCancel: [
    { label: 'Yes', value: 'yes', default: true },
    { label: 'No', value: 'no', default: false },
    { label: 'Cancel', value: 'cancel', default: false },
  ],
  RetryCancel: [
    { label: 'Retry', value: 'retry', default: true },
    { label: 'Cancel', value: 'cancel', default: false },
  ],
  AbortRetryIgnore: [
    { label: 'Abort', value: 'abort', default: false },
    { label: 'Retry', value: 'retry', default: true },
    { label: 'Ignore', value: 'ignore', default: false },
  ],
};

// ─── Sound ─────────────────────────────────────────────────────────────────────

let chordAudio: HTMLAudioElement | null = null;
let audioReady = false;

/**
 * Initializes and preloads the CHORD.WAV audio element.
 * Called at module level so the WAV starts loading immediately
 * when the page loads, well before the first user interaction.
 */
function ensureAudio(): HTMLAudioElement | null {
  if (!chordAudio) {
    try {
      chordAudio = new Audio('/audio/CHORD.WAV');
      chordAudio.volume = 0.5;
      chordAudio.preload = 'auto';
      // Mark as ready once loaded
      chordAudio.addEventListener('canplaythrough', () => {
        audioReady = true;
      }, { once: true });
      chordAudio.load();
    } catch {
      return null;
    }
  }
  return chordAudio;
}

// Start preloading immediately so the WAV is ready by the time
// the user sees their first message box.
ensureAudio();

/**
 * Plays the authentic Windows 98 CHORD.WAV system sound.
 * Safe to call from user-gesture handlers (menu clicks, button clicks).
 *
 * If the audio hasn't finished loading yet (race condition on first call),
 * it waits for `canplaythrough` before playing.
 * Silently ignores autoplay policy errors if called outside a gesture.
 */
function playSystemSound(): void {
  const audio = ensureAudio();
  if (!audio) return;

  try {
    audio.currentTime = 0;

    if (audioReady) {
      audio.play().catch(() => {});
    } else {
      // Audio still loading — play as soon as it's ready
      audio.addEventListener('canplaythrough', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }, { once: true });
    }
  } catch {
    // Audio not supported — noop
  }
}

/**
 * Pre-warms the audio system on first user interaction (e.g., first menu click).
 * Call this early in the app lifecycle after a user gesture.
 */
export function prewarmAudio(): void {
  const audio = ensureAudio();
  if (!audio) return;
  // Load enough of the audio to be ready for instant playback
  try {
    audio.load();
  } catch {
    // noop
  }
}

// ─── Dialog dimensions ────────────────────────────────────────────────────────

const DIALOG_WIDTH = 360;
const MIN_MESSAGE_HEIGHT = 60;

// ─── showMessageBox ───────────────────────────────────────────────────────────

/**
 * Opens an authentic Windows 98-style message box dialog using os-gui.
 *
 * Returns a Promise that resolves with the button the user clicked
 * (e.g. 'ok', 'cancel', 'yes', 'no', 'retry', 'abort', 'ignore').
 *
 * The dialog is non-resizable, has no minimize/maximize buttons, and
 * does NOT register with the taskbar (true to Win98 behavior).
 */
export function showMessageBox(options: MessageBoxOptions): Promise<MessageBoxResult> {
  const $Window = (window as any).$Window;

  if (!$Window) {
    // Fallback: if os-gui isn't loaded, use native alert
    window.alert(options.message);
    return Promise.resolve('ok' as MessageBoxResult);
  }

  const icon = options.icon ?? 'info';
  const buttons = options.buttons ?? 'OK';
  const buttonDefs = BUTTON_SETS[buttons];

  // Play the classic Windows system sound
  playSystemSound();

  // Calculate message height based on line count
  const lineCount = options.message.split('\n').length;
  const messageHeight = Math.max(MIN_MESSAGE_HEIGHT, lineCount * 18 + 10);
  const totalHeight = 45 + messageHeight + 40 + 10; // padding + message + button area

  return new Promise((resolve) => {
    const $win = $Window({
      title: options.title,
      resizable: false,
      minimizeButton: false,
      maximizeButton: false,
    });

    $win.css({
      width: `${DIALOG_WIDTH}px`,
      height: `${totalHeight}px`,
    });

    // Center on screen
    $win.center();

    // ── Content container ──
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 12px 16px;
      box-sizing: border-box;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      font-size: 11px;
    `;

    // ── Message row (icon + text) ──
    const msgRow = document.createElement('div');
    msgRow.style.cssText = `
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex: 1;
    `;

    // Icon (authentic Windows 98 PNG)
    const iconEl = document.createElement('img');
    iconEl.src = ICON_PATHS[icon];
    iconEl.width = 32;
    iconEl.height = 32;
    iconEl.alt = '';
    iconEl.style.cssText = `
      flex-shrink: 0;
      margin-top: 4px;
    `;
    msgRow.appendChild(iconEl);

    // Message text
    const msgEl = document.createElement('div');
    msgEl.style.cssText = `
      flex: 1;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      padding-top: 6px;
      color: var(--WindowText);
    `;
    msgEl.textContent = options.message;
    msgRow.appendChild(msgEl);

    container.appendChild(msgRow);

    // ── Button row ──
    const btnRow = document.createElement('div');
    btnRow.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 8px;
      padding-top: 12px;
      flex-shrink: 0;
    `;

    const buttonsEls: HTMLButtonElement[] = [];

    buttonDefs.forEach((def, idx) => {
      const btn = document.createElement('button');
      btn.textContent = def.label;
      btn.style.cssText = `
        min-width: 75px;
        padding: 4px 16px;
        font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
        font-size: 11px;
        cursor: pointer;
      `;

      btn.addEventListener('click', () => {
        $win.close();
        resolve(def.value);
      });

      btnRow.appendChild(btn);
      buttonsEls.push(btn);

      // Focus the default button
      if (def.default) {
        // Focus after window is shown
        requestAnimationFrame(() => {
          btn.focus();
        });
      }
    });

    container.appendChild(btnRow);

    $win.$content.append(container);

    // Handle keyboard: Enter triggers default button, Escape triggers cancel/close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Find Cancel or close button
        const cancelDef = buttonDefs.find((d) => d.value === 'cancel' || d.value === 'no');
        if (cancelDef) {
          const idx = buttonDefs.indexOf(cancelDef);
          if (idx >= 0 && buttonsEls[idx]) {
            buttonsEls[idx].click();
          }
        } else {
          $win.close();
          resolve('cancel');
        }
      } else if (e.key === 'Enter') {
        const defaultDef = buttonDefs.find((d) => d.default);
        const defaultBtn = defaultDef ? buttonsEls[buttonDefs.indexOf(defaultDef)] : buttonsEls[0];
        if (defaultBtn) defaultBtn.click();
      }
    };

    // Use keydown on the window's DOM element
    const winElement = $win.$element[0] || $win.$element;
    if (winElement) {
      winElement.addEventListener('keydown', handleKeyDown);
    }

    // Clean up on close
    $win.onClosed(() => {
      if (winElement) {
        winElement.removeEventListener('keydown', handleKeyDown);
      }
    });
  });
}
