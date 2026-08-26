import type { FrameState } from '../player/types.ts';
import './BarChart.css';

interface BarChartProps {
  readonly frame: FrameState;
  readonly max: number;
}

export default function BarChart({ frame, max }: BarChartProps) {
  const { array, comparing, writing, sorted, pivot, range } = frame;

  const totalCount = array.length;
  const sortedCount = sorted.size;
  const ariaLabel = `${totalCount} bars, ${sortedCount} sorted.`;

  // Dense mode drops the gap to 0 above n=100 elements
  const isDense = totalCount > 100;
  const chartClasses = `bar-chart${isDense ? ' bar-chart--dense' : ''}`;

  return (
    <div className={chartClasses} role="img" aria-label={ariaLabel}>
      {array.map((value, index) => {
        // Precedence: writing -> comparing -> pivot -> sorted -> in-range -> out-of-range
        let stateClass = '';
        if (writing.includes(index)) {
          stateClass = 'bar--writing';
        } else if (comparing.includes(index)) {
          stateClass = 'bar--comparing';
        } else if (pivot === index) {
          stateClass = 'bar--pivot';
        } else if (sorted.has(index)) {
          stateClass = 'bar--sorted';
        } else if (range !== null) {
          if (index >= range[0] && index <= range[1]) {
            stateClass = 'bar--in-range';
          } else {
            stateClass = 'bar--out-of-range';
          }
        }

        const heightPercent = max > 0 ? (value / max) * 100 : 0;

        return (
          <div
            key={index}
            className={`bar ${stateClass}`}
            style={{ height: `${heightPercent}%` }}
            data-value={value}
          />
        );
      })}
    </div>
  );
}
