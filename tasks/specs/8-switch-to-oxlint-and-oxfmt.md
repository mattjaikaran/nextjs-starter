# 8 — Switch to Oxlint and Oxfmt and align CI

## Problem

`package.json` still lints with ESLint and `eslint-config-next`, so this repo
drifts from the owner's tooling decision (every repo uses Oxlint and Oxfmt).
There is no CI workflow that runs lint, format, typecheck, or build, so a
regression in any of them reaches `main` unnoticed.

## Files owned

- `package.json`
- `bun.lock`
- `.oxlintrc.json`
- `.oxfmtrc.json`
- `eslint.config.mjs` (delete)
- `.github/workflows/ci.yml`
- `AGENTS.md`
- `DEPENDENCIES.md`
- `app/(main)/about/page.tsx`
- `middleware.ts`
- `components/charts/AreaChart.tsx`
- `components/charts/DonutChart.tsx`
- `lib/store/slices/authSlice.ts`
- every file reformatted by the one-off `bun run format`
- `tasks/specs/8-switch-to-oxlint-and-oxfmt.md`

## Acceptance

- [x] No `eslint`, `prettier`, or `@typescript-eslint/*` dependency or config
      file remains.
- [x] `lint`, `lint:strict`, `lint:fix`, `format`, `format:check`, and
      `typecheck` scripts match the reference names.
- [x] `.oxlintrc.json` enables the React, React hooks, TypeScript, import,
      Next.js, and JSX a11y rules that `eslint-config-next` enforced.
- [x] `format:check` passes on the reformatted tree.
- [x] CI runs Oxlint, the Oxfmt check, typecheck, build, and React doctor.

## Gate

```bash
bun install --frozen-lockfile   # pass
bun run lint:strict             # pass
bun run format:check            # pass
bun run typecheck               # pass
bun run build                   # pass
bun run check-conventions       # 2 pre-existing violations (lib/api.ts, forms/todos/TodoForm.tsx)
bun run check-dependencies      # pass
bun run check-agents            # pass
bun start; curl -s http://localhost:3000/api/health   # {"status":"ok",...}
```
