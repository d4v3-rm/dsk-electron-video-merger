const previewEn = {
  cardTitle: 'Output plan',
  status: {
    active: 'Active job',
    queued: 'Queued',
    ready: 'Ready to launch',
    idle: 'Waiting',
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
