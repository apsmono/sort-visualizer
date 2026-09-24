import type { ArrayOptions } from './types.ts';

export function generateArray(options: ArrayOptions): number[] {
  const { size, distribution, seed } = options;

  let rand: () => number;
  if (seed !== undefined) {
    let s = seed;
    rand = () => {
      let t = (s += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  } else {
    rand = Math.random;
  }

  const arr: number[] = [];

  if (distribution === 'few-unique') {
    const pool = [20, 40, 60, 80, 100];
    for (let i = 0; i < size; i++) {
      const idx = Math.floor(rand() * pool.length);
      arr.push(pool[idx]);
    }
  } else {
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(rand() * 96) + 5); // values in [5, 100]
    }

    if (distribution === 'nearly-sorted') {
      arr.sort((a, b) => a - b);
      const swapCount = Math.ceil(size * 0.05);
      for (let k = 0; k < swapCount; k++) {
        const i = Math.floor(rand() * size);
        const j = Math.floor(rand() * size);
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    } else if (distribution === 'reversed') {
      arr.sort((a, b) => b - a);
    }
  }

  return arr;
}
