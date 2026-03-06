import type { TFunction } from 'i18next';
import type { JobComposerModeCopy } from '@renderer/components/job-composer/job-composer.types';

export const getJobComposerModeCopy = (t: TFunction, isMergeMode: boolean): JobComposerModeCopy =>
  isMergeMode
    ? {
        cardTitle: t('composer.cardTitle.merge'),
        queueTag: t('composer.tags.orderedQueue'),
        title: t('composer.title.merge'),
        subtitle: t('composer.subtitle.merge'),
        orderInfo: t('composer.orderInfo.merge'),
        orderAlertType: 'info',
        statsLabel: t('composer.stats.clips'),
        addButtonLabel: t('composer.buttons.addClips'),
        clearButtonLabel: t('composer.buttons.clearQueue'),
        startButtonLabel: t('composer.buttons.startMerge'),
        emptyTitle: t('composer.empty.mergeTitle'),
        emptyDescription: t('composer.empty.mergeDescription'),
        queueTitle: t('composer.sections.queueMerge'),
        queueHint: t('composer.queueHint.merge'),
        deliveryValue: t('composer.delivery.merge'),
      }
    : {
        cardTitle: t('composer.cardTitle.compress'),
        queueTag: t('composer.tags.batchCompression'),
        title: t('composer.title.compress'),
        subtitle: t('composer.subtitle.compress'),
        orderInfo: t('composer.orderInfo.compress'),
        orderAlertType: 'warning',
        statsLabel: t('composer.stats.videos'),
        addButtonLabel: t('composer.buttons.addVideos'),
        clearButtonLabel: t('composer.buttons.clearSelection'),
        startButtonLabel: t('composer.buttons.startCompression'),
        emptyTitle: t('composer.empty.compressTitle'),
        emptyDescription: t('composer.empty.compressDescription'),
        queueTitle: t('composer.sections.queueCompress'),
        queueHint: t('composer.queueHint.compress'),
        deliveryValue: t('composer.delivery.compress'),
      };
