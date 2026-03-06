import type { UiStoreState } from '@renderer/store/ui-store.types';

export const selectThemeProviderState = (state: UiStoreState) => ({
  themeMode: state.themeMode,
  syncThemeFromStorage: state.syncThemeFromStorage,
});

export const selectThemeSwitcherState = (state: UiStoreState) => ({
  themeMode: state.themeMode,
  setThemeMode: state.setThemeMode,
});

export const selectWorkspacePanelState = (state: UiStoreState) => ({
  activeWorkspacePanel: state.activeWorkspacePanel,
  setActiveWorkspacePanel: state.setActiveWorkspacePanel,
});

export const selectOverviewUiState = (state: UiStoreState) => ({
  overviewExpanded: state.overviewExpanded,
  toggleOverviewExpanded: state.toggleOverviewExpanded,
});

export const selectExportProfileModalState = (state: UiStoreState) => ({
  exportProfileModalOpen: state.exportProfileModalOpen,
  setExportProfileModalOpen: state.setExportProfileModalOpen,
});

export const selectCodecGuideModalState = (state: UiStoreState) => ({
  codecGuideModalOpen: state.codecGuideModalOpen,
  setCodecGuideModalOpen: state.setCodecGuideModalOpen,
});

export const selectExecutionNotesModalState = (state: UiStoreState) => ({
  executionNotesModalOpen: state.executionNotesModalOpen,
  setExecutionNotesModalOpen: state.setExecutionNotesModalOpen,
});

export const selectHistoryDrawerState = (state: UiStoreState) => ({
  selectedHistoryJobId: state.selectedHistoryJobId,
  setSelectedHistoryJobId: state.setSelectedHistoryJobId,
});
