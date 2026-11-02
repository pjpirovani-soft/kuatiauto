import "dotenv/config";
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.e2e.local" });

import { defineConfig, devices } from "@playwright/test";

const PROD_URL = process.env.E2E_PROD_URL ?? "https://kuatiauto.vercel.app";
const LOCAL_URL = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e/report" }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "es-PY",
    timezoneId: "America/Asuncion",
    serviceWorkers: "block",
  },
  projects: [
    {
      name: "smoke-prod",
      testDir: "./e2e/smoke",
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: PROD_URL,
        ignoreHTTPSErrors: false,
      },
    },
    {
      name: "flows-local",
      testDir: "./e2e/flows",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: LOCAL_URL,
      },
    },
  ],
});