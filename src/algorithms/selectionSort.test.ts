import { describe, test } from 'vitest';
import selectionSort from './selectionSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('selectionSort', () => {
  test('correctness', () => assertSortsCorrectly(selectionSort));
  test('reversibility', () => assertReversible(selectionSort));
  test('indices in bounds', () => assertIndicesInBounds(selectionSort));
  test('termination', () => assertTerminates(selectionSort));
});
