# AGENTS.md

Single source of agent instructions for this repository. Claude Code, Codex,
Cursor, and opencode all read this file. `CLAUDE.md` must be absent or contain
only `@AGENTS.md`; no other instruction file may repeat these rules. Nested
`AGENTS.md` files are only added when a package has its own commands or rules
(none today — the nearest file wins).

## Project overview

Next.js 16 App Router starter (React 19, TypeScript strict, Tailwind CSS v4,
Shadcn/ui) with a Zustand client store, TanStack Query server state, and an
axios layer that speaks to a Django API through `/api/v1` rewrites.
Package manager: **bun** (`bun.lock`). Do not use npm or yarn.

- Architecture and API/state patterns: [README.md](README.md)
- Project structure: [README.md#project-structure](README.md#project-structure)
- Dependency policy: [DEPENDENCIES.md](DEPENDENCIES.md)

## Commands

Run from the repo root with bun.

| Purpose | Command |
| --- | --- |
| Install | `bun install --frozen-lockfile` |
| Dev server (http://localhost:3000) | `bun run dev` |
| Typecheck + production build | `bun run build` |
| Production server | `bun start` |
| Lint | `bun run lint` |
| Convention gate | `bun run check-conventions` |
| Dependency gate | `bun run check-dependencies` |
| Agent docs gate | `bun run check-agents` |
| All static gates | `bun run gauntlet` |
| React diagnostics (downloads the tool) | `bun run doctor` |

Smoke the app after a build: `bun start`, then
`curl -s http://localhost:3000/api/health` — expects `{"status":"ok",...}`.
`bun start` warns that `output: "standalone"` prefers
`node .next/standalone/server.js`; both serve the app.

### Known failing checks

These failures predate AGENTS.md. Do not add new violations; fix the ones in
files you touch.

- `bun run lint`: 24 problems (12 errors, 12 warnings). Errors come from
  `hooks/utils/use-media-query.ts` (`set-state-in-effect`),
  `hooks/mutations/use-auth-mutations.ts` (`no-explicit-any`), and
  `react-doctor/*` disable comments for a plugin the ESLint config does not
  load (`hooks/api/use-api.ts`, `lib/utils/async.ts`).
- `bun run check-conventions`: 5 violations — `NO_ANY_CAST` ×3 in
  `hooks/mutations/use-auth-mutations.ts`, `NO_WINDOW_LOCATION` in
  `lib/api.ts`, `NO_USE_STATE_FOR_FORMS` in `forms/todos/TodoForm.tsx`.
- `bun run doctor`: reports 31 existing issues (score 42/100) and exits 1.
  Treat findings as hypotheses and fix them in the files you touch; do not
  suppress rules to raise the score. `react-doctor.config.json` is still read
  but deprecated in favour of `doctor.config.json`.
- `bun run gauntlet` fails until the lint and convention violations above are
  fixed; it stops at the first failing gate.

`bun install --frozen-lockfile`, `bun run build`,
`bun run check-dependencies`, and `bun run check-agents` pass on a clean
checkout.

## Code standards and architecture rules

TypeScript is strict. No `as any`, `@ts-ignore`, or `console.log` in source
files.

- **Routing**: App Router under `app/`. Route files (`page`, `layout`,
  `error`, `loading`, `not-found`) use default exports; components and forms
  use named exports.
- **Protected routes**: keep client-store redirects in an effect, not in the
  render path. `app/todos/TodosContent.tsx` renders no protected content while
  signed out, then navigates to `/login` after mount, so `/todos` stays
  prerenderable.
- **Navigation**: `useRouter()` from `next/navigation`; never
  `window.location.href`.
- **HTTP**: requests go through `lib/api.ts` and `lib/api/services/*`.
  Components use the query and mutation hooks in `hooks/queries`,
  `hooks/mutations`, and `hooks/api`; no raw `axios`, `fetch`, `useQuery`, or
  `useMutation` outside those folders, `lib/`, and `app/api/`.
- **Forms**: `react-hook-form` + `zod`; never `useState` for form state.
- **UI**: Shadcn primitives live in `components/ui` (add with
  `bunx shadcn add <name>`); variant maps belong in `*-variants.ts`
  files; compose classes with `cn()`. `components/ui` is vendored and excluded
  from the convention checker, so keep edits there minimal and purposeful.
- **Size**: a component file over 300 lines is a violation; split it.
- **Dependencies**: exact versions only; the policy lives in
  [DEPENDENCIES.md](DEPENDENCIES.md). No npm or yarn commands in docs.

The mechanical rules are enforced by
[scripts/check_conventions.ts](scripts/check_conventions.ts) and
[scripts/check_dependencies.ts](scripts/check_dependencies.ts) through
`bun run gauntlet`. [.github/workflows/agents.yml](.github/workflows/agents.yml)
fails when this file is missing or a relative link in it does not resolve.

## Testing policy

There is no unit-test runner in this repo, and none should be added. Verify a
change with:

1. `bun run build` — typecheck and prerender the static routes.
2. `bun run gauntlet` — lint, conventions, dependencies, agent docs. Fix
   violations in the files you changed; leave the documented pre-existing
   failures alone.
3. Run the affected route with `bun run dev` or `bun start` and exercise it,
   including `/api/health` after a build.

If a behavior needs automated coverage, add a Playwright e2e spec or a
`tests/smoke` script; do not add unit tests.

## Git and commits

- Conventional Commits: `type(scope): Imperative summary` (`feat`, `fix`,
  `chore`, `docs`, `refactor`, `test`, `build`, `ci`).
- Subject at most 50 characters, imperative, no trailing period; wrap the body
  at 72.
- One concern per commit; keep the docs change with the code it describes.
- Never commit `.env*`, secrets, `.next/`, or other build output.
- Under agent-run, the harness pushes the branch and opens the pull request
  after its gate passes; do not push or run `gh pr create` yourself.

## Spec workflow (agent-run)

Specs live in [tasks/specs/](tasks/specs/README.md), one file per task named
`<issue>-<slug>.md`. Every spec states:

- **Problem** — the user-visible issue and why it matters.
- **Files owned** — the paths an agent may edit; nothing outside them.
- **Acceptance** — observable outcomes.
- **Gate** — the exact commands that must pass before handoff.

Skip a spec for a docs-only or one-line change. Agent-run owns the branch,
commit, push, and PR; its gate is the last word.

## Security

- `.env*` is gitignored. Never commit tokens, keys, or `.env` files, and never
  paste secrets into code, tests, or docs.
- `NEXT_PUBLIC_*` values are inlined into the browser bundle — treat them as
  public. Server-only values such as `INTERNAL_API_URL` (used by the `/api/v1`
  rewrite in `next.config.ts`) stay unprefixed.
- `middleware.ts` is an auth stub and does not protect routes; protected pages
  redirect from the client store, so authorization must live in the API.
- Dependencies are exact-pinned for supply-chain safety; changing a version
  requires the matching [DEPENDENCIES.md](DEPENDENCIES.md) row.
