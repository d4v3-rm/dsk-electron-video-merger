import { Statistic } from 'antd';
import type { JobHistoryMetric } from '@renderer/components/job-history/job-history.types';

interface JobBoardSummaryProps {
  metrics: JobHistoryMetric[];
}

export const JobBoardSummary = ({ metrics }: JobBoardSummaryProps) => (
  <div className="history-summary-grid">
    {metrics.map((item) => (
      <div key={item.key} className="history-stat-tile">
        <Statistic className="metric-stat" title={item.title} value={item.value} prefix={item.prefix} />
      </div>
    ))}
  </div>
);
