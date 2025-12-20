import { Avatar, Col, Layout, Row, Space, Spin, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { JobBoard } from './components/JobBoard';
import { JobComposer } from './components/JobComposer';
import { MergeOverview } from './components/MergeOverview';
import { MergePreviewCard } from './components/MergePreviewCard';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useJobProgress } from './hooks/use-job-progress';
import { useAppStore } from './store/use-app-store';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const { refreshJobs, loaded } = useAppStore();
  useJobProgress();

  useEffect(() => {
    void refreshJobs();
  }, [refreshJobs]);

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="header-content">
          <div className="app-brand">
            <Avatar size={40} shape="square" icon={<DashboardOutlined />} />
            <div>
              <Title level={4} className="app-title">
                VideoMerger Desktop
              </Title>
              <Text type="secondary">Merge workstation per unione, conversione e compressione video</Text>
            </div>
          </div>
          <Space>
            <ThemeSwitcher />
            <Text className="status-badge">Studio locale</Text>
          </Space>
        </div>
      </Header>

      <Content className="app-content">
        <div className="dashboard-container">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <MergeOverview />

            <Row gutter={[16, 16]} align="stretch">
              <Col xs={24} xl={9}>
                <JobComposer />
              </Col>
              <Col xs={24} xl={15}>
                {loaded ? (
                  <Space direction="vertical" size="large" className="panel-stack">
                    <MergePreviewCard />
                    <JobBoard />
                  </Space>
                ) : (
                  <div className="loading-card">
                    <Space direction="vertical" size="middle" align="center">
                      <Spin size="large" />
                      <Text type="secondary">Caricamento workspace merge...</Text>
                    </Space>
                  </div>
                )}
              </Col>
            </Row>
          </Space>
        </div>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">
          Workspace pensato per costruire merge ordinati, monitorare l&apos;output e riaprire facilmente i
          risultati.
        </Text>
      </Footer>
    </Layout>
  );
}

export default App;
