import type { AlgorithmMeta } from '../algorithms/types.ts';
import './ComplexityCard.css';

interface ComplexityCardProps {
  readonly meta: AlgorithmMeta;
}

export default function ComplexityCard({ meta }: ComplexityCardProps) {
  const { complexity, stable, inPlace, summary, invariant } = meta;

  return (
    <div className="complexity-card">
      <span className="complexity-card__title">Algorithm Info</span>
      <div className="complexity-card__content">
        <p className="complexity-card__summary">{summary}</p>

        <div className="complexity-card__grid">
          <div className="complexity-row">
            <span className="complexity-row__label">Best Case</span>
            <span className="complexity-row__value text-mono">{complexity.best}</span>
          </div>
          <div className="complexity-row">
            <span className="complexity-row__label">Average Case</span>
            <span className="complexity-row__value text-mono">{complexity.average}</span>
          </div>
          <div className="complexity-row">
            <span className="complexity-row__label">Worst Case</span>
            <span className="complexity-row__value text-mono">{complexity.worst}</span>
          </div>
          <div className="complexity-row">
            <span className="complexity-row__label">Space Complexity</span>
            <span className="complexity-row__value text-mono">{complexity.space}</span>
          </div>
        </div>

        <div className="complexity-card__badges">
          <span className={`badge ${stable ? 'badge--success' : 'badge--warning'}`}>
            {stable ? 'Stable' : 'Unstable'}
          </span>
          <span className={`badge ${inPlace ? 'badge--success' : 'badge--warning'}`}>
            {inPlace ? 'In-Place' : 'Out-of-Place'}
          </span>
        </div>

        <div className="complexity-card__invariant">
          <span className="invariant-label">Invariant</span>
          <p className="invariant-text">{invariant}</p>
        </div>
      </div>
    </div>
  );
}
