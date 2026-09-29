// TSK-0340 on screen: the client checks only the input's format and shows no
// verdict of its own (REQ-2402), pauses on background (REQ-2406) and on idle
// (REQ-2408, REQ-2410), and draws scored and unscored tasks alike (REQ-2430).
// The e2e server is shared, so every test pairs its own device and reads its
// own session's events.
import Database from "better-sqlite3";
import type { Page, Request } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const DB = "/tmp/meowtower-e2e.sqlite";
const PARENT = "http://127.0.0.1:3925";

async function ready(page: Page, route: string): Promise<void> {
  await page.goto("about:blank");
  await page.goto(`/#${route}`);
  await expect(page.locator("body")).toHaveAttribute("data-screen", route);
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

async function pairDevice(page: Page): Promise<void> {
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);
}

/** Opens the play screen and returns the session it started. */
async function play(page: Page): Promise<string> {
  const started = page.waitForResponse("**/api/session/start");
  await ready(page, "/play");
  const { sessionId } = (await (await started).json()) as {
    sessionId: string;
  };
  await expect(page.locator(".play .task")).toBeVisible();
  return sessionId;
}

function sessionEvents(sessionId: string, type: string): unknown[] {
  const db = new Database(DB, { readonly: true });
  const rows = db
    .prepare(
      "SELECT payload FROM events WHERE session_id = ? AND type = ? ORDER BY seq",
    )
    .all(sessionId, type) as { payload: string }[];
  db.close();
  return rows.map((r) => JSON.parse(r.payload) as unknown);
}

const pauses = (page: Page): Request[] => {
  const seen: Request[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith("/pause")) seen.push(r);
  });
  return seen;
};

test("REQ-2402: the client refuses a letter, sends a wrong number raw and shows no verdict of its own", async ({
  page,
}) => {
  await pairDevice(page);
  await play(page);
  const field = page.locator("#play-answer");
  await field.focus();
  await page.keyboard.type("a");
  await expect(field).toHaveValue("");
  await page.keyboard.type("99");
  await expect(field).toHaveValue("99");

  // Hold the reply, to see what the client shows before the server decides.
  let release: () => void = () => undefined;
  const held = new Promise<void>((r) => (release = r));
  let sent: unknown;
  await page.route("**/api/session/*/answer", async (route) => {
    sent = route.request().postDataJSON();
    await held;
    await route.continue();
  });
  const replied = page.waitForResponse("**/api/session/*/answer");
  await page.locator('[data-action="play-submit"]').click();
  await expect.poll(() => sent).toBeTruthy();
  expect(sent).toMatchObject({ raw: "99", dontKnow: false });
  await page.waitForTimeout(300);
  await expect(page.locator(".badge")).toHaveCount(0);
  await expect(page.locator(".play")).not.toContainText(
    /Чисто|Почти|Другая тропа|Принято/,
  );
  release();
  const reply = (await (await replied).json()) as { outcome?: string };
  // The badge the server's outcome names, and nothing the client decided.
  const word =
    reply.outcome === "clean"
      ? "Чисто!"
      : reply.outcome === "partial"
        ? "Почти!"
        : "Другая тропа";
  await expect(page.locator(".badge")).toHaveText(word);
});

test("REQ-2406: a hidden page sends the pause with background through a keepalive fetch", async ({
  page,
}) => {
  // Record the keepalive flag of every fetch the page makes.
  await page.addInitScript(() => {
    const seen: { url: string; keepalive: boolean }[] = [];
    (window as unknown as { fetches: typeof seen }).fetches = seen;
    const real = window.fetch.bind(window);
    window.fetch = (input, init) => {
      seen.push({ url: String(input), keepalive: init?.keepalive === true });
      return real(input, init);
    };
  });
  await pairDevice(page);
  const sessionId = await play(page);
  const paused = page.waitForResponse("**/pause");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const res = await paused;
  expect(res.request().postDataJSON()).toMatchObject({ reason: "background" });
  const fetches = await page.evaluate(
    () =>
      (window as unknown as { fetches: { url: string; keepalive: boolean }[] })
        .fetches,
  );
  expect(fetches.filter((f) => f.url.endsWith("/pause"))).toEqual([
    { url: `/api/session/${sessionId}/pause`, keepalive: true },
  ]);
  expect(sessionEvents(sessionId, "adventure_paused")).toEqual([
    { reason: "background" },
  ]);
});

