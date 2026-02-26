import { Card } from 'antd';
import { useMemo, useRef, useState } from 'react';
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
import { useAppStore } from '@renderer/store/use-app-store';

export const MergeOverview = () => {
  const { t } = useTranslation();
  const { jobs, selectedFiles, jobMode, setJobMode } = useAppStore(useShallow(selectOverviewState));
  const shellRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const previousModeRef = useRef(jobMode);
  const [isExpanded, setIsExpanded] = useState(false);

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
  useOverviewAnimations({ shellRef, detailsRef, previousModeRef, isExpanded, jobMode });

  return (
    <Card
      className={`modern-card overview-card ${isExpanded ? 'overview-card-expanded' : 'overview-card-collapsed'}`}
    >
      <div ref={shellRef} className="overview-shell">
        <OverviewHeader
          isExpanded={isExpanded}
          jobMode={jobMode}
          workspaceStatus={workspaceStatus}
          title={modeCopy.title}
          studioTag={modeCopy.studioTag}
          deliveryTag={modeCopy.deliveryTag}
          onToggleOverview={() => setIsExpanded((current) => !current)}
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
