import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The main chunk's ~930kB (three.js + react + gsap) is the real baseline:
    // three.js renders the loader's WebGL background from first paint, so it
    // can't be code-split away. lottie-react/lottie-web is already split into
    // its own async chunk since Work/ProjectsDesktop load below the fold.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      checks: {
        // lottie-web (pulled in via lottie-react) uses a direct eval() internally
        // to compile After Effects expressions — vendor code we don't control.
        eval: false,
      },
    },
  },
})
