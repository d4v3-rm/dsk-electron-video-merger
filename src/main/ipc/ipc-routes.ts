import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/ipc';
import type { JobCreationPayload } from '../../shared/types';
import { FilePickerService } from '../services/file-picker.service';
import { JobService } from '../services/job.service';

const resetHandlers = (): void => {
  ipcMain.removeHandler(IPC_CHANNELS.filesPick);
  ipcMain.removeHandler(IPC_CHANNELS.jobsCreate);
  ipcMain.removeHandler(IPC_CHANNELS.jobsList);
};

export const initializeIpc = (jobService: JobService, fileService: FilePickerService): void => {
  resetHandlers();

  ipcMain.handle(IPC_CHANNELS.filesPick, async () => {
    return fileService.pickVideos();
  });

  ipcMain.handle(IPC_CHANNELS.jobsCreate, async (_event, payload: JobCreationPayload) => {
    return jobService.createJob(payload);
  });

  ipcMain.handle(IPC_CHANNELS.jobsList, async () => {
    return jobService.getJobs();
  });
};
