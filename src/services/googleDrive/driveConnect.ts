/**
 * googleDrive/driveConnect — the Google Drive connect flow, shared by every window
 * that is allowed to start it.
 *
 * WHY THIS IS A MODULE AND NOT A WINDOW: the flow's storage belongs to the whole
 * tab, not to a window. The PKCE verifier and the CSRF state live in
 * sessionStorage (`DRIVE.AUTH_VERIFIER_STORAGE_KEY`, `DRIVE.AUTH_STATE_STORAGE_KEY`),
 * which every window in the tab shares, and the authorization code is handed over in
 * localStorage under one key (`DRIVE.AUTH_PENDING_CODE_STORAGE_KEY`) that
 * `consumePendingCode` *removes on read* with no compare-and-delete. Two windows
 * running this flow at once is therefore not a race that resolves gracefully:
 * whichever poller reads first takes the only code there is, and the loser either
 * spins to the 180 s timeout or — worse — reads the winner's code, fails the state
 * comparison and calls `clearPendingAuth()`, destroying the winner's verifier while
 * the winner is still exchanging with it. A module-level claim is the only place
 * that can see both windows; two closures could not.
 *
 * WHY IT OWNS NO DOM: the screens that ask for a connection do different jobs. My
 * Drive creates the workspace folder as soon as it loads; the Recycle Bin must not,
 * and says so in its own words. So this module owns only the parts that are
 * genuinely identical — arming the PKCE pair, waiting for the callback tab, the
 * exchange, the failures — and reports progress through callbacks, leaving each
 * window to paint "waiting", "failed" and "done" the way its own copy says. The
 * consent URL is handed back to the caller rather than assigned to anything: the
 * browser may only leave for Google from a *user click* on a real
 * `<a target="_blank">`, which is DOM this module does not own.
 *
 * WHY THE MESSAGES TRAVEL IN: i18n for these windows is local to each app
 * (`DriveApp` and `RecycleBin` each carry their own `TRANSLATIONS` table, because
 * both are built outside React where `useTranslation` is unreachable). A translation
 * table here would either import the React i18n this module must not know about, or
 * freeze one app's wording onto the other. Same shape as `messageBox` and
 * `explorerChrome`: parameters in, nothing out.
 *
 * SECURITY is unchanged from `auth`: nothing here persists the access token. The
 * token goes to `driveSession`, which holds it in memory for the life of the page.
 */

import {
  buildConsentUrl,
  clearPendingAuth,
  consumePendingCode,
  exchangeCodeForToken,
  generatePkce,
  generateState,
  loadPendingAuth,
  savePendingAuth,
} from './auth';
import { GoogleAuthError } from './auth';
import { setDriveToken } from './driveSession';
import type { PkcePair } from './auth';
import type { DriveToken } from './types';

/** OAuth client configuration, read from the build-time Vite environment. */
export interface DriveConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
}

/**
 * An armed connect: the verifier/state pair the caller is holding, together with the
 * consent URL its link has to point at.
 *
 * The pair is generated when the connect panel is rendered but only *persisted* on
 * click, so an arming the user never clicks costs nothing and expires with the page.
 */
export interface DriveConnectArming {
  readonly verifier: string;
  readonly state: string;
  readonly consentUrl: string;
}

/**
 * Failure copy for the four ways the flow can end without a token, supplied by the
 * calling window's own translation table.
 */
export interface DriveConnectMessages {
  readonly configMissing: string;
  readonly timeout: string;
  readonly stateMismatch: string;
  readonly exchangeFailed: string;
}

/**
 * What the calling window paints, decided by the calling window.
 *
 * `onConnecting` runs synchronously inside {@link launchDriveConnect}, so the wait
 * screen is on the DOM in the same frame the user clicked. The other two run from the
 * flow's continuation, possibly minutes later.
 */
export interface DriveConnectProgress {
  /** The flow is armed and waiting for the callback tab. */
  readonly onConnecting: () => void;
  /** The flow ended without a token; `message` is ready to show as is. */
  readonly onFailed: (message: string) => void;
  /** A token is live. The window decides what to load with it. */
  readonly onConnected: () => void;
}

/** Whether the caller was allowed to start the flow. */
export type DriveConnectLaunch =
  | { readonly started: true }
  | { readonly started: false };

/** How the flow ended, before anyone is told about it. */
type DriveConnectOutcome =
  | { readonly status: 'connected'; readonly token: DriveToken }
  | { readonly status: 'failed'; readonly message: string };

/**
 * The single-flight claim.
 *
 * Deliberately NOT in `driveSession`: that module owns the *session*, whose lifetime
 * is a product decision, and it publishes exactly two channels — the token lifecycle
 * and workspace mutations. A connect in progress is neither, and announcing it on the
 * token channel would make every subscriber reload a listing over an event that
 * changes no listing.
 */
let connectInFlight = false;

/** Read the OAuth client configuration, or `null` when an env var is missing. */
export function readDriveConfig(): DriveConfig | null {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_CLIENT_SECRET, VITE_GOOGLE_REDIRECT_URI } = import.meta.env;
  if (!VITE_GOOGLE_CLIENT_ID || !VITE_GOOGLE_CLIENT_SECRET || !VITE_GOOGLE_REDIRECT_URI) return null;
  return {
    clientId: VITE_GOOGLE_CLIENT_ID,
    clientSecret: VITE_GOOGLE_CLIENT_SECRET,
    redirectUri: VITE_GOOGLE_REDIRECT_URI,
  };
}

