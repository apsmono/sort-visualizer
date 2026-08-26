import type { Algorithm } from './types.ts';

const bubbleSort: Algorithm = {
  meta: {
    id: 'bubble',
    name: 'Bubble Sort',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
    },
    stable: true,
    inPlace: true,
    summary:
      'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This pass is repeated until the list is sorted.',
    invariant:
      'After pass k, the largest k elements are in their final positions.',
  },
  run: function* (input) {
    const arr = [...input];
    const n = arr.length;
    if (n === 0) {
      yield { kind: 'done' };
      return;
    }

    for (let pass = 0; pass < n; pass++) {
      let swapped = false;
      for (let i = 0; i < n - 1 - pass; i++) {
        yield {
          kind: 'compare',
          compare: [i, i + 1],
          note: `Comparing elements ${arr[i]} and ${arr[i + 1]}`,
        };
        if (arr[i] > arr[i + 1]) {
          const prevI = arr[i];
          const prevI1 = arr[i + 1];
          arr[i] = prevI1;
          arr[i + 1] = prevI;
          yield {
            kind: 'write',
            writes: [
              { index: i, value: prevI1, prev: prevI },
              { index: i + 1, value: prevI, prev: prevI1 },
            ],
            note: `Swapping ${prevI} and ${prevI1}`,
          };
          swapped = true;
        }
      }
      const finalizedIndex = n - 1 - pass;
      yield {
        kind: 'mark-sorted',
        sorted: [finalizedIndex],
        note: `Element at index ${finalizedIndex} is finalized`,
      };

      if (!swapped) {
        const remaining: number[] = [];
        for (let j = 0; j < finalizedIndex; j++) {
          remaining.push(j);
        }
        if (remaining.length > 0) {
          yield {
            kind: 'mark-sorted',
            sorted: remaining,
            note: 'No swaps made: remaining elements are sorted',
          };
        }
        break;
      }
    }

    yield { kind: 'done' };
  },
};

export default bubbleSort;
