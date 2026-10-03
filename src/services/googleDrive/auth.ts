/**
 * googleDrive/auth — OAuth 2.0 authorization code flow with PKCE for the Drive
 * integration.
 *
 * WHY NOT THE GIS TOKEN CLIENT (the obvious choice): the Google Identity
 * Services popup hangs silently in this app — `error_callback` never fires, and
 * it depends on third-party cookies that Chrome restricts and Firefox blocks.
 * That was measured, not assumed, so this module deliberately implements the
 * plain authorization code flow instead.
 *
 * WHY THE TAB HANDOFF: the flow navigates away, which a popup cannot survive
 * reliably. So the consent screen opens in a tab the *user* clicks (a plain
 * `<a target="_blank">`, never `window.open`, so nothing depends on popup
 * permissions). Google redirects that tab to the app URL with `?code=...`, that
 * tab publishes the code to `localStorage` under a transient key and closes
 * itself, and the main window polls for it and deletes it on read.
 *
 * SECURITY CONSTRAINT — the access token is never persisted. It is returned to
 * the caller and kept in memory for the life of the window. What crosses
 * storage is only:
 *   - sessionStorage: the PKCE verifier and the CSRF state, per-tab and cleared
 *     when the flow completes;
 *   - localStorage: the single-use authorization code, during the few seconds
 *     it waits to be collected, removed as soon as it is read.
 * Neither is a credential: the verifier is useless without the token endpoint,
 * and the code is single-use and expires in seconds.
 */

import { DRIVE } from '../../constants';
import type { DriveToken } from './types';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

/** Scope requested. Non-sensitive: it grants access only to files the app creates. */
export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

/** 32 random bytes -> 43 base64url chars, the RFC 7636 minimum. */
const PKCE_VERIFIER_BYTES = 32;
const PKCE_STATE_BYTES = 16;

/**
 * Treat the token as dead this many seconds before Google would reject it, so a
 * request does not start a request that dies mid-flight with a 401.
 */
const TOKEN_EXPIRY_SKEW_SECONDS = 60;

/** A verifier/challenge pair for one authorization attempt. */
export interface PkcePair {
  readonly verifier: string;
  readonly challenge: string;
}

/** Verifier plus state, persisted in sessionStorage while the flow is in flight. */
export interface PendingAuthSession {
  readonly verifier: string;
  readonly state: string;
}

/** Outcome of reading an authorization response out of a URL. */
export interface AuthorizationResponse {
  readonly code: string | null;
  readonly state: string | null;
  readonly error: string | null;
  readonly errorDescription: string | null;
}

/** What the callback tab hands back to the main window through localStorage. */
export interface PendingCode {
  readonly code: string;
  readonly state: string | null;
  readonly receivedAt: number;
}

/** Inputs for building the consent URL. */
export interface ConsentUrlParams {
  readonly clientId: string;
  readonly redirectUri: string;
  readonly state: string;
  readonly codeChallenge: string;
  readonly scope?: string;
}

/** Inputs for the authorization-code exchange. */
export interface TokenExchangeParams {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly code: string;
  readonly codeVerifier: string;
  readonly redirectUri: string;
}

/** Encode bytes as unpadded base64url, the encoding PKCE requires. */
function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBase64Url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/**
 * Generate a PKCE verifier and its S256 challenge.
 *
 * Uses WebCrypto, so it requires a secure context: `https` in production,
 * `http://localhost` in development. Plain `http` over a LAN origin has no
 * `crypto.subtle` and the caller must surface that as a configuration problem
 * rather than failing later with an opaque error.
 */
export async function generatePkce(): Promise<PkcePair> {
  const verifier = randomBase64Url(PKCE_VERIFIER_BYTES);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return { verifier, challenge: base64UrlEncode(new Uint8Array(digest)) };
}

/**
 * Generate the CSRF `state` for one authorization attempt.
 *
 * The caller must compare the state Google echoes back against the stored one
 * before exchanging the code; mismatching it means the response belongs to a
 * different attempt and must be discarded.
 */
export function generateState(): string {
  return randomBase64Url(PKCE_STATE_BYTES);
}

/**
 * Build the Google consent URL.
 *
 * `access_type=online` is explicit because there is no backend to store a
 * refresh token, so Google would not issue one anyway; `prompt=consent` makes
 * the first-time grant predictable instead of relying on prior grants.
 *
 * The caller is responsible for putting this URL on a user-clicked
 * `<a target="_blank">`. Nothing here opens a window.
 */
export function buildConsentUrl(params: ConsentUrlParams): string {
  const query = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: 'code',
    scope: params.scope ?? DRIVE_SCOPE,
    access_type: 'online',
    prompt: 'consent',
    code_challenge: params.codeChallenge,
    code_challenge_method: 'S256',
    state: params.state
  });
  return `${GOOGLE_AUTH_ENDPOINT}?${query.toString()}`;
}

/**
 * Exchange an authorization code for an access token.
 *
 * `client_secret` is required: Google answers `400 invalid_request`
 * ("client_secret is missing.") for a "Web application" client even when the
 * request carries a PKCE verifier. Sending it from the browser is the accepted
 * cost of having no backend (see `.env.example`).
 *
 * Throws on failure: the caller is inside a connect button, where a thrown
 * error is easier to turn into user feedback than a result wrapper, and the
 * error text from Google is worth showing. Everything past the token — the API
 * layer — returns results instead.
 */
