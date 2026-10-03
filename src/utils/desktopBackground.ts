/**
 * desktopBackground — persistence layer for the custom desktop background image.
 *
 * The image the user picks (from Settings or from the "Custom image" wallpaper
 * tile) is decoded straight from the `File` with `createImageBitmap`, downscaled
 * to fit the byte budget, re-encoded as JPEG and stored in localStorage under
 * {@link BACKGROUND_KEY} ('desktop.backgroundImage').
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

import { COLORS, LOCAL_STORAGE_KEYS } from '../constants';

/** localStorage key that holds the custom background (a Data URL). */
export const BACKGROUND_KEY = LOCAL_STORAGE_KEYS.DESKTOP_BACKGROUND_IMAGE;

/**
 * Hard limit for the value we are willing to keep in localStorage: 2 MB of
 * *stored Data URL* (base64 grows a file by ~4/3). This is the final authority —
 * {@link setBackgroundImage} rejects anything larger, and
 * {@link downscaleImageFileToDataUrl} encodes until the result fits it.
 */
export const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Longest edge, in pixels, of the image we keep.
 *
 * The desktop renders the background with `background-size: cover`, which
 * already scales the bitmap to the viewport — so anything past the largest
 * plausible screen is bytes spent for zero visible gain, while those bytes are
 * the ones competing with the rest of localStorage. 2560 keeps 1440p crisp and
 * 4K reasonable, and leaves several times of headroom inside {@link MAX_BYTES}
 * even for a very detailed photograph.
 */
export const MAX_IMAGE_EDGE_PX = 2560;

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

/**
 * JPEG quality ladder used at the full (edge-capped) dimensions. Visually lossless
 * enough for a wallpaper at 0.85, and each step below trades a little sharpness
 * for roughly a third of the bytes.
 */
const JPEG_QUALITY_LADDER: readonly number[] = [0.85, 0.75, 0.65, 0.55];

/**
 * Ladder used once the dimensions have been halved. Dropping resolution costs
 * more visible quality than dropping JPEG quality, so the retry restarts at the
 * second step rather than at 0.85.
 */
const JPEG_QUALITY_LADDER_REDUCED: readonly number[] = [0.75, 0.65, 0.55];

/**
 * Hard cap on encode attempts. Every attempt is a full canvas draw + JPEG
 * encode, so a pathological input (huge, extremely detailed, or crafted to
 * defeat the ladder) must not be able to spin the main thread: we give up and
 * let the 'too-large' safety net report it.
 */
const MAX_ENCODE_ATTEMPTS = 8;

/**
 * Smallest edge we are willing to shrink to. The attempt cap already bounds the
 * loop; this only keeps the final retry from producing a meaningless 2×2 image.
 */
const MIN_IMAGE_EDGE_PX = 64;

/** One candidate encode: target size plus JPEG quality. */
type EncodeAttempt = { width: number; height: number; quality: number };

/**
 * Scale the picked image so its longest edge is at most {@link MAX_IMAGE_EDGE_PX},
 * never enlarging it: a 300×200 picture stays 300×200 rather than being blown up
 * into 2560×1707 of blur stored in localStorage.
 */
