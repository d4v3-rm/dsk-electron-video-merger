import { LinkOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { listPathTextStyle } from '@renderer/theme/component-styles';

const { Paragraph } = Typography;

interface PreviewPathTextProps {
  path: string;
}

export const PreviewPathText = ({ path }: PreviewPathTextProps) => (
  <Paragraph style={listPathTextStyle} copyable={{ text: path }} ellipsis={{ tooltip: path }}>
    <LinkOutlined /> {path}
  </Paragraph>
);