test("REQ-2408, REQ-2410: no input pauses after 5 minutes with a task open and after 90 seconds outside it", async ({
  page,
}) => {
  await page.clock.install();
  await pairDevice(page);
  const seen = pauses(page);
  const inTask = await play(page);
  // A task is open: 90 seconds is thinking time, not idleness.
  await page.clock.fastForward(91_000);
  await page.waitForTimeout(200);
  expect(seen).toHaveLength(0);
  await page.clock.fastForward(5 * 60_000 - 91_000 - 1_000);
  await page.waitForTimeout(200);
  expect(seen).toHaveLength(0);
  await page.clock.fastForward(2_000);
  await expect.poll(() => seen.length).toBe(1);
  expect(seen[0]?.postDataJSON()).toMatchObject({ reason: "idle" });
  await expect(page.locator('[data-action="play-continue"]')).toBeVisible();
  await expect
    .poll(() => sessionEvents(inTask, "adventure_paused"))
    .toEqual([{ reason: "idle" }]);

  // Outside the task window, after an answer, the limit is 90 seconds.
  const started = page.waitForResponse("**/api/session/start");
  await page.locator('[data-action="play-continue"]').click();
  const { sessionId } = (await (await started).json()) as {
    sessionId: string;
  };
  await expect(page.locator(".play .task")).toBeVisible();
  await page.locator("#play-answer").fill("0");
  await page.locator('[data-action="play-submit"]').click();
  await expect(page.locator(".badge")).toBeVisible();
  await page.clock.fastForward(89_000);
  await page.waitForTimeout(200);
  expect(seen).toHaveLength(1);
  await page.clock.fastForward(2_000);
  await expect.poll(() => seen.length).toBe(2);
  expect(seen[1]?.postDataJSON()).toMatchObject({ reason: "idle" });
  await expect
    .poll(() => sessionEvents(sessionId, "adventure_paused"))
    .toEqual([{ reason: "idle" }]);
});

test("REQ-2430: a scored and an unscored task render the same apart from the task's text", async ({
  page,
}) => {
  await pairDevice(page);
  let next = page.waitForResponse("**/api/session/*/next");
  await play(page);
  const purposeOf = (itemId: string): string => {
    const db = new Database(DB, { readonly: true });
    const row = db
      .prepare(
        "SELECT json_extract(payload, '$.purpose') AS purpose FROM events WHERE type = 'item_shown' AND json_extract(payload, '$.itemId') = ?",
      )
      .get(itemId) as { purpose: string };
    db.close();
    return row.purpose;
  };
  // The room's and the outcome's markup, with what the task itself says blanked.
  const markup = (): Promise<string> =>
    page.locator(".play").evaluate((section) => {
      const copy = section.cloneNode(true) as HTMLElement;
      for (const n of copy.querySelectorAll(".task, .battle, .solution li"))
        n.textContent = "";
      return copy.innerHTML;
    });
  const seen = new Map<string, { room: string; outcome: string }>();
  for (let i = 0; i < 6 && seen.size < 2; i++) {
    if (i > 0) {
      next = page.waitForResponse("**/api/session/*/next");
      await page.locator('[data-action="play-next"]').click();
    }
    const packet = (await (await next).json()) as {
      itemId: string;
      [k: string]: unknown;
    };
    await expect(page.locator(".play .task")).toBeVisible();
    const room = await markup();
    // The same answer to both, so the outcome's badge is the same word.
    await page.locator("#play-answer").fill("0");
    await page.locator('[data-action="play-submit"]').click();
    await expect(page.locator(".badge")).toBeVisible();
    const purpose = purposeOf(packet.itemId);
    if (!seen.has(purpose))
      seen.set(purpose, { room, outcome: await markup() });
  }
  const scored = seen.get("standin");
  const warmup = seen.get("warmup");
  expect(scored).toBeTruthy();
  expect(warmup).toBeTruthy();
  expect(warmup?.room).toBe(scored?.room);
  expect(warmup?.outcome).toBe(scored?.outcome);
});
