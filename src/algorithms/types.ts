/**
 * Core contract for the sort visualizer.
 *
 * DESIGN RULE (do not violate):
 * Algorithms are PURE GENERATORS. They never touch React, the DOM, timers,
 * or module-level state. They yield a stream of `SortStep` values describing
 * what happened, and the player layer decides when and how to render them.
 *
 * DESIGN RULE (do not violate):
 * A step NEVER carries an array snapshot. It carries reversible `Write`
 * records instead. This keeps memory O(1) per step and makes the timeline
 * scrubbable in both directions.
 */

export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

/** A single reversible mutation of one array cell. */
export interface Write {
  /** Index written to. */
  readonly index: number;
  /** Value after the write. */
  readonly value: number;
  /** Value before the write. Required — this is what makes stepping back possible. */
  readonly prev: number;
}

export type StepKind =
  /** Two indices were read and compared. No mutation. */
  | 'compare'
  /** One or more cells were written (covers swaps, shifts, merge write-backs). */
  | 'write'
  /** Indices are now in their final sorted position. */
  | 'mark-sorted'
  /** The active pivot changed (quick sort). `pivot: null` clears it. */
  | 'set-pivot'
  /** The sub-array under consideration changed. `range: null` clears it. */
  | 'set-range'
  /** Terminal step. Every index is sorted. Yield exactly once, last. */
  | 'done';

export interface SortStep {
  readonly kind: StepKind;
  /** Present on 'compare'. The two indices being compared. */
  readonly compare?: readonly [number, number];
  /** Present on 'write'. Applied in order; reversed in reverse order. */
  readonly writes?: readonly Write[];
  /** Present on 'mark-sorted'. Indices newly finalized (not cumulative). */
  readonly sorted?: readonly number[];
  /** Present on 'set-pivot'. */
  readonly pivot?: number | null;
  /** Present on 'set-range'. Inclusive [lo, hi]. */
  readonly range?: readonly [number, number] | null;
  /** Optional one-line human explanation shown in the narration strip. */
  readonly note?: string;
}

/**
 * An algorithm implementation.
 * MUST NOT mutate `input`. Work on a local copy.
 * MUST yield a final `{ kind: 'done' }` step.
 */
export type SortGenerator = (
  input: readonly number[],
) => Generator<SortStep, void, undefined>;

export interface Complexity {
  readonly best: string;
  readonly average: string;
  readonly worst: string;
  readonly space: string;
}

export interface AlgorithmMeta {
  readonly id: AlgorithmId;
  readonly name: string;
  readonly complexity: Complexity;
  readonly stable: boolean;
  readonly inPlace: boolean;
  /** One or two sentences. Shown in the info card. */
  readonly summary: string;
  /** Plain-language description of the loop invariant. */
  readonly invariant: string;
}

export interface Algorithm {
  readonly meta: AlgorithmMeta;
  readonly run: SortGenerator;
}
