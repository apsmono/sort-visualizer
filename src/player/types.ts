import type { SortStep } from '../algorithms/types.ts';

/** Derived counters. Recomputed by the reducer as steps are applied/unapplied. */
export interface SortStats {
  readonly comparisons: number;
  readonly writes: number;
  readonly stepIndex: number;
  readonly totalSteps: number;
}

/** Everything the renderer needs to draw one frame. */
export interface FrameState {
  /** Live array. Mutated forward and backward by applying `Write` records. */
  readonly array: readonly number[];
  readonly comparing: readonly number[];
  readonly writing: readonly number[];
  /** Cumulative set of finalized indices. */
  readonly sorted: ReadonlySet<number>;
  readonly pivot: number | null;
  readonly range: readonly [number, number] | null;
  readonly note: string | null;
}

export interface PlayerState extends FrameState {
  readonly steps: readonly SortStep[];
  /** Index of the NEXT step to apply. 0 = nothing applied yet. */
  readonly cursor: number;
  readonly stats: SortStats;
  readonly status: 'idle' | 'playing' | 'paused' | 'finished';
}

export type PlayerAction =
  | { type: 'load'; array: readonly number[]; steps: readonly SortStep[] }
  | { type: 'forward'; count: number }
  | { type: 'back'; count: number }
  | { type: 'seek'; cursor: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'reset' };
