import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "https://juandavid.site/codigo8a.github.io",
  css: {
    devSourcemap: true
  }
})
