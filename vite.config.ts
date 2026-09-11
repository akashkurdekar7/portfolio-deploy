import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js is loaded via dynamic import() in ReelsField/AnimeGreeter, so
    // it lands in its own chunk (~520kB) rather than inflating this limit.
    chunkSizeWarningLimit: 600,
  },
})
