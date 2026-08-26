# sort-visualizer

An interactive visualizer that shows six classic sorting algorithms turning a
jagged line of bars into an ordered one — step by step, forward or backward,
at any speed.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run test       # vitest
npm run lint       # oxlint
```

## What it does

- Renders an array as a row of bars whose heights encode their values.
- Runs one of six algorithms (bubble, selection, insertion, merge, quick, heap)
  as a stream of discrete steps.
- Colours each bar by its role in the current step: comparing, being written,
  pivot, finalized, or outside the active sub-range.
- Lets you play, pause, step one operation at a time in **either direction**,
  scrub the whole timeline, and change speed while running.
- Shows live comparison/write counters next to the algorithm's Big-O card, so
  the theory and the observed cost sit side by side.

## The one idea that makes it work

Algorithms do not draw anything and do not know time exists. Each is a pure
generator that yields `SortStep` records. The player layer folds those steps
into a `FrameState`, and React renders the frame.

Because every mutating step carries both the new value and the previous value,
the fold is **invertible**. Stepping backward is not a re-run from the start —
it is the same reducer applying the inverse. That is what makes scrubbing cheap
and instant, and it keeps memory at O(1) per step instead of storing an array
snapshot per frame.

## Docs

| File | What it covers |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Layers, data flow, the step/frame model |
| [CONVENTIONS.md](CONVENTIONS.md) | Code style, git workflow, testing rules |
| [AGENTS.md](AGENTS.md) | Rules for AI agents working in this repo |
| [CLAUDE.md](CLAUDE.md) | Entry point for AI assistants |
| [AI_CONTEXT.md](AI_CONTEXT.md) | Current phase and active priorities |
| [.agents/handoff/](.agents/handoff/) | Staged build specs for the executor |

## Status

Scaffold + specification complete. Implementation is staged in
`.agents/handoff/001-build-plan.md` and is being executed by `agy`.
