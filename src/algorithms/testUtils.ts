import { expect } from 'vitest';
import type { Algorithm, SortStep } from './types.ts';
import { generateArray } from '../lib/generateArray.ts';

export function runToCompletion(
  alg: Algorithm,
  input: readonly number[],
): {
  steps: SortStep[];
  final: number[];
} {
  const steps: SortStep[] = [];
  const arr = [...input];
  const gen = alg.run(input);

  for (const step of gen) {
    steps.push(step);
    if (step.kind === 'write' && step.writes) {
      for (const w of step.writes) {
        arr[w.index] = w.value;
      }
    }
  }

  return { steps, final: arr };
}

export function assertSortsCorrectly(alg: Algorithm): void {
  const testCases = [
    [],
    [7],
    [2, 1],
    generateArray({ size: 50, distribution: 'random', seed: 42 }),
    generateArray({ size: 50, distribution: 'reversed', seed: 42 }),
    generateArray({ size: 50, distribution: 'nearly-sorted', seed: 42 }),
    generateArray({ size: 50, distribution: 'few-unique', seed: 42 }),
    Array(20).fill(5),
  ];

  for (const input of testCases) {
    const expected = [...input].sort((a, b) => a - b);
    const { final } = runToCompletion(alg, input);
    expect(final).toEqual(expected);
  }
}

export function assertReversible(alg: Algorithm): void {
  const input = generateArray({ size: 30, distribution: 'random', seed: 123 });
  const { steps } = runToCompletion(alg, input);

  const arr = [...input];
  // Apply forward
  for (const step of steps) {
    if (step.kind === 'write' && step.writes) {
      for (const w of step.writes) {
        arr[w.index] = w.value;
      }
    }
  }

  // Apply backward in reverse order
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    if (step.kind === 'write' && step.writes) {
      for (let j = step.writes.length - 1; j >= 0; j--) {
        const w = step.writes[j];
        arr[w.index] = w.prev;
      }
    }
  }

  expect(arr).toEqual(input);
}

export function assertIndicesInBounds(alg: Algorithm): void {
  const input = generateArray({ size: 40, distribution: 'random', seed: 999 });
  const n = input.length;
  const { steps } = runToCompletion(alg, input);

  for (const step of steps) {
    if (step.compare) {
      const [i, j] = step.compare;
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(n);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThan(n);
    }
    if (step.writes) {
      for (const w of step.writes) {
        expect(w.index).toBeGreaterThanOrEqual(0);
        expect(w.index).toBeLessThan(n);
      }
    }
    if (step.sorted) {
      for (const idx of step.sorted) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(n);
      }
    }
    if (step.pivot !== undefined && step.pivot !== null) {
      expect(step.pivot).toBeGreaterThanOrEqual(0);
      expect(step.pivot).toBeLessThan(n);
    }
    if (step.range) {
      const [lo, hi] = step.range;
      expect(lo).toBeGreaterThanOrEqual(0);
      expect(lo).toBeLessThan(n);
      expect(hi).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThan(n);
      expect(lo).toBeLessThanOrEqual(hi);
    }
  }
}

export function assertTerminates(alg: Algorithm): void {
  const input = [4, 2, 5, 1, 3];
  const { steps } = runToCompletion(alg, input);

  expect(steps.length).toBeGreaterThan(0);
  const lastStep = steps[steps.length - 1];
  expect(lastStep.kind).toBe('done');

  // Check that no other step is 'done'
  for (let i = 0; i < steps.length - 1; i++) {
    expect(steps[i].kind).not.toBe('done');
  }
}
