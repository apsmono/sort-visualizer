import type { Algorithm } from './types.ts';

const insertionSort: Algorithm = {
  meta: {
    id: 'insertion',
    name: 'Insertion Sort',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: true,
    inPlace: true,
    summary:
      'Insertion Sort builds the final sorted array one item at a time. It takes each element from the unsorted part and inserts it into its correct position within the already sorted prefix.',
    invariant: 'After pass k, the prefix of size k + 1 is sorted.',
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
        range: [0, i],
        note: `Focusing on sorted prefix (indices 0 to ${i})`,
      };

      let j = i;
      while (j > 0) {
        yield {
          kind: 'compare',
          compare: [j - 1, j],
          note: `Comparing elements ${arr[j - 1]} and ${arr[j]}`,
        };
        if (arr[j] < arr[j - 1]) {
          const prevJ = arr[j];
          const prevJ1 = arr[j - 1];
          arr[j] = prevJ1;
          arr[j - 1] = prevJ;
          yield {
            kind: 'write',
            writes: [
              { index: j - 1, value: prevJ, prev: prevJ1 },
              { index: j, value: prevJ1, prev: prevJ },
            ],
            note: `Shifting element ${prevJ} back to index ${j - 1}`,
          };
          j--;
        } else {
          break;
        }
      }
    }

    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    yield {
      kind: 'mark-sorted',
      sorted: allIndices,
      note: 'All elements are now in final sorted positions',
    };

    yield {
      kind: 'set-range',
      range: null,
    };
    yield { kind: 'done' };
  },
};

export default insertionSort;
