import type { Algorithm } from './types.ts';

const selectionSort: Algorithm = {
  meta: {
    id: 'selection',
    name: 'Selection Sort',
    complexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: false,
    inPlace: true,
    summary:
      'Selection Sort divides the input list into two parts: a sorted sublist at the left and an unsorted sublist at the right. It repeatedly finds the smallest element from the unsorted sublist and swaps it with the leftmost unsorted element.',
    invariant:
      'After pass k, the smallest k elements are in their final positions.',
  },
  run: function* (input) {
    const arr = [...input];
    const n = arr.length;
    if (n === 0) {
      yield { kind: 'done' };
      return;
    }

    for (let i = 0; i < n; i++) {
      yield {
        kind: 'set-range',
        range: [i, n - 1],
        note: `Focusing on unsorted tail (indices ${i} to ${n - 1})`,
      };

      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        yield {
          kind: 'compare',
          compare: [minIdx, j],
          note: `Comparing current min (${arr[minIdx]}) with element (${arr[j]})`,
        };
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        const prevI = arr[i];
        const prevMin = arr[minIdx];
        arr[i] = prevMin;
        arr[minIdx] = prevI;
        yield {
          kind: 'write',
          writes: [
            { index: i, value: prevMin, prev: prevI },
            { index: minIdx, value: prevI, prev: prevMin },
          ],
          note: `Swapping minimum element ${prevMin} into index ${i}`,
        };
      }

      yield {
        kind: 'mark-sorted',
        sorted: [i],
        note: `Index ${i} is now finalized`,
      };
    }

    yield {
      kind: 'set-range',
      range: null,
    };
    yield { kind: 'done' };
  },
};

export default selectionSort;
