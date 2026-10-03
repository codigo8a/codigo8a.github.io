export const COLORS = {
  DESKTOP_BG: '#008080',
  WINDOW_BG: '#c0c0c0',
  WINDOW_TEXT: '#000',
  WINDOW_BORDER_LIGHT: '#ffffff',
  WINDOW_BORDER_DARK: '#808080',
  WINDOW_BORDER_BLACK: '#000',
  LINK: '#0000ff'
};

export const Z_INDEX = {
  DESKTOP: 1,
  CLIPPY: 5,
  WINDOW_BASE: 10,
  TASKBAR: 1000,
  START_MENU: 1100
};

export const WINDOW_DEFAULTS = {
  INITIAL_X: 50,
  INITIAL_Y: 50,
  WIDTH: 400,
  HEIGHT: 300,
  OFFSET_STEP: 20
};

export const LOCAL_STORAGE_KEYS = {
  LANGUAGE: 'language',
  SHOW_WELCOME: 'show_welcome',
  WELCOME_HIDDEN_AT: 'welcome_hidden_at',
  WALLPAPER: 'wallpaper',
  /** Custom desktop background image (Data URL, client-side only). */
  DESKTOP_BACKGROUND_IMAGE: 'desktop.backgroundImage',
  CLIPPY_ENABLED: 'clippy_enabled',
  WINDOW_STATES: 'window_states',
  WINAMP_STATE: 'winamp_state',
  WINAMP_PLAYLIST: 'winamp_playlist'
};

/**
 * Google Drive integration. The app never stores its workspace id: it
 * *discovers* the folder by name on every session (see `findWorkspaceFolder`).
 * That is why WORKSPACE_FOLDER_NAME has to stay stable — changing it orphans the
 * previously created folder.
 *
 * Only non-secret values belong here. The OAuth token is deliberately absent:
 * it lives in memory only, never in any storage.
 */
export const DRIVE = {
  /** Stable name of the app-managed workspace folder. Changing it orphans the old folder. */
  WORKSPACE_FOLDER_NAME: 'juandavid desktop',
  /** Google-native folder mime type (also used to discover the workspace in files.list). */
  FOLDER_MIME_TYPE: 'application/vnd.google-apps.folder',
  /** Mime type for the markdown/text files the app uploads and edits. */
  MARKDOWN_MIME_TYPE: 'text/markdown',
  /** sessionStorage key for the PKCE code verifier of an in-flight authorization. */
  AUTH_VERIFIER_STORAGE_KEY: 'drive.auth.codeVerifier',
  /** sessionStorage key for the CSRF state of an in-flight authorization. */
  AUTH_STATE_STORAGE_KEY: 'drive.auth.state',
  /** localStorage key used only to hand the short-lived code between browser tabs. */
  AUTH_PENDING_CODE_STORAGE_KEY: 'drive.auth.pendingCode',
  /** Delay between attempts while waiting for the callback tab to publish the code. */
  AUTH_POLL_INTERVAL_MS: 500,
  /** Give up waiting for the callback tab after this long (user may need longer). */
  AUTH_POLL_TIMEOUT_MS: 180000
};
