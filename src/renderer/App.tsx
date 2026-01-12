import { Layout, Row, Col, Space, Spin, Typography } from 'antd';
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
        <div className="dashboard-container dashboard-stage">
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <MergeOverview />

            {loaded ? (
              <Row gutter={[20, 20]} align="stretch" className="dashboard-main-grid">
                <Col xs={24} xl={10} xxl={9} className="dashboard-side-column">
                  <Space direction="vertical" size="large" className="panel-stack">
                    <JobComposer />
                  </Space>
                </Col>

                <Col xs={24} xl={14} xxl={15} className="dashboard-center-column">
                  <Space direction="vertical" size="large" className="panel-stack">
                    <MergePreviewCard />
                    <JobBoard />
                  </Space>
                </Col>
              </Row>
            ) : (
              <div className="loading-card">
                <Space direction="vertical" size="middle" align="center">
                  <Spin size="large" />
                  <Text type="secondary">{t('app.loadingWorkspace')}</Text>
                </Space>
              </div>
            )}
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
