#!/usr/bin/env bun
/**
 * Agent docs gate — fail when the repo's agent instructions drift.
 *
 * Checks:
 *   1. MISSING_AGENTS_MD — AGENTS.md exists at the repo root
 *   2. BROKEN_LINK       — every relative link in AGENTS.md resolves
 *   3. BROKEN_ANCHOR     — heading anchors in Markdown links resolve
 *   4. CLAUDE_MD_FALLBACK — CLAUDE.md is absent or contains only `@AGENTS.md`
 *
 * Usage:
 *   bun run scripts/check_agent_docs.ts
 *   bun run scripts/check_agent_docs.ts --json
 *
 * Exit: 0 = agent docs are valid, 1 = violations found
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { argv, exit } from "node:process";

const PROJECT_ROOT = new URL("..", import.meta.url).pathname;
const AGENTS_FILE = "AGENTS.md";
const CLAUDE_FILE = "CLAUDE.md";

interface Violation {
  check: string;
  filepath: string;
  line: number;
  message: string;
}

interface MarkdownLink {
  line: number;
  target: string;
}

function slugifyHeading(heading: string): string {
  return heading
    .trim()
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function collectHeadings(markdown: string): Set<string> {
  const slugs = new Set<string>();
  for (const line of markdown.split("\n")) {
    const match = line.match(/^#{1,6}\s+(.+)$/);
    if (match) slugs.add(slugifyHeading(match[1]));
  }
  return slugs;
}

function collectLinks(markdown: string): MarkdownLink[] {
  const links: MarkdownLink[] = [];
  let inFence = false;

  const lines = markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const pattern = /\[[^\]]*\]\(([^)]+)\)/g;
    let match = pattern.exec(line);
    while (match) {
      links.push({ line: i + 1, target: match[1].trim() });
      match = pattern.exec(line);
    }
  }
  return links;
}

function checkRelativeLinks(links: MarkdownLink[]): Violation[] {
  const violations: Violation[] = [];

  for (const link of links) {
    if (/^(https?:|mailto:|tel:|#)/.test(link.target)) continue;

    const [rawPath, anchor] = link.target.split("#");
    const filePath = rawPath.replace(/^<|>$/g, "").replace(/\s+"[^"]*"$/, "");
    if (!filePath) continue;

    const resolved = join(PROJECT_ROOT, filePath.replace(/^\//, ""));
    if (!existsSync(resolved)) {
      violations.push({
        check: "BROKEN_LINK",
        filepath: AGENTS_FILE,
        line: link.line,
        message: `"${filePath}" — link target does not exist`,
      });
      continue;
    }

    if (!anchor || !resolved.endsWith(".md")) continue;

    const headings = collectHeadings(readFileSync(resolved, "utf-8"));
    if (!headings.has(anchor.toLowerCase())) {
      violations.push({
        check: "BROKEN_ANCHOR",
        filepath: AGENTS_FILE,
        line: link.line,
        message: `"${link.target}" — no heading with that anchor in ${filePath}`,
      });
    }
  }

  return violations;
}

function checkClaudeFallback(root: string): Violation[] {
  const claudePath = join(root, CLAUDE_FILE);
  if (!existsSync(claudePath)) return [];

  const content = readFileSync(claudePath, "utf-8").trim();
  if (content === "@AGENTS.md") return [];

  return [
    {
      check: "CLAUDE_MD_FALLBACK",
      filepath: CLAUDE_FILE,
      line: 1,
      message: "CLAUDE.md must be deleted or contain only @AGENTS.md",
    },
  ];
}

function main(): number {
  const { values } = parseArgs({
    args: argv.slice(2),
    options: {
      json: { type: "boolean", default: false },
    },
    strict: false,
  });

  const violations: Violation[] = [];
  const agentsPath = join(PROJECT_ROOT, AGENTS_FILE);

  if (!existsSync(agentsPath)) {
    violations.push({
      check: "MISSING_AGENTS_MD",
      filepath: AGENTS_FILE,
      line: 0,
      message: "AGENTS.md is missing at the repo root",
    });
  } else {
    const links = collectLinks(readFileSync(agentsPath, "utf-8"));
    violations.push(...checkRelativeLinks(links));
    violations.push(...checkClaudeFallback(PROJECT_ROOT));
  }

  if (values.json) {
    console.log(
      JSON.stringify(
        {
          violations: violations.map((v) => ({
            check: v.check,
            file: v.filepath,
            line: v.line,
            message: v.message,
          })),
          count: violations.length,
        },
        null,
        2,
      ),
    );
  } else {
    if (violations.length === 0) {
      console.log("Agent docs are valid.");
    }
    for (const v of violations) {
      console.log(`[${v.check}] ${v.filepath}:${v.line} — ${v.message}`);
    }
    console.log(
      violations.length
        ? `\n${violations.length} violation(s) found.`
        : "\n0 violations.",
    );
  }

  return violations.length ? 1 : 0;
}

exit(main());
