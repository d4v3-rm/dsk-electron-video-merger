import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { Segmented, Tooltip } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { useUiStore } from '../store/use-ui-store';

type ThemeSwitcherProps = {
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
};

export const ThemeSwitcher = ({ size = 'middle', block = false }: ThemeSwitcherProps) => {
  const { themeMode, setThemeMode } = useUiStore();

  const options = [
    {
      value: 'dark',
      icon: <MoonOutlined />,
      label: (
        <Tooltip title="Tema scuro">
          <span>Scuro</span>
        </Tooltip>
      ),
    },
    {
      value: 'light',
      icon: <BulbOutlined />,
      label: (
        <Tooltip title="Tema chiaro">
          <span>Chiaro</span>
        </Tooltip>
      ),
    },
  ];

  const handleChange = (value: SegmentedValue) => {
    setThemeMode(value as 'light' | 'dark');
  };

  return <Segmented block={block} size={size} value={themeMode} options={options} onChange={handleChange} />;
};
