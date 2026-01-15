import {
  CompressOutlined,
  DashboardOutlined,
  DownOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  PushpinOutlined,
  UpOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Row, Segmented, Space, Statistic, Steps, Tag, Typography } from 'antd';
import { gsap } from 'gsap';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { JobMode } from '@shared/types';
import { ThemeSwitcher } from '@renderer/components/ThemeSwitcher';
import { useCanHover } from '@renderer/hooks/use-can-hover';
import { useAppStore } from '@renderer/store/use-app-store';
import { getJobModeLabel } from '@renderer/utils/job-presentation';

const { Title, Text, Paragraph } = Typography;

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
  const jobs = useAppStore((state) => state.jobs);
  const selectedFiles = useAppStore((state) => state.selectedFiles);
  const jobMode = useAppStore((state) => state.jobMode);
  const setJobMode = useAppStore((state) => state.setJobMode);
  const canHover = useCanHover();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const previousModeRef = useRef<JobMode>(jobMode);
  const [isPinnedOpen, setIsPinnedOpen] = useState(() => !canHover);
  const [isHoverActive, setIsHoverActive] = useState(false);

  const queuedJobs = jobs.filter((job) => job.status === 'queued').length;
  const runningJobs = jobs.filter((job) => job.status === 'running').length;
  const completedJobs = jobs.filter((job) => job.status === 'completed').length;
  const activeJob =
    jobs.find((job) => job.status === 'running') ?? jobs.find((job) => job.status === 'queued') ?? null;
  const currentStep = getCurrentStep(selectedFiles.length, runningJobs, completedJobs);
  const isExpanded = canHover ? isPinnedOpen || isHoverActive : isPinnedOpen;
  const workspaceMode = activeJob?.mode ?? jobMode;
  const workspaceStatus =
    runningJobs > 0
      ? t('overview.status.running', { mode: getJobModeLabel(workspaceMode) })
      : selectedFiles.length > 0
        ? t('overview.status.ready', { mode: getJobModeLabel(jobMode) })
        : t('overview.status.idle');

  const modeCopy = useMemo(() => {
    if (jobMode === 'compress') {
      return {
        studioTag: t('overview.tags.compressionLab'),
        deliveryTag: t('overview.tags.perFileOutput'),
        title: t('overview.modes.compress.title'),
        body: t('overview.modes.compress.body'),
        chips: [
          t('overview.chips.batchCompression'),
          t('overview.chips.guidedCompression'),
          t('overview.chips.localHistory'),
          t('overview.chips.perFileOutput'),
        ],
        steps: [
          {
            title: t('overview.modes.compress.steps.selectTitle'),
            description: t('overview.modes.compress.steps.selectDescription'),
            icon: <VideoCameraOutlined />,
          },
          {
            title: t('overview.modes.compress.steps.encodeTitle'),
            description: t('overview.modes.compress.steps.encodeDescription'),
            icon: <CompressOutlined />,
          },
          {
            title: t('overview.modes.compress.steps.outputTitle'),
            description: t('overview.modes.compress.steps.outputDescription'),
            icon: <PlayCircleOutlined />,
          },
        ],
        firstMetricTitle: t('overview.metrics.videos'),
      };
    }

    return {
      studioTag: t('overview.tags.studio'),
      deliveryTag: t('overview.tags.singleOutput'),
      title: t('overview.modes.merge.title'),
      body: t('overview.modes.merge.body'),
      chips: [
        t('overview.chips.explicitOrder'),
        t('overview.chips.guidedCompression'),
        t('overview.chips.localHistory'),
        t('overview.chips.singleOutput'),
      ],
      steps: [
        {
          title: t('overview.modes.merge.steps.queueTitle'),
          description: t('overview.modes.merge.steps.queueDescription'),
          icon: <VideoCameraOutlined />,
        },
        {
          title: t('overview.modes.merge.steps.encodeTitle'),
          description: t('overview.modes.merge.steps.encodeDescription'),
          icon: <CompressOutlined />,
        },
        {
          title: t('overview.modes.merge.steps.outputTitle'),
          description: t('overview.modes.merge.steps.outputDescription'),
          icon: <PlayCircleOutlined />,
        },
      ],
      firstMetricTitle: t('overview.metrics.clips'),
    };
  }, [jobMode, t]);

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

  useEffect(() => {
    setIsPinnedOpen(!canHover);
    setIsHoverActive(false);
  }, [canHover]);

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

  const toggleOverview = () => {
    setIsPinnedOpen((current) => !current);
  };

  return (
    <Card
      className={`modern-card overview-card ${isExpanded ? 'overview-card-expanded' : 'overview-card-collapsed'}`}
    >
      <div
        ref={shellRef}
        className="overview-shell"
        onMouseEnter={canHover ? () => setIsHoverActive(true) : undefined}
        onMouseLeave={canHover ? () => setIsHoverActive(false) : undefined}
      >
        <div className="overview-topbar">
          <Space size="middle" className="overview-brand">
            <Avatar size={48} shape="square" icon={<DashboardOutlined />} />
            <div className="overview-brand-copy overview-mode-animate">
              <Space wrap size={[8, 8]} className="overview-tags">
                <Tag color="processing">{modeCopy.studioTag}</Tag>
                <Tag>{t('overview.tags.desktop')}</Tag>
                <Tag>{modeCopy.deliveryTag}</Tag>
              </Space>
              <Title level={3} className="overview-title">
                {modeCopy.title}
              </Title>
            </div>
          </Space>

          <Space size="small" wrap className="overview-actions">
            <ThemeSwitcher size="small" />
            <Segmented
              className="overview-mode-switch"
              value={jobMode}
              onChange={(value) => setJobMode(value as JobMode)}
              options={[
                {
                  label: (
                    <Space size={6}>
                      <VideoCameraOutlined />
                      {t('modes.merge')}
                    </Space>
                  ),
                  value: 'merge',
                },
                {
                  label: (
                    <Space size={6}>
                      <CompressOutlined />
                      {t('modes.compress')}
                    </Space>
                  ),
                  value: 'compress',
                },
              ]}
            />
            <Text className="status-badge">{workspaceStatus}</Text>
            <Button
              size="small"
              icon={canHover ? <PushpinOutlined /> : isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={toggleOverview}
            >
              {canHover
                ? isPinnedOpen
                  ? t('overview.actions.unpin')
                  : t('overview.actions.pinOpen')
                : isExpanded
                  ? t('overview.actions.collapse')
                  : t('overview.actions.expand')}
            </Button>
          </Space>
        </div>

        <Row gutter={[12, 12]} className="overview-kpi-grid overview-mode-animate">
          {metrics.map((metric) => (
            <Col xs={12} xl={6} key={metric.key}>
              <div className="overview-kpi">
                <Statistic title={metric.title} value={metric.value} prefix={metric.prefix} />
              </div>
            </Col>
          ))}
        </Row>

        <div ref={detailsRef} className="overview-details">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} xl={12}>
              <Space direction="vertical" size="middle" className="overview-copy overview-mode-animate">
                <Paragraph className="overview-text">{modeCopy.body}</Paragraph>

                <Space wrap size={[8, 8]}>
                  {modeCopy.chips.map((chip) => (
                    <Tag key={chip} bordered={false}>
                      {chip}
                    </Tag>
                  ))}
                </Space>

                <Text type="secondary">{canHover ? t('overview.hoverHint') : t('overview.toggleHint')}</Text>
              </Space>
            </Col>

            <Col xs={24} xl={12}>
              <div className="overview-steps overview-mode-animate">
                <Steps current={currentStep} responsive items={modeCopy.steps} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};
