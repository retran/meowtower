// Every end-to-end test records each response the client receives, so the
// check that no response carries the model key covers every screen (REQ-2504).
import { test as base, expect } from "@playwright/test";

const KEY = "sk-or-v1-e2e-fake-key-0000";

export const test = base.extend<{ leaks: string[] }>({
  leaks: [
    async ({ page }, use) => {
      const leaks: string[] = [];
      const pending: Promise<void>[] = [];
      page.on("response", (res) => {
        pending.push(
          (async () => {
            const headers = JSON.stringify(await res.allHeaders());
            const body = await res.body().catch(() => Buffer.alloc(0));
            const text = headers + body.toString("latin1");
            if (text.includes(KEY) || text.includes("sk-or-"))
              leaks.push(res.url());
          })(),
        );
      });
      await use(leaks);
      await Promise.all(pending);
      expect(leaks, "responses carrying the model key").toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
