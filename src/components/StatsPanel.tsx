import type { SortStats } from '../player/types.ts';
import './StatsPanel.css';

interface StatsPanelProps {
  readonly stats: SortStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const { comparisons, writes, stepIndex, totalSteps } = stats;

  return (
    <div className="stats-panel">
      <span className="stats-panel__title">Statistics</span>
      <div className="stats-panel__grid">
        <div className="stat-box">
          <span className="stat-box__label">Comparisons</span>
          <span className="stat-box__value">{comparisons}</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__label">Writes (Array Mutations)</span>
          <span className="stat-box__value">{writes}</span>
        </div>
        <div className="stat-box">
          <span className="stat-box__label">Active Step</span>
          <span className="stat-box__value">
            {stepIndex} / {totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
}