/**
 * Turn a thrown authorization error into text the user can act on.
 *
 * Google's own error code and description are kept because they are what identifies a
 * code that was already used or a `redirect_uri` that does not match the request, and
 * collapsing them into one generic sentence is how those become unfixable support
 * questions.
 */
export function describeAuthorizationFailure(error: unknown, fallback: string): string {
  if (error instanceof GoogleAuthError) {
    return `${fallback}\n\nGoogle: ${error.code} — ${error.description}`;
  }
  return `${fallback}\n\n${error instanceof Error ? error.message : String(error)}`;
}

/**
 * Arm the flow: generate a PKCE pair and build Google's consent URL.
 *
 * Resolves `null` when WebCrypto is unavailable, which is a configuration problem
 * (`generatePkce` needs `crypto.subtle`, so plain `http` on a LAN origin cannot arm a
 * flow at all) rather than a transient failure. The caller owns the wording for it.
 * The reason is logged here, where the failure actually happens.
 */
export async function prepareDriveConnect(config: DriveConfig): Promise<DriveConnectArming | null> {
  let pkce: PkcePair;
  try {
    pkce = await generatePkce();
  } catch (error) {
    console.error('Drive PKCE generation failed.', error);
    return null;
  }

  const state = generateState();
  return {
    verifier: pkce.verifier,
    state,
    consentUrl: buildConsentUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      state,
      codeChallenge: pkce.challenge,
    }),
  };
}

/**
 * True while some window holds the flow.
 *
 * Exists so a second window can say so *before* the user clicks, instead of arming a
 * link whose only outcome is to be refused. A window that cannot start the flow is
 * already subscribed to the session channel, so it repaints when the session arrives.
 */
export function isDriveConnectInFlight(): boolean {
  return connectInFlight;
}

/**
 * Wait for the callback tab to publish the code, then validate and spend it.
 *
 * Split from {@link launchDriveConnect} so the claim can be released at exactly one
 * point — after the outcome exists, before anybody is told about it — rather than in a
 * `finally` that would run after the token had already been published.
 */
async function runConnect(
  arming: DriveConnectArming,
  messages: DriveConnectMessages,
): Promise<DriveConnectOutcome> {
  const pending = await consumePendingCode();
  if (pending === null) return { status: 'failed', message: messages.timeout };

  if (pending.state !== arming.state) {
    // The response belongs to another attempt, so the stored verifier goes with it:
    // leaving it behind would let a later exchange reuse a verifier no live attempt
    // is waiting on.
    clearPendingAuth();
    return { status: 'failed', message: messages.stateMismatch };
  }

  // Re-read rather than trusting the arming: the app is a static bundle, so this can
  // only differ if the environment itself changed mid-flow. It is checked here, where
  // the exchange needs it, and not at arming time because the arming does not use the
  // secret.
  const config = readDriveConfig();
  if (config === null) return { status: 'failed', message: messages.configMissing };

  // Normally the same pair the caller persisted on click. The fallback covers a tab
  // whose storage was unavailable at that moment, where the in-memory arming is the
  // only verifier left.
  const session = loadPendingAuth() ?? arming;
  try {
    const token = await exchangeCodeForToken({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      code: pending.code,
      codeVerifier: session.verifier,
      redirectUri: config.redirectUri,
    });
    clearPendingAuth();
    return { status: 'connected', token };
  } catch (error) {
    clearPendingAuth();
    return {
      status: 'failed',
      message: describeAuthorizationFailure(error, messages.exchangeFailed),
    };
  }
}

/**
 * Claim the flow and run it to completion.
 *
 * MUST be called from a user click on a real `<a target="_blank">`, never from
 * `window.open`: the flow navigates away, which a popup cannot survive reliably, and
 * browsers block scripted popups across the OAuth redirect. The caller keeps that
 * anchor and this call in the same click handler, so the verifier is persisted before
 * the browser leaves the page.
 *
 * Returns `{ started: false }` without touching any storage when another window already
 * holds the flow. The caller must then refuse the navigation: the browser opening a
 * second Google tab would produce a second code for a single-use exchange, and the
 * window that is waiting would lose the race for it.
 */
export function launchDriveConnect(
  arming: DriveConnectArming,
  messages: DriveConnectMessages,
  progress: DriveConnectProgress,
): DriveConnectLaunch {
  if (connectInFlight) return { started: false };

  connectInFlight = true;
  savePendingAuth({ verifier: arming.verifier, state: arming.state });
  progress.onConnecting();

  void runConnect(arming, messages)
    .then((outcome) => {
      // Released before the token is published: this module's claim is over the moment
      // a token exists, and a window repainting from the session notification must not
      // be told a connect is still running.
      connectInFlight = false;
      if (outcome.status === 'connected') {
        setDriveToken(outcome.token);
        progress.onConnected();
        return;
      }
      progress.onFailed(outcome.message);
    })
    .catch((error: unknown) => {
      // An unexpected throw must not leave the claim held. A permanently locked
      // connect is worse than whatever caused it: it outlives the window that hit it
      // and silently disables the only action either window has. Nothing is reported to
      // the caller — this module has no honest message for a fault of its own, and
      // `consumePendingCode` rejecting (a corrupt handoff value) is exactly the case
      // where attributing it to Google would be a lie. Reopening the window recovers.
      connectInFlight = false;
      console.error('Drive connect failed unexpectedly.', error);
    });

  return { started: true };
}
