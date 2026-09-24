import type { Algorithm, SortStep } from './types.ts';

const heapSort: Algorithm = {
  meta: {
    id: 'heap',
    name: 'Heap Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    stable: false,
    inPlace: true,
    summary:
      'Heap Sort visualizes the array as a binary tree. It first builds a max-heap, then repeatedly extracts the maximum element and restores the heap property.',
    invariant:
      'The array is partitioned into a max-heap at the left and a sorted sub-array at the right.',
  },
  run: function* (input) {
    const arr = [...input];
    const n = arr.length;
    if (n === 0) {
      yield { kind: 'done' };
      return;
    }

    function* siftDown(
      start: number,
      end: number,
    ): Generator<SortStep, void, undefined> {
      yield {
        kind: 'set-range',
        range: [0, end],
        note: `Restoring heap property on range indices 0 to ${end}`,
      };

      let root = start;
      while (root * 2 + 1 <= end) {
        const child = root * 2 + 1;
        let swapIdx = root;

        yield {
          kind: 'compare',
          compare: [swapIdx, child],
          note: `Comparing parent ${arr[swapIdx]} with left child ${arr[child]}`,
        };
        if (arr[swapIdx] < arr[child]) {
          swapIdx = child;
        }

        if (child + 1 <= end) {
          yield {
            kind: 'compare',
            compare: [swapIdx, child + 1],
            note: `Comparing current max ${arr[swapIdx]} with right child ${arr[child + 1]}`,
          };
          if (arr[swapIdx] < arr[child + 1]) {
            swapIdx = child + 1;
          }
        }

        if (swapIdx !== root) {
          const prevRoot = arr[root];
          const prevSwap = arr[swapIdx];
          arr[root] = prevSwap;
          arr[swapIdx] = prevRoot;

          yield {
            kind: 'write',
            writes: [
              { index: root, value: prevSwap, prev: prevRoot },
              { index: swapIdx, value: prevRoot, prev: prevSwap },
            ],
            note: `Swapping parent ${prevRoot} and child ${prevSwap}`,
          };
          root = swapIdx;
        } else {
          break;
        }
      }
    }

    // Phase 1: Build Max Heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* siftDown(i, n - 1);
    }

    // Phase 2: Heap Extraction
    for (let end = n - 1; end > 0; end--) {
      const prev0 = arr[0];
      const prevEnd = arr[end];
      arr[0] = prevEnd;
      arr[end] = prev0;

      yield {
        kind: 'write',
        writes: [
          { index: 0, value: prevEnd, prev: prev0 },
          { index: end, value: prev0, prev: prevEnd },
        ],
        note: `Swapping heap root ${prev0} with last element ${prevEnd}`,
      };

      yield {
        kind: 'mark-sorted',
        sorted: [end],
        note: `Index ${end} is now finalized`,
      };

      yield* siftDown(0, end - 1);
    }

    // Index 0 is now sorted
    yield {
      kind: 'mark-sorted',
      sorted: [0],
      note: 'Index 0 is finalized',
    };

    yield {
      kind: 'set-range',
      range: null,
    };
    yield { kind: 'done' };
  },
};

export default heapSort;
