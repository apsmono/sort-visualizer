import type { AlgorithmId, Algorithm } from './types.ts';
import bubbleSort from './bubbleSort.ts';
import selectionSort from './selectionSort.ts';
import insertionSort from './insertionSort.ts';
import mergeSort from './mergeSort.ts';
import quickSort from './quickSort.ts';
import heapSort from './heapSort.ts';

export const ALGORITHMS: Record<AlgorithmId, Algorithm> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

export const ALGORITHM_LIST: readonly Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
];
