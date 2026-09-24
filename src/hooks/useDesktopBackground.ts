/**
 * useDesktopBackground — custom desktop background image (Data URL).
 *
 * Reads the value persisted by the Settings app
 * (`BACKGROUND_KEY` → 'desktop.backgroundImage', see
 * utils/desktopBackground.ts) and keeps it in sync while the app is open:
 *
 *  - On mount the stored value is read synchronously (lazy `useState`), so the
 *    first paint already shows the custom background when there is one — no
 *    flash of the default wallpaper after a reload.
 *  - `DESKTOP_BACKGROUND_EVENT` ('desktop-background-changed', dispatched by
 *    utils/desktopBackground.ts on set/clear) re-applies the background without
 *    a page reload. Settings MUST write through that module (set/clear) so the
 *    event is dispatched.
 *  - The `storage` event keeps several open tabs in sync.
 *  - Both listeners are removed on unmount.
 *
 * A stored value that is not an inline base64 image (corrupt, truncated, a
 * plain path…) is never rendered: it is discarded and the key is cleaned up so
 * it cannot come back on the next read.
 *
 * PERSISTENCE IS LOCAL ONLY: the image lives in this browser's localStorage.
 * It is never uploaded and no network request is made to display it (the value
 * itself is the image).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  BACKGROUND_KEY,
  DESKTOP_BACKGROUND_EVENT,
  clearBackgroundImage,
  isValidBackgroundDataUrl,
} from '../utils/desktopBackground';

/** Read the raw stored value, telling "nothing stored" apart from "corrupt". */
function readStoredBackground(): { value: string | null; corrupt: boolean } {
  try {
    const raw = localStorage.getItem(BACKGROUND_KEY);
    if (raw === null) return { value: null, corrupt: false };
    if (isValidBackgroundDataUrl(raw)) return { value: raw, corrupt: false };
    return { value: null, corrupt: true };
  } catch {
    // localStorage can throw when storage is disabled (private mode / blocked
    // cookies). "No custom background" is the expected fallback, not an error.
    return { value: null, corrupt: false };
  }
}

/**
 * Current custom background as a Data URL, or null when there is none
 * (missing key, corrupt value, storage unavailable). The desktop then keeps
 * using the selected wallpaper.
 */
export function useDesktopBackground(): string | null {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    () => readStoredBackground().value
  );

  /** Re-read storage; drop a corrupt value so it does not linger in the key. */
  const refresh = useCallback(() => {
    const { value, corrupt } = readStoredBackground();
    setBackgroundImage(value);
    if (corrupt) {
      // Removes the key and dispatches DESKTOP_BACKGROUND_EVENT; the listener
      // below then re-reads, finds nothing corrupt and stops (no loop).
      clearBackgroundImage();
    }
  }, []);

  useEffect(() => {
    // Drop a corrupt value left over from an earlier session: it can never be
    // rendered, so the key must not linger (state already holds null for it).
    // No setState here — the lazy initializer above already read the value.
    if (readStoredBackground().corrupt) {
      clearBackgroundImage();
    }

    const handleBackgroundChange = () => refresh();
    const handleStorage = (event: StorageEvent) => {
      // Fires in the other tabs only; `key === null` means storage was cleared.
      if (event.key === null || event.key === BACKGROUND_KEY) {
        refresh();
      }
    };

    window.addEventListener(DESKTOP_BACKGROUND_EVENT, handleBackgroundChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(DESKTOP_BACKGROUND_EVENT, handleBackgroundChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refresh]);

  return backgroundImage;
}
