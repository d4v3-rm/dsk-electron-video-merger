import { Avatar, Col, Layout, Row, Spin, Tag, Typography } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useAppStore } from './store/use-app-store';
import { JobBoard } from './components/JobBoard';
import { JobComposer } from './components/JobComposer';
import { JobStats } from './components/JobStats';
import { useJobProgress } from './hooks/use-job-progress';

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
          <Tag color="blue">Elaborazione locale</Tag>
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
              {loaded ? <JobBoard /> : <Spin className="loading-card" size="large" tip="Caricamento coda job..." />}
            </Col>
          </Row>
        </div>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">Pipeline interamente locale: job singolo o batch, conversione e compressione in Electron.</Text>
      </Footer>
    </Layout>
  );
}

export default App;

