import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const rawPort = process.env.VITE_DEV_SERVER_PORT;
const parsedPort = Number.parseInt(rawPort ?? '', 10);
const devPort = Number.isNaN(parsedPort) ? 5173 : parsedPort;

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: devPort,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1200,
  },
});
