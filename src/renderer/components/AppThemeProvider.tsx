import { ConfigProvider, theme as antdTheme } from 'antd';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import type { ThemeConfig } from 'antd';
import { useUiStore } from '@renderer/store/use-ui-store';

const THEME_TOKENS: Record<ReturnType<typeof useUiStore.getState>['themeMode'], ThemeConfig> = {
  dark: {
    algorithm: antdTheme.darkAlgorithm,
    token: {
      colorPrimary: '#3b82f6',
      colorInfo: '#60a5fa',
      colorBgLayout: 'transparent',
      colorBgContainer: 'rgba(15, 23, 42, 0.9)',
      colorText: '#e2e8f0',
      colorTextSecondary: 'rgba(226, 232, 240, 0.82)',
      borderRadius: 12,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    },
    components: {
      Layout: {
        headerHeight: 72,
        headerBg: 'transparent',
        footerBg: 'transparent',
      },
      Card: {
        headerBg: 'transparent',
      },
    },
  },
  light: {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      colorInfo: '#1677ff',
      colorBgLayout: 'transparent',
      colorBgContainer: 'rgba(255, 255, 255, 0.95)',
      colorText: '#0f172a',
      colorTextSecondary: 'rgba(15, 23, 42, 0.7)',
      borderRadius: 12,
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
    },
    components: {
      Layout: {
        headerHeight: 72,
        headerBg: 'transparent',
        footerBg: 'transparent',
      },
      Card: {
        headerBg: 'transparent',
      },
    },
  },
};

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { themeMode, syncThemeFromStorage } = useUiStore();
  const themeConfig = useMemo(() => THEME_TOKENS[themeMode], [themeMode]);

  useEffect(() => {
    syncThemeFromStorage();
  }, [syncThemeFromStorage]);

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};
