#!/usr/bin/env bun
/**
 * Fail when the committed generated client differs from the contract in
 * `openapi.json` (or `OPENAPI_INPUT`).
 *
 * Regenerates into a scratch directory beside the committed output, compares
 * every relative path and byte against `src/api/generated`, then removes the
 * scratch directory.
 */

import { createClient } from '@hey-api/openapi-ts';
import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';
import config from '../openapi-ts.config';

const COMMITTED = 'src/api/generated';
// Same depth as the committed output, so the generated runtime-config import
// keeps the same relative path and only real drift shows up.
const SCRATCH = 'src/api/.generated-check';

async function files(root: string, directory = root): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return files(root, path);
      if (!entry.isFile()) throw new Error(`Unexpected generated entry: ${path}`);
      return [relative(root, path)];
    })
  );
  return paths.flat().sort();
}

await rm(SCRATCH, { recursive: true, force: true });
try {
  await mkdir(SCRATCH, { recursive: true });
  const resolved = await config;
  await createClient({ ...resolved, output: SCRATCH });

  const [expected, actual] = await Promise.all([
    files(SCRATCH),
    files(COMMITTED),
  ]);
  const drift: string[] = [];
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);

  for (const path of expected) {
    if (!actualSet.has(path)) {
      drift.push(`Missing: ${path}`);
      continue;
    }
    const [left, right] = await Promise.all([
      readFile(join(SCRATCH, path)),
      readFile(join(COMMITTED, path)),
    ]);
    if (!left.equals(right)) drift.push(`Changed: ${path}`);
  }
  for (const path of actual) {
    if (!expectedSet.has(path)) drift.push(`Extra: ${path}`);
  }

  if (drift.length) {
    throw new Error(
      `Generated API drift. Run bun run api:generate.\n${drift.join('\n')}`
    );
  }
  console.log('Generated API matches the contract (all paths and bytes).');
} finally {
  await rm(SCRATCH, { recursive: true, force: true });
}
