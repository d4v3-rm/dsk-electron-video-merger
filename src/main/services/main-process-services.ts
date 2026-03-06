import { createFfmpegService, type FfmpegService } from '@main/services/ffmpeg.service';
import { createFilePickerService, type FilePickerService } from '@main/services/file-picker.service';
import { createJobService, type JobService } from '@main/services/job.service';
import { createStorageService, type StorageService } from '@main/services/storage.service';

export interface MainProcessServices {
  storageService: StorageService;
  ffmpegService: FfmpegService;
  filePickerService: FilePickerService;
  jobService: JobService;
}

let servicesInstance: MainProcessServices | null = null;

export const getMainProcessServices = (): MainProcessServices => {
  if (!servicesInstance) {
    const storageService = createStorageService();
    const ffmpegService = createFfmpegService();
    const filePickerService = createFilePickerService();
    const jobService = createJobService(storageService, ffmpegService);

    servicesInstance = {
      storageService,
      ffmpegService,
      filePickerService,
      jobService,
    };
  }

  return servicesInstance;
};
