import { Typography } from 'antd';
import type { JobComposerOptionCardProps } from '@renderer/components/job-composer/job-composer.types';
import {
  optionCardBadgeStyle,
  optionCardBadgesStyle,
  optionCardBaseStyle,
  optionCardDisabledStyle,
  optionCardHeaderStyle,
  optionCardMetaStyle,
  optionCardSelectedStyle,
} from '@renderer/theme/component-styles';

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
    style={{
      ...optionCardBaseStyle,
      ...(selected ? optionCardSelectedStyle : {}),
      ...(disabled ? optionCardDisabledStyle : {}),
    }}
    onClick={onClick}
    disabled={disabled}
  >
    <span style={optionCardHeaderStyle}>
      <Text strong>{title}</Text>
      <Text type="secondary">{description}</Text>
    </span>

    {badges.length > 0 ? (
      <span style={optionCardBadgesStyle}>
        {badges.map((badge) => (
          <span key={badge} style={optionCardBadgeStyle}>
            {badge}
          </span>
        ))}
      </span>
    ) : null}

    {meta ? (
      <Text type="secondary" style={optionCardMetaStyle}>
        {meta}
      </Text>
    ) : null}
  </button>
);
