import type { JobCreationPayload } from '@shared/types';
import type { ElectronApi } from '@shared/ipc.types';
import type { ElectronBridgeWindow } from '@renderer/services/ipc.types';

const getElectronAPI = (): ElectronApi | undefined => {
  return (globalThis as typeof globalThis & ElectronBridgeWindow).electronAPI;
};

const createMissingBridgeError = (): Error =>
  new Error('Electron bridge unavailable. Start the app with Electron and verify that preload.ts is loaded.');

const noOpUnsubscribe = (): void => {
  // Safe fallback when the renderer is not hosted by Electron.
};

const withApi = <T>(handler: (api: ElectronApi) => T): T => {
  const api = getElectronAPI();
  if (!api) {
    throw createMissingBridgeError();
  }

  return handler(api);
};

export const api = {
  selectVideoFiles: async () => withApi((electronAPI) => electronAPI.selectVideoFiles()),
  selectOutputDirectory: async () => withApi((electronAPI) => electronAPI.selectOutputDirectory()),
  createJob: async (payload: JobCreationPayload) => withApi((electronAPI) => electronAPI.createJob(payload)),
  getJobs: async () => withApi((electronAPI) => electronAPI.getJobs()),
  getHardwareAccelerationProfile: async () =>
    withApi((electronAPI) => electronAPI.getHardwareAccelerationProfile()),
  subscribeJobProgress: (callback: Parameters<ElectronApi['onJobProgress']>[0]) => {
    const electronAPI = getElectronAPI();
    if (!electronAPI) {
      return noOpUnsubscribe;
    }

    return electronAPI.onJobProgress(callback);
  },
};
