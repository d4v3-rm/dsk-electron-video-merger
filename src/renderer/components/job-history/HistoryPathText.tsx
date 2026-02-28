import { Typography } from 'antd';
import type { CSSProperties } from 'react';
import { listPathTextStyle } from '@renderer/theme/component-styles';

const { Paragraph } = Typography;

interface HistoryPathTextProps {
  path: string;
  style?: CSSProperties;
}

export const HistoryPathText = ({ path, style }: HistoryPathTextProps) => (
  <Paragraph
    style={{ ...listPathTextStyle, ...style }}
    copyable={{ text: path }}
    ellipsis={{ tooltip: path }}
  >
    {path}
  </Paragraph>
);
