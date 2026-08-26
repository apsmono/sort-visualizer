import { describe, test } from 'vitest';
import mergeSort from './mergeSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('mergeSort', () => {
  test('correctness', () => assertSortsCorrectly(mergeSort));
  test('reversibility', () => assertReversible(mergeSort));
  test('indices in bounds', () => assertIndicesInBounds(mergeSort));
  test('termination', () => assertTerminates(mergeSort));
});
