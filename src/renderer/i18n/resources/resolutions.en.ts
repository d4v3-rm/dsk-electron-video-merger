const resolutionsEn = {
  source: {
    label: 'Source',
    description:
      'Keep the native input resolution. Merge mode follows the first clip canvas, while compression keeps each source frame size.',
    technical: 'Native input canvas',
    badge: 'Source-matched',
    behavior: 'Mode-aware',
  },
  '720p': {
    label: '720p',
    description: 'Normalize the output to a 1280 x 720 canvas.',
  },
  '1080p': {
    label: '1080p',
    description: 'Normalize the output to a 1920 x 1080 canvas.',
  },
  '1440p': {
    label: '1440p',
    description: 'Normalize the output to a 2560 x 1440 canvas.',
  },
  '2160p': {
    label: '2160p',
    description: 'Normalize the output to a 3840 x 2160 canvas.',
  },
  fixedCanvasBadge: '16:9 canvas',
};

export default resolutionsEn;
