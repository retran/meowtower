// Every end-to-end test records each response the client receives, so the
// checks cover every screen: no response carries the model key (REQ-2504), no
// JSON body carries a field of the task's design (REQ-2428), and only an
// answer reply carries the correct answer (REQ-2420).
import { test as base, expect } from "@playwright/test";
import { forbiddenFields } from "../helpers/packets.js";

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
            // An event stream never ends, so its body can't be read whole:
            // only its headers are checked. It carries the two messages of
            // SPC-0030, which hold no key.
            if (
              (res.headers()["content-type"] ?? "").includes("event-stream")
            ) {
              if (headers.includes(KEY) || headers.includes("sk-or-"))
                leaks.push(res.url());
              return;
            }
            const body = await res.body().catch(() => Buffer.alloc(0));
            const text = headers + body.toString("latin1");
            if (text.includes(KEY) || text.includes("sk-or-"))
              leaks.push(res.url());
            if (!(res.headers()["content-type"] ?? "").includes("json")) return;
            // A body the browser didn't keep, such as a redirect's, is empty.
            if (body.length === 0) return;
            const json: unknown = JSON.parse(body.toString("utf8"));
            for (const field of forbiddenFields(json))
              leaks.push(`${res.url()}: ${field}`);
            if (
              body.includes("correctAnswer") &&
              !new URL(res.url()).pathname.endsWith("/answer")
            )
              leaks.push(`${res.url()}: correctAnswer outside an answer reply`);
          })(),
        );
      });
      await use(leaks);
      await Promise.all(pending);
      expect(
        leaks,
        "responses carrying the model key, the design or an early answer",
      ).toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };
