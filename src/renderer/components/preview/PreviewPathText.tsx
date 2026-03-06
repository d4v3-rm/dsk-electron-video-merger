import { LinkOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Paragraph } = Typography;

interface PreviewPathTextProps {
  path: string;
}

export const PreviewPathText = ({ path }: PreviewPathTextProps) => (
  <Paragraph className="preview-path" copyable={{ text: path }} ellipsis={{ tooltip: path }}>
    <LinkOutlined /> {path}
  </Paragraph>
);
