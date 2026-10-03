/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OAuth client id of the Google Cloud "Web application" client. Public by design. */
  readonly VITE_GOOGLE_CLIENT_ID: string;
  /** OAuth client secret. It ships in the bundle on purpose; see .env.example. */
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
  /** Redirect uri registered in Google Cloud. Must match the origin exactly. */
  readonly VITE_GOOGLE_REDIRECT_URI: string;
}