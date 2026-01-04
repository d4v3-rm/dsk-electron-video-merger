import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { Segmented, Tooltip } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '@renderer/store/use-ui-store';

type ThemeSwitcherProps = {
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
};

export const ThemeSwitcher = ({ size = 'middle', block = false }: ThemeSwitcherProps) => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode } = useUiStore();

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
    setThemeMode(value as 'light' | 'dark');
  };

  return <Segmented block={block} size={size} value={themeMode} options={options} onChange={handleChange} />;
};
