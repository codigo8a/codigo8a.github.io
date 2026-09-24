/**
 * Cascade Position Utility
 *
 * Prevents all windows from opening at exactly the same coordinates
 * by applying a small incremental offset. Each new window is nudged
 * 25px down and 25px to the right, wrapping after ~9 windows so they
 * stay on screen.
 *
 * On mobile viewports (< 768px) the offset is disabled because
 * windows open maximized — cascade would override the full-screen
 * positioning and push the window off-viewport.
 *
 * Usage in React windows (DesktopContext.addWindow):
 *   import { getCascadeOffset } from '../../utils/cascadePosition';
 *   const offset = getCascadeOffset();
 *   const x = centerX + offset;
 *   const y = centerY + offset;
 *
 * Usage in os-gui native windows:
 *   import { getCascadeOffset } from '../../utils/cascadePosition';
 *   $win.center();
 *   const offset = getCascadeOffset();
 *   $win.css({ left: parseInt($win.css('left')) + offset, top: parseInt($win.css('top')) + offset });
 */

const CASCADE_STEP = 25;
const CASCADE_MAX = 225; // 9 steps × 25px = 225px max offset
const MOBILE_BREAKPOINT = 768;

declare global {
  interface Window {
    /** Cascade counter persisted on `window` under the key `__window_cascade_offset`. */
    __window_cascade_offset?: number;
  }
}

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
}

function getCounter(): number {
  if (typeof window === 'undefined') return 0;
  return window.__window_cascade_offset || 0;
}

function incrementCounter(): number {
  const current = getCounter();
  const next = (current + CASCADE_STEP) % CASCADE_MAX;
  window.__window_cascade_offset = next;
  return current;
}

/**
 * Returns the current cascade offset (same value for both x and y)
 * and advances the counter for the next window.
 *
 * Returns 0 on mobile viewports (< 768px) to avoid overriding
 * the maximized full-screen position of windows.
 */
export function getCascadeOffset(): number {
  if (isMobileViewport()) return 0;
  return incrementCounter();
}

/**
 * Returns the current cascade offset without advancing the counter.
 * Useful when you only need to read the current value.
 * Returns 0 on mobile viewports (< 768px).
 */
export function peekCascadeOffset(): number {
  if (isMobileViewport()) return 0;
  return getCounter();
}

/**
 * Resets the cascade counter (e.g. when all windows are closed).
 */
export function resetCascadeCounter(): void {
  if (typeof window !== 'undefined') {
    window.__window_cascade_offset = 0;
  }
}
