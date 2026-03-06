const compressionEn = {
  master: {
    label: 'Master',
    description: 'Highest retention and the largest files. Best for handoff and edit-safe outputs.',
  },
  high: {
    label: 'High',
    description: 'Conservative compression that keeps visible loss low.',
  },
  balanced: {
    label: 'Balanced',
    description: 'Default tradeoff between size, speed, and visual retention.',
  },
  web: {
    label: 'Web',
    description: 'Leans harder into bitrate reduction for upload and distribution.',
  },
  small: {
    label: 'Small',
    description: 'Most aggressive profile for constrained storage and delivery.',
  },
};

export default compressionEn;
