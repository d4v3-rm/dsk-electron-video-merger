import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { JobCreationPayload, JobProgressPayload } from '../shared/types';

const fallbackChannels = {
  filesPick: 'videos:pick',
  jobsCreateSingle: 'jobs:create:single',
  jobsCreateBulk: 'jobs:create:bulk',
  jobsList: 'jobs:list',
  jobsProgress: 'jobs:progress',
} as const;

type IpcChannels = typeof fallbackChannels;

const requireFromMainDir = createRequire(path.join(__filename, '../'));
const loadIpcChannels = (): IpcChannels => {
  try {
    const loaded = requireFromMainDir('../shared/ipc');
    return loaded.IPC_CHANNELS as IpcChannels;
  } catch {
    return fallbackChannels;
  }
};

const IPC_CHANNELS = loadIpcChannels();

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
