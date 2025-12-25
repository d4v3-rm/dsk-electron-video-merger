import type {
  ConversionSettings,
  HardwareAccelerationProfile,
  Job,
  JobProgressPayload,
} from '../../shared/types';

type RendererElectronApi = {
  selectVideoFiles: () => Promise<{ id: string; name: string; path: string; size: number }[]>;
  createJob: (payload: { filePaths: string[]; settings: ConversionSettings }) => Promise<Job>;
  getJobs: () => Promise<Job[]>;
  getHardwareAccelerationProfile: () => Promise<HardwareAccelerationProfile>;
  onJobProgress: (cb: (payload: JobProgressPayload) => void) => () => void;
};

type BrowserWindowWithBridge = {
  electronAPI?: RendererElectronApi;
};

const getElectronAPI = (): RendererElectronApi | undefined => {
  return (globalThis as BrowserWindowWithBridge).electronAPI;
};

const createMissingBridgeError = (): Error =>
  new Error(
    "Bridge Electron non disponibile. Avvia l'app da Electron e verifica che preload.ts sia caricato.",
  );

const noOpUnsubscribe = (): void => {
  // Fallback sicuro quando il renderer non e ospitato da Electron.
};

const withApi = <T>(handler: (api: RendererElectronApi) => T): T => {
  const api = getElectronAPI();
  if (!api) {
    throw createMissingBridgeError();
  }

  return handler(api);
};

export const api = {
  selectVideoFiles: async () => withApi((electronAPI) => electronAPI.selectVideoFiles()),
  createJob: async (payload: { filePaths: string[]; settings: ConversionSettings }) =>
    withApi((electronAPI) => electronAPI.createJob(payload)),
  getJobs: async () => withApi((electronAPI) => electronAPI.getJobs()),
  getHardwareAccelerationProfile: async () =>
    withApi((electronAPI) => electronAPI.getHardwareAccelerationProfile()),
  subscribeJobProgress: (cb: (payload: JobProgressPayload) => void) => {
    const electronAPI = getElectronAPI();
    if (!electronAPI) {
      return noOpUnsubscribe;
    }

    return electronAPI.onJobProgress(cb);
  },
};
