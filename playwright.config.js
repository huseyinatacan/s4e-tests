// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "https://app.s4e.io",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      slowMo: 1000,    // 500ms delay between each action (remove later for speed)
    },
  },

  projects: [
    // ── Auth setup (alternative to login.js, may be blocked by Cloudflare) ──
    {
      name: "setup",
      testMatch: /auth\.setup\.js/,
      use: {
        browserName: "firefox",
        headless: false,
      },
    },

    // ── Browsers (reuse session from: node login.js) ──
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/session.json",
        headless: false,   // Must be headed — Cloudflare blocks headless browsers
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        storageState: "tests/.auth/session.json",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        storageState: "tests/.auth/session.json",
      },
    },
  ],
});