function fitWithinEdgeLimit(width: number, height: number): { width: number; height: number } {
  const longestEdge = Math.max(width, height);
  const scale = longestEdge > 0 ? Math.min(1, MAX_IMAGE_EDGE_PX / longestEdge) : 1;
  return {
    // Math.round can reach 0 only for sub-pixel inputs; clamp so the canvas
    // never gets a zero dimension (which makes toDataURL return "data:,").
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Ordered list of encodes to try: the quality ladder at full size, then the same
 * idea with halved dimensions, until {@link MAX_ENCODE_ATTEMPTS} is reached.
 */
function buildEncodePlan(width: number, height: number): EncodeAttempt[] {
  const plan: EncodeAttempt[] = [];
  let currentWidth = width;
  let currentHeight = height;
  let pass = 0;

  while (plan.length < MAX_ENCODE_ATTEMPTS) {
    const ladder = pass === 0 ? JPEG_QUALITY_LADDER : JPEG_QUALITY_LADDER_REDUCED;
    for (const quality of ladder) {
      if (plan.length >= MAX_ENCODE_ATTEMPTS) return plan;
      plan.push({ width: currentWidth, height: currentHeight, quality });
    }
    if (currentWidth <= MIN_IMAGE_EDGE_PX && currentHeight <= MIN_IMAGE_EDGE_PX) return plan;
    currentWidth = Math.max(MIN_IMAGE_EDGE_PX, Math.round(currentWidth / 2));
    currentHeight = Math.max(MIN_IMAGE_EDGE_PX, Math.round(currentHeight / 2));
    pass += 1;
  }

  return plan;
}

/** Release a decoded bitmap eagerly so a failed retry loop cannot leak GPU memory. */
function releaseBitmap(bitmap: ImageBitmap | null): void {
  try {
    bitmap?.close();
  } catch {
    // Already released (or no close() support): nothing left to do.
  }
}

/**
 * Draw `bitmap` onto an opaque canvas of the attempt's size and encode it as a
 * JPEG Data URL.
 *
 * The fill is deliberate, not cosmetic: JPEG has no alpha channel, so a
 * transparent PNG encoded without it would come out against black. Compositing
 * on the desktop teal means transparency reads as "the desktop shows through",
 * which is what the user saw in their editor.
 */
function encodeAttempt(bitmap: ImageBitmap, attempt: EncodeAttempt): string {
  const canvas = document.createElement('canvas');
  canvas.width = attempt.width;
  canvas.height = attempt.height;
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('read-failed' satisfies BackgroundReadError);
    ctx.fillStyle = COLORS.DESKTOP_BG;
    ctx.fillRect(0, 0, attempt.width, attempt.height);
    ctx.drawImage(bitmap, 0, 0, attempt.width, attempt.height);
    const dataUrl = canvas.toDataURL('image/jpeg', attempt.quality);
    if (!isValidBackgroundDataUrl(dataUrl)) {
      throw new Error('read-failed' satisfies BackgroundReadError);
    }
    return dataUrl;
  } finally {
    // Detach the backing bitmap immediately; the Data URL already holds a copy.
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Decode a picked image file and produce a Data URL that always fits
 * {@link MAX_BYTES}: the image is downscaled to {@link MAX_IMAGE_EDGE_PX} and
 * re-encoded as JPEG, degrading quality and then resolution until it fits.
 *
 * Rejects with a {@link BackgroundReadError} code (never logs to the console):
 * 'not-image' for non-image files, 'read-failed' when the browser cannot decode
 * the file or the canvas cannot encode it, and 'too-large' only when the whole
 * {@link MAX_ENCODE_ATTEMPTS} ladder failed to fit — a safety net that a
 * normal photograph should never reach, kept so a value {@link setBackgroundImage}
 * would reject is never handed to it as a "successful" read.
 *
 * Decoding goes through `createImageBitmap(file)` rather than
 * `FileReader.readAsDataURL` on purpose: base64-encoding an 8 MB photo first
 * means building an ~11 MB string in memory before any resizing can happen,
 * which is the main-thread stall this function exists to avoid.
 */
export async function downscaleImageFileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('not-image' satisfies BackgroundReadError);
  }

  let bitmap: ImageBitmap;
  try {
    if (typeof createImageBitmap !== 'function') {
      throw new Error('createImageBitmap unavailable');
    }
    bitmap = await createImageBitmap(file);
  } catch {
    // Undecodable file, an image type the browser does not support, or no
    // createImageBitmap (very old Safari): all of them are a failed read.
    throw new Error('read-failed' satisfies BackgroundReadError);
  }

  try {
    if (bitmap.width < 1 || bitmap.height < 1) {
      throw new Error('read-failed' satisfies BackgroundReadError);
    }
    const fitted = fitWithinEdgeLimit(bitmap.width, bitmap.height);
    for (const attempt of buildEncodePlan(fitted.width, fitted.height)) {
      const dataUrl = encodeAttempt(bitmap, attempt);
      if (dataUrl.length <= MAX_BYTES) return dataUrl;
    }
    // Effectively unreachable: 8 encodes from 2560px down to half that fit in
    // 2 MB unless the source is pathological. Keep it so an oversized value is
    // never passed off as a valid read.
    throw new Error('too-large' satisfies BackgroundReadError);
  } finally {
    releaseBitmap(bitmap);
  }
}

/** @deprecated Use {@link getBackgroundImage}. */
export const getDesktopBackgroundImage = getBackgroundImage;

/** @deprecated Use {@link setBackgroundImage}. */
export const setDesktopBackgroundImage = setBackgroundImage;

/** @deprecated Use {@link clearBackgroundImage}. */
export const clearDesktopBackgroundImage = clearBackgroundImage;
