import { describe, test } from 'vitest';
import heapSort from './heapSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('heapSort', () => {
  test('correctness', () => assertSortsCorrectly(heapSort));
  test('reversibility', () => assertReversible(heapSort));
  test('indices in bounds', () => assertIndicesInBounds(heapSort));
  test('termination', () => assertTerminates(heapSort));
});
