/**
 * desktopBackground — persistence layer for the custom desktop background image.
 *
 * The image the user picks (from Settings or from the "Custom image" wallpaper
 * tile) is read as a Data URL (`FileReader.readAsDataURL`) and stored in
 * localStorage under {@link BACKGROUND_KEY} ('desktop.backgroundImage').
 *
 * PERSISTENCE IS LOCAL ONLY: the image never leaves the browser. It is not
 * uploaded to a server, there is no backend copy and it is not tied to any user
 * account or device. Clearing the browser cache/site data (or "Delete Saved
 * Data" in Settings) drops the custom background and the desktop falls back to
 * the selected wallpaper. Nothing in this module performs a network request.
 *
 * Cross-module contract:
 *   - {@link DESKTOP_BACKGROUND_EVENT} is dispatched on `window` after every
 *     successful write/removal, so consumers (DesktopContext, Settings) can
 *     re-read the value and update the UI without a reload.
 *   - Every localStorage access is wrapped in try/catch: private mode, blocked
 *     cookies, disabled storage or SSR must never throw at the caller.
 */

import { LOCAL_STORAGE_KEYS } from '../constants';

/** localStorage key that holds the custom background (a Data URL). */
export const BACKGROUND_KEY = LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE;

/**
 * Hard limit for the value we are willing to keep in localStorage: 2 MB of
 * *stored Data URL* (base64 grows a file by ~4/3, so this accepts image files
 * of up to ~1.5 MB — {@link readImageFileAsDataUrl} applies the same budget).
 */
export const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/** @deprecated Use {@link MAX_BYTES} (same value, kept for existing imports). */
export const MAX_BACKGROUND_IMAGE_BYTES = MAX_BYTES;

/** Fired on window whenever the stored background changes (set or removed). */
export const DESKTOP_BACKGROUND_EVENT = 'desktop-background-changed';

/** Failure reasons for a store attempt, mapped to translated UI messages. */
export type BackgroundStoreError = 'invalid' | 'too-large' | 'quota' | 'unknown';

export type BackgroundStoreResult = { ok: true } | { ok: false; error: BackgroundStoreError };

/** Failure reasons for reading a picked file. */
export type BackgroundReadError = 'not-image' | 'too-large' | 'read-failed';

/**
 * A stored value is usable only when it is an inline base64 image Data URL
 * (`data:image/<type>;base64,<payload>`) whose payload is a complete base64
 * group. Anything else — empty string, plain path, `data:text/plain,…`, a
 * truncated payload, legacy format — counts as "no custom background", so
 * corrupt data can never reach the desktop `url()` and break (or inject into)
 * the rendered CSS.
 */
const IMAGE_DATA_URL_RE = /^data:image\/[a-z0-9.+-]+;base64,([A-Za-z0-9+/]+={0,2})$/;

/**
 * Shortest payload we accept: every real image encodes to far more than 16
 * base64 characters, so this only rejects hand-written junk such as
 * `data:image/png;base64,QUJD`.
 */
const MIN_DATA_URL_PAYLOAD = 16;

/** True when `value` is a base64 image Data URL this module can render. */
export function isValidBackgroundDataUrl(value: string | null | undefined): value is string {
  if (typeof value !== 'string') return false;
  const payload = IMAGE_DATA_URL_RE.exec(value)?.[1];
  if (payload === undefined) return false;
  // Base64 always encodes whole 4-character groups, so a length that is not a
  // multiple of 4 means the value was truncated (or written by hand). The
  // browser cannot decode it and the desktop would lose its background
  // entirely, so it must be treated as corrupt.
  return payload.length >= MIN_DATA_URL_PAYLOAD && payload.length % 4 === 0;
}

/**
 * QuotaExceededError across browser flavours: the standard name, Firefox's
 * legacy name and the legacy numeric codes (22 / 1014).
 */
function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const { name, code } = error as { name?: unknown; code?: unknown };
  return (
    name === 'QuotaExceededError' ||
    name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    code === 22 ||
    code === 1014
  );
}

/** Notify listeners that the stored background changed (no-op without window). */
function notifyBackgroundChanged(): void {
  try {
    window.dispatchEvent(new CustomEvent(DESKTOP_BACKGROUND_EVENT));
  } catch {
    // No window (SSR) or CustomEvent unavailable: there is nothing to notify.
  }
}

/**
 * Read the stored custom background.
 *
 * @returns the Data URL, or `null` when the key is absent, localStorage is
 * unavailable (private mode / SSR / storage disabled) or the stored value is
 * corrupt (not an image Data URL). Never throws.
 */
export function getBackgroundImage(): string | null {
  try {
    const stored = localStorage.getItem(BACKGROUND_KEY);
    return isValidBackgroundDataUrl(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Store a custom background Data URL and notify listeners.
 *
 * Validation order: data URL shape ('invalid') → size ('too-large') → write
 * ('quota' when localStorage rejects it for lack of space, 'unknown' for any
 * other storage failure, e.g. storage disabled by policy).
 *
 * Never throws: inspect the returned result. On failure nothing is written, so
 * a previously stored background stays in place.
 */
export function setBackgroundImage(dataUrl: string): BackgroundStoreResult {
  if (!isValidBackgroundDataUrl(dataUrl)) {
    return { ok: false, error: 'invalid' };
  }
  if (dataUrl.length > MAX_BYTES) {
    return { ok: false, error: 'too-large' };
  }
  try {
    localStorage.setItem(BACKGROUND_KEY, dataUrl);
  } catch (error) {
    return { ok: false, error: isQuotaError(error) ? 'quota' : 'unknown' };
  }
  notifyBackgroundChanged();
  return { ok: true };
}

/**
 * Remove the stored background (the desktop goes back to its wallpaper) and
 * notify listeners. Never throws, even when storage is unavailable.
 */
export function clearBackgroundImage(): void {
  try {
    localStorage.removeItem(BACKGROUND_KEY);
  } catch {
    // Nothing to remove when storage is unavailable.
  }
  notifyBackgroundChanged();
}

/** Size of the `data:image/<type>;base64,` header, in characters. */
const DATA_URL_HEADER_LENGTH = 64;

/**
 * Validate and read a picked file as a Data URL.
 *
 * Rejects with a {@link BackgroundReadError} code (never logs to the console):
 * 'not-image' for non-image files, 'too-large' when the resulting Data URL
 * would not fit {@link MAX_BYTES}, 'read-failed' when FileReader cannot read
 * the file or returns something that is not an image Data URL.
 */
export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('not-image' satisfies BackgroundReadError));
      return;
    }
    // base64 encodes 3 bytes into 4 characters: reject up front so an accepted
    // file is always storable (setBackgroundImage never answers 'too-large').
    const encodedSize = Math.ceil((file.size * 4) / 3) + DATA_URL_HEADER_LENGTH;
    if (encodedSize > MAX_BYTES) {
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

/** @deprecated Use {@link getBackgroundImage}. */
export const getDesktopBackgroundImage = getBackgroundImage;

/** @deprecated Use {@link setBackgroundImage}. */
export const setDesktopBackgroundImage = setBackgroundImage;

/** @deprecated Use {@link clearBackgroundImage}. */
export const clearDesktopBackgroundImage = clearBackgroundImage;
