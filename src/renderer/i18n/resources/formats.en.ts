const formatsEn = {
  mp4: {
    label: 'MP4',
    category: 'Distribution',
    description: 'Best all-round delivery choice for players, browsers, and devices.',
    codecs: 'H.264 video + AAC audio',
    backend: 'CPU or NVIDIA NVENC',
  },
  mov: {
    label: 'MOV',
    category: 'Editing',
    description: 'QuickTime container tuned for editing handoff and post workflows.',
    codecs: 'H.264 video + AAC audio',
    backend: 'CPU or NVIDIA NVENC',
  },
  mkv: {
    label: 'MKV',
    category: 'Archive',
    description: 'Flexible archive container when compatibility matters less than muxing freedom.',
    codecs: 'H.264 video + AAC audio',
    backend: 'CPU or NVIDIA NVENC',
  },
  webm: {
    label: 'WebM',
    category: 'Web',
    description: 'Web-oriented output using VP9 and Opus for browser-first delivery.',
    codecs: 'VP9 video + Opus audio',
    backend: 'CPU only',
  },
  flv: {
    label: 'FLV',
    category: 'Legacy stream',
    description: 'Legacy streaming container for older ingest and playback targets.',
    codecs: 'H.264 video + AAC audio',
    backend: 'CPU or NVIDIA NVENC',
  },
  avi: {
    label: 'AVI',
    category: 'Legacy',
    description: 'Legacy interchange container using MPEG-4 video and MP3 audio.',
    codecs: 'MPEG-4 video + MP3 audio',
    backend: 'CPU only',
  },
  ogv: {
    label: 'OGV',
    category: 'Open',
    description: 'Open media package using Theora and Vorbis for niche or archival targets.',
    codecs: 'Theora video + Vorbis audio',
    backend: 'CPU only',
  },
  mpg: {
    label: 'MPG',
    category: 'Legacy playback',
    description: 'MPEG program stream for signage, appliances, and older playback chains.',
    codecs: 'MPEG-2 video + MP2 audio',
    backend: 'CPU only',
  },
};

export default formatsEn;
