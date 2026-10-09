/**
 * Active-window focus — keep an os-gui window's title bar blue while the user
 * is working inside it, and hand focus back when a dialog that belongs to it
 * closes.
 *
 * Why this exists
 * ---------------
 * os-gui paints a window's title bar from real DOM focus: the rule
 * `.os-window:not(.focused) .window-titlebar` is gray, and `Window.js` toggles
 * `.focused` on focusin/focusout. So the moment focus leaves to `<body>`, the
 * window underneath goes gray — even when the user never left it. Two common
 * ways that happens:
 *
 *   1. an in-window modal (e.g. Encarta's `.modal-overlay`) hides the control
 *      it was opened from, dropping focus to `<body>`;
 *   2. a dialog that is its own os-gui window (e.g. `showMessageBox`) closes,
 *      taking the focus with it.
 *
 * This module covers both:
 *
 *   - A conservative guard (installed on import) re-focuses the active window
 *     when focus falls to `<body>` and the focus loss came from that window's
 *     own content — i.e. the last pointer interaction was inside that same
 *     window. A deliberate click on the desktop or on another window is left
 *     alone, so the gray/blue behaviour the user expects is preserved.
 *   - `getActiveWindow()` / `restoreWindowFocus()` are exported so a dialog
 *     that is its own top-level window can remember the app window before it
 *     opens and restore focus when it closes.
 *
 * Restoring is a single `.focus()` on the window's `.window-content` (os-gui
 * gives it `tabindex="-1"`). That re-fires focusin, so os-gui shows the window
 * as focused again and brings it back to the front.
 */

/** The last os-gui window that a real focus landed inside. */
let lastFocusedWindow: HTMLElement | null = null;

/** The last os-gui window a pointer went down on (`null` when outside all of them). */
let lastPointerWindow: HTMLElement | null = null;

function windowOf(target: EventTarget | null): HTMLElement | null {
  const el = target as Element | null;
  const win = el?.closest?.('.os-window');
  return win instanceof HTMLElement ? win : null;
}

if (typeof document !== 'undefined') {
  document.addEventListener(
    'focusin',
    (event) => {
      const win = windowOf(event.target);
      if (win) lastFocusedWindow = win;
    },
    true,
  );

  document.addEventListener(
    'pointerdown',
    (event) => {
      lastPointerWindow = windowOf(event.target);
    },
    true,
  );

  // When focus is about to fall to nowhere, and the interaction that caused it
  // was inside the same window, give focus back to that window.
  document.addEventListener(
    'focusout',
    (event) => {
      if (event.relatedTarget) return; // focus moved to a real element
      const win = lastFocusedWindow;
      if (!win || lastPointerWindow !== win) return; // not our window's content
      requestAnimationFrame(() => {
        if (document.activeElement === document.body) {
          win.querySelector<HTMLElement>('.window-content')?.focus();
        }
      });
    },
    true,
  );
}

/**
 * The os-gui window that currently has the focus, falling back to the last
 * window a real focus landed inside (which is what a modal is covering).
 */
export function getActiveWindow(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.os-window.focused') ?? lastFocusedWindow;
}

/**
 * Give focus back to `win` after the current dialog closes.
 *
 * Deferred one frame so the closing dialog can finish hiding its own focused
 * control first. No-ops when `win` is gone, when it is already focused, or
 * when the user has moved focus somewhere else in the meantime.
 */
export function restoreWindowFocus(win: HTMLElement | null): void {
  if (!win) return;

  requestAnimationFrame(() => {
    if (!win.isConnected) return;

    const active = document.activeElement;
    // Only restore when focus is loose (on `<body>`). Anything else means the
    // user already chose where focus goes — respect it.
    if (active && active !== document.body) return;

    win.querySelector<HTMLElement>('.window-content')?.focus();
  });
}
