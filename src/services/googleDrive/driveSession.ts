/**
 * googleDrive/driveSession — the one owner of the in-memory Google session.
 *
 * WHY THIS EXISTS: two os-gui windows need the same Drive session, and
 * `osWindowRegistry` cannot carry data between them. Its public `OsWindowEntry`
 * holds only `{ id, appId, title, icon, isMinimized }` — no payload, no
 * callbacks — and both windows live outside React, so there is no context to
 * thread a token through. A module-level holder is the only bridge that does
 * not change the launch payload or grow `AppData`.
 *
 * THIS INVERTS THE OLD CLIENT CONTRACT on purpose. `client.ts` used to state
 * that the access token is a parameter of every call and that no module-level
 * mutable state exists, so the HTTP layer could not leak a session into an
 * unrelated caller. That isolation still holds for `client.ts`: it stays pure
 * and still takes the token as an argument. What moved is *ownership* — who
 * holds the token, not who consumes it. The single account-wide Drive session
 * is shared state by nature; pretending otherwise only moved the coupling into
 * two closures that could not see each other.
 *
 * OWNING THE SESSION ALSO OWNS ITS LIFETIME, and that lifetime is not a window's.
 * The session ends on exactly three events — the token expiring, a 401, and the
 * user choosing Disconnect — and on no others. Closing a window is deliberately
 * not one of them: both windows read this session and either can outlive the
 * other, so a close button is not a consent decision.
 *
 * TWO KINDS OF NOTIFICATION live here, and they are not interchangeable. The token
 * channel announces the *lifecycle* of the session — connected, disconnected,
 * expired. The workspace channel announces that the folder's *contents* changed
 * under a window that is already connected (today: the Recycle Bin restoring a
 * file). Merging them would refresh every subscriber on every event, and the
 * subscribers do not want each other's refreshes: My Drive reloads its listing,
 * while the Recycle Bin reloads the trash on every token notification, so a
 * restore published there would trigger a redundant second load of the very
 * listing that restore had just emptied.
 *
 * HARD CONSTRAINT — the token stays memory-only. It is held in this module
 * scope for the life of the page and is never written to any browser storage,
 * cookie or URL. There is no refresh token without a backend, so a session is
 * short (~1 h) and ends by asking the user to reconnect.
 */

import { isDriveTokenExpired } from './types';
import type { DriveToken } from './types';

let currentToken: DriveToken | null = null;

/**
 * Id of the app-managed workspace folder (`desktop-web`), published by My Drive
 * once it has discovered or created it.
 *
 * The Recycle Bin needs it to restore a file to the right folder, and it cannot
 * ask My Drive: that window may never have been opened. `null` simply means
 * "not discovered yet", which the Recycle Bin answers with its own lookup.
 */
let currentWorkspaceFolderId: string | null = null;

/** Notified whenever the session changes, so open windows can repaint. */
type DriveSessionListener = () => void;

const listeners = new Set<DriveSessionListener>();

/**
 * Workspace mutations get their own subscribers, for the reason given in the
 * module header: a window that repaints on "contents changed" is not a window
 * that should repaint on "token changed", and vice versa.
 */
const workspaceListeners = new Set<DriveSessionListener>();

/**
 * Announce a change to every subscriber of one channel.
 *
 * A copy is iterated so a listener that unsubscribes itself mid-notification —
 * which happens when the notification is what makes a window close — cannot
 * mutate the set that is being walked.
 */
function publish(target: Set<DriveSessionListener>): void {
  for (const listener of Array.from(target)) listener();
}

/** The live token, or `null` when no window has connected yet. */
export function getDriveToken(): DriveToken | null {
  return currentToken;
}

/**
 * The live token only if it is still usable, or `null`.
 *
 * Expiry is checked here so no caller has to remember to: a token that stopped
 * being accepted turns into a 401 on the next request, and a 401 without a
 * reconnect prompt is the failure mode this hides.
 */
export function getUsableDriveToken(): DriveToken | null {
  if (currentToken === null || isDriveTokenExpired(currentToken)) return null;
  return currentToken;
}

/** Publish a freshly exchanged token and wake every open window. */
export function setDriveToken(token: DriveToken): void {
  currentToken = token;
  publish(listeners);
}

/**
 * End the session and wake every open window.
 *
 * Every deliberate end of the session goes through here — the Disconnect menu
 * item, a 401, an expiry — so a window that is showing Drive content cannot keep
 * rendering it after the session is gone. Closing a window does not: the session
 * outlives both of them.
 */
export function clearDriveToken(): void {
  currentToken = null;
  publish(listeners);
}

/** The discovered workspace folder id, or `null` if nothing found it yet. */
export function getDriveWorkspaceFolderId(): string | null {
  return currentWorkspaceFolderId;
}

/** Publish the workspace folder id so a second window can restore into it. */
export function setDriveWorkspaceFolderId(folderId: string): void {
  currentWorkspaceFolderId = folderId;
}

/**
 * Forget the workspace folder id.
 *
 * Paired with the *session* it belongs to, never with a window closing: the id
 * names a folder in the account this session is for, so it must not outlive a
 * session the user deliberately ended. Closing My Drive keeps it — that session
 * is still live, and dropping it would only make the Recycle Bin rediscover what
 * the app already knows. An expiry leaves it cached too; the next connect
 * republishes it, and a cached id is only ever read together with a session,
 * never on its own.
 */
export function clearDriveWorkspaceFolderId(): void {
  currentWorkspaceFolderId = null;
}

/**
 * Subscribe to session changes. Returns the unsubscribe function.
 *
 * Callers MUST unsubscribe when their window closes. A listener that outlives
 * its window would run against detached DOM on the next connect or disconnect —
 * the same class of bug as reading a missing os-gui property.
 */
export function subscribeDriveToken(listener: DriveSessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Announce that the workspace folder's contents changed.
 *
 * No payload travels with it: the only consumer is a listing that has to be
 * re-read from Drive anyway, so an id here would be a second thing for the
 * caller to keep correct without changing what any subscriber does.
 */
export function notifyDriveWorkspaceChanged(): void {
  publish(workspaceListeners);
}

/**
 * Subscribe to workspace mutations. Returns the unsubscribe function.
 *
 * The same lifetime rule as {@link subscribeDriveToken} applies, and for the
 * same reason: a listener that outlives its window would rebuild a listing into
 * detached DOM on the next restore.
 */
export function subscribeDriveWorkspace(listener: DriveSessionListener): () => void {
  workspaceListeners.add(listener);
  return () => {
    workspaceListeners.delete(listener);
  };
}