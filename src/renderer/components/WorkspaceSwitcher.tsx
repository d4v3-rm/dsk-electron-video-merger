import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@renderer/store/use-app-store';
import { selectWorkspacePanelState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import type { WorkspacePanel } from '@renderer/store/ui-store.types';

const WORKSPACE_PANELS: WorkspacePanel[] = ['setup', 'output', 'history'];

export const WorkspaceSwitcher = () => {
  const { t } = useTranslation();
  const jobMode = useAppStore((state) => state.jobMode);
  const { activeWorkspacePanel, setActiveWorkspacePanel } = useUiStore(useShallow(selectWorkspacePanelState));

  return (
    <div className="workspace-switcher-shell" data-active-panel={activeWorkspacePanel}>
      <Segmented<WorkspacePanel>
        size="large"
        className="workspace-switcher"
        value={activeWorkspacePanel}
        onChange={(value) => setActiveWorkspacePanel(value)}
        options={WORKSPACE_PANELS.map((panel) => ({
          value: panel,
          label:
            panel === 'setup'
              ? jobMode === 'merge'
                ? t('composer.cardTitle.merge')
                : t('composer.cardTitle.compress')
              : panel === 'output'
                ? t('preview.cardTitle')
                : t('history.cardTitle'),
        }))}
      />
    </div>
  );
};
