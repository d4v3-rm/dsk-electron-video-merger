import { Layout, Typography, Spin } from 'antd';
import { useEffect } from 'react';
import { useAppStore } from './store/use-app-store';
import { JobBoard } from './components/JobBoard';
import { JobComposer } from './components/JobComposer';
import { useJobProgress } from './hooks/use-job-progress';

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
        <Title level={3}>🎞️ VideoMerger Desktop</Title>
      </Header>
      <Content className="app-content">
        <JobComposer />
        {loaded ? <JobBoard /> : <Spin size="large" />}
      </Content>
      <Footer className="app-footer">
        <Text type="secondary">Monorepo rimosso. Electron desktop con job singolo e batch.</Text>
      </Footer>
    </Layout>
  );
}

export default App;
