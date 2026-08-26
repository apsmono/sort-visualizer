import type { SortStep } from '../algorithms/types.ts';
import './Narration.css';

interface NarrationProps {
  readonly step: SortStep | undefined;
}

export default function Narration({ step }: NarrationProps) {
  let note = 'Click play to start animating!';

  if (step) {
    if (step.note) {
      note = step.note;
    } else {
      switch (step.kind) {
        case 'compare':
          if (step.compare) {
            note = `Comparing indices ${step.compare[0]} and ${step.compare[1]}`;
          } else {
            note = 'Comparing elements';
          }
          break;
        case 'write':
          if (step.writes && step.writes.length > 0) {
            const w = step.writes[0];
            note = `Writing value ${w.value} to index ${w.index}`;
          } else {
            note = 'Writing elements';
          }
          break;
        case 'mark-sorted':
          if (step.sorted && step.sorted.length > 0) {
            note = `Marked elements [${step.sorted.join(', ')}] as sorted`;
          } else {
            note = 'Finalizing sorted elements';
          }
          break;
        case 'set-pivot':
          if (step.pivot !== undefined && step.pivot !== null) {
            note = `Setting pivot to index ${step.pivot}`;
          } else {
            note = 'Clearing pivot';
          }
          break;
        case 'set-range':
          if (step.range) {
            note = `Focusing on range indices ${step.range[0]} to ${step.range[1]}`;
          } else {
            note = 'Focusing on full array';
          }
          break;
        case 'done':
          note = 'Sorting completed!';
          break;
        default:
          note = 'Processing...';
      }
    }
  }

  return (
    <div className="narration" aria-live="polite">
      <p className="narration__text">{note}</p>
    </div>
  );
}
