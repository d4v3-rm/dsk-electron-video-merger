import type { JobProgressUpdate } from '@main/services/ffmpeg.types';
import type { FfmpegService } from '@main/services/ffmpeg.service';
import { createMergeOutputPath } from '@main/services/job/job-output-path.service';
import type { MergeJobRunnerOptions } from '@main/services/job/job-runner.types';

export const runMergeJob = async ({
  job,
  outputDir,
  resolvedEncoderBackend,
  publishJobEvent,
  createLogEntry,
  ffmpegService,
}: MergeJobRunnerOptions & { ffmpegService: FfmpegService }): Promise<string[]> => {
  const outputPath = createMergeOutputPath(outputDir, job.settings.outputFormat);

  publishJobEvent(job, {
    progress: job.progress,
    message: job.message,
    outputPath,
    resolvedEncoderBackend,
    telemetry: job.telemetry,
    logEntry: createLogEntry('prepare', 'info', `Output target resolved: ${outputPath}`),
  });

  const output = await ffmpegService.processSingleMerge({
    inputPaths: job.sourcePaths,
    outputPath,
    format: job.settings.outputFormat,
    outputResolution: job.settings.outputResolution,
    compression: job.settings.compression,
    resolvedEncoderBackend,
    videoTimingMode: job.settings.videoTimingMode,
    targetFrameRate: job.settings.targetFrameRate,
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
};
