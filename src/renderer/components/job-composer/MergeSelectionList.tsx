import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, List, Space, Tag, Tooltip, Typography } from 'antd';
import type { MergeSelectionListProps } from '@renderer/components/job-composer/job-composer.types';
import { formatBytes } from '@renderer/utils/file-utils';
import {
  listContainerStyle,
  listItemStyle,
  listPathTextStyle,
  queueIndexStyle,
} from '@renderer/theme/component-styles';

const { Paragraph, Text } = Typography;

export const MergeSelectionList = ({
  selectedFiles,
  moveSelectedFile,
  removeSelectedFile,
  moveUpTooltipLabel,
  moveDownTooltipLabel,
  removeTooltipLabel,
  startTagLabel,
  endTagLabel,
  startRoleLabel,
  endRoleLabel,
  middleRoleLabel,
}: MergeSelectionListProps) => (
  <List
    style={listContainerStyle}
    dataSource={selectedFiles}
    renderItem={(item, index) => {
      const isFirst = index === 0;
      const isLast = index === selectedFiles.length - 1;

      return (
        <List.Item
          style={listItemStyle}
          actions={[
            <Space key="controls" size="small">
              <Tooltip title={moveUpTooltipLabel}>
                <Button
                  size="small"
                  icon={<ArrowUpOutlined />}
                  disabled={isFirst}
                  onClick={() => moveSelectedFile(item.id, 'up')}
                />
              </Tooltip>
              <Tooltip title={moveDownTooltipLabel}>
                <Button
                  size="small"
                  icon={<ArrowDownOutlined />}
                  disabled={isLast}
                  onClick={() => moveSelectedFile(item.id, 'down')}
                />
              </Tooltip>
              <Tooltip title={removeTooltipLabel}>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeSelectedFile(item.id)}
                />
              </Tooltip>
            </Space>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar shape="square" size={34} style={queueIndexStyle}>
                {index + 1}
              </Avatar>
            }
            title={
              <Space wrap>
                <Text strong>{item.name}</Text>
                {isFirst ? <Tag color="cyan">{startTagLabel}</Tag> : null}
                {isLast ? <Tag color="geekblue">{endTagLabel}</Tag> : null}
              </Space>
            }
            description={
              <Flex vertical gap={4}>
                <Paragraph style={listPathTextStyle} ellipsis={{ tooltip: item.path }}>
                  {item.path}
                </Paragraph>
                <Space size="middle">
                  <Text type="secondary">{formatBytes(item.size)}</Text>
                  <Text type="secondary">
                    {isFirst ? startRoleLabel : isLast ? endRoleLabel : middleRoleLabel}
                  </Text>
                </Space>
              </Flex>
            }
          />
        </List.Item>
      );
    }}
  />
);
