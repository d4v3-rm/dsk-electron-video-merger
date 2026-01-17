import type { JobProgressUpdate } from '@main/services/ffmpeg.types';
import { FfmpegService } from '@main/services/ffmpeg.service';
import { JobOutputPathService } from '@main/services/job/job-output-path.service';
import type { MergeJobRunnerOptions } from '@main/services/job/job-runner.types';

export class MergeJobRunnerService {
  constructor(
    private readonly ffmpegService: FfmpegService,
    private readonly outputPathService: JobOutputPathService,
  ) {}

  async run({
    job,
    outputDir,
    tempDir,
    resolvedEncoderBackend,
    publishJobEvent,
    createLogEntry,
  }: MergeJobRunnerOptions): Promise<string[]> {
    const outputPath = this.outputPathService.createMergeOutputPath(outputDir, job.settings.outputFormat);

    publishJobEvent(job, {
      progress: job.progress,
      message: job.message,
      outputPath,
      resolvedEncoderBackend,
      telemetry: job.telemetry,
      logEntry: createLogEntry('prepare', 'info', `Output target resolved: ${outputPath}`),
    });

    const output = await this.ffmpegService.processSingleMerge({
      inputPaths: job.sourcePaths,
      outputPath,
      format: job.settings.outputFormat,
      compression: job.settings.compression,
      resolvedEncoderBackend,
      tempDir,
      onProgress: (update: JobProgressUpdate) =>
        publishJobEvent(job, {
          progress: update.progress,
          message: update.message,
          outputPath,
          telemetry: update.telemetry,
          resolvedEncoderBackend,
          logEntry: update.logMessage
            ? createLogEntry(update.stage, 'info', update.logMessage, update.progress)
            : undefined,
        }),
    });

    return [output];
  }
}
