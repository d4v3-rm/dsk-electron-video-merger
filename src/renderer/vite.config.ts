import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist/renderer'),
    emptyOutDir: true,
    sourcemap: true
  }
});
