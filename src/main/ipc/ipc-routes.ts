import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/ipc';
import type { JobCreationPayload } from '@shared/types';
import type { FilePickerService } from '@main/services/file-picker.service';
import type { JobService } from '@main/services/job.service';

const resetHandlers = (): void => {
  ipcMain.removeHandler(IPC_CHANNELS.filesPick);
  ipcMain.removeHandler(IPC_CHANNELS.outputDirectoryPick);
  ipcMain.removeHandler(IPC_CHANNELS.jobsCreate);
  ipcMain.removeHandler(IPC_CHANNELS.jobsList);
  ipcMain.removeHandler(IPC_CHANNELS.systemCapabilities);
};

export const initializeIpc = (jobService: JobService, fileService: FilePickerService): void => {
  resetHandlers();

  ipcMain.handle(IPC_CHANNELS.filesPick, async () => {
    return fileService.pickVideos();
  });

  ipcMain.handle(IPC_CHANNELS.outputDirectoryPick, async () => {
    return fileService.pickOutputDirectory();
  });

  ipcMain.handle(IPC_CHANNELS.jobsCreate, async (_event, payload: JobCreationPayload) => {
    return jobService.createJob(payload);
  });

  ipcMain.handle(IPC_CHANNELS.jobsList, async () => {
    return jobService.getJobs();
  });

  ipcMain.handle(IPC_CHANNELS.systemCapabilities, async () => {
    return jobService.getHardwareAccelerationProfile();
  });
};
