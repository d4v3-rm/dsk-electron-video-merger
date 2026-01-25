export type AppThemeMode = 'light' | 'dark';
export type WorkspacePanel = 'setup' | 'output' | 'history';

export interface UiStoreState {
  themeMode: AppThemeMode;
  activeWorkspacePanel: WorkspacePanel;
  setThemeMode: (themeMode: AppThemeMode) => void;
  toggleThemeMode: () => void;
  setActiveWorkspacePanel: (panel: WorkspacePanel) => void;
  syncThemeFromStorage: () => void;
}
