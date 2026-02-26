import { Alert, Col, Drawer, Row, Space, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { JobDetailsInputsCard } from '@renderer/components/job-history/JobDetailsInputsCard';
import { JobDetailsLogsCard } from '@renderer/components/job-history/JobDetailsLogsCard';
import { JobDetailsOutputsCard } from '@renderer/components/job-history/JobDetailsOutputsCard';
import { JobDetailsRuntimeCard } from '@renderer/components/job-history/JobDetailsRuntimeCard';
import { JobDetailsStatusCard } from '@renderer/components/job-history/JobDetailsStatusCard';
import { JobDetailsSummaryCard } from '@renderer/components/job-history/JobDetailsSummaryCard';
import type { JobDetailsDrawerProps } from '@renderer/components/job-history/job-details-drawer.types';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

export const JobDetailsDrawer = ({ job, open, onClose }: JobDetailsDrawerProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Drawer
      title={
        job
          ? t('details.title', { mode: getJobModeLabel(job.mode), id: job.id.slice(0, 8) })
          : t('details.defaultTitle')
      }
      open={open}
      onClose={onClose}
      width={680}
      destroyOnClose
      styles={{
        content: {
          borderTopLeftRadius: 28,
          borderBottomLeftRadius: 28,
          overflow: 'hidden',
          background: token.colorBgContainer,
        },
        header: {
          padding: '24px 24px 0',
          background: 'transparent',
        },
        body: {
          padding: 24,
          background: 'transparent',
        },
      }}
    >
      {job ? (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <JobDetailsStatusCard job={job} />

          {job.error ? (
            <Alert type="error" showIcon message={t('details.errorTitle')} description={job.error} />
          ) : null}

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <JobDetailsSummaryCard job={job} />
            </Col>
            <Col xs={24}>
              <JobDetailsRuntimeCard job={job} />
            </Col>
            <Col xs={24}>
              <JobDetailsLogsCard job={job} />
            </Col>
            <Col xs={24}>
              <JobDetailsInputsCard job={job} />
            </Col>
            <Col xs={24}>
              <JobDetailsOutputsCard job={job} />
            </Col>
          </Row>
        </Space>
      ) : null}
    </Drawer>
  );
};
