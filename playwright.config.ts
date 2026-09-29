import { defineConfig, devices } from "@playwright/test";

const PORT = 3920;

export default defineConfig({
  testDir: "tests/e2e",
  reporter: [["list"]],
  use: { baseURL: `http://127.0.0.1:${PORT}` },
  // The two interfaces (SPC-0010): an iPad in WebKit, and a computer in
  // Chromium at 1280x720.
  projects: [
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
    {
      name: "computer",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  // The client is compiled, so the server serves dist/client.
  webServer: {
    command: "npm run build && node --import tsx src/server/main.ts",
    url: `http://127.0.0.1:${PORT}/health`,
    reuseExistingServer: false,
    env: {
      PORT: String(PORT),
      PARENT_PORT: "3925",
      MEOWTOWER_DB: "/tmp/meowtower-e2e.sqlite",
      // The storage notice counts the snapshots folder's parent, so it gets
      // a folder of its own rather than all of /tmp.
      MEOWTOWER_SNAPSHOTS: "/tmp/meowtower-e2e-data/snapshots",
      MEOWTOWER_CLIENT: "dist/client",
      // A fake key, so the recorder can prove no response carries it.
      OPENROUTER_API_KEY: "sk-or-v1-e2e-fake-key-0000",
    },
  },
});
