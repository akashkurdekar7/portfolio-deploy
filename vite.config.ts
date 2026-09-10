import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The main chunk's ~930kB (three.js + react + gsap) is the real baseline:
    // three.js renders the loader's WebGL background from first paint, so it
    // can't be code-split away.
    chunkSizeWarningLimit: 1000,
  },
})
