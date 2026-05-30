/**
 * Cascade Position Utility
 *
 * Prevents all windows from opening at exactly the same coordinates
 * by applying a small incremental offset. Each new window is nudged
 * 25px down and 25px to the right, wrapping after ~9 windows so they
 * stay on screen.
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
const STORAGE_KEY = '__window_cascade_offset';

function getCounter(): number {
  if (typeof window === 'undefined') return 0;
  return (window as any)[STORAGE_KEY] || 0;
}

function incrementCounter(): number {
  const current = getCounter();
  const next = (current + CASCADE_STEP) % CASCADE_MAX;
  (window as any)[STORAGE_KEY] = next;
  return current;
}

/**
 * Returns the current cascade offset (same value for both x and y)
 * and advances the counter for the next window.
 */
export function getCascadeOffset(): number {
  return incrementCounter();
}

/**
 * Returns the current cascade offset without advancing the counter.
 * Useful when you only need to read the current value.
 */
export function peekCascadeOffset(): number {
  return getCounter();
}

/**
 * Resets the cascade counter (e.g. when all windows are closed).
 */
export function resetCascadeCounter(): void {
  if (typeof window !== 'undefined') {
    (window as any)[STORAGE_KEY] = 0;
  }
}
