import { Card, Flex, Space, Tag, Typography } from 'antd';
import { CompressionSelectionList } from '@renderer/components/job-composer/CompressionSelectionList';
import { JobComposerActionBar } from '@renderer/components/job-composer/JobComposerActionBar';
import { JobComposerEmptyState } from '@renderer/components/job-composer/JobComposerEmptyState';
import { MergeSelectionList } from '@renderer/components/job-composer/MergeSelectionList';
import type { JobComposerQueuePanelProps } from '@renderer/components/job-composer/job-composer.types';

const { Text } = Typography;

export const JobComposerQueuePanel = ({
  title,
  queueHint,
  selectedFilesCount,
  loading,
  addButtonLabel,
  clearButtonLabel,
  startButtonLabel,
  emptyTitle,
  emptyDescription,
  isMergeMode,
  selectedFiles,
  selectVideoFiles,
  clearSelectedFiles,
  createJob,
  removeSelectedFile,
  moveSelectedFile,
  moveUpTooltipLabel,
  moveDownTooltipLabel,
  removeTooltipLabel,
  startTagLabel,
  endTagLabel,
  startRoleLabel,
  endRoleLabel,
  middleRoleLabel,
  sourceRoleLabel,
}: JobComposerQueuePanelProps) => (
  <Card
    size="small"
    className="panel-list-card"
    title={title}
    extra={<Tag color="processing">{selectedFilesCount}</Tag>}
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Flex className="panel-action-bar" align="center" justify="space-between" gap={16} wrap>
        <Text type="secondary" className="panel-action-copy">
          {queueHint}
        </Text>
        <JobComposerActionBar
          selectedFilesCount={selectedFilesCount}
          loading={loading}
          addButtonLabel={addButtonLabel}
          clearButtonLabel={clearButtonLabel}
          startButtonLabel={startButtonLabel}
          selectVideoFiles={selectVideoFiles}
          clearSelectedFiles={clearSelectedFiles}
          createJob={createJob}
        />
      </Flex>

      {selectedFilesCount === 0 ? (
        <JobComposerEmptyState title={emptyTitle} description={emptyDescription} />
      ) : isMergeMode ? (
        <MergeSelectionList
          selectedFiles={selectedFiles}
          moveSelectedFile={moveSelectedFile}
          removeSelectedFile={removeSelectedFile}
          moveUpTooltipLabel={moveUpTooltipLabel}
          moveDownTooltipLabel={moveDownTooltipLabel}
          removeTooltipLabel={removeTooltipLabel}
          startTagLabel={startTagLabel}
          endTagLabel={endTagLabel}
          startRoleLabel={startRoleLabel}
          endRoleLabel={endRoleLabel}
          middleRoleLabel={middleRoleLabel}
        />
      ) : (
        <CompressionSelectionList
          selectedFiles={selectedFiles}
          removeSelectedFile={removeSelectedFile}
          removeTooltipLabel={removeTooltipLabel}
          sourceRoleLabel={sourceRoleLabel}
        />
      )}
    </Space>
  </Card>
);
