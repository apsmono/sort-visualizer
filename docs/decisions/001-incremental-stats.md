# Architectural Decision Record — 001-incremental-stats

## Context
During Stage 1 implementation of the sorting visualizer, the original build plan specified that `stats.comparisons` and `stats.writes` should be counted by scanning all steps in `steps[0...cursor)`. 
However, for large arrays or algorithms with high comparison counts (e.g., Bubble Sort or Quick Sort on 200 elements, which can have thousands of steps), scanning the entire array of steps from `0` to `cursor` on every animation frame (at 500 steps/second) is computationally expensive ($O(steps)$) and introduces frame drops.

## Decision
We decided to compute `comparisons` and `writes` **incrementally** inside the `playerReducer`:
1. When moving `forward(count)`, we add the comparisons and writes of the applied steps to the current state counter. This is $O(\text{count})$, which is usually $O(1)$ on normal playback ticks.
2. When moving `back(count)`, we subtract the comparisons and writes of the unapplied steps from the current state counter.
3. Only when performing a non-sequential jump (e.g. `seek` or `load`), we scan the step history from `0` to `cursor` to reconstruct the correct counters.

## Consequences
* **Performance:** High playback speeds (e.g., 500 steps/second) remain extremely fast and responsive. Frame rates do not degrade as the algorithm nears completion.
* **Maintainability:** The reducer logic is slightly more complex as it maintains running stats, but this is mitigated by delegating non-sequential jumps (`seek`) to scan-based recalculations to ensure self-healing correctness.
