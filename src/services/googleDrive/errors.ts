/**
 * googleDrive/errors — translation of Google HTTP failures into stable,
 * translatable {@link DriveErrorCode} values.
 *
 * The Drive layer speaks codes, not sentences: callers branch on the code and
 * render it with `t()`. The ES/EN table below is the single source of truth for
 * what each code means and is used for logging, for the console/diagnostics
 * surface, and as the wording work unit 2 moves into
 * `src/i18n/translations.ts`. When the UI translations land, `t()` wins for
 * visible copy and this table stays the reference for the mapping itself.
 */

import type { DriveError, DriveErrorCode, DriveResult } from './types';

/** HTTP statuses with a dedicated meaning. Anything else becomes `unknown`. */
const STATUS_TO_ERROR_CODE: Record<number, DriveErrorCode> = {
  400: 'invalid-request',
  401: 'auth-expired',
  403: 'forbidden',
  404: 'not-found',
  429: 'rate-limited'
};

/**
 * Map an HTTP status to a Drive error code.
 *
 * 401 wins over everything: Google answers 401 for an expired or revoked token,
 * and that is the one failure the UI must react to by prompting a reconnect.
 */
export function mapHttpStatusToErrorCode(status: number): DriveErrorCode {
  return STATUS_TO_ERROR_CODE[status] ?? 'unknown';
}

/**
 * Build a {@link DriveError}. `status` is `null` for transport failures so
 * consumers can tell "Google said no" from "we never reached Google".
 */
export function createDriveError(
  code: DriveErrorCode,
  status: number | null,
  detail: string
): DriveError {
  return { code, status, detail };
}

/** Wrap a thrown value (fetch failure, aborted request) as a transport error. */
export function createNetworkError(detail: unknown): DriveError {
  const detailText =
    detail instanceof Error ? detail.message : typeof detail === 'string' ? detail : 'network failure';
  return createDriveError('network', null, detailText);
}

/** Failure result for a transport-level problem. */
export function networkFailure(detail: unknown): DriveResult<never> {
  return { ok: false, error: createNetworkError(detail) };
}

/** Failure result for a non-success HTTP response. */
export function httpFailure(status: number, detail: string): DriveResult<never> {
  return { ok: false, error: createDriveError(mapHttpStatusToErrorCode(status), status, detail) };
}

/**
 * Human-readable text per error code, in the two languages the app ships.
 *
 * Deliberately worded for an end user who never asked for OAuth: no HTTP status
 * numbers, no scope names, no Google internals. See the module header for how
 * this relates to `t()` once the Drive translations exist.
 */
export const DRIVE_ERROR_MESSAGES: Record<DriveErrorCode, Record<'es' | 'en', string>> = {
  'auth-expired': {
    es: 'La sesión con Google venció. Conectá de nuevo para seguir.',
    en: 'Your Google session expired. Reconnect to keep going.'
  },
  forbidden: {
    es: 'Google no permitió esta operación con los permisos de la app.',
    en: 'Google did not allow this operation with the app permissions.'
  },
  'not-found': {
    es: 'El archivo o la carpeta ya no existe.',
    en: 'That file or folder no longer exists.'
  },
  'rate-limited': {
    es: 'Se alcanzó el límite de operaciones de Google. Probá de nuevo en un momento.',
    en: 'Google request limit reached. Try again in a moment.'
  },
  'invalid-request': {
    es: 'Google rechazó la operación. Volvé a iniciar la sesión.',
    en: 'Google rejected the operation. Sign in again.'
  },
  network: {
    es: 'No se pudo conectar con Google. Revisá tu conexión a internet.',
    en: 'Could not reach Google. Check your internet connection.'
  },
  unknown: {
    es: 'Ocurrió un error inesperado al hablar con Google.',
    en: 'An unexpected error occurred while talking to Google.'
  }
};

/** Text for one error code in the requested language, falling back to English. */
export function getDriveErrorMessage(code: DriveErrorCode, language: 'es' | 'en'): string {
  return DRIVE_ERROR_MESSAGES[code][language];
}

/** Text for one error in the requested language. */
export function getDriveErrorMessageForError(
  error: DriveError,
  language: 'es' | 'en'
): string {
  return getDriveErrorMessage(error.code, language);
}