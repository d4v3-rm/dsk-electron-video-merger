import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

const rawPort = process.env.VITE_DEV_SERVER_PORT;
const parsedPort = Number.parseInt(rawPort ?? '', 10);
const devPort = Number.isNaN(parsedPort) ? 5173 : parsedPort;

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [react(), tsconfigPaths({ projects: [path.resolve(__dirname, 'tsconfig.renderer.app.json')] })],
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: devPort,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1200,
  },
});
