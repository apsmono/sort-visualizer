import type { Algorithm, SortStep } from './types.ts';

const mergeSort: Algorithm = {
  meta: {
    id: 'merge',
    name: 'Merge Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    stable: true,
    inPlace: false,
    summary:
      'Merge Sort is a divide-and-conquer algorithm. It recursively divides the array into halves, sorts each half, and then merges the sorted halves back together.',
    invariant: 'After merging sub-arrays, each merged segment is internally sorted.',
  },
  run: function* (input) {
    const arr = [...input];
    const n = arr.length;
    if (n === 0) {
      yield { kind: 'done' };
      return;
    }

    function* merge(
      lo: number,
      mid: number,
      hi: number,
    ): Generator<SortStep, void, undefined> {
      yield {
        kind: 'set-range',
        range: [lo, hi],
        note: `Merging sub-arrays (indices ${lo}-${mid} and ${mid + 1}-${hi})`,
      };

      const temp: number[] = [];
      let i = lo;
      let j = mid + 1;

      while (i <= mid && j <= hi) {
        yield {
          kind: 'compare',
          compare: [i, j],
          note: `Comparing elements ${arr[i]} and ${arr[j]}`,
        };
        if (arr[i] <= arr[j]) {
          temp.push(arr[i]);
          i++;
        } else {
          temp.push(arr[j]);
          j++;
        }
      }

      while (i <= mid) {
        temp.push(arr[i]);
        i++;
      }
      while (j <= hi) {
        temp.push(arr[j]);
        j++;
      }

      for (let k = 0; k < temp.length; k++) {
        const idx = lo + k;
        const prev = arr[idx];
        const value = temp[k];
        arr[idx] = value;
        yield {
          kind: 'write',
          writes: [{ index: idx, value, prev }],
          note: `Writing ${value} back to index ${idx}`,
        };
      }
    }

    function* sort(lo: number, hi: number): Generator<SortStep, void, undefined> {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      yield* sort(lo, mid);
      yield* sort(mid + 1, hi);
      yield* merge(lo, mid, hi);
    }

    yield* sort(0, n - 1);

    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    yield {
      kind: 'mark-sorted',
      sorted: allIndices,
      note: 'Array is fully sorted!',
    };

    yield {
      kind: 'set-range',
      range: null,
    };
    yield { kind: 'done' };
  },
};

export default mergeSort;
