import '@fontsource/orbitron/latin-600.css';
import '@fontsource/orbitron/latin-700.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-500.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import enUS from 'antd/locale/en_US';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import type { ThemeConfig } from 'antd';
import { useUiStore } from '@renderer/store/use-ui-store';

type ThemeMode = ReturnType<typeof useUiStore.getState>['themeMode'];

type SciFiPalette = {
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  container: string;
  elevated: string;
  fillSoft: string;
  fillStrong: string;
  border: string;
  borderSoft: string;
  outline: string;
  shadow: string;
};

const FONT_BODY = "'Space Grotesk', 'Segoe UI', sans-serif";
const FONT_DISPLAY = "'Orbitron', 'Space Grotesk', sans-serif";

const PALETTES: Record<ThemeMode, SciFiPalette> = {
  dark: {
    primary: '#59f3ff',
    primarySoft: '#2cd4ff',
    accent: '#8cffb7',
    accentSoft: 'rgba(140, 255, 183, 0.16)',
    text: '#e8fbff',
    textSecondary: 'rgba(212, 241, 255, 0.78)',
    textTertiary: 'rgba(212, 241, 255, 0.52)',
    container: 'rgba(8, 17, 31, 0.84)',
    elevated: 'rgba(6, 13, 24, 0.96)',
    fillSoft: 'rgba(34, 58, 86, 0.42)',
    fillStrong: 'rgba(10, 26, 43, 0.76)',
    border: 'rgba(115, 224, 255, 0.2)',
    borderSoft: 'rgba(115, 224, 255, 0.12)',
    outline: 'rgba(89, 243, 255, 0.18)',
    shadow: '0 22px 72px rgba(0, 0, 0, 0.45)',
  },
  light: {
    primary: '#0f88ff',
    primarySoft: '#33a1ff',
    accent: '#12a66a',
    accentSoft: 'rgba(18, 166, 106, 0.14)',
    text: '#09203b',
    textSecondary: 'rgba(9, 32, 59, 0.76)',
    textTertiary: 'rgba(9, 32, 59, 0.5)',
    container: 'rgba(244, 250, 255, 0.88)',
    elevated: 'rgba(255, 255, 255, 0.98)',
    fillSoft: 'rgba(190, 223, 255, 0.28)',
    fillStrong: 'rgba(223, 239, 255, 0.64)',
    border: 'rgba(15, 136, 255, 0.18)',
    borderSoft: 'rgba(15, 136, 255, 0.1)',
    outline: 'rgba(15, 136, 255, 0.16)',
    shadow: '0 22px 60px rgba(55, 98, 138, 0.18)',
  },
};

const createThemeConfig = (themeMode: ThemeMode): ThemeConfig => {
  const palette = PALETTES[themeMode];
  const isDark = themeMode === 'dark';

  return {
    algorithm: [isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm, antdTheme.compactAlgorithm],
    token: {
      colorPrimary: palette.primary,
      colorInfo: palette.primary,
      colorSuccess: isDark ? '#34d399' : '#059669',
      colorWarning: '#fbbf24',
      colorError: '#fb7185',
      colorLink: palette.primary,
      colorLinkHover: palette.primarySoft,
      colorText: palette.text,
      colorTextSecondary: palette.textSecondary,
      colorTextDescription: palette.textTertiary,
      colorBgLayout: 'transparent',
      colorBgContainer: palette.container,
      colorBgElevated: palette.elevated,
      colorFillSecondary: palette.fillSoft,
      colorFillTertiary: palette.fillStrong,
      colorBorder: palette.border,
      colorBorderSecondary: palette.borderSoft,
      colorSplit: palette.borderSoft,
      controlOutline: palette.outline,
      boxShadowSecondary: palette.shadow,
      fontFamily: FONT_BODY,
      fontFamilyCode: FONT_DISPLAY,
      borderRadius: 18,
      borderRadiusLG: 26,
      borderRadiusSM: 12,
      controlHeight: 42,
      controlHeightLG: 48,
      lineWidth: 1,
      motionDurationFast: '0.18s',
      motionDurationMid: '0.28s',
      wireframe: false,
    },
    components: {
      Layout: {
        bodyBg: 'transparent',
        headerBg: 'transparent',
        footerBg: 'transparent',
        siderBg: 'transparent',
        triggerBg: 'transparent',
        triggerColor: palette.text,
      },
      Card: {
        headerBg: 'transparent',
        bodyPadding: 24,
        bodyPaddingSM: 20,
        headerFontSize: 14,
        headerFontSizeSM: 13,
        headerHeight: 56,
      },
      Button: {
        fontWeight: 600,
        borderRadius: 999,
        defaultBg: palette.fillStrong,
        defaultBorderColor: palette.border,
        defaultColor: palette.text,
        defaultHoverBg: palette.fillSoft,
        defaultHoverBorderColor: palette.primary,
        defaultHoverColor: palette.primarySoft,
        defaultActiveBg: palette.fillStrong,
        defaultActiveBorderColor: palette.primary,
        defaultActiveColor: palette.primary,
        primaryShadow: 'none',
        defaultShadow: 'none',
      },
      Input: {
        activeBorderColor: palette.primary,
        hoverBorderColor: palette.primarySoft,
        activeShadow: `0 0 0 4px ${palette.outline}`,
        addonBg: palette.fillSoft,
      },
      Select: {
        selectorBg: palette.fillStrong,
        optionActiveBg: palette.fillSoft,
        optionSelectedBg: palette.fillStrong,
        hoverBorderColor: palette.primarySoft,
        activeBorderColor: palette.primary,
      },
      Form: {
        labelColor: palette.textSecondary,
      },
      Segmented: {
        trackBg: palette.fillStrong,
        itemHoverBg: palette.fillSoft,
        itemSelectedBg: palette.elevated,
        itemSelectedColor: palette.text,
        trackPadding: 4,
      },
      Tag: {
        defaultBg: palette.fillSoft,
        defaultColor: palette.textSecondary,
        fontSize: 12,
      },
      Table: {
        headerBg: palette.fillStrong,
        headerColor: palette.text,
        headerSplitColor: palette.borderSoft,
        borderColor: palette.borderSoft,
        rowHoverBg: palette.fillSoft,
        colorFillAlter: palette.fillSoft,
        footerBg: 'transparent',
      },
      Progress: {
        defaultColor: palette.primary,
        remainingColor: palette.fillStrong,
        lineBorderRadius: 999,
      },
      Modal: {
        contentBg: palette.elevated,
        headerBg: 'transparent',
        titleColor: palette.text,
      },
      Drawer: {
        colorBgElevated: palette.elevated,
      },
      Tooltip: {
        colorBgSpotlight: isDark ? '#071420' : '#edf7ff',
      },
      Descriptions: {
        labelBg: 'transparent',
      },
      Empty: {
        colorTextDescription: palette.textSecondary,
      },
      Divider: {
        colorSplit: palette.borderSoft,
      },
      Steps: {
        colorTextDescription: palette.textSecondary,
      },
      Alert: {
        withDescriptionIconSize: 18,
      },
    },
  };
};

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { themeMode, syncThemeFromStorage } = useUiStore();
  const themeConfig = useMemo(() => createThemeConfig(themeMode), [themeMode]);

  useEffect(() => {
    syncThemeFromStorage();
  }, [syncThemeFromStorage]);

  return (
    <ConfigProvider locale={enUS} theme={themeConfig}>
      {children}
    </ConfigProvider>
  );
};
