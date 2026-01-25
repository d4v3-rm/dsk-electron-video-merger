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
