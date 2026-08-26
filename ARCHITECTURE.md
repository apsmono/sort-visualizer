# ARCHITECTURE

## Layer diagram

```
┌──────────────────────────────────────────────────────────┐
│ components/           React. Dumb. Props in, pixels out. │
│   BarChart, ControlBar, StatsPanel, ComplexityCard       │
└───────────────▲──────────────────────────────────────────┘
                │ FrameState (what to draw right now)
┌───────────────┴──────────────────────────────────────────┐
│ player/               Time, playback, scrubbing.          │
│   playerReducer.ts    fold + unfold steps → FrameState    │
│   usePlayer.ts        requestAnimationFrame driver        │
└───────────────▲──────────────────────────────────────────┘
                │ SortStep[]
┌───────────────┴──────────────────────────────────────────┐
│ algorithms/           Pure generators. No React, no DOM,  │
│   bubble … heap       no timers, no module state.         │
└──────────────────────────────────────────────────────────┘
```

Dependencies point **upward only**. `algorithms/` must not import from
`player/` or `components/`. `player/` must not import from `components/`.

## The step model

An algorithm is a generator that yields `SortStep` values. A step describes an
event, not a state:

```ts
{ kind: 'compare', compare: [3, 4] }
{ kind: 'write', writes: [
    { index: 3, value: 91, prev: 12 },
    { index: 4, value: 12, prev: 91 },
  ] }
{ kind: 'mark-sorted', sorted: [9] }
{ kind: 'done' }
```

### Why steps carry `prev`

The obvious design is to snapshot the array on every step. It is also the wrong
one: bubble sort on 150 elements emits ~11k steps, and 11k × 150 numbers is a
lot of garbage to hold so the user can drag a slider.

Instead every write records the value it replaced. That makes the reducer
invertible:

```
apply(step)   → for each write, array[w.index] = w.value
unapply(step) → for each write in reverse, array[w.index] = w.prev
```

Stepping backward is the same cost as stepping forward. Scrubbing to an
arbitrary position is a walk from the current cursor, not a re-run from zero.
Memory is O(steps) in small event records, not O(steps × n) in arrays.

The one thing this costs: **the cumulative sorted set is not invertible from a
single step** (a `mark-sorted` step tells you what was added, not what the set
looked like before). The reducer therefore recomputes `sorted` by replaying the
`mark-sorted` steps below the cursor. That is cheap because those steps are rare
— at most `n` of them across an entire run.

## The player

`usePlayer` runs a `requestAnimationFrame` loop with a time accumulator:

```
elapsed  += dt
stepsDue  = floor(elapsed * stepsPerSecond)
```

Not `setInterval`. At high speeds several steps are consumed per frame; at low
speeds frames pass with nothing consumed. Speed changes take effect on the next
frame without restarting the run.

The loop is a `useRef`-held rAF handle. React state updates once per frame with
the resulting `FrameState`.

## Rendering

Bars are DOM elements, not canvas. At n ≤ 200 React handles the reconciliation
comfortably, and DOM keeps the thing inspectable, stylable and accessible.

Each bar's height is a percentage of the maximum value. Its colour is decided by
a single precedence chain, evaluated top to bottom:

```
writing  →  comparing  →  pivot  →  sorted  →  in-range  →  out-of-range
```

Only one class wins. Do not stack state classes — the whole point is that a
glance at a bar tells you exactly one thing.

## State ownership

| State | Lives in | Why |
| --- | --- | --- |
| Source array, distribution, size | `App` | Regenerating it restarts everything |
| Selected algorithm | `App` | Same |
| Precomputed `steps` | `App`, memoized on (array, algorithm) | Generating is cheap and must not happen per frame |
| Cursor, live array, highlights, stats | `usePlayer` | Changes every frame |
| Speed, play/pause | `usePlayer` | Playback concerns |

Changing the array or algorithm resets the player. Changing speed does not.
