import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { IpcChannels } from '@shared/ipc';
import type { ElectronApi } from '@shared/ipc.types';
import type { HardwareAccelerationProfile, JobCreationPayload, JobProgressPayload } from '@shared/types';

const IPC_CHANNELS: IpcChannels = {
  filesPick: 'videos:pick',
  outputDirectoryPick: 'output-directory:pick',
  jobsCreate: 'jobs:create',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
  systemCapabilities: 'system:capabilities',
};

const electronApi: ElectronApi = {
  selectVideoFiles: () => ipcRenderer.invoke(IPC_CHANNELS.filesPick),
  selectOutputDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.outputDirectoryPick),
  createJob: (payload: JobCreationPayload) => ipcRenderer.invoke(IPC_CHANNELS.jobsCreate, payload),
  getJobs: () => ipcRenderer.invoke(IPC_CHANNELS.jobsList),
  getHardwareAccelerationProfile: (): Promise<HardwareAccelerationProfile> =>
    ipcRenderer.invoke(IPC_CHANNELS.systemCapabilities),
  onJobProgress: (callback: (payload: JobProgressPayload) => void) => {
    const listener = (_event: IpcRendererEvent, payload: JobProgressPayload) => {
      callback(payload);
    };

    ipcRenderer.on(IPC_CHANNELS.jobsProgress, listener);

    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.jobsProgress, listener);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);
