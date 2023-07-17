import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), createHtmlPlugin({ minify: true })],
  build: {
    emptyOutDir: true,
    outDir: '../server/public',
  },
});
