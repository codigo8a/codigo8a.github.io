/**
 * desktopBackground — custom desktop background image.
 *
 * The image the user picks in Settings is read as a Data URL
 * (`FileReader.readAsDataURL`) and kept in localStorage under
 * `LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE` ('desktop.backgroundImage').
 *
 * PERSISTENCE IS LOCAL ONLY: the image never leaves the browser. There is no
 * upload to a server, no backend copy and no association with any user account.
 * Clearing the browser cache/storage (or "Delete Saved Data" in Settings) makes
 * the desktop fall back to the selected wallpaper.
 *
 * Events dispatched:
 *   DESKTOP_BACKGROUND_EVENT ('desktop-background-changed') — React
 *   (DesktopContext) listens to it and re-reads the stored value.
 */

import { LOCAL_STORAGE_KEYS } from '../constants';

/** Largest accepted image, in bytes (data URLs grow ~4/3 when base64-encoded). */
export const MAX_BACKGROUND_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

/** Fired on window whenever the stored background changes (set or removed). */
export const DESKTOP_BACKGROUND_EVENT = 'desktop-background-changed';

/** Failure reasons for a store attempt, mapped to translated UI messages. */
export type BackgroundStoreError = 'quota' | 'unavailable';

export type BackgroundStoreResult = { ok: true } | { ok: false; error: BackgroundStoreError };

/** Failure reasons for reading a picked file. */
export type BackgroundReadError = 'not-image' | 'too-large' | 'read-failed';

/**
 * A stored value is only usable when it still looks like an inline base64 image.
 * Anything else (empty string, plain path, truncated JSON, legacy value) counts
 * as "no custom background" so corrupt data can never break the UI.
 */
export function isValidBackgroundDataUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^data:image\/[a-z0-9.+-]+;base64,/i.test(value);
}

/** Read the stored custom background, or null when absent/corrupt/unavailable. */
export function getDesktopBackgroundImage(): string | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE);
    return isValidBackgroundDataUrl(stored) ? stored : null;
  } catch {
    // localStorage can throw when storage is disabled (private mode / blocked
    // cookies). A missing background is the expected fallback, not an error.
    return null;
  }
}

/** Store a Data URL and notify listeners. Never throws — inspect the result. */
export function setDesktopBackgroundImage(dataUrl: string): BackgroundStoreResult {
  if (!isValidBackgroundDataUrl(dataUrl)) {
    return { ok: false, error: 'unavailable' };
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE, dataUrl);
  } catch (e) {
    // QuotaExceededError: image too big for the localStorage budget (~5 MB).
    const isQuota =
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        e.code === 22);
    return { ok: false, error: isQuota ? 'quota' : 'unavailable' };
  }
  window.dispatchEvent(new CustomEvent(DESKTOP_BACKGROUND_EVENT));
  return { ok: true };
}

/** Remove the stored background (restores the wallpaper) and notify listeners. */
export function clearDesktopBackgroundImage(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE);
  } catch {
    // Nothing to remove if storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent(DESKTOP_BACKGROUND_EVENT));
}

/**
 * Validate and read a picked file as a Data URL.
 * Rejects with a `BackgroundReadError` code (never logs to the console).
 */
export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('not-image' satisfies BackgroundReadError));
      return;
    }
    if (file.size > MAX_BACKGROUND_IMAGE_BYTES) {
      reject(new Error('too-large' satisfies BackgroundReadError));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string' && isValidBackgroundDataUrl(result)) {
        resolve(result);
      } else {
        reject(new Error('read-failed' satisfies BackgroundReadError));
      }
    };
    reader.onerror = () => reject(new Error('read-failed' satisfies BackgroundReadError));
    reader.readAsDataURL(file);
  });
}
