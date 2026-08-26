import type { Algorithm } from './types.ts';

const quickSort: Algorithm = {
  meta: {
    id: 'quick',
    name: 'Quick Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    stable: false,
    inPlace: true,
    summary:
      'Quick Sort is a divide-and-conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot by placing it in its final correct position.',
    invariant:
      'Pivots are in their final positions; elements to their left are smaller, and elements to their right are larger.',
  },
  run: function* (input) {
    const arr = [...input];
    const n = arr.length;
    if (n === 0) {
      yield { kind: 'done' };
      return;
    }

    const stack: [number, number][] = [[0, n - 1]];

    while (stack.length > 0) {
      const [lo, hi] = stack.pop()!;
      if (lo > hi) continue;

      if (lo === hi) {
        yield {
          kind: 'mark-sorted',
          sorted: [lo],
          note: `Single element at index ${lo} is finalized`,
        };
        continue;
      }

      yield {
        kind: 'set-range',
        range: [lo, hi],
        note: `Focusing on partition range indices ${lo} to ${hi}`,
      };

      const pivotVal = arr[hi];
      yield {
        kind: 'set-pivot',
        pivot: hi,
        note: `Choosing pivot ${pivotVal} at index ${hi}`,
      };

      let i = lo - 1;

      for (let j = lo; j < hi; j++) {
        yield {
          kind: 'compare',
          compare: [j, hi],
          note: `Comparing element ${arr[j]} with pivot ${pivotVal}`,
        };
        if (arr[j] < pivotVal) {
          i++;
          if (i !== j) {
            const prevI = arr[i];
            const prevJ = arr[j];
            arr[i] = prevJ;
            arr[j] = prevI;
            yield {
              kind: 'write',
              writes: [
                { index: i, value: prevJ, prev: prevI },
                { index: j, value: prevI, prev: prevJ },
              ],
              note: `Swapping ${prevJ} and ${prevI}`,
            };
          }
        }
      }

      const p = i + 1;
      if (p !== hi) {
        const prevP = arr[p];
        const prevHi = arr[hi];
        arr[p] = prevHi;
        arr[hi] = prevP;
        yield {
          kind: 'write',
          writes: [
            { index: p, value: prevHi, prev: prevP },
            { index: hi, value: prevP, prev: prevHi },
          ],
          note: `Placing pivot ${prevHi} at index ${p}`,
        };
      }

      yield {
        kind: 'mark-sorted',
        sorted: [p],
        note: `Pivot index ${p} is now in its final correct position`,
      };

      yield {
        kind: 'set-pivot',
        pivot: null,
      };

      // Push right, then left to process left first (DFS left-to-right order)
      stack.push([p + 1, hi]);
      stack.push([lo, p - 1]);
    }

    yield {
      kind: 'set-range',
      range: null,
    };
    yield { kind: 'done' };
  },
};

export default quickSort;
