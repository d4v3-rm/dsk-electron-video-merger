import type { TargetFrameRate, VideoTimingMode } from '@shared/types';
import type { MediaFileInfo } from '@main/services/media-probe.types';
import {
  DEFAULT_AUDIO_CHANNEL_LAYOUT,
  DEFAULT_AUDIO_SAMPLE_RATE,
} from '@main/services/ffmpeg/ffmpeg.constants';
import { resolveFrameRateLabel } from '@main/services/ffmpeg/ffmpeg-command.utils';

export const formatSeconds = (durationMs: number): string => (durationMs / 1000).toFixed(3);

export const buildScalePadFilter = (targetWidth: number, targetHeight: number): string =>
  `scale=${targetWidth}:${targetHeight}:force_original_aspect_ratio=decrease,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black,setsar=1`;

export const resolveSegmentDurationMs = (fileInfo: MediaFileInfo): number => {
  const durationMs = fileInfo.durationMs ?? fileInfo.video?.durationMs ?? fileInfo.audio?.durationMs ?? null;
  if (!durationMs || durationMs <= 0) {
    throw new Error(`Unable to resolve segment duration for ${fileInfo.path}.`);
  }

  return durationMs;
};

export const buildMergeFilterGraph = (
  filesInfo: MediaFileInfo[],
  videoTimingMode: VideoTimingMode,
  targetFrameRate: TargetFrameRate,
): { filterComplex: string; hasAudio: boolean; videoOutputLabel: string; audioOutputLabel?: string } => {
  const firstVideoStream = filesInfo[0]?.video;
  if (!firstVideoStream) {
    throw new Error('Unable to resolve the merge output video profile.');
  }

  const targetWidth = firstVideoStream.width;
  const targetHeight = firstVideoStream.height;
  const hasAudio = filesInfo.some((fileInfo) => Boolean(fileInfo.audio));
  const filterParts: string[] = [];
  const concatInputs: string[] = [];

  filesInfo.forEach((fileInfo, index) => {
    filterParts.push(
      `[${index}:v:0]setpts=PTS-STARTPTS,${buildScalePadFilter(targetWidth, targetHeight)}[v${index}]`,
    );
    concatInputs.push(`[v${index}]`);

    if (!hasAudio) {
      return;
    }

    if (fileInfo.audio) {
      filterParts.push(
        `[${index}:a:0]aresample=${DEFAULT_AUDIO_SAMPLE_RATE}:async=1:first_pts=0,aformat=sample_fmts=fltp:channel_layouts=${DEFAULT_AUDIO_CHANNEL_LAYOUT},asetpts=PTS-STARTPTS[a${index}]`,
      );
    } else {
      filterParts.push(
        `anullsrc=r=${DEFAULT_AUDIO_SAMPLE_RATE}:cl=${DEFAULT_AUDIO_CHANNEL_LAYOUT},atrim=duration=${formatSeconds(resolveSegmentDurationMs(fileInfo))},asetpts=PTS-STARTPTS[a${index}]`,
      );
    }

    concatInputs.push(`[a${index}]`);
  });

  if (hasAudio) {
    filterParts.push(`${concatInputs.join('')}concat=n=${filesInfo.length}:v=1:a=1[vcat][acat]`);
  } else {
    filterParts.push(`${concatInputs.join('')}concat=n=${filesInfo.length}:v=1:a=0[vcat]`);
  }

  if (videoTimingMode === 'cfr') {
    filterParts.push(`[vcat]fps=${resolveFrameRateLabel(targetFrameRate)}[vout]`);
    return {
      filterComplex: filterParts.join(';'),
      hasAudio,
      videoOutputLabel: '[vout]',
      audioOutputLabel: hasAudio ? '[acat]' : undefined,
    };
  }

  return {
    filterComplex: filterParts.join(';'),
    hasAudio,
    videoOutputLabel: '[vcat]',
    audioOutputLabel: hasAudio ? '[acat]' : undefined,
  };
};
