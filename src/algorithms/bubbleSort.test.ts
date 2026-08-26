import { describe, test } from 'vitest';
import bubbleSort from './bubbleSort.ts';
import {
  assertSortsCorrectly,
  assertReversible,
  assertIndicesInBounds,
  assertTerminates,
} from './testUtils.ts';

describe('bubbleSort', () => {
  test('correctness', () => assertSortsCorrectly(bubbleSort));
  test('reversibility', () => assertReversible(bubbleSort));
  test('indices in bounds', () => assertIndicesInBounds(bubbleSort));
  test('termination', () => assertTerminates(bubbleSort));
});
