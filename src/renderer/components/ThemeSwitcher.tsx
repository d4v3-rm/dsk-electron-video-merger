import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { Segmented, Tooltip } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import type { ThemeSwitcherProps } from '@renderer/components/theme-switcher.types';
import { selectThemeSwitcherState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import type { AppThemeMode } from '@renderer/store/ui-store.types';

export const ThemeSwitcher = ({ size = 'middle', block = false }: ThemeSwitcherProps) => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode } = useUiStore(useShallow(selectThemeSwitcherState));

  const options = [
    {
      value: 'dark',
      icon: <MoonOutlined />,
      label: (
        <Tooltip title={t('theme.darkTooltip')}>
          <span>{t('common.dark')}</span>
        </Tooltip>
      ),
    },
    {
      value: 'light',
      icon: <BulbOutlined />,
      label: (
        <Tooltip title={t('theme.lightTooltip')}>
          <span>{t('common.light')}</span>
        </Tooltip>
      ),
    },
  ];

  const handleChange = (value: SegmentedValue) => {
    setThemeMode(value as AppThemeMode);
  };

  return <Segmented block={block} size={size} value={themeMode} options={options} onChange={handleChange} />;
};
