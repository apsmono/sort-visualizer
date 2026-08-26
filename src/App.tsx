import { useState, useMemo, useEffect } from 'react';
import type { AlgorithmId } from './algorithms/types.ts';
import type { Distribution } from './lib/types.ts';
import { ALGORITHMS } from './algorithms/index.ts';
import { generateArray } from './lib/generateArray.ts';
import { usePlayer } from './player/usePlayer.ts';

import BarChart from './components/BarChart.tsx';
import ControlBar from './components/ControlBar.tsx';
import AlgorithmPicker from './components/AlgorithmPicker.tsx';
import ArrayControls from './components/ArrayControls.tsx';
import StatsPanel from './components/StatsPanel.tsx';
import ComplexityCard from './components/ComplexityCard.tsx';
import Narration from './components/Narration.tsx';

import './App.css';

export default function App() {
  const [arraySize, setArraySize] = useState(60);
  const [distribution, setDistribution] = useState<Distribution>('random');
  const [seed, setSeed] = useState(0);

  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>('bubble');

  // Regenerate array when parameters change
  const [array, setArray] = useState(() =>
    generateArray({ size: arraySize, distribution, seed })
  );

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    setArray(generateArray({ size: newSize, distribution, seed }));
  };

  const handleDistributionChange = (newDist: Distribution) => {
    setDistribution(newDist);
    setArray(generateArray({ size: arraySize, distribution: newDist, seed }));
  };

  const handleShuffle = () => {
    const newSeed = seed + 1;
    setSeed(newSeed);
    setArray(generateArray({ size: arraySize, distribution, seed: newSeed }));
  };

  // Precompute steps - MUST memoize this
  const steps = useMemo(
    () => [...ALGORITHMS[algorithmId].run(array)],
    [array, algorithmId]
  );

  const {
    frame,
    stats,
    status,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBack,
    seek,
    reset,
  } = usePlayer(array, steps);

  const currentStep = useMemo(() => {
    if (stats.stepIndex > 0 && stats.stepIndex <= steps.length) {
      return steps[stats.stepIndex - 1];
    }
    return undefined;
  }, [stats.stepIndex, steps]);

  const maxVal = useMemo(
    () => (array.length > 0 ? Math.max(...array) : 100),
    [array]
  );

  const isControlsDisabled = status === 'playing';

  // Keyboard Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isEditable =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true');

      if (isEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'playing') {
          pause();
        } else if (status !== 'finished') {
          play();
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) {
          seek(Math.min(stats.totalSteps, stats.stepIndex + 10));
        } else {
          stepForward();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) {
          seek(Math.max(0, stats.stepIndex - 10));
        } else {
          stepBack();
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, stepForward, stepBack, reset, seek, stats.stepIndex, stats.totalSteps, play, pause]);

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Sorting Algorithm Visualizer</h1>
        <p className="app__subtitle">
          An interactive tool for exploring and understanding classic sorting algorithms.
        </p>
      </header>

      <section className="app__stage" aria-label="Visualizer Board">
        <BarChart frame={frame} max={maxVal} />
      </section>

      <section className="app__controls" aria-label="Player Controls">
        <Narration step={currentStep} />
        <ControlBar
          status={status}
          cursor={frame.array ? stats.stepIndex : 0}
          totalSteps={stats.totalSteps}
          speed={speed}
          setSpeed={setSpeed}
          play={play}
          pause={pause}
          stepForward={stepForward}
          stepBack={stepBack}
          seek={seek}
          reset={reset}
        />
      </section>

      <aside className="app__panels" aria-label="Configuration and details">
        <ArrayControls
          size={arraySize}
          distribution={distribution}
          onSizeChange={handleSizeChange}
          onDistributionChange={handleDistributionChange}
          onShuffle={handleShuffle}
          disabled={isControlsDisabled}
        />

        <AlgorithmPicker
          selectedId={algorithmId}
          onSelect={setAlgorithmId}
          disabled={isControlsDisabled}
        />

        <StatsPanel stats={stats} />
        <ComplexityCard meta={ALGORITHMS[algorithmId].meta} />
      </aside>
    </main>
  );
}
