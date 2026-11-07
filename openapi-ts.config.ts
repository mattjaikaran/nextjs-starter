import { existsSync } from 'node:fs';
import { defineConfig } from '@hey-api/openapi-ts';

// A mattstack monorepo keeps the backend next to the frontend; a standalone
// checkout uses the contract committed here.
const MONOREPO_CONTRACT = '../backend/docs/openapi/openapi.json';
const VENDORED_CONTRACT = 'openapi.json';

function resolveInput(): string {
  if (process.env.OPENAPI_INPUT) return process.env.OPENAPI_INPUT;
  return existsSync(MONOREPO_CONTRACT) ? MONOREPO_CONTRACT : VENDORED_CONTRACT;
}

export default defineConfig({
  input: resolveInput(),
  output: 'src/api/generated',
  plugins: [
    '@hey-api/typescript',
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: './lib/api-client.ts',
    },
    '@hey-api/sdk',
    {
      name: 'zod',
      compatibilityVersion: 4,
      requests: true,
      responses: true,
      definitions: true,
    },
    '@tanstack/react-query',
  ],
});
