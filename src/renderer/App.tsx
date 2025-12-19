import { Avatar, Col, Layout, Row, Space, Spin, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { JobBoard } from './components/JobBoard';
import { JobComposer } from './components/JobComposer';
import { JobStats } from './components/JobStats';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useJobProgress } from './hooks/use-job-progress';
import { useAppStore } from './store/use-app-store';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const { refreshJobs, loaded, jobs } = useAppStore();
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
              <Text type="secondary">Unione, conversione e compressione video in locale</Text>
            </div>
          </div>
          <Space>
            <ThemeSwitcher />
            <Text className="status-badge">Merge locale</Text>
          </Space>
        </div>
      </Header>

      <Content className="app-content">
        <div className="dashboard-container">
          <JobStats jobs={jobs} />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <JobComposer />
            </Col>
            <Col xs={24} lg={16}>
              {loaded ? (
                <JobBoard />
              ) : (
                <div className="loading-card">
                  <Space direction="vertical" size="middle" align="center">
                    <Spin size="large" />
                    <Text type="secondary">Caricamento cronologia merge...</Text>
                  </Space>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">
          Pipeline interamente locale per unione, conversione e compressione video in un solo output.
        </Text>
      </Footer>
    </Layout>
  );
}

export default App;
