import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { IpcChannels } from '../shared/ipc';
import type { JobCreationPayload, JobProgressPayload } from '../shared/types';

// Keep the preload self-contained so it works with Electron's sandboxed preload runtime.
const IPC_CHANNELS: IpcChannels = {
  filesPick: 'videos:pick',
  jobsCreateSingle: 'jobs:create:single',
  jobsCreateBulk: 'jobs:create:bulk',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
};

contextBridge.exposeInMainWorld('electronAPI', {
  selectVideoFiles: () => ipcRenderer.invoke(IPC_CHANNELS.filesPick),
  createSingleJob: (payload: JobCreationPayload) =>
    ipcRenderer.invoke(IPC_CHANNELS.jobsCreateSingle, payload),
  createBulkJob: (payload: JobCreationPayload) => ipcRenderer.invoke(IPC_CHANNELS.jobsCreateBulk, payload),
  getJobs: () => ipcRenderer.invoke(IPC_CHANNELS.jobsList),
  onJobProgress: (callback: (payload: JobProgressPayload) => void) => {
    const listener = (_event: IpcRendererEvent, payload: JobProgressPayload) => {
      callback(payload);
    };

    ipcRenderer.on(IPC_CHANNELS.jobsProgress, listener);

    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.jobsProgress, listener);
    };
  },
});
