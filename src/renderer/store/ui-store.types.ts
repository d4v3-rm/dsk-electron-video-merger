export type AppThemeMode = 'light' | 'dark';
export type WorkspacePanel = 'setup' | 'output' | 'history';

export interface UiStoreState {
  themeMode: AppThemeMode;
  activeWorkspacePanel: WorkspacePanel;
  overviewExpanded: boolean;
  exportProfileModalOpen: boolean;
  codecGuideModalOpen: boolean;
  selectedHistoryJobId: string | null;
  setThemeMode: (themeMode: AppThemeMode) => void;
  toggleThemeMode: () => void;
  setActiveWorkspacePanel: (panel: WorkspacePanel) => void;
  setOverviewExpanded: (overviewExpanded: boolean) => void;
  toggleOverviewExpanded: () => void;
  setExportProfileModalOpen: (open: boolean) => void;
  setCodecGuideModalOpen: (open: boolean) => void;
  setSelectedHistoryJobId: (jobId: string | null) => void;
  syncThemeFromStorage: () => void;
}
