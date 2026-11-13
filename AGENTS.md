# AGENTS.md

Rules for this Next.js frontend package only: package manager, commands,
generated API client, and Playwright journeys. Global policy — commits,
secrets, branches, harness setup — lives in the repository root `AGENTS.md`;
the nearest file wins. This is the only agent file here: do not add a
`CLAUDE.md` or any tool-specific adapter.

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

| Purpose                            | Command                         |
| ---------------------------------- | ------------------------------- |
| Install                            | `bun install --frozen-lockfile` |
| Dev server (http://localhost:3000) | `bun run dev`                   |
| Typecheck + production build       | `bun run build`                 |
| Production server                  | `bun start`                     |
| Lint (Oxlint)                      | `bun run lint`                  |
| Lint, warnings denied              | `bun run lint:strict`           |
| Fix lint findings                  | `bun run lint:fix`              |
| Format (Oxfmt)                     | `bun run format`                |
| Format check                       | `bun run format:check`          |
| Typecheck                          | `bun run typecheck`             |
| E2E journeys (Playwright)          | `bun run test:e2e`              |
| Convention gate                    | `bun run check-conventions`     |
| Dependency gate                    | `bun run check-dependencies`    |
| Agent docs gate                    | `bun run check-agents`          |
| Generated API drift                | `bun run api:check`             |
| All static gates                   | `bun run gauntlet`              |
| React diagnostics                  | `bun run doctor`                |

Smoke the app after a build: `bun start`, then
`curl -s http://localhost:3000/api/health` — expects `{"status":"ok",...}`.
`bun start` warns that `output: "standalone"` prefers
`node .next/standalone/server.js`; both serve the app.

### Known failing checks

These failures predate the Oxlint/Oxfmt switch. Do not add new violations; fix
the ones in files you touch.

- `bun run check-conventions`: 2 violations — `NO_WINDOW_LOCATION` in
  `lib/api.ts` and `NO_USE_STATE_FOR_FORMS` in `forms/todos/TodoForm.tsx`.
- `bun run doctor`: pinned react-doctor 0.2.9 reports 12 issues on this tree and
  can stall after printing its report, so CI bounds and ignores it. Treat
  findings as hypotheses and fix them in the files you touch; do not suppress
  rules to raise the score. `react-doctor.config.json` is still read but
  deprecated in favour of `doctor.config.json`.
- `bun run gauntlet` stops at `check-conventions` until those two violations
  are fixed; `api:check`, `format:check`, `lint:strict`, and `typecheck` pass
  before it.

`bun install --frozen-lockfile`, `bun run lint`, `bun run lint:strict`,
`bun run format:check`, `bun run typecheck`, `bun run build`,
`bun run check-dependencies`, and `bun run check-agents` pass on a clean
checkout.

## Code standards and architecture rules

TypeScript is strict. No `as any`, `@ts-ignore`, or `console.log` in source
files.

- **Lint and format**: Oxlint reads `.oxlintrc.json` and Oxfmt reads
  `.oxfmtrc.json`; there is no ESLint or Prettier pipeline. Replicate a former
  ESLint rule in `.oxlintrc.json` rather than adding one of those packages
  back.
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
  files; compose classes with `cn()`. `components/ui` is vendored, excluded
  from the convention checker and skipped by Oxfmt, so keep edits there
  minimal and purposeful.
- **Size**: a component file over 300 lines is a violation; split it.
- **Dependencies**: exact versions only; the policy lives in
  [DEPENDENCIES.md](DEPENDENCIES.md). Add a row there with every dependency.

The mechanical rules are enforced by
[scripts/check_conventions.ts](scripts/check_conventions.ts) and
[scripts/check_dependencies.ts](scripts/check_dependencies.ts) through
`bun run gauntlet`. [.github/workflows/ci.yml](.github/workflows/ci.yml) runs
Oxlint, the Oxfmt check, typecheck, build, and React doctor.
[.github/workflows/agents.yml](.github/workflows/agents.yml)
fails when this file is missing or a relative link in it does not resolve.

## Generated API client

`src/api/generated` is generated from `openapi.json` by `@hey-api/openapi-ts`
([openapi-ts.config.ts](openapi-ts.config.ts)). Never edit it by hand.

- `bun run api:generate` — regenerate the client, types, Zod schemas, and
  TanStack Query helpers.
- `bun run api:check` — regenerate into a scratch directory and fail on any
  byte of drift; this runs first in `bun run gauntlet`.
- `OPENAPI_INPUT` overrides the spec path. The generated client is configured
  in `lib/api-client.ts`; it reuses the axios instance from `lib/api.ts`.
- Components still consume API data through the hooks and services described
  under HTTP above; import generated SDK functions rather than calling
  endpoints ad hoc.

## Testing and journeys

There is no unit-test runner in this repo, and none should be added.

1. `bun run build` — typecheck and prerender the static routes.
2. `bun run gauntlet` — generated API drift, format check, lint, typecheck,
   conventions, dependencies, agent docs. Fix violations in the files you
   changed; leave the documented pre-existing failures alone.
3. Run the affected route with `bun run dev` or `bun start` and exercise it,
   including `/api/health` after a build.

Behavioral coverage is an e2e journey spec under `e2e/` or a `tests/smoke`
script. Playwright config is [playwright.config.ts](playwright.config.ts):
`testDir: 'e2e'`, base URL `http://localhost:3000` (override with
`PLAYWRIGHT_BASE_URL`), dev server started on demand, Chromium project.
`bun run test:e2e` runs `playwright test --pass-with-no-tests`: the suite is
empty until the first journey lands, and file or load errors still fail.

Journey convention, read by the backend JOURNEYS gate:

- One test per journey, tagged with its journey ID:
  `test('...', { tag: '@J-001' }, async ({ page }) => { ... })`.
- Each journey step is a `test.step` whose title starts with the step ID:
  `await test.step('J-001-S1: create an account', ...)`. Do not write a
  separate test per step.
- The JSON reporter writes `test-results/journeys.json`; the gate reads it
  (defaults `JOURNEYS_E2E_DIR=<repo>/../frontend/e2e` and
  `JOURNEYS_E2E_REPORT=<repo>/../frontend/test-results/journeys.json`). Keep
  the reporter block in the config.
- Skipped tests count as no result. When you rename or remove a step, update
  its `test.step` title in the same change; a stale step tag is an orphan.
- If a step cannot pass yet, record it in the journey spec's `known_issues`
  instead of deleting the step title.

## Spec workflow (agent-run)

Specs live in [tasks/specs/](tasks/specs/README.md), one file per task named
`<issue>-<slug>.md`. Every spec states:

- **Problem** — the user-visible issue and why it matters.
- **Files owned** — the paths an agent may edit; nothing outside them.
- **Acceptance** — observable outcomes.
- **Gate** — the exact commands that must pass before handoff.

Skip a spec for a docs-only or one-line change.

## Security

- `NEXT_PUBLIC_*` values are inlined into the browser bundle — treat them as
  public. Server-only values such as `INTERNAL_API_URL` (used by the `/api/v1`
  rewrite in `next.config.ts`) stay unprefixed.
- `middleware.ts` is an auth stub and does not protect routes; protected pages
  redirect from the client store, so authorization must live in the API.
- Dependencies are exact-pinned for supply-chain safety; changing a version
  requires the matching [DEPENDENCIES.md](DEPENDENCIES.md) row.
