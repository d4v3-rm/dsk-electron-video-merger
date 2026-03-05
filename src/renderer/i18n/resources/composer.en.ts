const composerEn = {
  cardTitle: {
    merge: 'Merge setup',
    compress: 'Compression setup',
  },
  tags: {
    orderedQueue: 'Ordered queue',
    batchCompression: 'Batch compression',
    nvidiaAvailable: 'NVENC available',
    cpuOnly: 'CPU only',
  },
  title: {
    merge: 'Build the final merge',
    compress: 'Build the compression batch',
  },
  subtitle: {
    merge: 'Define clip order, choose the export profile, and render one final master.',
    compress: 'Select source videos, choose one export profile, and encode each file independently.',
  },
  sections: {
    exportProfile: 'Export profile',
    outputContainer: 'Container and codec',
    qualityProfile: 'Compression profile',
    processingRules: 'Processing rules',
    deliveryControls: 'Delivery controls',
    executionNotes: 'Execution notes',
    queueMerge: 'Timeline queue',
    queueCompress: 'Source selection',
  },
  orderInfo: {
    merge: 'The list order becomes the real order of the final merged video.',
    compress:
      'Every selected video is compressed independently. Queue order does not affect the generated outputs.',
  },
  queueHint: {
    merge: 'Order directly controls the final merged timeline. Reorder clips before launch.',
    compress: 'Each source stays independent. The list is only for review and cleanup before launch.',
  },
  hardwareDetecting: 'Hardware detection in progress',
  stats: {
    clips: 'Clips',
    videos: 'Videos',
    stagingSize: 'Staging size',
    delivery: 'Delivery',
  },
  fields: {
    outputFormat: 'Output format',
    compression: 'Compression profile',
    backend: 'Encoding backend',
    frameTiming: 'Frame timing',
    targetFrameRate: 'Target frame rate',
    destinationFolder: 'Destination folder',
    delivery: 'Delivery',
  },
  delivery: {
    merge: 'Single merged file',
    compress: 'One output per source',
  },
  backendSelected: 'Selected backend: {{backend}}.',
  backendCpuOnlyFormat: '{{format}} stays on the CPU path in this build.',
  backendNvenc: 'MP4, MOV, MKV, and FLV can use NVIDIA NVENC when available.',
  backendCpu: 'NVIDIA was not detected, so the job stays on CPU.',
  autoPrefersNvidia: 'prefers NVIDIA',
  autoStaysCpu: 'stays on CPU',
  encoderSoftwareOnly: 'Software encoding only via CPU.',
  encoderNvencActive: 'NVIDIA NVENC will be used for the final transcode.',
  encoderNvencRequest: 'Requests direct GPU encoding on the supported H.264 containers.',
  encoderNvencFallback: 'NVIDIA NVENC is unavailable. The job will fall back to CPU automatically.',
  encoderAutoGpu: 'Auto will choose NVIDIA NVENC for MP4, MOV, MKV, and FLV. Otherwise it falls back to CPU.',
  encoderAutoCpu: 'Auto will remain on CPU until NVIDIA NVENC becomes available.',
  timingPreserveHelp:
    'Preserve source timestamps and cadence. This mode avoids intentional frame drops or duplication.',
  timingCfrHelp:
    'Convert the output to {{frameRate}}. Use this only when a constant-frame-rate deliverable is required, because FFmpeg may duplicate or drop frames.',
  formatSectionHelp:
    'Choose the output container first. The app will align codecs and hardware support around it.',
  compressionSectionHelp:
    'Profiles adjust encoder intensity, not the logical frame flow. Frame cadence is controlled separately.',
  processingSectionHelp:
    'Hardware and frame timing are split so you can keep cadence decisions independent from compression.',
  destinationSectionHelp:
    'Choose where the next job should write its outputs. Leaving this empty uses the app-managed folder.',
  modalTitle: 'Export profile editor',
  modalSubtitle:
    'Review container, compression, backend, frame timing, and destination in one scrollable panel.',
  executionNotesPreview:
    'Review ordering, encoder behavior, frame timing, and destination notes in a separate panel.',
  executionNotesModalSubtitle:
    'Check the launch-sensitive notes for the next job without expanding the main composer surface.',
  destinationDefault: 'App-managed output folder',
  destinationSelected: 'The next job will write the generated output into the selected folder.',
  destinationAuto: 'No custom folder selected. The app will use its default local output folder.',
  buttons: {
    addClips: 'Add clips',
    addVideos: 'Add videos',
    clearQueue: 'Clear queue',
    clearSelection: 'Clear selection',
    startMerge: 'Start merge',
    startCompression: 'Start compression',
    selectDestination: 'Choose folder',
    useDefaultDestination: 'Use default',
    configureProfile: 'Configure profile',
    openExecutionNotes: 'Open execution notes',
  },
  queueToast: {
    mergeTitle: 'Merge queued',
    compressTitle: 'Compression queued',
    mergeDescription: '{{count}} clip{{suffix}} added to the queue. Opening Job history.',
    compressDescription: '{{count}} video{{suffix}} added to the queue. Opening Job history.',
  },
  empty: {
    mergeTitle: 'No clips in queue',
    mergeDescription: 'Add the videos you want to concatenate. You can reorder them before export.',
    compressTitle: 'No videos selected',
    compressDescription:
      'Add the videos you want to compress. Each source will generate its own output file.',
  },
  tooltips: {
    moveUp: 'Move up',
    moveDown: 'Move down',
    removeClip: 'Remove file',
    codecGuide: 'Open codec and container guide',
  },
  clipRole: {
    start: 'Starts the merge',
    end: 'Ends the merge',
    middle: 'Intermediate clip',
  },
  videoRole: {
    source: 'Independent source video',
  },
  clipTag: {
    start: 'Start',
    end: 'End',
  },
};

export default composerEn;
