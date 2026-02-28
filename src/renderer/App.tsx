import { Layout, Space, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { JobBoard } from '@renderer/components/JobBoard';
import { JobComposer } from '@renderer/components/JobComposer';
import { MergeOverview } from '@renderer/components/MergeOverview';
import { MergePreviewCard } from '@renderer/components/MergePreviewCard';
import { WorkspaceSwitcher } from '@renderer/components/WorkspaceSwitcher';
import { useJobProgress } from '@renderer/hooks/use-job-progress';
import { selectAppBootstrapState } from '@renderer/store/app-store.selectors';
import { selectWorkspacePanelState } from '@renderer/store/ui-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import { useUiStore } from '@renderer/store/use-ui-store';
import {
  appContentStyle,
  appShellStyle,
  dashboardContainerStyle,
  footerStyle,
  loadingCardStyle,
} from '@renderer/theme/component-styles';

const { Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  const { t } = useTranslation();
  const { refreshJobs, refreshHardwareAccelerationProfile, loaded } = useAppStore(
    useShallow(selectAppBootstrapState),
  );
  const { activeWorkspacePanel } = useUiStore(useShallow(selectWorkspacePanelState));
  useJobProgress();

  useEffect(() => {
    void refreshJobs();
    void refreshHardwareAccelerationProfile();
  }, [refreshHardwareAccelerationProfile, refreshJobs]);

  const renderPanel = () => {
    if (activeWorkspacePanel === 'setup') {
      return <JobComposer />;
    }

    if (!loaded) {
      return (
        <div style={loadingCardStyle}>
          <Space direction="vertical" size="middle" align="center">
            <Spin size="large" />
            <Text type="secondary">{t('app.loadingWorkspace')}</Text>
          </Space>
        </div>
      );
    }

    if (activeWorkspacePanel === 'output') {
      return <MergePreviewCard />;
    }

    return <JobBoard />;
  };

  return (
    <Layout style={appShellStyle}>
      <Content style={appContentStyle}>
        <div style={dashboardContainerStyle}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <MergeOverview />
            <WorkspaceSwitcher />
            <div key={activeWorkspacePanel}>{renderPanel()}</div>
          </Space>
        </div>
      </Content>

      <Footer style={footerStyle}>
        <Text type="secondary">{t('app.footer')}</Text>
      </Footer>
    </Layout>
  );
}

export default App;
