# Handoff 001 — Build Plan for `sort-visualizer`

**From:** Claude (planner)
**To:** `agy` (executor)
**Status:** ready to execute
**Prerequisites:** repo scaffolded, `npm install` done, `npm run build` green.

---

## How to use this document

Seven stages, in order. Each stage lists the files to create, the contract each
file must satisfy, and acceptance criteria that must pass before moving on.

Rules for every stage:

- Branch `agent/agy/<stage-slug>`, commit with conventional commits, merge to
  `main` when acceptance criteria pass.
- Run `npm run typecheck && npm run test && npm run build` before each commit.
- Read `CONVENTIONS.md` once before Stage 0. The three tsconfig traps listed
  there (`verbatimModuleSyntax`, `.ts` extensions in imports, no `enum`) will
  otherwise cost you your first build.
- Do not change `src/algorithms/types.ts` or `src/player/types.ts`. They are the
  contract. If one is genuinely wrong, stop and write a decision record.

---

## Stage 0 — Foundation

**Branch:** `agent/agy/stage-0-foundation`

### Files

**`src/index.css`** (overwrite the template's contents)
- `@import './styles/tokens.css';` at the top.
- CSS reset: `box-sizing: border-box` on everything, zero margins, `body`
  background `var(--bg)`, colour `var(--text)`, font `var(--font-ui)`.
- `:focus-visible` outline using `var(--bar-compare)` — keyboard users must be
  able to see where they are.

**`src/App.tsx`** (overwrite)
- Renders the static layout shell only. No logic yet.
- Structure:
  ```
  <main class="app">
    <header class="app__header">   title + one-line subtitle
    <section class="app__stage">   placeholder for BarChart
    <section class="app__controls">placeholder for ControlBar
    <aside class="app__panels">    placeholders for StatsPanel + ComplexityCard
  </main>
  ```

**`src/App.css`** (overwrite)
- Grid layout. The stage area must be the flexible one — it grows, the panels
  and controls do not.
- Minimum stage height `320px`, target `min(60vh, 520px)`.
- Below `900px` viewport width, panels stack under the stage.

**Delete:** `src/assets/` and its contents (unused template art). Remove the
`import` of them from `App.tsx`.

### Acceptance

- `npm run dev` shows the empty shell with the dark token palette applied.
- `npm run build` and `npm run typecheck` pass.
- No unused imports (`noUnusedLocals` will catch them).

---

## Stage 1 — Array generation and the player reducer

**Branch:** `agent/agy/stage-1-player`

This is the load-bearing stage. Get it right and the rest is presentation.

### Files

**`src/lib/generateArray.ts`**

```ts
export function generateArray(options: ArrayOptions): number[]
```

- Values in `[5, 100]` inclusive (they map directly to bar height percentages).
- Deterministic when `seed` is provided — implement a small mulberry32 PRNG
  inline; do not add a dependency.
- Distributions:
  - `random` — uniform.
  - `nearly-sorted` — sorted, then swap `ceil(n * 0.05)` random pairs.
  - `reversed` — descending.
  - `few-unique` — uniform draw from 5 distinct values. This is the case that
    exposes bad quicksort pivots, which is exactly why it is here.

**`src/player/playerReducer.ts`**

```ts
export const initialPlayerState: PlayerState
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState
```

Semantics, precisely:

- `cursor` is the index of the **next** step to apply. `cursor === 0` means
  nothing applied; `cursor === steps.length` means finished.
- `forward(count)`: apply `steps[cursor]`, `steps[cursor+1]`, … up to `count`
  steps or the end, whichever comes first. Applying a `write` step sets
  `array[w.index] = w.value` for each write, **in order**.
- `back(count)`: unapply `steps[cursor-1]`, `steps[cursor-2]`, … Unapplying a
  `write` step sets `array[w.index] = w.prev` for each write, **in reverse
  order**. This ordering matters when a single step writes the same index twice.
- `seek(cursor)`: walk forward or back from the current cursor to the target.
  Do not re-run from zero.
- Highlights (`comparing`, `writing`, `pivot`, `range`, `note`) reflect the last
  applied step only. After a `back`, they must reflect the step now at
  `cursor - 1`, or be cleared if `cursor === 0`.
- `sorted` is cumulative and **not** derivable from a single step. Recompute it
  by scanning `steps[0 … cursor)` for `mark-sorted` kinds. There are at most `n`
  of them, so this is cheap; do not try to make it incremental-with-undo.
- `stats.comparisons` = count of `compare` steps below the cursor.
  `stats.writes` = total number of `Write` records below the cursor.
- `status` becomes `'finished'` when `cursor === steps.length`.
- `reset` returns to `cursor: 0` with the original array restored.
- **The reducer must not mutate `state`.** Copy the array before writing to it.

**`src/player/usePlayer.ts`**

```ts
export function usePlayer(array: readonly number[], steps: readonly SortStep[]): {
  frame: FrameState;
  stats: SortStats;
  status: PlayerState['status'];
  speed: number;            // steps per second
  setSpeed: (n: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  seek: (cursor: number) => void;
  reset: () => void;
}
```

- `requestAnimationFrame` loop with a time accumulator, as described in
  `ARCHITECTURE.md`. Not `setInterval`.
- Speed range 1–500 steps/second. At the top end multiple steps are consumed per
  frame; the loop must handle that without dropping the `finished` transition.
- Changing speed mid-run must not restart or stutter the run.
- Cancel the rAF handle in the effect cleanup. A leaked loop after unmount or
  after an array change is the most likely bug in this stage.
- When `array` or `steps` identity changes, dispatch `load` and stop playback.

### Tests — `src/player/playerReducer.test.ts`

1. Applying every step forward produces the sorted array.
2. Applying all forward then all back returns the array to exactly the input,
   element by element.
3. `seek(k)` from any starting cursor produces the same state as `reset()` then
   `forward(k)`.
4. A step writing the same index twice unapplies correctly (construct this case
   by hand — no algorithm needs to produce it, but the reducer must survive it).
5. Counters match a manual count over the step list.

### Acceptance

- All reducer tests pass.
- `npm run typecheck && npm run test && npm run build` green.

---

## Stage 2 — The six algorithms

**Branch:** `agent/agy/stage-2-algorithms`

### Files

`src/algorithms/testUtils.ts` first, then one file per algorithm, then
`src/algorithms/index.ts`.

**`src/algorithms/testUtils.ts`**

```ts
export function runToCompletion(alg: Algorithm, input: readonly number[]): {
  steps: SortStep[]; final: number[];
}
export function assertSortsCorrectly(alg: Algorithm): void
export function assertReversible(alg: Algorithm): void
export function assertIndicesInBounds(alg: Algorithm): void
export function assertTerminates(alg: Algorithm): void
```

`assertSortsCorrectly` must cover: `[]`, `[7]`, `[2,1]`, random n=50,
reversed n=50, nearly-sorted n=50, few-unique n=50, all-equal n=20.

Each algorithm's test file is then four lines calling these. If a new algorithm
needs more than ~10 lines of test, the shared utils are missing something.

**The six algorithms.** Each default-exports an `Algorithm`. Step emission rules:

| Algorithm | Emit `compare` for | Emit `mark-sorted` when | Emit `set-range` / `set-pivot` |
| --- | --- | --- | --- |
| `bubbleSort` | every adjacent comparison | end of each pass: index `n-1-pass` | — |
| `selectionSort` | every candidate-vs-min comparison | after each placement: index `i` | `set-range` on the unsorted tail |
| `insertionSort` | every shift comparison | index `i` once placed (note: only truly final at the end — see below) | `set-range` on the sorted prefix |
| `mergeSort` | every merge comparison | after the final top-level merge, all indices | `set-range` on the sub-array being merged |
| `quickSort` | every element-vs-pivot comparison | the pivot's final index after each partition | `set-range` on the partition; `set-pivot` on the pivot index |
| `heapSort` | every parent-vs-child comparison | index `end` after each extract | `set-range` on the live heap |

Notes and traps:

- **Insertion sort's prefix is sorted but not final.** Do not mark it green — a
  later element can still shift into it. Use `set-range` to show the sorted
  prefix and only `mark-sorted` everything at the end. Getting this wrong is the
  single most common bug in sort visualizers and it teaches the wrong thing.
- **Merge sort** works out of place. Emit a `write` step for each write-back
  into the main array during the merge. The auxiliary buffer is not visualized;
  that is a deliberate scope decision, recorded in `AI_CONTEXT.md`.
- **Quick sort** — use Lomuto partition with the last element as pivot, and
  implement it **iteratively with an explicit stack**. Recursion is fine for
  correctness but an explicit stack makes the `set-range` steps trivially match
  what the user sees. Note in the meta that the `few-unique` distribution is the
  adversarial case.
- **Heap sort** — emit steps during `heapify` too, not just during extraction.
  The build-heap phase is half the algorithm and it is the interesting half.
- Swaps are one `write` step with two `Write` records, never two steps.
- Fill in real `AlgorithmMeta`: correct complexities, `stable` and `inPlace`
  flags, a two-sentence `summary`, and an `invariant` written in plain language
  ("after pass k, the largest k elements are in their final positions").

**`src/algorithms/index.ts`**

```ts
export const ALGORITHMS: Record<AlgorithmId, Algorithm>
export const ALGORITHM_LIST: readonly Algorithm[]  // display order
```

Display order: bubble, selection, insertion, merge, quick, heap — simple to
sophisticated, which is the order someone learning them wants.

### Acceptance

- Six test files, all green, all using the shared utils.
- Comparison counts are in the right ballpark: bubble on random n=100 is
  ~5000 comparisons; merge is ~550. If bubble is under 1000, comparisons are not
  being emitted honestly.

---

## Stage 3 — Bar rendering

**Branch:** `agent/agy/stage-3-bars`

### Files

**`src/components/BarChart.tsx` + `BarChart.css`**

```ts
interface BarChartProps { frame: FrameState; max: number; }
```

- One `<div class="bar">` per element, in a flex row, `align-items: flex-end`.
- Height: `${(value / max) * 100}%`. Width: `flex: 1` with a `gap` that shrinks
  to `0` above n=100 (`--bar-gap` set from a container class, not inline).
- **Key by index, not by value.** Values repeat in the `few-unique`
  distribution; keying by value produces duplicate-key warnings and wrong
  reconciliation.
- Colour precedence, evaluated top down, exactly one class applied:
  `writing → comparing → pivot → sorted → in-range → out-of-range`.
- `transition: height var(--bar-transition) linear` — nothing longer. The pacing
  belongs to the player; CSS easing on top of it makes fast speeds look mushy.
- The chart element gets `role="img"` and an `aria-label` summarizing state
  (e.g. `"120 bars, 47 sorted"`), so a screen reader gets something meaningful
  rather than 120 empty divs.

**`src/components/Bar.tsx`** — only if profiling shows it is needed. Otherwise
render bars inline in `BarChart` and skip the extra component; 200 memoized
components cost more than they save.

### Acceptance

- Hard-code a `FrameState` in a story/scratch render and confirm every colour
  state is reachable and visually distinct.
- No React key warnings at n=200 with the `few-unique` distribution.

---

## Stage 4 — Controls and wiring

**Branch:** `agent/agy/stage-4-controls`

### Files

**`src/components/ControlBar.tsx` + `.css`**

Controls, left to right:
- Play / Pause (one button, label and icon swap)
- Step back, Step forward
- Reset
- Speed slider, 1–500 steps/s, logarithmic feel (map slider position through
  `x => Math.round(Math.pow(x, 2.2))` so the low end is usable)
- Timeline slider, `0 … steps.length`, showing `cursor / total`

All buttons disabled appropriately: step-back at cursor 0, step-forward and play
at the end.

**`src/components/AlgorithmPicker.tsx` + `.css`**
- Radio group (not a `<select>`) so all six are visible and comparable.
- Each option shows name and worst-case complexity.

**`src/components/ArrayControls.tsx` + `.css`**
- Size slider, 10–200.
- Distribution radio group.
- "Shuffle" button — regenerates with a new seed.

**`src/App.tsx`** — wire it together:

```tsx
const [array, setArray] = useState(() => generateArray({ size: 60, distribution: 'random' }));
const [algorithmId, setAlgorithmId] = useState<AlgorithmId>('bubble');
const steps = useMemo(
  () => [...ALGORITHMS[algorithmId].run(array)],
  [array, algorithmId],
);
const player = usePlayer(array, steps);
```

That `useMemo` is not optional. Regenerating steps inside a playback render is
the difference between smooth and unusable.

### Keyboard

- `Space` toggles play/pause
- `←` / `→` step back / forward
- `Shift + ←` / `Shift + →` step 10
- `R` reset
- Bind on `window` via an effect, and **ignore the event when the target is an
  input or slider** — otherwise arrow keys fight the speed slider.

### Acceptance

- Play a full bubble sort at n=60 and watch it finish and stop cleanly.
- Change speed mid-run: no stutter, no restart.
- Scrub the timeline backward mid-run: bars and highlights follow correctly.
- Switch algorithm mid-run: player resets, no stale highlights, no leaked rAF
  loop (check with a `console.count` in the loop during development, then remove
  it).

---

## Stage 5 — Stats, complexity, narration

**Branch:** `agent/agy/stage-5-panels`

**`src/components/StatsPanel.tsx`** — live comparisons, writes, step `k / n`,
and elapsed steps-per-second. Use `font-variant-numeric: tabular-nums` so the
numbers stop jittering.

**`src/components/ComplexityCard.tsx`** — the selected algorithm's best/average/
worst/space, stable and in-place flags, summary, and invariant. This is the panel
that turns the animation into a lesson; give it room.

**`src/components/Narration.tsx`** — a single line describing the current step,
from `step.note` with a sensible fallback per kind ("comparing 14 and 15",
"placing 91 at index 3"). Give it `aria-live="polite"` and a fixed height so it
does not reflow the layout every frame.

### Acceptance

- Counters match a manual count on a small hand-checked array.
- Switching algorithms updates the complexity card immediately.

---

## Stage 6 — Accessibility, polish, docs

**Branch:** `agent/agy/stage-6-polish`

- Every control labelled; sliders have `aria-valuetext` in human units
  ("120 steps per second", not "34").
- Tab order follows visual order.
- Verify `prefers-reduced-motion` actually disables the bar transition.
- Check colour contrast of the six bar states against `--bg` — the compare
  yellow and the pivot purple are the two most likely to fail.
- Empty and single-element arrays render without crashing.
- n=200 at 500 steps/s stays responsive.
- README screenshot or short GIF.
- Follow the write-after-work protocol in `AGENTS.md`.

### Acceptance (project done)

Everything in the "Definition of Done" section of `AGENTS.md`.

---

## Out of scope until every stage is green

Listed so they are not forgotten, and not started early:

- Side-by-side algorithm race view
- Audio (pitch mapped to value)
- Shareable URL state
- Additional algorithms (shell, counting, radix — radix needs a bucket visual,
  which is a different rendering model and a separate handoff)
- Step export / GIF recording

If you finish early, improve the tests rather than starting one of these.
