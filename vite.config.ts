import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssMinify: false,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    },
    publicDir: 'public',
  });
