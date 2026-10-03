import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Google's OAuth 2.0 policy requires HTTPS on redirect URIs and JavaScript
    // origins, so Drive sign-in cannot be exercised over plain http. Opt in with
    // `npm run dev:https`. The certificate is self-signed, so the browser shows a
    // warning once per session.
    ...(process.env.DEV_HTTPS === '1' ? [basicSsl()] : [])
  ],
  base: "/",
  css: {
    devSourcemap: true
  }
})