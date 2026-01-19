import { Alert } from 'antd';
import type { JobComposerEmptyStateProps } from '@renderer/components/job-composer/job-composer.types';

export const JobComposerEmptyState = ({ title, description }: JobComposerEmptyStateProps) => (
  <Alert type="warning" showIcon message={title} description={description} />
);
