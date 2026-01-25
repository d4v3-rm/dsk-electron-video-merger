import { Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@renderer/store/use-app-store';
import { selectWorkspacePanelState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';

const WORKSPACE_PANELS = ['setup', 'output', 'history'] as const;

export const WorkspaceStepper = () => {
  const { t } = useTranslation();
  const jobMode = useAppStore((state) => state.jobMode);
  const { activeWorkspacePanel, setActiveWorkspacePanel } = useUiStore(useShallow(selectWorkspacePanelState));

  const currentIndex = WORKSPACE_PANELS.indexOf(activeWorkspacePanel);

  return (
    <div className="workspace-stepper-card">
      <Steps
        type="navigation"
        current={currentIndex}
        responsive={false}
        onChange={(nextIndex) => setActiveWorkspacePanel(WORKSPACE_PANELS[nextIndex])}
        items={[
          {
            title: jobMode === 'merge' ? t('composer.cardTitle.merge') : t('composer.cardTitle.compress'),
          },
          {
            title: t('preview.cardTitle'),
          },
          {
            title: t('history.cardTitle'),
          },
        ]}
      />
    </div>
  );
};
