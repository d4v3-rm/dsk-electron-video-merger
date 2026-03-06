import type { ElectronApi } from '@shared/ipc.types';

declare global {
  interface Window {
    electronAPI?: ElectronApi;
  }
}

export {};
