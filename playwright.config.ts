import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  // WebKit workers are heavy; too many at once crash on Windows, especially
  // once chromium and mobile-webkit run side by side.
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // iOS browsers (Safari and in-app browsers like Messenger) all use WebKit.
    // reducedMotion: Playwright's WebKit build on Windows can stall its click
    // "stable" check while the infinite hint pulse runs. Animations are covered by chromium.
    { name: "mobile-webkit", use: { ...devices["iPhone 13"], reducedMotion: "reduce" } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { CARD_SOURCE: "memory" },
  },
});
