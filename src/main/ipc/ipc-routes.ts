import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import type { JobCreationPayload } from '@shared/types';
import { FilePickerService } from '../services/file-picker.service';
import { JobService } from '../services/job.service';

export const initializeIpc = (jobService: JobService, fileService: FilePickerService): void => {
  ipcMain.handle(IPC_CHANNELS.filesPick, async () => {
    return fileService.pickVideos();
  });

  ipcMain.handle(IPC_CHANNELS.jobsCreateSingle, async (_event, payload: JobCreationPayload) => {
    return jobService.createJob('single', payload);
  });

  ipcMain.handle(IPC_CHANNELS.jobsCreateBulk, async (_event, payload: JobCreationPayload) => {
    return jobService.createJob('bulk', payload);
  });

  ipcMain.handle(IPC_CHANNELS.jobsList, async () => {
    return jobService.getJobs();
  });
};
