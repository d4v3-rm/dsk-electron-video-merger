import type { ElectronApi } from '@shared/ipc.types';

export interface ElectronBridgeWindow {
  electronAPI?: ElectronApi;
}
