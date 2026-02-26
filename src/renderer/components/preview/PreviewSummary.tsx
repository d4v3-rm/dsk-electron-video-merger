import { Statistic } from 'antd';
import type { PreviewMetric } from '@renderer/components/preview/preview.types';

interface PreviewSummaryProps {
  metrics: PreviewMetric[];
}

export const PreviewSummary = ({ metrics }: PreviewSummaryProps) => (
  <div className="preview-summary-grid">
    {metrics.map((item) => (
      <div key={item.key} className="preview-stat-tile">
        <Statistic className="metric-stat" title={item.title} value={item.value} prefix={item.prefix} />
      </div>
    ))}
  </div>
);
