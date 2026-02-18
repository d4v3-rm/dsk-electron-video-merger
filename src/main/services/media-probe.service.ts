import { spawn } from 'node:child_process';
import ffprobeStatic from 'ffprobe-static';
import { resolveBundledBinaryPath } from '@main/services/binary-path.utils';

const toMilliseconds = (durationSeconds: string): number | null => {
  const parsed = Number.parseFloat(durationSeconds);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed * 1000);
};

export class MediaProbeService {
  private readonly ffprobeBinary = resolveBundledBinaryPath(ffprobeStatic.path);

  async getDurationMs(filePath: string): Promise<number | null> {
    const ffprobeBinary = this.ffprobeBinary;
    if (!ffprobeBinary) {
      return null;
    }

    return new Promise<number | null>((resolve) => {
      const probe = spawn(
        ffprobeBinary,
        [
          '-v',
          'error',
          '-show_entries',
          'format=duration',
          '-of',
          'default=noprint_wrappers=1:nokey=1',
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

        resolve(toMilliseconds(stdout.trim()));
      });
    });
  }

  async getTotalDurationMs(filePaths: string[]): Promise<number | null> {
    if (filePaths.length === 0) {
      return 0;
    }

    const durations = await Promise.all(filePaths.map((filePath) => this.getDurationMs(filePath)));
    if (durations.some((duration) => duration === null)) {
      return null;
    }

    return durations.reduce<number>((total, duration) => total + (duration ?? 0), 0);
  }
}
