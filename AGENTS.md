# AGENTS.md

## Purpose

`sort-visualizer` is a React + TypeScript teaching tool: it animates six classic
sorting algorithms transforming a jagged row of bars into an ordered one, with
full forward/backward stepping and a scrubbable timeline.

## Current State

The repository is scaffolded and fully specified but **not yet implemented**.
Vite + React 19 + TypeScript are installed and `npm run build` passes on the
empty template. The type contracts in `src/algorithms/types.ts`,
`src/player/types.ts` and `src/lib/types.ts` are authored and are the source of
truth — build to them.

The build is staged in `.agents/handoff/001-build-plan.md`. Work the stages in
order; each has explicit acceptance criteria.

## Read Before Starting

1. `README.md` — what this is
2. `ARCHITECTURE.md` — the step/frame model and why it is invertible
3. `CONVENTIONS.md` — TS/React/CSS rules, including the `verbatimModuleSyntax`
   trap that will otherwise break your first build
4. `AI_CONTEXT.md` — which stage is active
5. `.agents/handoff/001-build-plan.md` — the actual work

## Agent Rules

- **Do not redesign the step model.** `SortStep` carries reversible `Write`
  records and no array snapshots. If you think you need a snapshot, re-read the
  "Why steps carry `prev`" section of `ARCHITECTURE.md` first, and if you still
  think so, write a decision record and ask before changing it.
- Respect the layer boundaries: `algorithms/` imports nothing from `player/` or
  `components/`; `player/` imports nothing from `components/`.
- Prefer small explicit edits over broad speculative scaffolding.
- Do not add dependencies without recording why in `docs/decisions/`. The app is
  intended to ship with zero runtime dependencies beyond React.
- Do not invent extra features (sound, 3D, algorithm racing, export to GIF)
  before every stage in the handoff is green. Stretch ideas are listed at the
  bottom of the build plan and are explicitly out of scope until then.
- Run `npm run typecheck && npm run test && npm run build` before every commit.
- Never commit secrets. There are none in this project and there should stay none.

## Write-After-Work Protocol

The owner works across devices and AI tools. Context never carries over. Before
you finish a session:

1. Update `CHANGELOG.md` with what changed. Timestamp via
   `date "+%Y-%m-%d %H-%M-%S"`.
2. Update `AI_CONTEXT.md` if the active stage or priorities moved.
3. Append to `docs/ai-working-notes.md` any pattern, bug, or gotcha you hit —
   append or amend, never overwrite.
4. Write `docs/decisions/NNN-slug.md` for any significant architectural choice.

When you finish, the next agent should be able to read the docs and know exactly
where to continue without re-exploring the code.

## Definition of Done (whole project)

- All six algorithms implemented, registered, and passing the shared test suite.
- Play, pause, step forward, step back, scrub, and speed control all work while
  the animation is running.
- Changing algorithm or regenerating the array resets cleanly with no stale
  highlights.
- `npm run typecheck`, `npm run test`, `npm run lint`, `npm run build` all pass.
- Keyboard accessible: space toggles play, arrow keys step, all controls
  reachable by tab and labelled.
- No console errors or React key warnings at n = 200.
