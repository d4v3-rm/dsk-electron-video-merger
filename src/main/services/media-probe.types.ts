export interface MediaVideoStreamInfo {
  codecName?: string;
  width: number;
  height: number;
  pixFmt?: string;
  avgFrameRate?: number;
  rFrameRate?: number;
  timeBase?: string;
  durationMs?: number | null;
}

export interface MediaAudioStreamInfo {
  codecName?: string;
  sampleRate?: number;
  channels?: number;
  channelLayout?: string;
  durationMs?: number | null;
}

export interface MediaFileInfo {
  path: string;
  durationMs: number | null;
  video: MediaVideoStreamInfo | null;
  audio: MediaAudioStreamInfo | null;
}
