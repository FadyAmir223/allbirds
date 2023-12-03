import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import svgr from 'vite-plugin-svgr'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), svgr(), createHtmlPlugin({ minify: true })],
  resolve: { alias: { '@': '/src' } },
})
