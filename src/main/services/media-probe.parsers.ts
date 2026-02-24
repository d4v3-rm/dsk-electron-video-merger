import type { MediaAudioStreamInfo, MediaVideoStreamInfo } from '@main/services/media-probe.types';

export interface RawProbeStream {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
  pix_fmt?: string;
  avg_frame_rate?: string;
  r_frame_rate?: string;
  time_base?: string;
  sample_rate?: string;
  channels?: number;
  channel_layout?: string;
  duration?: string;
}

export interface RawProbeResult {
  format?: {
    duration?: string;
  };
  streams?: RawProbeStream[];
}

export const toMilliseconds = (durationSeconds: string): number | null => {
  const parsed = Number.parseFloat(durationSeconds);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed * 1000);
};

const parseRational = (value?: string): number | undefined => {
  if (!value || value === '0/0') {
    return undefined;
  }

  const [numerator, denominator] = value.split('/');
  const parsedNumerator = Number.parseFloat(numerator);
  const parsedDenominator = Number.parseFloat(denominator);
  if (
    !Number.isFinite(parsedNumerator) ||
    !Number.isFinite(parsedDenominator) ||
    parsedDenominator === 0
  ) {
    return undefined;
  }

  const result = parsedNumerator / parsedDenominator;
  return Number.isFinite(result) && result > 0 ? result : undefined;
};

const parseInteger = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const toVideoStreamInfo = (stream: RawProbeStream | undefined): MediaVideoStreamInfo | null => {
  if (!stream || stream.codec_type !== 'video' || !stream.width || !stream.height) {
    return null;
  }

  return {
    codecName: stream.codec_name,
    width: stream.width,
    height: stream.height,
    pixFmt: stream.pix_fmt,
    avgFrameRate: parseRational(stream.avg_frame_rate),
    rFrameRate: parseRational(stream.r_frame_rate),
    timeBase: stream.time_base,
    durationMs: stream.duration ? toMilliseconds(stream.duration) : null,
  };
};

export const toAudioStreamInfo = (stream: RawProbeStream | undefined): MediaAudioStreamInfo | null => {
  if (!stream || stream.codec_type !== 'audio') {
    return null;
  }

  return {
    codecName: stream.codec_name,
    sampleRate: parseInteger(stream.sample_rate),
    channels: stream.channels,
    channelLayout: stream.channel_layout,
    durationMs: stream.duration ? toMilliseconds(stream.duration) : null,
  };
};
