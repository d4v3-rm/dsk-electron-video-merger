import path from 'node:path';
import type { JobProgressUpdate } from '@main/services/ffmpeg.types';
import { FfmpegService } from '@main/services/ffmpeg.service';
import { JobOutputPathService } from '@main/services/job/job-output-path.service';
import { mapBatchProgress } from '@main/services/job/job-progress.utils';
import type { CompressionJobRunnerOptions } from '@main/services/job/job-runner.types';

export class CompressionJobRunnerService {
  constructor(
    private readonly ffmpegService: FfmpegService,
    private readonly outputPathService: JobOutputPathService,
  ) {}

  async run({
    job,
    outputDir,
    resolvedEncoderBackend,
    publishJobEvent,
    createLogEntry,
  }: CompressionJobRunnerOptions): Promise<string[]> {
    const outputs: string[] = [];
    const reservedOutputPaths = new Set<string>();
    const totalFiles = job.sourcePaths.length;

    for (const [index, inputPath] of job.sourcePaths.entries()) {
      const inputFileName = path.basename(inputPath);
      const outputPath = await this.outputPathService.resolveCompressionOutputPath(
        outputDir,
        inputPath,
        job.settings.outputFormat,
        reservedOutputPaths,
      );
      const preparationProgress = mapBatchProgress(index, totalFiles, 4);
      const scopeLabel = `${inputFileName} (${index + 1}/${totalFiles})`;

      publishJobEvent(job, {
        progress: Math.max(job.progress, preparationProgress),
        message: `Preparing compression for ${scopeLabel}`,
        outputPath,
        resolvedEncoderBackend,
        telemetry: job.telemetry,
        logEntry: createLogEntry(
          'prepare',
          'info',
          `Compression target resolved for ${scopeLabel}: ${outputPath}`,
          preparationProgress,
        ),
      });

      const output = await this.ffmpegService.processSingleCompression({
        inputPath,
        outputPath,
        format: job.settings.outputFormat,
        compression: job.settings.compression,
        resolvedEncoderBackend,
        onProgress: (update: JobProgressUpdate) => {
          const progress = mapBatchProgress(index, totalFiles, update.progress);
          const message = `${scopeLabel} | ${update.message}`;

          publishJobEvent(job, {
            progress,
            message,
            outputPath,
            telemetry: update.telemetry,
            resolvedEncoderBackend,
            logEntry: update.logMessage
              ? createLogEntry(update.stage, 'info', `${scopeLabel} | ${update.logMessage}`, progress)
              : undefined,
          });
        },
      });

      outputs.push(output);

      if (index < totalFiles - 1) {
        const completionProgress = mapBatchProgress(index + 1, totalFiles, 0);
        publishJobEvent(job, {
          progress: Math.max(job.progress, completionProgress),
          message: `Completed ${index + 1} of ${totalFiles} compression tasks.`,
          outputPath: output,
          telemetry: job.telemetry,
          resolvedEncoderBackend,
          logEntry: createLogEntry(
            'finalize',
            'info',
            `Completed compression for ${inputFileName}.`,
            completionProgress,
          ),
        });
      }
    }

    return outputs;
  }
}
