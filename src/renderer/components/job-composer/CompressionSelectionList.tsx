import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, List, Space, Tooltip, Typography } from 'antd';
import type { CompressionSelectionListProps } from '@renderer/components/job-composer/job-composer.types';
import { formatBytes } from '@renderer/utils/file-utils';
import {
  listContainerStyle,
  listItemStyle,
  listPathTextStyle,
  queueIndexStyle,
} from '@renderer/theme/component-styles';

const { Paragraph, Text } = Typography;

export const CompressionSelectionList = ({
  selectedFiles,
  removeSelectedFile,
  removeTooltipLabel,
  sourceRoleLabel,
}: CompressionSelectionListProps) => (
  <List
    style={listContainerStyle}
    dataSource={selectedFiles}
    renderItem={(item, index) => (
      <List.Item
        style={listItemStyle}
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
          avatar={
            <Avatar shape="square" size={34} style={queueIndexStyle}>
              {index + 1}
            </Avatar>
          }
          title={<Text strong>{item.name}</Text>}
          description={
            <Flex vertical gap={4}>
              <Paragraph style={listPathTextStyle} ellipsis={{ tooltip: item.path }}>
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
