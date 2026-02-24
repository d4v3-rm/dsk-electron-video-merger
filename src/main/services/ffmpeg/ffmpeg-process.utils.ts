import { spawn } from 'node:child_process';
import type { JobProgressCallback, ProgressState } from '@main/services/ffmpeg.types';
import {
  PROGRESS_LOG_BUCKET_SIZE,
  PROGRESS_SEGMENT_SEPARATOR,
} from '@main/services/ffmpeg/ffmpeg.constants';
import {
  buildTelemetry,
  clampProgress,
  formatDurationForLog,
  joinProgressDetails,
  parseNumber,
} from '@main/services/ffmpeg/ffmpeg-progress.utils';

export const runFfMpeg = async (
  ffmpegBinary: string | null,
  args: string[],
  onProgress: JobProgressCallback,
  processingLabel: string,
  totalDurationMs?: number,
): Promise<void> => {
  if (!ffmpegBinary) {
    throw new Error('FFmpeg is not available in the current runtime.');
  }

  return new Promise<void>((resolve, reject) => {
    let buffer = '';
    let lastEmittedProgress = 0;
    let lastLoggedBucket = -1;
    const progressState: ProgressState = {};

    const emitRuntimeUpdate = (phase: 'encode' | 'finalize'): void => {
      const telemetry = buildTelemetry(progressState, totalDurationMs);
      const processedDurationMs = telemetry.processedDurationMs ?? 0;
      const computedProgress =
        totalDurationMs && totalDurationMs > 0
          ? clampProgress(Math.round((processedDurationMs / totalDurationMs) * 100))
          : Math.min(96, Math.max(lastEmittedProgress + 1, processedDurationMs > 0 ? 24 : 12));
      const progress = phase === 'finalize' ? 99 : Math.max(lastEmittedProgress, computedProgress);
      const speedLabel = telemetry.speed ? `${telemetry.speed.toFixed(2)}x` : undefined;
      const timeLabel = totalDurationMs
        ? `${formatDurationForLog(processedDurationMs)} / ${formatDurationForLog(totalDurationMs)}`
        : formatDurationForLog(processedDurationMs);
      const runtimeDetails = joinProgressDetails([timeLabel, speedLabel]);

      const message =
        phase === 'finalize'
          ? 'Finalizing output container'
          : `${processingLabel} ${progress}%${runtimeDetails ? `${PROGRESS_SEGMENT_SEPARATOR}${runtimeDetails}` : ''}`;

      const logBucket = Math.floor(progress / PROGRESS_LOG_BUCKET_SIZE);
      const shouldLog = phase === 'finalize' || logBucket > lastLoggedBucket;

      if (shouldLog) {
        lastLoggedBucket = Math.max(lastLoggedBucket, logBucket);
      }

      lastEmittedProgress = progress;

      const logDetails = joinProgressDetails([
        telemetry.bitrate,
        telemetry.fps ? `${telemetry.fps.toFixed(1)} fps` : undefined,
      ]);

      onProgress({
        progress,
        message,
        stage: phase === 'finalize' ? 'finalize' : 'encode',
        telemetry,
        logMessage: shouldLog
          ? `${message}${logDetails ? `${PROGRESS_SEGMENT_SEPARATOR}${logDetails}` : ''}`
          : undefined,
      });
    };

    const ffmpegProcess = spawn(ffmpegBinary, ['-hide_banner', '-nostats', '-progress', 'pipe:2', ...args], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    onProgress({
      progress: 8,
      message: 'Preparing timeline and encoder settings',
      stage: 'prepare',
      telemetry: totalDurationMs ? { totalDurationMs } : undefined,
      logMessage: 'Preparing timeline and encoder settings.',
    });

    ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
      buffer += chunk.toString();

      while (buffer.includes('\n')) {
        const newlineIndex = buffer.indexOf('\n');
        const rawLine = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (!rawLine) {
          continue;
        }

        const separatorIndex = rawLine.indexOf('=');
        if (separatorIndex === -1) {
          continue;
        }

        const key = rawLine.slice(0, separatorIndex);
        const value = rawLine.slice(separatorIndex + 1);

        switch (key) {
          case 'bitrate': {
            progressState.bitrate = value;
            break;
          }
          case 'fps': {
            progressState.fps = parseNumber(value);
            break;
          }
          case 'out_time': {
            progressState.outTime = value;
            break;
          }
          case 'speed': {
            progressState.speed = parseNumber(value);
            break;
          }
          case 'progress': {
            if (value === 'continue') {
              emitRuntimeUpdate('encode');
            }

            if (value === 'end') {
              emitRuntimeUpdate('finalize');
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    });

    ffmpegProcess.on('error', (error: Error) => {
      reject(error);
    });

    ffmpegProcess.on('close', (code: number | null) => {
      if (code === 0 || code === null) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exit code: ${code}`));
      }
    });
  });
};
