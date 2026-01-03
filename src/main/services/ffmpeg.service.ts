import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import type {
  CompressionPreset,
  EncoderBackend,
  HardwareAccelerationProfile,
  JobLogStage,
  JobTelemetry,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';
import { MediaProbeService } from '@main/services/media-probe.service';

export interface JobProgressUpdate {
  progress: number;
  message: string;
  stage: JobLogStage;
  telemetry?: JobTelemetry;
  logMessage?: string;
}

export type JobProgressCallback = (update: JobProgressUpdate) => void;

interface EncoderArgs {
  args: string[];
}

interface ProgressState {
  bitrate?: string;
  fps?: number;
  outTime?: string;
  speed?: number;
}

const CPU_CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '23',
  strong: '28',
};

const VP9_CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '28',
  balanced: '32',
  strong: '36',
};

const NVENC_CQ_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '22',
  strong: '28',
};

const NVENC_PRESET_BY_PRESET: Record<CompressionPreset, string> = {
  light: 'p6',
  balanced: 'p5',
  strong: 'p4',
};

const CPU_ENCODER_BY_FORMAT: Record<OutputFormat, EncoderArgs> = {
  mp4: {
    args: [
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-movflags',
      '+faststart',
    ],
  },
  mov: {
    args: [
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-movflags',
      '+faststart',
    ],
  },
  mkv: {
    args: ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k'],
  },
  webm: {
    args: [
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-b:v',
      '0',
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      '-row-mt',
      '1',
      '-c:a',
      'libopus',
    ],
  },
};

const NVIDIA_SUPPORTED_FORMATS: OutputFormat[] = ['mp4', 'mov', 'mkv'];
const PROGRESS_LOG_BUCKET_SIZE = 10;

const clampProgress = (value: number): number => Math.max(1, Math.min(99, value));

const toProbeErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Hardware detection failed.';
};

const createDefaultHardwareAccelerationProfile = (
  reason = 'NVIDIA NVENC was not detected in the bundled FFmpeg binary.',
): HardwareAccelerationProfile => ({
  nvidia: {
    available: false,
    encoder: null,
    hardwareAccel: null,
    supportedOutputFormats: [],
    reason,
  },
});

