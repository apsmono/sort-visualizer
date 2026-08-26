# CHANGELOG

Format: `YYYY-MM-DD HH-mm-ss` local device time.

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
