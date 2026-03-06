import type { AppStoreState } from '@renderer/store/app-store.types';

export const selectAppBootstrapState = (state: AppStoreState) => ({
  loaded: state.loaded,
  refreshJobs: state.refreshJobs,
  refreshHardwareAccelerationProfile: state.refreshHardwareAccelerationProfile,
});

export const selectJobComposerState = (state: AppStoreState) => ({
  jobMode: state.jobMode,
  selectedFiles: state.selectedFiles,
  hardwareAccelerationProfile: state.hardwareAccelerationProfile,
  hardwareAccelerationLoaded: state.hardwareAccelerationLoaded,
  outputDirectory: state.outputDirectory,
  settings: state.settings,
  loading: state.loading,
  setCompression: state.setCompression,
  setEncoderBackend: state.setEncoderBackend,
  setOutputResolution: state.setOutputResolution,
  setVideoTimingMode: state.setVideoTimingMode,
  setTargetFrameRate: state.setTargetFrameRate,
  setOutputFormat: state.setOutputFormat,
  selectVideoFiles: state.selectVideoFiles,
  selectOutputDirectory: state.selectOutputDirectory,
  clearOutputDirectory: state.clearOutputDirectory,
  clearSelectedFiles: state.clearSelectedFiles,
  removeSelectedFile: state.removeSelectedFile,
  moveSelectedFile: state.moveSelectedFile,
  createJob: state.createJob,
});

export const selectOverviewState = (state: AppStoreState) => ({
  jobs: state.jobs,
  selectedFiles: state.selectedFiles,
  jobMode: state.jobMode,
  setJobMode: state.setJobMode,
});

export const selectPreviewState = (state: AppStoreState) => ({
  selectedFiles: state.selectedFiles,
  outputDirectory: state.outputDirectory,
  settings: state.settings,
  jobMode: state.jobMode,
  jobs: state.jobs,
});
