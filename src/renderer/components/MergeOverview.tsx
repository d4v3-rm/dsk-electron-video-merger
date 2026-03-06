import { Card } from 'antd';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import {
  getActiveOverviewJob,
  getCurrentOverviewStep,
  getOverviewModeCopy,
  getOverviewMetrics,
  getOverviewWorkspaceStatus,
  OverviewDetails,
  OverviewHeader,
  OverviewMetrics,
} from '@renderer/components/overview';
import { useOverviewAnimations } from '@renderer/components/overview/use-overview-animations';
import { selectOverviewState } from '@renderer/store/app-store.selectors';
import { selectOverviewUiState } from '@renderer/store/ui-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import { useUiStore } from '@renderer/store/use-ui-store';

export const MergeOverview = () => {
  const { t } = useTranslation();
  const { jobs, selectedFiles, jobMode, setJobMode } = useAppStore(useShallow(selectOverviewState));
  const { overviewExpanded, toggleOverviewExpanded } = useUiStore(useShallow(selectOverviewUiState));
  const shellRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const previousModeRef = useRef(jobMode);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const activeJob = getActiveOverviewJob(jobs);
  const currentStep = getCurrentOverviewStep(selectedFiles.length, runningJobs, completedJobs);
  const workspaceMode = activeJob?.mode ?? jobMode;
  const workspaceStatus = getOverviewWorkspaceStatus(
    t,
    runningJobs,
    selectedFiles.length,
    workspaceMode,
    jobMode,
  );

  const modeCopy = useMemo(() => getOverviewModeCopy(jobMode, t), [jobMode, t]);

  const metrics = useMemo(
    () => getOverviewMetrics(t, modeCopy, selectedFiles.length, queuedJobs, runningJobs, completedJobs),
    [completedJobs, modeCopy, queuedJobs, runningJobs, selectedFiles.length, t],
  );
  useOverviewAnimations({ shellRef, detailsRef, previousModeRef, isExpanded: overviewExpanded, jobMode });

  return (
    <Card
      className={`modern-card overview-card ${overviewExpanded ? 'overview-card-expanded' : 'overview-card-collapsed'}`}
    >
      <div ref={shellRef} className="overview-shell">
        <OverviewHeader
          isExpanded={overviewExpanded}
          jobMode={jobMode}
          workspaceStatus={workspaceStatus}
          title={modeCopy.title}
          studioTag={modeCopy.studioTag}
          deliveryTag={modeCopy.deliveryTag}
          onToggleOverview={toggleOverviewExpanded}
          onModeChange={setJobMode}
        />

        <OverviewMetrics metrics={metrics} />

        <div ref={detailsRef} className="overview-details">
          <OverviewDetails
            body={modeCopy.body}
            chips={modeCopy.chips}
            toggleHint={t('overview.toggleHint')}
            currentStep={currentStep}
            steps={modeCopy.steps}
          />
        </div>
      </div>
    </Card>
  );
};
