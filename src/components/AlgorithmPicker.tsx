import type { AlgorithmId } from '../algorithms/types.ts';
import { ALGORITHM_LIST } from '../algorithms/index.ts';
import './AlgorithmPicker.css';

interface AlgorithmPickerProps {
  readonly selectedId: AlgorithmId;
  readonly onSelect: (id: AlgorithmId) => void;
  readonly disabled: boolean;
}

export default function AlgorithmPicker({
  selectedId,
  onSelect,
  disabled,
}: AlgorithmPickerProps) {
  return (
    <div className="algorithm-picker">
      <span className="algorithm-picker__title">Algorithms</span>
      <div className="algorithm-picker__group" role="radiogroup" aria-label="Select sorting algorithm">
        {ALGORITHM_LIST.map((alg) => {
          const isSelected = selectedId === alg.meta.id;
          return (
            <label
              key={alg.meta.id}
              className={`algorithm-picker__option${isSelected ? ' algorithm-picker__option--selected' : ''}${disabled ? ' algorithm-picker__option--disabled' : ''}`}
            >
              <input
                type="radio"
                name="algorithm-selection"
                value={alg.meta.id}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onSelect(alg.meta.id)}
                className="algorithm-picker__input"
              />
              <div className="algorithm-picker__info">
                <span className="algorithm-picker__name">{alg.meta.name}</span>
                <span className="algorithm-picker__complexity text-mono">
                  Worst: {alg.meta.complexity.worst}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