export async function exchangeCodeForToken(params: TokenExchangeParams): Promise<DriveToken> {
  const payload = new URLSearchParams({
    client_id: params.clientId,
    client_secret: params.clientSecret,
    code: params.code,
    code_verifier: params.codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: params.redirectUri
  });

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`token exchange failed (${response.status}): ${detail}`);
  }

  const parsed: unknown = await response.json();
  const body = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};
  const accessToken = body.access_token;
  if (typeof accessToken !== 'string' || accessToken === '') {
    throw new Error('token exchange returned no access_token');
  }

  const expiresIn = typeof body.expires_in === 'number' ? body.expires_in : 0;
  const usableSeconds = Math.max(0, expiresIn - TOKEN_EXPIRY_SKEW_SECONDS);

  return { accessToken, expiresAt: Date.now() + usableSeconds * 1000 };
}

/** Persist the verifier and state for the in-flight attempt. Never throws. */
export function savePendingAuth(session: PendingAuthSession): void {
  try {
    sessionStorage.setItem(DRIVE.AUTH_VERIFIER_STORAGE_KEY, session.verifier);
    sessionStorage.setItem(DRIVE.AUTH_STATE_STORAGE_KEY, session.state);
  } catch {
    // Storage disabled (private mode, blocked cookies): the flow cannot be
    // completed across tabs, which the caller reports as a connect failure.
  }
}

/** Read back the in-flight attempt, or `null` when there is none or it is corrupt. */
export function loadPendingAuth(): PendingAuthSession | null {
  try {
    const verifier = sessionStorage.getItem(DRIVE.AUTH_VERIFIER_STORAGE_KEY);
    const state = sessionStorage.getItem(DRIVE.AUTH_STATE_STORAGE_KEY);
    if (!verifier || !state) return null;
    return { verifier, state };
  } catch {
    return null;
  }
}

/** Drop the in-flight attempt. Never throws. */
export function clearPendingAuth(): void {
  try {
    sessionStorage.removeItem(DRIVE.AUTH_VERIFIER_STORAGE_KEY);
    sessionStorage.removeItem(DRIVE.AUTH_STATE_STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}

/**
 * Parse an authorization response out of a URL.
 *
 * Handles both callback shapes: the redirect Google sends to the callback tab,
 * and the same-tab case where the browser lands back on the app with the code
 * already in the address bar.
 */
export function readAuthorizationResponse(href: string = window.location.href): AuthorizationResponse {
  const params = new URLSearchParams(new URL(href).search);
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    errorDescription: params.get('error_description')
  };
}

/**
 * True when the current URL is a Drive authorization response, meaning the app
 * should hand the code over instead of rendering the normal UI.
 */
export function isAuthorizationCallback(href: string = window.location.href): boolean {
  const response = readAuthorizationResponse(href);
  return response.code !== null || response.error !== null;
}

/**
 * Publish a received code for the main window and close the callback tab.
 *
 * Returns whether the code was published, so the caller can keep the tab open
 * with an explanation instead of closing a tab that delivered nothing.
 */
export function publishAuthorizationCode(response: AuthorizationResponse): boolean {
  if (response.code === null) return false;

  const pending: PendingCode = {
    code: response.code,
    state: response.state,
    receivedAt: Date.now()
  };

  try {
    localStorage.setItem(DRIVE.AUTH_PENDING_CODE_STORAGE_KEY, JSON.stringify(pending));
  } catch {
    return false;
  }

  window.close();
  return true;
}

/**
 * Wait for the callback tab to publish a code, then remove it from storage.
 *
 * Resolves `null` when nothing arrives within `timeoutMs`, which is a normal
 * outcome: the user may have closed the tab, or taken longer than expected to
 * approve. It also resolves `null` immediately when the handoff store cannot be
 * read, since no code can arrive in that case. The caller decides whether to
 * offer a retry.
 */
export function consumePendingCode(
  timeoutMs: number = DRIVE.AUTH_POLL_TIMEOUT_MS
): Promise<PendingCode | null> {
  return new Promise((resolve) => {
    const readPendingCode = (): PendingCode | null => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(DRIVE.AUTH_PENDING_CODE_STORAGE_KEY);
      } catch {
        return null;
      }
      if (raw === null) return null;

      try {
        localStorage.removeItem(DRIVE.AUTH_PENDING_CODE_STORAGE_KEY);
      } catch {
        // The value is already in hand; a failed removal only risks a stale
        // code, which the next connect discards on state mismatch.
      }

      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return null;
      const pending = parsed as Record<string, unknown>;
      if (typeof pending.code !== 'string' || pending.code === '') return null;
      return {
        code: pending.code,
        state: typeof pending.state === 'string' ? pending.state : null,
        receivedAt: typeof pending.receivedAt === 'number' ? pending.receivedAt : 0
      };
    };

    if (timeoutMs <= 0) {
      resolve(readPendingCode());
      return;
    }

    // The handoff store is the one hard dependency of this poll. If it cannot
    // be read, no code can ever arrive, so fail immediately instead of spinning
    // for the full timeout and leaving the user on a spinner for minutes.
    try {
      localStorage.getItem(DRIVE.AUTH_PENDING_CODE_STORAGE_KEY);
    } catch {
      resolve(null);
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const pending = readPendingCode();
      if (pending !== null) {
        window.clearInterval(intervalId);
        resolve(pending);
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(intervalId);
        resolve(null);
      }
    }, DRIVE.AUTH_POLL_INTERVAL_MS);
  });
}