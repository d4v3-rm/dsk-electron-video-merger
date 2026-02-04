export const heroTags = ['Desktop-first', 'Portable build', 'FFmpeg core'];

export const heroMetrics = [
  { label: 'Modes', value: 'Merge + Compress' },
  { label: 'Acceleration', value: 'CPU / NVIDIA NVENC' },
  { label: 'Containers', value: 'MP4 / MOV / MKV / WebM' },
];

export const featureCards = [
  {
    title: 'One control room for two workflows',
    description:
      'Switch between timeline merging and individual batch compression without changing tools or leaving the desktop app.',
  },
  {
    title: 'Readable output planning',
    description:
      'Inspect destination path, codec profile, backend selection, and live runtime telemetry before and during execution.',
  },
  {
    title: 'GPU-aware when hardware exists',
    description:
      'Use NVIDIA NVENC automatically where containers and codecs permit it, then fall back cleanly to CPU when they do not.',
  },
  {
    title: 'Portable release, local-first runtime',
    description:
      'No database, no remote dependency, no cloud roundtrip. Everything stays on the operator workstation.',
  },
];

export const workflowSteps = [
  {
    title: 'Stage the source set',
    description:
      'Add clips or source videos, reorder only when merge mode requires a strict final timeline, and set the delivery destination.',
    details: ['Queue-aware workspace', 'Destination folder selection', 'Format and profile presets'],
  },
  {
    title: 'Encode with intent',
    description:
      'Select container, compression profile, and preferred backend while the app computes the effective runtime execution path.',
    details: ['MP4, MOV, MKV, WebM', 'Auto, CPU, NVIDIA NVENC', 'Real FFmpeg telemetry'],
  },
  {
    title: 'Review and deliver',
    description:
      'Track progress, inspect logs, open historical jobs, and recover the final artifact directly from the output destination.',
    details: ['Live progress + percentages', 'Detailed job history', 'Artifact path visibility'],
  },
];

export const performanceHighlights = [
  {
    label: 'Desktop shell',
    value: 'Electron + Node.js',
    caption: 'Native desktop workflow with local filesystem access and IPC-backed orchestration.',
  },
  {
    label: 'Presentation layer',
    value: 'React + Ant Design',
    caption: 'Structured operator UI with a custom dark theme and production-ready components.',
  },
  {
    label: 'Motion system',
    value: 'GSAP',
    caption:
      'Reveal choreography, staggered panels, and section-level transitions for the landing experience.',
  },
  {
    label: 'Packaging',
    value: 'Portable Windows build',
    caption: 'Designed for distribution as a portable desktop executable without installer friction.',
  },
];

export const capabilityColumns = [
  {
    title: 'Merge studio',
    items: [
      'Explicit clip ordering',
      'Single master output',
      'Technical output planning',
      'Live execution telemetry',
    ],
  },
  {
    title: 'Compression lane',
    items: [
      'Per-file output generation',
      'Profile-driven compression',
      'Backend selection and fallback',
      'Destination folder targeting',
    ],
  },
  {
    title: 'Operational detail',
    items: [
      'Job history drawer',
      'Codec guidance from markdown',
      'Hardware awareness',
      'Local-only artifact storage',
    ],
  },
];
