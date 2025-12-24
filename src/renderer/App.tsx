import { Col, Layout, Row, Space, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { JobBoard } from './components/JobBoard';
import { JobComposer } from './components/JobComposer';
import { MergeOverview } from './components/MergeOverview';
import { MergePreviewCard } from './components/MergePreviewCard';
import { useJobProgress } from './hooks/use-job-progress';
import { useAppStore } from './store/use-app-store';

const { Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  const { refreshJobs, refreshHardwareAccelerationProfile, loaded } = useAppStore();
  useJobProgress();

  useEffect(() => {
    void refreshJobs();
    void refreshHardwareAccelerationProfile();
  }, [refreshHardwareAccelerationProfile, refreshJobs]);

  return (
    <Layout className="app-shell">
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
