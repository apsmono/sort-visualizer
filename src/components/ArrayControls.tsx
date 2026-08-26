import type { Distribution } from '../lib/types.ts';
import './ArrayControls.css';

interface ArrayControlsProps {
  readonly size: number;
  readonly distribution: Distribution;
  readonly onSizeChange: (size: number) => void;
  readonly onDistributionChange: (dist: Distribution) => void;
  readonly onShuffle: () => void;
  readonly disabled: boolean;
}

export default function ArrayControls({
  size,
  distribution,
  onSizeChange,
  onDistributionChange,
  onShuffle,
  disabled,
}: ArrayControlsProps) {
  const distributions: { value: Distribution; label: string }[] = [
    { value: 'random', label: 'Random' },
    { value: 'nearly-sorted', label: 'Nearly Sorted' },
    { value: 'reversed', label: 'Reversed' },
    { value: 'few-unique', label: 'Few Unique' },
  ];

  return (
    <div className="array-controls">
      <div className="array-controls__row">
        <div className="array-controls__size-slider">
          <label htmlFor="array-size-slider" className="array-controls__label">
            Array Size
          </label>
          <div className="array-controls__slider-wrapper">
            <input
              id="array-size-slider"
              type="range"
              min="10"
              max="200"
              step="1"
              value={size}
              onChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
              disabled={disabled}
              className="slider"
              aria-valuetext={`${size} bars`}
            />
            <span className="array-controls__size-value text-mono">{size}</span>
          </div>
        </div>

        <button
          type="button"
          className="shuffle-btn"
          onClick={onShuffle}
          disabled={disabled}
          aria-label="Shuffle/Regenerate Array"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.38 10.17l-1.42 1.41 3.17 3.17L20 16.5V22h-5.5l2.04-2.04-3.66-3.66z" />
          </svg>
          Shuffle
        </button>
      </div>

      <div className="array-controls__distributions">
        <span className="array-controls__label">Distribution</span>
        <div className="dist-group" role="radiogroup" aria-label="Select array distribution type">
          {distributions.map((dist) => {
            const isSelected = distribution === dist.value;
            return (
              <label
                key={dist.value}
                className={`dist-option${isSelected ? ' dist-option--selected' : ''}${disabled ? ' dist-option--disabled' : ''}`}
              >
                <input
                  type="radio"
                  name="distribution-selection"
                  value={dist.value}
                  checked={isSelected}
                  disabled={disabled}
                  onChange={() => onDistributionChange(dist.value)}
                  className="dist-option__input"
                />
                <span className="dist-option__label">{dist.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
