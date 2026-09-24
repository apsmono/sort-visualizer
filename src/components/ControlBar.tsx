import './ControlBar.css';

interface ControlBarProps {
  readonly status: 'idle' | 'playing' | 'paused' | 'finished';
  readonly cursor: number;
  readonly totalSteps: number;
  readonly speed: number;
  readonly setSpeed: (n: number) => void;
  readonly play: () => void;
  readonly pause: () => void;
  readonly stepForward: () => void;
  readonly stepBack: () => void;
  readonly seek: (cursor: number) => void;
  readonly reset: () => void;
}

export default function ControlBar({
  status,
  cursor,
  totalSteps,
  speed,
  setSpeed,
  play,
  pause,
  stepForward,
  stepBack,
  seek,
  reset,
}: ControlBarProps) {
  const isPlaying = status === 'playing';
  const isFinished = status === 'finished';
  const isAtStart = cursor === 0;

  // Convert actual speed back to slider x in [0, 1] using power of 2.2
  const sliderX = Math.pow(Math.max(0, speed - 1) / 499, 1 / 2.2);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = parseFloat(e.target.value);
    const newSpeed = Math.round(1 + 499 * Math.pow(x, 2.2));
    setSpeed(newSpeed);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseInt(e.target.value, 10));
  };

  return (
    <div className="control-bar">
      <div className="control-bar__buttons">
        <button
          type="button"
          className="control-btn"
          onClick={reset}
          disabled={isAtStart}
          aria-label="Reset"
          title="Reset (R)"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" />
          </svg>
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={stepBack}
          disabled={isAtStart || isPlaying}
          aria-label="Step back"
          title="Step back (Left Arrow)"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          type="button"
          className="control-btn control-btn--play"
          onClick={isPlaying ? pause : play}
          disabled={isFinished}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={stepForward}
          disabled={isFinished || isPlaying}
          aria-label="Step forward"
          title="Step forward (Right Arrow)"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 6v12l8.5-6zm7.5 0h2v12h-2z" />
          </svg>
        </button>
      </div>

      <div className="control-bar__sliders">
        <div className="control-slider">
          <label htmlFor="timeline-slider" className="control-slider__label">
            Timeline
          </label>
          <div className="control-slider__input-wrapper">
            <input
              id="timeline-slider"
              type="range"
              min="0"
              max={totalSteps}
              value={cursor}
              onChange={handleTimelineChange}
              className="slider"
              aria-valuetext={`Step ${cursor} of ${totalSteps}`}
            />
            <span className="control-slider__value text-mono">
              {cursor}/{totalSteps}
            </span>
          </div>
        </div>

        <div className="control-slider">
          <label htmlFor="speed-slider" className="control-slider__label">
            Speed
          </label>
          <div className="control-slider__input-wrapper">
            <input
              id="speed-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sliderX}
              onChange={handleSpeedChange}
              className="slider"
              aria-valuetext={`${speed} steps per second`}
            />
            <span className="control-slider__value text-mono">{speed}/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
