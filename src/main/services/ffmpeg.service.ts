import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import type {
  CompressionPreset,
  EncoderBackend,
  HardwareAccelerationProfile,
  OutputFormat,
  ResolvedEncoderBackend,
} from '@shared/types';

export type JobProgressCallback = (value: number, message: string, outputPath?: string) => void;

interface EncoderArgs {
  args: string[];
}

const CPU_CRF_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '25',
  strong: '35',
};

const NVENC_CQ_BY_PRESET: Record<CompressionPreset, string> = {
  light: '18',
  balanced: '24',
  strong: '30',
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
  webm: {
    args: ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '0', '-c:a', 'libopus'],
  },
};

const NVIDIA_SUPPORTED_FORMATS: OutputFormat[] = ['mp4', 'mov'];

const createDefaultHardwareAccelerationProfile = (
  reason = 'NVIDIA NVENC non rilevato dal binario FFmpeg corrente.',
): HardwareAccelerationProfile => ({
  nvidia: {
    available: false,
    encoder: null,
    hardwareAccel: null,
    supportedOutputFormats: [],
    reason,
  },
});

const toProbeErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Rilevamento hardware non riuscito.';
};

export class FfmpegService {
  private readonly ffmpegBinary = ffmpegPath;
  private hardwareAccelerationProfilePromise: Promise<HardwareAccelerationProfile> | null = null;

  async getHardwareAccelerationProfile(): Promise<HardwareAccelerationProfile> {
    if (!this.ffmpegBinary) {
      return createDefaultHardwareAccelerationProfile('FFmpeg non disponibile nel runtime corrente.');
    }

    if (!this.hardwareAccelerationProfilePromise) {
      this.hardwareAccelerationProfilePromise = this.detectHardwareAccelerationProfile().catch((error) =>
        createDefaultHardwareAccelerationProfile(
          `Rilevamento hardware non riuscito: ${toProbeErrorMessage(error)}`,
        ),
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
      throw new Error('Il merge richiede almeno un file input.');
    }

    const concatInputFile =
      inputPaths.length > 1 ? await this.createConcatInputFile(tempDir, inputPaths) : null;
    const encoder = this.buildEncoderArgs(format, compression, resolvedEncoderBackend);
    const inputArgs = concatInputFile
      ? ['-f', 'concat', '-safe', '0', '-i', concatInputFile]
      : ['-i', inputPaths[0]];

    await this.runFfMpeg(
      ['-y', ...inputArgs, ...encoder.args, outputPath],
      onProgress,
      resolvedEncoderBackend === 'nvidia' ? 'Transcodifica GPU NVIDIA' : 'Transcodifica CPU',
    );

    return outputPath;
  }

  private buildEncoderArgs(
    format: OutputFormat,
    compression: CompressionPreset,
    resolvedEncoderBackend: ResolvedEncoderBackend,
  ): EncoderArgs {
    if (resolvedEncoderBackend === 'nvidia' && NVIDIA_SUPPORTED_FORMATS.includes(format)) {
      return {
        args: [
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
          '-movflags',
          '+faststart',
        ],
      };
    }

    const cpuEncoder = CPU_ENCODER_BY_FORMAT[format];
    return {
      args: [...cpuEncoder.args, ...(format === 'webm' ? [] : ['-crf', CPU_CRF_BY_PRESET[compression]])],
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
          ? 'NVIDIA NVENC disponibile per MP4 e MOV.'
          : 'NVIDIA NVENC disponibile per l encode; decode CUDA non rilevato.',
      },
    };
  }

  private async runFfMpegProbe(args: string[]): Promise<string> {
    if (!this.ffmpegBinary) {
      throw new Error('FFmpeg non disponibile nel runtime corrente.');
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
  ): Promise<void> {
    if (!this.ffmpegBinary) {
      throw new Error('FFmpeg non disponibile nel runtime corrente.');
    }

    return new Promise<void>((resolve, reject) => {
      let progressNotified = false;
      const ffmpegProcess = spawn(this.ffmpegBinary as string, args, {
        stdio: ['ignore', 'ignore', 'pipe'],
      });

      onProgress(18, 'Preparazione timeline');

      ffmpegProcess.stderr.on('data', (chunk: Buffer) => {
        const line = chunk.toString();
        if (!progressNotified && line.includes('frame=')) {
          progressNotified = true;
          onProgress(76, processingLabel);
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
