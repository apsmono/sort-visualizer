import { describe, test } from 'vitest';
import insertionSort from './insertionSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('insertionSort', () => {
  test('correctness', () => assertSortsCorrectly(insertionSort));
  test('reversibility', () => assertReversible(insertionSort));
  test('indices in bounds', () => assertIndicesInBounds(insertionSort));
  test('termination', () => assertTerminates(insertionSort));
});
