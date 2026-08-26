# CHANGELOG

Format: `YYYY-MM-DD HH-mm-ss` local device time.

## 2026-08-26 17-10-58 — Visualizer Implementation Completed

- Stage 0: Overwrote index.css with reset/accessibility outline, configured dynamic App grid layout, and deleted unused assets.
- Stage 1: Added deterministic generateArray utilizing Mulberry32 PRNG. Implemented playerReducer for invertible stepping, seek walk logic, and O(1) stats computation. Built usePlayer animation loop using requestAnimationFrame. Created playerReducer tests.
- Stage 2: Developed six sorting algorithms as pure generators (Bubble, Selection, Insertion, Merge, Quick, Heap) emitting comparison, write, range, and pivot step markers. Lomuto Quick Sort is iterative to prevent recursion limit overflows. Created testUtils and custom Vitest suites for all algorithms.
- Stage 3: Developed BarChart component with dense scaling thresholds and state modifier classes.
- Stage 4: Built ControlBar, AlgorithmPicker, and ArrayControls interfaces. Styled sliders, inputs, and button grids. Configured global keyboard handlers.
- Stage 5: Built StatsPanel with tabular-nums, ComplexityCard displaying metadata/invariants, and fallback-narrative Narration strip.
- Stage 6: Fixed React Compiler and oxlint warnings, added slider accessibility valuetext descriptors, and ran test suite showing all 29 tests fully green.

## 2026-08-26 09-52-08 — Repo scaffold and specification

- Scaffolded Vite + React 19 + TypeScript project.
- Added vitest (jsdom), @testing-library/react, prettier; configured scripts for
  `test`, `typecheck`, `format`, `lint`.
- Extended `tsconfig.app.json` to include `tests/` and vitest/jest-dom types.
- Authored type contracts: `src/algorithms/types.ts`, `src/player/types.ts`,
  `src/lib/types.ts`.
- Authored design tokens: `src/styles/tokens.css`.
- Authored README, ARCHITECTURE, CONVENTIONS, AGENTS, CLAUDE, AI_CONTEXT.
- Authored build plan `.agents/handoff/001-build-plan.md`.
- Verified `npm run build` passes.
