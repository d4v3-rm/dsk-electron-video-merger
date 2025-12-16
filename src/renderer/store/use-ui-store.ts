import { create } from 'zustand';

export type AppThemeMode = 'light' | 'dark';

type UiState = {
  themeMode: AppThemeMode;
  setThemeMode: (themeMode: AppThemeMode) => void;
  toggleThemeMode: () => void;
  syncThemeFromStorage: () => void;
};

const THEME_STORAGE_KEY = 'video-merger-theme-mode';
const DEFAULT_THEME_MODE: AppThemeMode = 'dark';

const isValidThemeMode = (value: string | null): value is AppThemeMode => value === 'light' || value === 'dark';

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
};

export const useUiStore = create<UiState>((set) => ({
  themeMode: DEFAULT_THEME_MODE,

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

  syncThemeFromStorage: () => {
    const persistedThemeMode = readStoredThemeMode();
    applyThemeToDom(persistedThemeMode);
    set({ themeMode: persistedThemeMode });
  },
}));

applyThemeToDom(DEFAULT_THEME_MODE);
