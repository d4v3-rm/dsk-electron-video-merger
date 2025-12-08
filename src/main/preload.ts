import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import type { JobCreationPayload, JobProgressPayload } from '@shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  selectVideoFiles: () => ipcRenderer.invoke(IPC_CHANNELS.filesPick),
  createSingleJob: (payload: JobCreationPayload) => ipcRenderer.invoke(IPC_CHANNELS.jobsCreateSingle, payload),
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
  }
});