import {
  CompressOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Space, Statistic, Steps, Tag, Typography } from 'antd';
import { useAppStore } from '../store/use-app-store';

const { Title, Text } = Typography;

const getCurrentStep = (selectedFilesCount: number, runningJobsCount: number, completedJobsCount: number) => {
  if (runningJobsCount > 0) {
    return 1;
  }

  if (completedJobsCount > 0 && selectedFilesCount === 0) {
    return 2;
  }

  return selectedFilesCount > 0 ? 0 : 0;
};

export const MergeOverview = () => {
  const jobs = useAppStore((state) => state.jobs);
  const selectedFiles = useAppStore((state) => state.selectedFiles);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const currentStep = getCurrentStep(selectedFiles.length, runningJobs, completedJobs);

  return (
    <Card className="modern-card overview-card" variant="borderless">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} xl={14}>
          <Space direction="vertical" size="large" className="overview-copy">
            <Space wrap>
              <Tag color="processing">Merge Studio</Tag>
              <Tag>Locale</Tag>
              <Tag>Output unico</Tag>
            </Space>

            <div>
              <Title level={2} className="overview-title">
                Organizza i clip, definisci il profilo di export e genera un master finale pulito.
              </Title>
              <Text type="secondary" className="overview-text">
                L&apos;interfaccia segue il flusso reale di lavoro: coda input, profilo output, esecuzione e
                storico. Niente pannelli generici, solo quello che serve a chi monta.
              </Text>
            </div>

            <div className="overview-steps">
              <Steps
                current={currentStep}
                responsive
                items={[
                  {
                    title: 'Queue clip',
                    description: 'Scegli e ordina i file',
                    icon: <VideoCameraOutlined />,
                  },
                  {
                    title: 'Merge',
                    description: 'Transcodifica e compressione',
                    icon: <CompressOutlined />,
                  },
                  {
                    title: 'Output',
                    description: 'Verifica e riusa il risultato',
                    icon: <PlayCircleOutlined />,
                  },
                ]}
              />
            </div>
          </Space>
        </Col>

        <Col xs={24} xl={10}>
          <Row gutter={[12, 12]}>
            <Col xs={12}>
              <div className="overview-stat">
                <Statistic
                  title="Clip in staging"
                  value={selectedFiles.length}
                  prefix={<VideoCameraOutlined />}
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className="overview-stat">
                <Statistic title="Merge in coda" value={queuedJobs} prefix={<ProfileOutlined />} />
              </div>
            </Col>
            <Col xs={12}>
              <div className="overview-stat">
                <Statistic title="In lavorazione" value={runningJobs} prefix={<CompressOutlined />} />
              </div>
            </Col>
            <Col xs={12}>
              <div className="overview-stat">
                <Statistic title="Completati" value={completedJobs} prefix={<PlayCircleOutlined />} />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
