# AI Working Notes

Append-only log of patterns, errors, fixes and gotchas found while working in
this repo. Never overwrite an entry — add to it or add a new one below.

## Environment

- Node v22.23.2, npm 10.9.8 (as of scaffold).
- Vite 8, React 19.2, TypeScript ~6.0, vitest 4.
- The Vite template ships `oxlint`, not ESLint. `npm run lint` runs oxlint.

## Gotchas found so far

- **`verbatimModuleSyntax: true`** — type-only imports must be
  `import type { X } from './y.ts'`. A value-style import of a type is a build
  error, and it is the most likely first failure for a new agent here.
- **`allowImportingTsExtensions: true`** — relative imports carry the `.ts` /
  `.tsx` extension. Omitting it fails resolution.
- **`erasableSyntaxOnly: true`** — `enum` is banned. Use
  `const X = { ... } as const` plus `type X = typeof X[keyof typeof X]`.
- The Vite template leaves `src/App.css`, `src/index.css` and `src/assets/`
  in place. Stage 0 repurposes `index.css` as the global stylesheet; the
  template's hero image and svg assets under `src/assets/` are unused and can be
  deleted.

## Known environment quirk (planner session only)

The scaffold was authored over a sandboxed mount where `unlink` was denied.
Consequences visible in the repo, none of which reproduce on a normal macOS
checkout:

- `npm install` printed `npm warn cleanup ... EPERM rmdir` for optional
  platform binaries under `node_modules/@oxlint` and `lightningcss-*`. The
  install itself succeeded. Extra `lightningcss-<other-platform>` folders may be
  present; a fresh `npm ci` on the Mac drops them.
- `vite build` failed at `vite:prepare-out-dir` because it could not empty
  `dist/`. `tsc -b` passed; the failure was the mount, not the code. Verified by
  running `tsc -b --noEmit` and `oxlint` standalone — both clean.
- Git left stale `.lock` and `tmp_obj_*` files that could not be unlinked; they
  were moved aside into `.git/_stale/`. **Delete `.git/_stale/` on first
  checkout** — it is inert but pointless.
- The initial branch is `master`. Rename it: `git branch -m main`.

First thing to run on the Mac:

```bash
cd ~/Developer/projects/sort-visualizer
rm -rf .git/_stale dist
git branch -m main
npm ci && npm run typecheck && npm run lint && npm run build
```
