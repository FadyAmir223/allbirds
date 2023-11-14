import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr(), createHtmlPlugin({ minify: true })],
  resolve: { alias: { '@': '/src' } },
});
