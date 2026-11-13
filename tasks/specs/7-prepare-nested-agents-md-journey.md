# 7 — Prepare for nested AGENTS.md and journey tests

## Problem

AGENTS.md still carries repository-global rules (commits, secrets, branch and
harness policy) that belong to the root file of a mattstack checkout, and it
says nothing about the generated API client or the Playwright journey
conventions the backend JOURNEYS gate reads. The repo also tracks a
Claude-only skill symlink, so AGENTS.md is not the only agent file. Without a
Playwright config that writes a JSON report, the gate cannot tell which
journey step failed.

## Files owned

- `AGENTS.md`
- `playwright.config.ts`
- `package.json`
- `bun.lock`
- `DEPENDENCIES.md`
- `.gitignore`
- `.claude/skills/react-doctor/SKILL.md` (delete)
- `tasks/specs/7-prepare-nested-agents-md-journey.md`

## Acceptance

- [ ] AGENTS.md keeps frontend facts only: package manager, dev/build/test
      commands, generated API client rules, Playwright conventions. Commit,
      secret, and branch rules are gone.
- [ ] AGENTS.md documents the `@J-NNN` test tag and the
      `test.step('J-NNN-S<n>: ...')` step title convention.
- [ ] `playwright.config.ts` uses `testDir: 'e2e'` and a `list` + `json`
      reporter writing `test-results/journeys.json`.
- [ ] `bun run test:e2e` runs Playwright, and `@playwright/test` is pinned
      exactly and listed in DEPENDENCIES.md.
- [ ] No `CLAUDE.md` or tool-specific agent adapter is tracked.

## Gate

```bash
bun install --frozen-lockfile   # pass
bun run build                   # pass
bun run api:check               # pass
bun run lint                    # pass, 10 pre-existing warnings
bun run check-conventions       # 2 pre-existing violations (lib/api.ts, forms/todos/TodoForm.tsx)
bun run check-dependencies      # pass
bun run check-agents            # pass
bun start; curl -s http://localhost:3000/api/health   # {"status":"ok",...}
```

`bun run test:e2e` needs browsers installed and journey specs; this change
ships the config only.
