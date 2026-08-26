import { useState, useReducer, useEffect, useRef, useCallback } from 'react';
import type { FrameState, SortStats, PlayerState } from './types.ts';
import type { SortStep } from '../algorithms/types.ts';
import { initialPlayerState, playerReducer } from './playerReducer.ts';

export function usePlayer(
  array: readonly number[],
  steps: readonly SortStep[]
): {
  frame: FrameState;
  stats: SortStats;
  status: PlayerState['status'];
  speed: number;
  setSpeed: (n: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  seek: (cursor: number) => void;
  reset: () => void;
} {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);
  const [speed, setSpeed] = useState(50); // steps per second

  // Sync array and steps changes
  useEffect(() => {
    dispatch({ type: 'load', array, steps });
  }, [array, steps]);

  const stateRef = useRef(state);
  const speedRef = useRef(speed);

  // Keep references to state and speed for the animation loop to prevent effect restarts
  useEffect(() => {
    stateRef.current = state;
    speedRef.current = speed;
  });

  const rafRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.status !== 'playing') {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      accumulatedTimeRef.current = 0;
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dt = (now - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = now;

      const currentSpeed = speedRef.current;
      accumulatedTimeRef.current += dt;

      const stepDuration = 1 / currentSpeed;
      if (accumulatedTimeRef.current >= stepDuration) {
        const stepsDue = Math.floor(accumulatedTimeRef.current / stepDuration);
        accumulatedTimeRef.current -= stepsDue * stepDuration;

        dispatch({ type: 'forward', count: stepsDue });
      }

      // Check if we finished inside the step check
      if (stateRef.current.cursor < stateRef.current.steps.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        lastTimeRef.current = null;
        accumulatedTimeRef.current = 0;
      }
    };

    lastTimeRef.current = null;
    accumulatedTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [state.status]);

  const play = useCallback(() => {
    dispatch({ type: 'play' });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'pause' });
  }, []);

  const toggle = useCallback(() => {
    if (stateRef.current.status === 'playing') {
      dispatch({ type: 'pause' });
    } else {
      dispatch({ type: 'play' });
    }
  }, []);

  const stepForward = useCallback(() => {
    dispatch({ type: 'forward', count: 1 });
  }, []);

  const stepBack = useCallback(() => {
    dispatch({ type: 'back', count: 1 });
  }, []);

  const seek = useCallback((cursor: number) => {
    dispatch({ type: 'seek', cursor });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  // FrameState is a subset of PlayerState
  const frame: FrameState = {
    array: state.array,
    comparing: state.comparing,
    writing: state.writing,
    sorted: state.sorted,
    pivot: state.pivot,
    range: state.range,
    note: state.note,
  };

  return {
    frame,
    stats: state.stats,
    status: state.status,
    speed,
    setSpeed,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    seek,
    reset,
  };
}
