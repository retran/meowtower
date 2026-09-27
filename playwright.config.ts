import { defineConfig, devices } from "@playwright/test";

const PORT = 3920;

export default defineConfig({
  testDir: "tests/e2e",
  reporter: [["list"]],
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  projects: [{ name: "ipad", use: { ...devices["iPad (gen 7)"] } }],
  webServer: {
    command: "node --import tsx src/server/main.ts",
    url: `http://127.0.0.1:${PORT}/health`,
    reuseExistingServer: false,
    env: {
      PORT: String(PORT),
      PARENT_PORT: "3925",
      MEOWTOWER_DB: "/tmp/meowtower-e2e.sqlite",
      MEOWTOWER_SNAPSHOTS: "/tmp/meowtower-e2e-snapshots",
      // A fake key, so the recorder can prove no response carries it.
      OPENROUTER_API_KEY: "sk-or-v1-e2e-fake-key-0000",
    },
  },
});
