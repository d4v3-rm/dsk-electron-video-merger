import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

const rawPort = process.env.VITE_WEBSITE_DEV_PORT;
const parsedPort = Number.parseInt(rawPort ?? '', 10);
const devPort = Number.isNaN(parsedPort) ? 5180 : parsedPort;

const resolveManualChunk = (id: string): string | undefined => {
  if (!id.includes('node_modules')) {
    return undefined;
  }

  if (id.includes('antd') || id.includes('@ant-design')) {
    return 'antd-vendor';
  }

  if (id.includes('gsap')) {
    return 'motion-vendor';
  }

  return undefined;
};

export default defineConfig({
  root: path.resolve(__dirname, 'website'),
  base: './',
  plugins: [react(), tsconfigPaths({ projects: [path.resolve(__dirname, 'tsconfig.website.json')] })],
  resolve: {
    alias: {
      '@website': path.resolve(__dirname, 'website/src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: devPort,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4180,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/website'),
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: resolveManualChunk,
      },
    },
  },
});
