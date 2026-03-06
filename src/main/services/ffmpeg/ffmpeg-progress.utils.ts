import type { JobTelemetry } from '@shared/types';
import type { ProgressState } from '@main/services/ffmpeg.types';
import { PROGRESS_SEGMENT_SEPARATOR } from '@main/services/ffmpeg/ffmpeg.constants';

export const clampProgress = (value: number): number => Math.max(1, Math.min(99, value));

export const parseNumber = (value: string): number | undefined => {
  const normalized = value.replace(/x$/i, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parseDurationToMs = (value: string | undefined): number | undefined => {
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

export const formatDurationForLog = (value: number | undefined): string => {
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

export const buildTelemetry = (state: ProgressState, totalDurationMs?: number): JobTelemetry => {
  const processedDurationMs = parseDurationToMs(state.outTime);

  return {
    totalDurationMs,
    processedDurationMs,
    fps: state.fps,
    speed: state.speed,
    bitrate: state.bitrate && state.bitrate !== 'N/A' ? state.bitrate : undefined,
  };
};

export const joinProgressDetails = (parts: Array<string | undefined>): string =>
  parts.filter((part): part is string => Boolean(part)).join(PROGRESS_SEGMENT_SEPARATOR);