const parseNumber = (value: string): number | undefined => {
  const normalized = value.replace(/x$/i, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseDurationToMs = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const match = value.match(/^(\d+):(\d+):(\d+(?:\.\d+)?)$/);
  if (!match) {
    return undefined;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const seconds = Number.parseFloat(match[3]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return undefined;
  }

  return Math.round(((hours * 60 + minutes) * 60 + seconds) * 1000);
};

const formatDurationForLog = (value: number | undefined): string => {
  if (value === undefined || value < 0) {
    return '--:--';
  }

  const totalSeconds = Math.floor(value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const buildTelemetry = (state: ProgressState, totalDurationMs?: number): JobTelemetry => {
  const processedDurationMs = parseDurationToMs(state.outTime);

  return {
    totalDurationMs,
    processedDurationMs,
    fps: state.fps,
    speed: state.speed,
    bitrate: state.bitrate && state.bitrate !== 'N/A' ? state.bitrate : undefined,
  };
};

export class FfmpegService {
  private readonly ffmpegBinary = ffmpegPath;
  private readonly mediaProbeService = new MediaProbeService();
  private hardwareAccelerationProfilePromise: Promise<HardwareAccelerationProfile> | null = null;

  async getHardwareAccelerationProfile(): Promise<HardwareAccelerationProfile> {
    if (!this.ffmpegBinary) {
      return createDefaultHardwareAccelerationProfile('FFmpeg is not available in the current runtime.');
    }

    if (!this.hardwareAccelerationProfilePromise) {
      this.hardwareAccelerationProfilePromise = this.detectHardwareAccelerationProfile().catch((error) =>
        createDefaultHardwareAccelerationProfile(`Hardware detection failed: ${toProbeErrorMessage(error)}`),
      );
    }

    return this.hardwareAccelerationProfilePromise;
  }

  resolveEncoderBackend(
    requestedBackend: EncoderBackend,
    format: OutputFormat,
    hardwareProfile: HardwareAccelerationProfile,
  ): ResolvedEncoderBackend {
    if (!NVIDIA_SUPPORTED_FORMATS.includes(format)) {
      return 'cpu';
    }

    if (requestedBackend === 'cpu') {
      return 'cpu';
    }

    if (requestedBackend === 'nvidia' && hardwareProfile.nvidia.available) {
      return 'nvidia';
    }

    if (requestedBackend === 'auto' && hardwareProfile.nvidia.available) {
      return 'nvidia';
    }

    return 'cpu';
  }

  async processSingleMerge({
    inputPaths,
    outputPath,
    format,
    compression,
    resolvedEncoderBackend,
    tempDir,
    onProgress,
  }: {
    inputPaths: string[];
    outputPath: string;
    format: OutputFormat;
    compression: CompressionPreset;
    resolvedEncoderBackend: ResolvedEncoderBackend;
    tempDir: string;
    onProgress: JobProgressCallback;
  }): Promise<string> {
    if (inputPaths.length === 0) {
      throw new Error('At least one input file is required to start the merge.');
    }

    const totalDurationMs = (await this.mediaProbeService.getTotalDurationMs(inputPaths)) ?? undefined;
    const concatInputFile =
      inputPaths.length > 1 ? await this.createConcatInputFile(tempDir, inputPaths) : null;
    const encoder = this.buildEncoderArgs(format, compression, resolvedEncoderBackend);
    const inputArgs = concatInputFile
      ? ['-f', 'concat', '-safe', '0', '-i', concatInputFile]
      : ['-i', inputPaths[0]];

    await this.runFfMpeg(
      ['-y', ...inputArgs, ...encoder.args, outputPath],
      onProgress,
      resolvedEncoderBackend === 'nvidia'
        ? 'Encoding with NVIDIA NVENC'
        : format === 'webm'
          ? 'Encoding VP9 output on CPU'
          : 'Encoding on CPU',
      totalDurationMs,
    );

    return outputPath;
  }

  private buildEncoderArgs(
    format: OutputFormat,
    compression: CompressionPreset,
    resolvedEncoderBackend: ResolvedEncoderBackend,
  ): EncoderArgs {
    if (resolvedEncoderBackend === 'nvidia' && NVIDIA_SUPPORTED_FORMATS.includes(format)) {
      const baseArgs = [
        '-c:v',
        'h264_nvenc',
        '-preset:v',
        NVENC_PRESET_BY_PRESET[compression],
        '-rc:v',
        'vbr',
        '-cq:v',
        NVENC_CQ_BY_PRESET[compression],
        '-b:v',
        '0',
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-b:a',
        '160k',
      ];

      return {
        args: format === 'mp4' || format === 'mov' ? [...baseArgs, '-movflags', '+faststart'] : baseArgs,
      };
    }

    const cpuEncoder = CPU_ENCODER_BY_FORMAT[format];
    if (format === 'webm') {
      return {
        args: [...cpuEncoder.args, '-crf', VP9_CRF_BY_PRESET[compression]],
      };
    }

    return {
      args: [...cpuEncoder.args, '-crf', CPU_CRF_BY_PRESET[compression]],
    };
  }

  private async createConcatInputFile(tempDir: string, inputPaths: string[]): Promise<string> {
    const concatFile = path.join(tempDir, 'concat-input.txt');
    const content = inputPaths.map((filePath) => `file '${filePath.replace(/'/g, "'\\''")}'`).join('\n');
    await fs.writeFile(concatFile, content, 'utf8');
    return concatFile;
  }

  private async detectHardwareAccelerationProfile(): Promise<HardwareAccelerationProfile> {
    const [encodersOutput, hardwareAccelerationOutput] = await Promise.all([
      this.runFfMpegProbe(['-hide_banner', '-encoders']),
      this.runFfMpegProbe(['-hide_banner', '-hwaccels']),
    ]);

    const hasNvencEncoder = encodersOutput.includes('h264_nvenc');
    const hasCudaAcceleration = hardwareAccelerationOutput.includes('cuda');

    if (!hasNvencEncoder) {
      return createDefaultHardwareAccelerationProfile();
    }

    return {
      nvidia: {
        available: true,
        encoder: 'h264_nvenc',
        hardwareAccel: hasCudaAcceleration ? 'cuda' : null,
        supportedOutputFormats: [...NVIDIA_SUPPORTED_FORMATS],
        reason: hasCudaAcceleration
          ? 'NVIDIA NVENC is available for MP4, MOV, and MKV outputs.'
          : 'NVIDIA NVENC encode is available, but CUDA decode was not detected.',
      },
    };
  }

  private async runFfMpegProbe(args: string[]): Promise<string> {
    if (!this.ffmpegBinary) {
      throw new Error('FFmpeg is not available in the current runtime.');
    }

    return new Promise<string>((resolve, reject) => {
      const ffmpegProcess = spawn(this.ffmpegBinary as string, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let output = '';

      ffmpegProcess.stdout.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
        output += chunk.toString();
      });

      ffmpegProcess.on('error', (error: Error) => {
        reject(error);
      });

      ffmpegProcess.on('close', (code: number | null) => {
        if (code === 0 || code === null) {
          resolve(output);
        } else {
          reject(new Error(`ffmpeg probe exit code: ${code}`));
        }
      });
    });
  }

  private async runFfMpeg(
    args: string[],
    onProgress: JobProgressCallback,
    processingLabel: string,
    totalDurationMs?: number,
  ): Promise<void> {
    if (!this.ffmpegBinary) {
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

        const message =
          phase === 'finalize'
            ? 'Finalizing output container'
            : `${processingLabel} ${progress}%${timeLabel ? ` � ${timeLabel}` : ''}${speedLabel ? ` � ${speedLabel}` : ''}`;

        const logBucket = Math.floor(progress / PROGRESS_LOG_BUCKET_SIZE);
        const shouldLog = phase === 'finalize' || logBucket > lastLoggedBucket;

        if (shouldLog) {
          lastLoggedBucket = Math.max(lastLoggedBucket, logBucket);
        }

        lastEmittedProgress = progress;
        onProgress({
          progress,
          message,
          stage: phase === 'finalize' ? 'finalize' : 'encode',
          telemetry,
          logMessage: shouldLog
            ? `${message}${telemetry.bitrate ? ` � ${telemetry.bitrate}` : ''}${telemetry.fps ? ` � ${telemetry.fps.toFixed(1)} fps` : ''}`
            : undefined,
        });
      };

      const ffmpegProcess = spawn(
        this.ffmpegBinary as string,
        ['-hide_banner', '-nostats', '-progress', 'pipe:2', ...args],
        {
          stdio: ['ignore', 'ignore', 'pipe'],
        },
      );

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
  }
}
