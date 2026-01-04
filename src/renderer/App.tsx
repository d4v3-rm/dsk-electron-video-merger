import { Col, Layout, Row, Space, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JobBoard } from '@renderer/components/JobBoard';
import { JobComposer } from '@renderer/components/JobComposer';
import { MergeOverview } from '@renderer/components/MergeOverview';
import { MergePreviewCard } from '@renderer/components/MergePreviewCard';
import { useJobProgress } from '@renderer/hooks/use-job-progress';
import { useAppStore } from '@renderer/store/use-app-store';

const { Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  const { t } = useTranslation();
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
                      <Text type="secondary">{t('app.loadingWorkspace')}</Text>
                    </Space>
                  </div>
                )}
              </Col>
            </Row>
          </Space>
        </div>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">{t('app.footer')}</Text>
      </Footer>
    </Layout>
  );
}

export default App;
