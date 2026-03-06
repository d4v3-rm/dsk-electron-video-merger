import { spawn } from 'node:child_process';
import ffprobeStatic from 'ffprobe-static';
import { resolveBundledBinaryPath } from '@main/services/binary-path.utils';
import type { MediaFileInfo } from '@main/services/media-probe.types';
import {
  toAudioStreamInfo,
  toMilliseconds,
  toVideoStreamInfo,
  type RawProbeResult,
} from '@main/services/media-probe.parsers';

export interface MediaProbeService {
  getFileInfo: (filePath: string) => Promise<MediaFileInfo | null>;
  getDurationMs: (filePath: string) => Promise<number | null>;
  getFilesInfo: (filePaths: string[]) => Promise<MediaFileInfo[] | null>;
  getTotalDurationMs: (filePaths: string[]) => Promise<number | null>;
}

export const createMediaProbeService = (): MediaProbeService => {
  const ffprobeBinary = resolveBundledBinaryPath(ffprobeStatic.path);

  const getFileInfo = async (filePath: string): Promise<MediaFileInfo | null> => {
    if (!ffprobeBinary) {
      return null;
    }

    return new Promise<MediaFileInfo | null>((resolve) => {
      const probe = spawn(
        ffprobeBinary,
        [
          '-v',
          'error',
          '-print_format',
          'json',
          '-show_streams',
          '-show_entries',
          'format=duration:stream=codec_type,codec_name,width,height,pix_fmt,avg_frame_rate,r_frame_rate,time_base,sample_rate,channels,channel_layout,duration',
          filePath,
        ],
        {
          stdio: ['ignore', 'pipe', 'pipe'] as const,
        },
      );

      let stdout = '';

      probe.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      probe.on('error', () => {
        resolve(null);
      });

      probe.on('close', (code: number | null) => {
        if (code !== 0 && code !== null) {
          resolve(null);
          return;
        }

        try {
          const parsed = JSON.parse(stdout) as RawProbeResult;
          const streams = parsed.streams ?? [];
          const video = toVideoStreamInfo(streams.find((stream) => stream.codec_type === 'video'));
          const audio = toAudioStreamInfo(streams.find((stream) => stream.codec_type === 'audio'));

          resolve({
            path: filePath,
            durationMs: parsed.format?.duration ? toMilliseconds(parsed.format.duration) : null,
            video,
            audio,
          });
        } catch {
          resolve(null);
        }
      });
    });
  };

  const getDurationMs = async (filePath: string): Promise<number | null> => {
    const info = await getFileInfo(filePath);
    return info?.durationMs ?? null;
  };

  const getFilesInfo = async (filePaths: string[]): Promise<MediaFileInfo[] | null> => {
    const filesInfo = await Promise.all(filePaths.map((filePath) => getFileInfo(filePath)));
    if (filesInfo.some((info) => info === null)) {
      return null;
    }

    return filesInfo as MediaFileInfo[];
  };

  const getTotalDurationMs = async (filePaths: string[]): Promise<number | null> => {
    if (filePaths.length === 0) {
      return 0;
    }

    const durations = await Promise.all(filePaths.map((filePath) => getDurationMs(filePath)));
    if (durations.some((duration) => duration === null)) {
      return null;
    }

    return durations.reduce<number>((total, duration) => total + (duration ?? 0), 0);
  };

  return {
    getFileInfo,
    getDurationMs,
    getFilesInfo,
    getTotalDurationMs,
  };
};
