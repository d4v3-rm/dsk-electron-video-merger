import {
  CompressOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import { gsap } from 'gsap';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import {
  getOverviewModeCopy,
  OverviewDetails,
  OverviewHeader,
  OverviewMetrics,
} from '@renderer/components/overview';
import { selectOverviewState } from '@renderer/store/app-store.selectors';
import { useAppStore } from '@renderer/store/use-app-store';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

const getCurrentStep = (selectedFilesCount: number, runningJobsCount: number, completedJobsCount: number) => {
  if (runningJobsCount > 0) {
    return 1;
  }

  if (completedJobsCount > 0 && selectedFilesCount === 0) {
    return 2;
  }

  return 0;
};

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
  const activeJob =
    jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
  const currentStep = getCurrentStep(selectedFiles.length, runningJobs, completedJobs);
  const workspaceMode = activeJob?.mode ?? jobMode;
  const workspaceStatus =
    runningJobs > 0
      ? t('overview.status.running', { mode: getJobModeLabel(workspaceMode) })
      : selectedFiles.length > 0
        ? t('overview.status.ready', { mode: getJobModeLabel(jobMode) })
        : t('overview.status.idle');

  const modeCopy = useMemo(() => getOverviewModeCopy(jobMode, t), [jobMode, t]);

  const metrics = useMemo(
    () => [
      {
        key: 'clips',
        title: modeCopy.firstMetricTitle,
        value: selectedFiles.length,
        prefix: <VideoCameraOutlined />,
      },
      {
        key: 'queued',
        title: t('overview.metrics.queued'),
        value: queuedJobs,
        prefix: <ProfileOutlined />,
      },
      {
        key: 'running',
        title: t('overview.metrics.running'),
        value: runningJobs,
        prefix: <CompressOutlined />,
      },
      {
        key: 'completed',
        title: t('overview.metrics.completed'),
        value: completedJobs,
        prefix: <PlayCircleOutlined />,
      },
    ],
    [completedJobs, modeCopy.firstMetricTitle, queuedJobs, runningJobs, selectedFiles.length, t],
  );

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const details = detailsRef.current;

    if (!shell || !details) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.killTweensOf([shell, details]);

      if (isExpanded) {
        gsap.set(details, { display: 'block' });
        gsap.fromTo(
          details,
          { height: 0, autoAlpha: 0, y: -16 },
          {
            height: 'auto',
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            ease: 'power2.out',
            clearProps: 'height',
          },
        );

        gsap.fromTo(shell, { y: 10 }, { y: 0, duration: 0.34, ease: 'power2.out', overwrite: 'auto' });
        return;
      }

      gsap.to(details, {
        height: 0,
        autoAlpha: 0,
        y: -10,
        duration: 0.24,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(details, { display: 'none' });
        },
      });

      gsap.to(shell, { y: 0, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
    }, shell);

    return () => {
      ctx.revert();
    };
  }, [isExpanded]);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return undefined;
    }

    const direction = previousModeRef.current === jobMode ? 0 : jobMode === 'compress' ? 1 : -1;
    const ctx = gsap.context(() => {
      const targets = shell.querySelectorAll('.overview-mode-animate');
      gsap.killTweensOf(targets);
      gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          x: direction * 18,
          y: 8,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.28,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
        },
      );
    }, shell);

    previousModeRef.current = jobMode;

    return () => {
      ctx.revert();
    };
  }, [jobMode]);

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
