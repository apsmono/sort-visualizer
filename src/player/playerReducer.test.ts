import { describe, test, expect } from 'vitest';
import { initialPlayerState, playerReducer } from './playerReducer.ts';
import type { SortStep } from '../algorithms/types.ts';

describe('playerReducer', () => {
  // Setup standard test data
  const originalArray = [3, 1, 2];
  const steps: SortStep[] = [
    { kind: 'compare', compare: [0, 1] }, // 3 vs 1
    {
      kind: 'write',
      writes: [
        { index: 0, value: 1, prev: 3 },
        { index: 1, value: 3, prev: 1 },
      ],
    }, // swap -> [1, 3, 2]
    { kind: 'compare', compare: [1, 2] }, // 3 vs 2
    {
      kind: 'write',
      writes: [
        { index: 1, value: 2, prev: 3 },
        { index: 2, value: 3, prev: 2 },
      ],
    }, // swap -> [1, 2, 3]
    { kind: 'compare', compare: [0, 1] }, // 1 vs 2
    { kind: 'mark-sorted', sorted: [0, 1, 2] },
    { kind: 'done' },
  ];

  test('1. Applying every step forward produces the sorted array', () => {
    let state = playerReducer(initialPlayerState, {
      type: 'load',
      array: originalArray,
      steps,
    });

    expect(state.array).toEqual([3, 1, 2]);
    expect(state.cursor).toBe(0);

    state = playerReducer(state, { type: 'forward', count: steps.length });

    expect(state.array).toEqual([1, 2, 3]);
    expect(state.cursor).toBe(steps.length);
    expect(state.status).toBe('finished');
  });

  test('2. Applying all forward then all back returns the array to exactly the input', () => {
    let state = playerReducer(initialPlayerState, {
      type: 'load',
      array: originalArray,
      steps,
    });

    state = playerReducer(state, { type: 'forward', count: steps.length });
    expect(state.array).toEqual([1, 2, 3]);

    state = playerReducer(state, { type: 'back', count: steps.length });
    expect(state.array).toEqual([3, 1, 2]);
    expect(state.cursor).toBe(0);
  });

  test('3. seek(k) from any starting cursor produces the same state as reset() then forward(k)', () => {
    const loadedState = playerReducer(initialPlayerState, {
      type: 'load',
      array: originalArray,
      steps,
    });

    // Test seeks to every position from every position
    for (let start = 0; start <= steps.length; start++) {
      for (let target = 0; target <= steps.length; target++) {
        // Start at 'start'
        let state1 = playerReducer(loadedState, { type: 'seek', cursor: start });
        // Seek to 'target'
        state1 = playerReducer(state1, { type: 'seek', cursor: target });

        // Build target state from reset
        let state2 = playerReducer(loadedState, { type: 'reset' });
        state2 = playerReducer(state2, { type: 'forward', count: target });

        expect(state1.array).toEqual(state2.array);
        expect(state1.cursor).toBe(state2.cursor);
        expect(state1.stats.comparisons).toBe(state2.stats.comparisons);
        expect(state1.stats.writes).toBe(state2.stats.writes);
        expect(state1.sorted).toEqual(state2.sorted);
        expect(state1.pivot).toBe(state2.pivot);
        expect(state1.range).toEqual(state2.range);
      }
    }
  });

  test('4. A step writing the same index twice unapplies correctly', () => {
    const doubleWriteSteps: SortStep[] = [
      {
        kind: 'write',
        writes: [
          { index: 0, value: 8, prev: 5 },
          { index: 0, value: 12, prev: 8 },
        ],
      },
    ];

    let state = playerReducer(initialPlayerState, {
      type: 'load',
      array: [5],
      steps: doubleWriteSteps,
    });

    // Apply
    state = playerReducer(state, { type: 'forward', count: 1 });
    expect(state.array).toEqual([12]);

    // Unapply
    state = playerReducer(state, { type: 'back', count: 1 });
    expect(state.array).toEqual([5]); // Must be exactly 5, not 8!
  });

  test('5. Counters match a manual count over the step list', () => {
    const loadedState = playerReducer(initialPlayerState, {
      type: 'load',
      array: originalArray,
      steps,
    });

    for (let k = 0; k <= steps.length; k++) {
      const state = playerReducer(loadedState, { type: 'seek', cursor: k });

      // Manual count
      let manualComparisons = 0;
      let manualWrites = 0;
      for (let i = 0; i < k; i++) {
        const s = steps[i];
        if (s.kind === 'compare') {
          manualComparisons++;
        } else if (s.kind === 'write' && s.writes) {
          manualWrites += s.writes.length;
        }
      }

      expect(state.stats.comparisons).toBe(manualComparisons);
      expect(state.stats.writes).toBe(manualWrites);
    }
  });
});
