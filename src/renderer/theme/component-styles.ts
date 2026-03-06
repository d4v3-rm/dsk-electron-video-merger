import type { CSSProperties } from 'react';

export const appShellStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'transparent',
};

export const appContentStyle: CSSProperties = {
  padding: '24px 24px 8px',
};

export const dashboardContainerStyle: CSSProperties = {
  maxWidth: 1440,
  margin: '0 auto',
};

export const loadingCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 420,
  padding: 48,
  borderRadius: 18,
  background: 'var(--app-surface)',
  border: '1px solid var(--app-border)',
};

export const footerStyle: CSSProperties = {
  textAlign: 'center',
  background: 'transparent',
};

export const fullHeightCardStyle: CSSProperties = {
  height: '100%',
};

export const sectionCardStyle: CSSProperties = {
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface-alt)',
};

export const sectionCardStyles = {
  header: { minHeight: 52 },
  body: { padding: 18 },
} as const;

export const highlightCardStyle: CSSProperties = {
  border: '1px solid var(--app-border-strong)',
  background: 'var(--app-surface-alt)',
};

export const compactCardStyles = {
  body: { padding: 16 },
} as const;

export const summaryTileStyle: CSSProperties = {
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface-alt)',
};

export const statisticTileBodyStyles = {
  body: { padding: 16 },
} as const;

export const actionBarStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
};

export const actionCopyStyle: CSSProperties = {
  maxWidth: '48ch',
};

export const listContainerStyle: CSSProperties = {
  borderTop: '1px solid var(--app-border)',
  paddingTop: 8,
};

export const listItemStyle: CSSProperties = {
  padding: '14px 4px',
  borderBottom: '1px solid var(--app-border)',
};

export const listPathTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: '100%',
};

export const queueIndexStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  borderRadius: 12,
  background: 'var(--app-avatar-bg)',
  border: '1px solid var(--app-border-strong)',
  color: 'var(--app-accent)',
  fontWeight: 700,
};

export const outputNameStyle: CSSProperties = {
  color: 'var(--app-accent)',
};

export const runtimeBoxStyle: CSSProperties = {
  padding: 16,
  borderRadius: 18,
  background: 'var(--app-accent-soft)',
  border: '1px solid var(--app-border-strong)',
};

export const infoStackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

export const workspaceSwitcherShellStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingInline: 8,
  overflowX: 'auto',
};

export const workspaceSwitcherStyle: CSSProperties = {
  width: 'fit-content',
  maxWidth: '100%',
};

export const workspaceSwitcherSegmentedStyle: CSSProperties = {
  display: 'inline-flex',
  maxWidth: '100%',
  padding: 6,
  borderRadius: 999,
  background: 'var(--app-surface)',
  border: '1px solid var(--app-border)',
};

export const workspaceSwitcherHistoryStyle: CSSProperties = {
  borderColor: 'var(--app-border-strong)',
};

export const flatNotificationStyle: CSSProperties = {
  overflow: 'hidden',
  border: '1px solid var(--app-border-strong)',
  borderRadius: 22,
  background: 'var(--app-surface)',
};

export const overviewCardStyle: CSSProperties = {
  ...fullHeightCardStyle,
  border: '1px solid var(--app-border-strong)',
  background: 'var(--app-surface-alt)',
};

export const overviewCardStyles = {
  body: { padding: '24px 28px' },
} as const;

export const overviewShellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

export const overviewTopbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 24,
  flexWrap: 'wrap',
};

export const overviewBrandStyle: CSSProperties = {
  alignItems: 'flex-start',
  minWidth: 0,
  maxWidth: 'min(100%, 640px)',
};

export const overviewBrandCopyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minWidth: 0,
  maxWidth: 'min(100%, 540px)',
};

export const overviewTagStyle: CSSProperties = {
  margin: 0,
  padding: '4px 10px',
  borderRadius: 999,
  border: '1px solid var(--app-border-strong)',
  background: 'var(--app-surface)',
  color: 'var(--app-text-secondary)',
  fontWeight: 500,
};

export const overviewChipStyle: CSSProperties = {
  ...overviewTagStyle,
  background: 'var(--app-surface-muted)',
};

export const overviewTitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: '20ch',
  color: 'var(--app-text)',
  lineHeight: 1.15,
};

export const statusBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: '6px 12px',
  borderRadius: 999,
  border: '1px solid var(--app-status-border)',
  background: 'var(--app-status-bg)',
  color: 'var(--app-text)',
};

export const overviewControlsStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 12,
  width: 'min(100%, 508px)',
  minWidth: 320,
  marginLeft: 'auto',
};

export const overviewToolbarStyle: CSSProperties = {
  justifyContent: 'flex-end',
};

export const overviewModePanelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 14,
  borderRadius: 18,
  background: 'var(--app-surface)',
  border: '1px solid var(--app-border-strong)',
};

export const overviewModeLabelStyle: CSSProperties = {
  fontWeight: 600,
};

export const overviewTextStyle: CSSProperties = {
  display: 'block',
  margin: 0,
  maxWidth: '60ch',
  fontSize: 15,
  lineHeight: 1.7,
  color: 'var(--app-text-secondary)',
};

export const overviewStepsStyle: CSSProperties = {
  padding: 18,
  borderRadius: 18,
  background: 'var(--app-surface)',
  border: '1px solid var(--app-border)',
};

export const composerSummaryStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

export const composerSummaryDescriptionsStyles = {
  body: { padding: '14px 16px' },
} as const;

export const composerSummaryDescriptionsStyle: CSSProperties = {
  border: '1px solid var(--app-border)',
  borderRadius: 18,
  background: 'var(--app-surface)',
};

export const composerSettingsShellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
};

export const composerSettingsSectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

export const composerSettingsCopyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

export const composerControlPanelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 16,
  borderRadius: 18,
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface)',
};

export const modalContentStyle: CSSProperties = {
  border: '1px solid var(--app-border)',
  borderRadius: 20,
  background: 'var(--app-surface)',
};

export const modalHeaderStyle: CSSProperties = {
  background: 'var(--app-surface)',
  borderBottom: '1px solid var(--app-border)',
};

export const modalBodyInsetStyle: CSSProperties = {
  paddingTop: 8,
};

export const tableStyle: CSSProperties = {
  width: '100%',
  marginBottom: 18,
  borderCollapse: 'collapse',
};

export const tableCellStyle: CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--app-border)',
  verticalAlign: 'top',
};

export const tableHeaderCellStyle: CSSProperties = {
  ...tableCellStyle,
  textAlign: 'left',
  background: 'var(--app-surface-alt)',
};

export const optionCardBaseStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
  minHeight: 166,
  padding: 16,
  font: 'inherit',
  borderRadius: 18,
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface)',
  color: 'var(--app-text)',
  textAlign: 'left',
  appearance: 'none',
  cursor: 'pointer',
};

export const optionCardSelectedStyle: CSSProperties = {
  borderColor: 'var(--app-accent)',
  background: 'var(--app-surface-alt)',
};

export const optionCardDisabledStyle: CSSProperties = {
  opacity: 0.52,
  cursor: 'not-allowed',
};

export const optionCardHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

export const optionCardBadgesStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

export const optionCardBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 28,
  padding: '4px 10px',
  borderRadius: 999,
  border: '1px solid var(--app-border-strong)',
  background: 'var(--app-surface-muted)',
  color: 'var(--app-text-secondary)',
  fontSize: 12,
  lineHeight: 1.35,
};

export const optionCardMetaStyle: CSSProperties = {
  marginTop: 'auto',
};
