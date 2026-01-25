import { create } from 'zustand';
import { applyThemeCssVariables } from '@renderer/theme/app-theme';
import type { AppThemeMode, UiStoreState } from '@renderer/store/ui-store.types';

const THEME_STORAGE_KEY = 'video-merger-theme-mode';
const DEFAULT_THEME_MODE: AppThemeMode = 'dark';

const isValidThemeMode = (value: string | null): value is AppThemeMode =>
  value === 'light' || value === 'dark';

const readStoredThemeMode = (): AppThemeMode => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME_MODE;
  }

  const persisted = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isValidThemeMode(persisted) ? persisted : DEFAULT_THEME_MODE;
};

const applyThemeToDom = (themeMode: AppThemeMode): void => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', themeMode);
  applyThemeCssVariables(themeMode);
};

export const useUiStore = create<UiStoreState>((set) => ({
  themeMode: DEFAULT_THEME_MODE,
  activeWorkspacePanel: 'setup',

  setThemeMode: (themeMode) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }

    applyThemeToDom(themeMode);
    set({ themeMode });
  },

  toggleThemeMode: () => {
    set((state) => {
      const nextThemeMode: AppThemeMode = state.themeMode === 'dark' ? 'light' : 'dark';

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextThemeMode);
      }

      applyThemeToDom(nextThemeMode);
      return { themeMode: nextThemeMode };
    });
  },

  setActiveWorkspacePanel: (activeWorkspacePanel) => {
    set({ activeWorkspacePanel });
  },

  syncThemeFromStorage: () => {
    const persistedThemeMode = readStoredThemeMode();
    applyThemeToDom(persistedThemeMode);
    set({ themeMode: persistedThemeMode });
  },
}));

applyThemeToDom(DEFAULT_THEME_MODE);
