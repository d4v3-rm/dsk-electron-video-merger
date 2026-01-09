import { FfmpegService } from '@main/services/ffmpeg.service';
import { FilePickerService } from '@main/services/file-picker.service';
import { JobService } from '@main/services/job.service';
import { StorageService } from '@main/services/storage.service';

export class MainProcessServices {
  private static instance: MainProcessServices | null = null;

  readonly storageService: StorageService;
  readonly ffmpegService: FfmpegService;
  readonly filePickerService: FilePickerService;
  readonly jobService: JobService;

  private constructor() {
    this.storageService = new StorageService();
    this.ffmpegService = new FfmpegService();
    this.filePickerService = new FilePickerService();
    this.jobService = new JobService(this.storageService, this.ffmpegService);
  }

  static getInstance(): MainProcessServices {
    if (!MainProcessServices.instance) {
      MainProcessServices.instance = new MainProcessServices();
    }

    return MainProcessServices.instance;
  }
}
