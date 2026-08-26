# AI_CONTEXT

> Source of truth for "where are we". Update this whenever a stage completes.

## Current Phase

**Phase 1 — Implementation.** Scaffold and specification are complete; no
feature code has been written yet.

## Active Stage

**Stage 0 — Foundation** (see `.agents/handoff/001-build-plan.md`)

## Stage Status

| Stage | Name | Status |
| --- | --- | --- |
| 0 | Foundation: tokens, globals, app shell | not started |
| 1 | Array generation + player reducer + tests | not started |
| 2 | Six algorithms + shared test suite | not started |
| 3 | Bar rendering | not started |
| 4 | Playback controls + wiring | not started |
| 5 | Stats, complexity card, narration | not started |
| 6 | Accessibility, polish, docs | not started |

## Completed

- Repo scaffolded: Vite + React 19 + TypeScript, vitest, prettier, oxlint.
- `npm run build` verified green on the template.
- Type contracts authored: `src/algorithms/types.ts`, `src/player/types.ts`,
  `src/lib/types.ts`.
- Design tokens authored: `src/styles/tokens.css`.
- Docs authored: README, ARCHITECTURE, CONVENTIONS, AGENTS, CLAUDE, this file.
- Build plan authored: `.agents/handoff/001-build-plan.md`.

## Source-of-Truth Index

| Question | File |
| --- | --- |
| What shape is a step? | `src/algorithms/types.ts` |
| What does the renderer receive? | `src/player/types.ts` |
| Why is the reducer invertible? | `ARCHITECTURE.md` |
| What am I allowed to change? | `AGENTS.md` |
| What do I build next? | `.agents/handoff/001-build-plan.md` |

## Known Open Questions

- Should the timeline slider seek by walking the cursor (current plan) or by
  replaying from zero to a keyframe? Walking is specified; revisit only if
  scrubbing across a 20k-step run feels slow in practice.
- Merge sort's auxiliary buffer is not visualized in the current spec — the
  write-back into the main array is. If that reads as confusing during Stage 5,
  raise it rather than silently changing the step model.
