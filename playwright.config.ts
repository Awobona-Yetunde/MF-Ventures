import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
  webServer: {
    command: "npx vite --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 60_000,
    env: { VITE_API_BASE_URL: "https://mock-backend.test" },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", launchOptions: { executablePath: "/opt/pw-browsers/chromium" } },
    },
  ],
});
