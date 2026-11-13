import { defineConfig, devices } from "@playwright/test";

/**
 * Journey e2e config. The backend JOURNEYS gate reads the JSON report at
 * `test-results/journeys.json`, so keep the reporter block and its path.
 * See AGENTS.md for the `@J-NNN` tag and `J-NNN-S<n>:` step conventions.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["json", { outputFile: "test-results/journeys.json" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
