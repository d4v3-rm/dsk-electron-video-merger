export type AppThemeMode = 'light' | 'dark';

export interface UiStoreState {
  themeMode: AppThemeMode;
  setThemeMode: (themeMode: AppThemeMode) => void;
  toggleThemeMode: () => void;
  syncThemeFromStorage: () => void;
}
