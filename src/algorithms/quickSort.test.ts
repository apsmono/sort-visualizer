import { describe, test } from 'vitest';
import quickSort from './quickSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('quickSort', () => {
  test('correctness', () => assertSortsCorrectly(quickSort));
  test('reversibility', () => assertReversible(quickSort));
  test('indices in bounds', () => assertIndicesInBounds(quickSort));
  test('termination', () => assertTerminates(quickSort));
});
