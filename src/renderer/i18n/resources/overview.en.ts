const overviewEn = {
  status: {
    running: '{{mode}} in progress',
    ready: 'Ready for {{mode}}',
    idle: 'Local studio',
  },
  tags: {
    studio: 'Merge Studio',
    compressionLab: 'Compression Lab',
    desktop: 'Desktop',
    singleOutput: 'Single output',
    perFileOutput: 'Per-file output',
  },
  metrics: {
    clips: 'Staging clips',
    videos: 'Selected videos',
    queued: 'Queued jobs',
    running: 'Active jobs',
    completed: 'Completed',
  },
  modes: {
    merge: {
      title: 'Arrange clips and generate one final master with full control over the timeline.',
      body: 'Merge mode keeps the source order explicit. Select clips, define the queue, and render a single final deliverable with one compression profile and one destination path.',
      steps: {
        queueTitle: 'Clip queue',
        queueDescription: 'Select and order the timeline',
        encodeTitle: 'Merge',
        encodeDescription: 'Transcode the final master',
        outputTitle: 'Output',
        outputDescription: 'Review and reuse the merged file',
      },
    },
    compress: {
      title: 'Switch to compressor mode to encode source videos individually with one shared export profile.',
      body: 'Compression mode keeps every selected source as an independent output. Use it when you need lighter deliverables without concatenating clips into a single timeline.',
      steps: {
        selectTitle: 'Video selection',
        selectDescription: 'Collect the sources to encode',
        encodeTitle: 'Compress',
        encodeDescription: 'Encode each source with the chosen profile',
        outputTitle: 'Outputs',
        outputDescription: 'Review the compressed files one by one',
      },
    },
  },
  chips: {
    explicitOrder: 'Explicit order',
    batchCompression: 'Batch compression',
    guidedCompression: 'Guided compression',
    localHistory: 'Local history',
    singleOutput: 'Single output',
    perFileOutput: 'Per-file output',
  },
  hoverHint:
    'Hover the hero to expand the operating context, or pin it open while you configure the workspace.',
  toggleHint: 'Use the toggle to collapse or reopen the introductory panel.',
  actions: {
    pinOpen: 'Pin open',
    unpin: 'Unpin',
    collapse: 'Collapse',
    expand: 'Expand',
  },
};

export default overviewEn;
