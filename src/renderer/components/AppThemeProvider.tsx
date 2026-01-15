import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { PropsWithChildren, useEffect, useMemo } from 'react';
import { getAntdThemeConfig } from '@renderer/theme/app-theme';
import { useUiStore } from '@renderer/store/use-ui-store';

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { themeMode, syncThemeFromStorage } = useUiStore();
  const themeConfig = useMemo(() => getAntdThemeConfig(themeMode), [themeMode]);

  useEffect(() => {
    syncThemeFromStorage();
  }, [syncThemeFromStorage]);

  return (
    <ConfigProvider
      locale={enUS}
      theme={themeConfig}
      button={{ autoInsertSpace: false }}
      card={{ variant: 'outlined' }}
      form={{ colon: false, requiredMark: false, variant: 'filled' }}
      input={{ variant: 'filled' }}
      inputNumber={{ variant: 'filled' }}
      select={{ variant: 'filled', showSearch: false }}
      textArea={{ variant: 'filled' }}
      modal={{ centered: true }}
      pagination={{ showSizeChanger: false }}
    >
      {children}
    </ConfigProvider>
  );
};
