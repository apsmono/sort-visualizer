# CLAUDE.md — AI Onboarding Hub

Single entry point for AI assistants working in `sort-visualizer`.

## Start Here

`sort-visualizer` animates six classic sorting algorithms turning an unordered
row of bars into an ordered one. React 19 + TypeScript + Vite, no runtime
dependencies beyond React.

The one architectural idea: **algorithms are pure generators that yield
reversible step records; the player folds those steps into a renderable frame.**
Read `ARCHITECTURE.md` before writing any code.

## Read This First

1. [README.md](README.md) — mission and quickstart
2. [ARCHITECTURE.md](ARCHITECTURE.md) — layers, step model, state ownership
3. [CONVENTIONS.md](CONVENTIONS.md) — TS/React/CSS/git/testing rules
4. [AGENTS.md](AGENTS.md) — mandatory agent rules and write-after-work protocol
5. [AI_CONTEXT.md](AI_CONTEXT.md) — current stage and active priorities
6. [.agents/handoff/001-build-plan.md](.agents/handoff/001-build-plan.md) — the work

## Before You Edit

- [ ] Read `AI_CONTEXT.md` to confirm the active stage
- [ ] Run `git fetch --all --prune && git status -sb`; if behind, `git pull --ff-only`
- [ ] Confirm `npm run typecheck && npm run test && npm run build` is green before you start
- [ ] Work on `agent/agy/<stage-slug>`, not `main`

## Three Things That Will Bite You

1. `verbatimModuleSyntax` is on — every type import needs `import type`.
2. `allowImportingTsExtensions` is on — relative imports need the `.ts`/`.tsx`
   extension.
3. `erasableSyntaxOnly` is on — no `enum`. Use `as const` objects.

## After You Edit

Follow the write-after-work protocol in `AGENTS.md`. Update `CHANGELOG.md`,
`AI_CONTEXT.md`, and `docs/ai-working-notes.md`.
