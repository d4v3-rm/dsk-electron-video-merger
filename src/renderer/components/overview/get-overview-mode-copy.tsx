import { CompressOutlined, PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import type { TFunction } from 'i18next';
import type { JobMode } from '@shared/types';
import type { OverviewModeCopy } from '@renderer/components/overview/overview.types';

export const getOverviewModeCopy = (jobMode: JobMode, t: TFunction): OverviewModeCopy => {
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
};
