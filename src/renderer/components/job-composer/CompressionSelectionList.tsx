import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, List, Space, Tooltip, Typography } from 'antd';
import type { CompressionSelectionListProps } from '@renderer/components/job-composer/job-composer.types';
import { formatBytes } from '@renderer/utils/file-utils';

const { Paragraph, Text } = Typography;

export const CompressionSelectionList = ({
  selectedFiles,
  removeSelectedFile,
  removeTooltipLabel,
  sourceRoleLabel,
}: CompressionSelectionListProps) => (
  <List
    className="queue-list"
    dataSource={selectedFiles}
    renderItem={(item, index) => (
      <List.Item
        className="queue-item"
        actions={[
          <Tooltip key="remove" title={removeTooltipLabel}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeSelectedFile(item.id)}
            />
          </Tooltip>,
        ]}
      >
        <List.Item.Meta
          avatar={<div className="queue-index">{index + 1}</div>}
          title={<Text strong>{item.name}</Text>}
          description={
            <Flex vertical gap={4}>
              <Paragraph className="selected-file-path" ellipsis={{ tooltip: item.path }}>
                {item.path}
              </Paragraph>
              <Space size="middle">
                <Text type="secondary">{formatBytes(item.size)}</Text>
                <Text type="secondary">{sourceRoleLabel}</Text>
              </Space>
            </Flex>
          }
        />
      </List.Item>
    )}
  />
);
