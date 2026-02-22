import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { selectThemeProviderState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import { getAntdThemeConfig } from '@renderer/theme/app-theme';

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const { themeMode, syncThemeFromStorage } = useUiStore(useShallow(selectThemeProviderState));
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
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};
