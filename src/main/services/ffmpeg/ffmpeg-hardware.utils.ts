import { spawn } from 'node:child_process';
import type { HardwareAccelerationProfile } from '@shared/types';

const toProbeErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Hardware detection failed.';
};

export const createDefaultHardwareAccelerationProfile = (
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

const runFfMpegProbe = async (ffmpegBinary: string | null, args: string[]): Promise<string> => {
  if (!ffmpegBinary) {
    throw new Error('FFmpeg is not available in the current runtime.');
  }

  return new Promise<string>((resolve, reject) => {
    const ffmpegProcess = spawn(ffmpegBinary, args, {
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
};

export const detectHardwareAccelerationProfileSafely = async (
  ffmpegBinary: string | null,
  supportedFormats: HardwareAccelerationProfile['nvidia']['supportedOutputFormats'],
): Promise<HardwareAccelerationProfile> => {
  try {
    const [encodersOutput, hardwareAccelerationOutput] = await Promise.all([
      runFfMpegProbe(ffmpegBinary, ['-hide_banner', '-encoders']),
      runFfMpegProbe(ffmpegBinary, ['-hide_banner', '-hwaccels']),
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
        supportedOutputFormats: [...supportedFormats],
        reason: hasCudaAcceleration
          ? 'NVIDIA NVENC is available for MP4, MOV, and MKV outputs.'
          : 'NVIDIA NVENC encode is available, but CUDA decode was not detected.',
      },
    };
  } catch (error) {
    return createDefaultHardwareAccelerationProfile(`Hardware detection failed: ${toProbeErrorMessage(error)}`);
  }
};
