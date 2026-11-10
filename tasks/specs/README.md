# Specs

One spec per agent-run task. The spec is the contract: an agent works to it,
and the gate is the last word on whether the work is done.

Name files `<issue>-<slug>.md`, for example `3-move-agent-docs.md`. Do not add
a spec for a docs-only or one-line change.

## Required sections

- **Problem** — the user-visible issue, current behavior, and why it matters.
- **Files owned** — the paths the agent may edit. Work outside this list is a
  contract violation; ask before widening it.
- **Acceptance** — observable outcomes, one checkbox each.
- **Gate** — the exact commands that must pass before handoff, with the
  expected result for each.

## Gate

The default gate is:

```bash
bun run build
bun run gauntlet
```

Add a smoke or Playwright e2e run when the change touches a route. The
commands in [AGENTS.md](../../AGENTS.md#commands) are the source of truth; a
spec copies them, never invents new ones.
