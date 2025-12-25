import { FileDoneOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Divider, Drawer, Empty, List, Progress, Space, Tag, Typography } from 'antd';
import type { Job } from '@shared/types';
import { requestedEncoderBackendLabel, resolvedEncoderBackendLabel } from '../utils/encoder-presentation';
import { getFileName } from '../utils/file-utils';
import { statusColor, statusLabel, toProgressStatus } from '../utils/job-presentation';

const { Text, Paragraph } = Typography;

type Props = {
  job: Job | null;
  open: boolean;
  onClose: () => void;
};

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export const JobDetailsDrawer = ({ job, open, onClose }: Props) => {
  return (
    <Drawer
      title={job ? `Dettaglio merge #${job.id.slice(0, 8)}` : 'Dettaglio merge'}
      open={open}
      onClose={onClose}
      width={480}
      destroyOnClose
    >
      {job ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space align="center">
            <Tag color={statusColor[job.status]}>{statusLabel[job.status]}</Tag>
            {job.resolvedEncoderBackend ? (
              <Tag bordered={false} color="blue">
                {resolvedEncoderBackendLabel[job.resolvedEncoderBackend]}
              </Tag>
            ) : null}
            <Text type="secondary">Aggiornato {dateFormatter.format(job.updatedAt)}</Text>
          </Space>

          <div>
            <Progress percent={job.progress} status={toProgressStatus(job.status)} />
            <Text type="secondary">{job.message}</Text>
          </div>

          {job.error ? (
            <Alert type="error" showIcon message="Errore durante il merge" description={job.error} />
          ) : null}

          <Descriptions
            column={1}
            size="small"
            items={[
              {
                key: 'format',
                label: 'Formato output',
                children: job.settings.outputFormat.toUpperCase(),
              },
              {
                key: 'compression',
                label: 'Compressione',
                children: job.settings.compression,
              },
              {
                key: 'backendRequested',
                label: 'Backend richiesto',
                children: requestedEncoderBackendLabel[job.settings.encoderBackend],
              },
              {
                key: 'backendResolved',
                label: 'Backend effettivo',
                children: job.resolvedEncoderBackend
                  ? resolvedEncoderBackendLabel[job.resolvedEncoderBackend]
                  : 'In attesa di risoluzione',
              },
              {
                key: 'clips',
                label: 'Clip concatenati',
                children: job.files.length,
              },
              {
                key: 'createdAt',
                label: 'Creato il',
                children: dateFormatter.format(job.createdAt),
              },
            ]}
          />

          <Divider orientation="left">
            <Space>
              <OrderedListOutlined />
              Input queue
            </Space>
          </Divider>

          <List
            size="small"
            dataSource={job.files}
            renderItem={(file, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Tag bordered={false}>{index + 1}</Tag>}
                  title={file.name}
                  description={
                    <Paragraph
                      className="job-drawer-path"
                      copyable={{ text: file.path }}
                      ellipsis={{ tooltip: file.path }}
                    >
                      {file.path}
                    </Paragraph>
                  }
                />
              </List.Item>
            )}
          />

          <Divider orientation="left">
            <Space>
              <FileDoneOutlined />
              Output
            </Space>
          </Divider>

          {job.outputPaths.length > 0 ? (
            <List
              size="small"
              dataSource={job.outputPaths}
              renderItem={(outputPath) => (
                <List.Item>
                  <List.Item.Meta
                    title={getFileName(outputPath)}
                    description={
                      <Paragraph
                        className="job-drawer-path"
                        copyable={{ text: outputPath }}
                        ellipsis={{ tooltip: outputPath }}
                      >
                        {outputPath}
                      </Paragraph>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="L'output sara` disponibile qui appena il merge termina."
            />
          )}
        </Space>
      ) : null}
    </Drawer>
  );
};
