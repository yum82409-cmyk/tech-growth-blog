import { defineConfig, devices } from "@playwright/test";

const chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4321",
    browserName: "chromium",
    launchOptions: { executablePath: chromePath },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "pnpm preview --host 127.0.0.1 --port 4321 --ignore-lock",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
