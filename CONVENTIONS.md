# CONVENTIONS

## TypeScript

- `verbatimModuleSyntax` is **on**. Type-only imports must use `import type`:
  ```ts
  import type { SortStep } from '../algorithms/types.ts';
  ```
  A plain `import { SortStep }` will fail the build.
- `allowImportingTsExtensions` is on — include the `.ts` / `.tsx` extension in
  relative imports.
- `noUnusedLocals` and `noUnusedParameters` are on. Prefix intentionally unused
  parameters with `_`.
- `erasableSyntaxOnly` is on: no `enum`, no parameter properties, no namespaces.
  Use `const` objects with `as const` and a derived union type instead.
- No `any`. If a type is genuinely unknown use `unknown` and narrow it.
- Prefer `readonly` on every shape that crosses a layer boundary.

## React

- Function components only. No class components.
- Components in `components/` are presentational: they take props and render.
  No data fetching, no timers, no direct player access.
- One component per file, named the same as the file.
- Hooks live in the layer that owns the state (`player/`), not in `components/`.
- Memoize the step array with `useMemo` keyed on `(array, algorithmId)`. Never
  regenerate steps inside a render triggered by playback.

## CSS

- Plain CSS, colocated `.css` file per component, imported by that component.
- Every colour, spacing value, radius and duration comes from
  `src/styles/tokens.css`. No hard-coded hex values in component CSS.
- Class names are `component-name__element--modifier`.
- Respect `prefers-reduced-motion` — the tokens file already zeroes the bar
  transition; do not add transitions that bypass it.

## Algorithms

- One file per algorithm, default-exporting an `Algorithm` object.
- Never mutate the `input` argument. Copy it first: `const a = [...input]`.
- Yield a `compare` step for every comparison the algorithm actually performs.
  The comparison counter has to be honest — it is teaching material.
- Yield a single `write` step containing both writes for a swap, not two steps.
- Yield `mark-sorted` the moment an index is provably final, not at the end.
- Yield exactly one `done` step, last.
- Register the algorithm in `src/algorithms/index.ts`.

## Testing

Every algorithm gets, at minimum:

1. **Correctness** — replaying all writes yields `[...input].sort((a, b) => a - b)`,
   for random, reversed, nearly-sorted, few-unique, empty, and single-element input.
2. **Reversibility** — applying every step forward then unapplying every step
   backward returns the array to exactly the original input.
3. **Termination** — a `done` step is emitted and nothing follows it.
4. **Bounds** — every index in `compare`, `writes`, and `sorted` is within
   `[0, n)`.

Put shared assertions in `src/algorithms/testUtils.ts` and call them from each
algorithm's test file. A new algorithm should be ~10 lines of test.

## Git

- Branch per stage: `agent/agy/<stage-slug>`.
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- One stage per commit series, merged to `main` when its acceptance criteria pass.
- Never commit `node_modules/`, `dist/`, or `.env`.
- Run `npm run typecheck && npm run test && npm run build` before every commit.

## Documentation

- Update `CHANGELOG.md` for every notable change. Timestamp format
  `YYYY-MM-DD HH-mm-ss`, from `date "+%Y-%m-%d %H-%M-%S"`.
- Update `AI_CONTEXT.md` when a stage completes or priorities shift.
- Record significant architectural choices in `docs/decisions/NNN-slug.md`.
