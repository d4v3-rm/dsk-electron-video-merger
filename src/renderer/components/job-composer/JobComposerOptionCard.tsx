import { Typography } from 'antd';
import type { JobComposerOptionCardProps } from '@renderer/components/job-composer/job-composer.types';

const { Text } = Typography;

export const JobComposerOptionCard = ({
  title,
  description,
  badges,
  selected,
  onClick,
  meta,
  disabled = false,
}: JobComposerOptionCardProps) => (
  <button
    type="button"
    className={`composer-option-card ${selected ? 'composer-option-card-selected' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className="composer-option-card-header">
      <Text strong>{title}</Text>
      <Text type="secondary">{description}</Text>
    </span>

    {badges.length > 0 ? (
      <span className="composer-option-card-badges">
        {badges.map((badge) => (
          <span key={badge} className="composer-option-card-badge">
            {badge}
          </span>
        ))}
      </span>
    ) : null}

    {meta ? (
      <Text type="secondary" className="composer-option-card-meta">
        {meta}
      </Text>
    ) : null}
  </button>
);
