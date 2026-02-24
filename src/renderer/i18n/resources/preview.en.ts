const previewEn = {
  cardTitle: 'Output plan',
  status: {
    active: 'Active job',
    queued: 'Queued',
    ready: 'Ready to launch',
    idle: 'Waiting',
  },
  metrics: {
    inputVideos: 'Inputs',
    format: 'Format',
    backend: 'Backend',
    delivery: 'Delivery',
  },
  sections: {
    packet: 'Output packet',
    runtime: 'Runtime status',
    inputs: 'Staged inputs',
    artifact: 'Latest artifact',
  },
  runtime: {
    readyTitle: 'Ready to launch',
    readyDescription: 'The workspace is configured. Start the next job to stream live telemetry here.',
    idleTitle: 'No active runtime',
    idleDescription: 'Start a merge or compression job to populate this area with live progress data.',
  },
  emptyDescription: 'Select videos to preview the active job plan.',
  labels: {
    outputName: 'Output name',
    mode: 'Mode',
    inputVideos: 'Input videos',
    format: 'Format',
    compression: 'Compression',
    requestedBackend: 'Requested backend',
    activeBackend: 'Effective backend',
    frameTiming: 'Frame timing',
    targetFrameRate: 'Target frame rate',
    stagingSize: 'Staging size',
    delivery: 'Delivery',
    destinationFolder: 'Destination folder',
  },
  pendingResolution: 'Pending resolution',
  defaultDestination: 'App-managed output folder',
  delivery: {
    merge: 'One final merged file',
    compress: 'One compressed file per input video',
  },
  currentOrder: 'Current clip order',
  selectedVideos: 'Selected videos',
  moreVideos: '+ {{count}} additional videos selected.',
  lastOutput: 'Latest generated output',
};

export default previewEn;
