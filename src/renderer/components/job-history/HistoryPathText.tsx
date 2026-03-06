import { Typography } from 'antd';

const { Paragraph } = Typography;

interface HistoryPathTextProps {
  path: string;
  className?: string;
}

export const HistoryPathText = ({ path, className = 'job-drawer-path' }: HistoryPathTextProps) => (
  <Paragraph className={className} copyable={{ text: path }} ellipsis={{ tooltip: path }}>
    {path}
  </Paragraph>
);
