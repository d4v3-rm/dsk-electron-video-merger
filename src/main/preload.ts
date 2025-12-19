import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import type { IpcChannels } from '../shared/ipc';
import type { JobCreationPayload, JobProgressPayload } from '../shared/types';

const IPC_CHANNELS: IpcChannels = {
  filesPick: 'videos:pick',
  jobsCreate: 'jobs:create',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
};

contextBridge.exposeInMainWorld('electronAPI', {
  selectVideoFiles: () => ipcRenderer.invoke(IPC_CHANNELS.filesPick),
  createJob: (payload: JobCreationPayload) => ipcRenderer.invoke(IPC_CHANNELS.jobsCreate, payload),
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
