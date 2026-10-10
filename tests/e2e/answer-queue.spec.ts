// TSK-0380 on screen: the client commits each answer to IndexedDB before it
// sends it, retries until the server logs it, flushes the queue on launch
// before it asks to resume, and plays no task and shows no outcome while the
// answer is unsent (REQ-2400, REQ-2434, REQ-2436, REQ-2438). An answer unsent
// for 24 hours shows as `queue_stuck` in the device's settings.
import Database from "better-sqlite3";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const DB = "/tmp/meowtower-e2e.sqlite";
const PARENT = "http://127.0.0.1:3925";
const WAITING = "Туман над тропой, фамильяр ищет дорогу";

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

/** The entries the device holds in its queue's store, as the page sees them. */
async function queued(
  page: Page,
): Promise<{ idemKey: string; kind: string }[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const open = indexedDB.open("meowtower-queue");
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
    });
    const all = await new Promise<{ idemKey: string; kind: string }[]>(
      (resolve, reject) => {
        const req = db.transaction("entries").objectStore("entries").getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      },
    );
    db.close();
    return all;
  });
}

/** How many times the log holds an attempt at the item. */
function attempts(itemId: string): number {
  const db = new Database(DB, { readonly: true });
  const row = db
    .prepare(
      "SELECT COUNT(*) AS n FROM events WHERE type = 'attempt_submitted' AND json_extract(payload, '$.itemId') = ?",
    )
    .get(itemId) as { n: number };
  db.close();
  return row.n;
}

async function answerOnce(page: Page): Promise<void> {
  await page.locator("#play-answer").fill("7");
  await page.locator('[data-action="play-submit"]').click();
}

test("REQ-2434: the answer is in IndexedDB before the request, and the next launch sends it before it asks to resume", async ({
  page,
  context,
}) => {
  await pairDevice(page);
  await ready(page, "/play");
  await expect(page.locator(".play .task")).toBeVisible();

  const committedAtSend: number[] = [];
  let itemId = "";
  await page.route("**/api/session/*/answer", async (route) => {
    itemId = (route.request().postDataJSON() as { itemId: string }).itemId;
    committedAtSend.push((await queued(page)).length);
    await route.abort("connectionrefused");
  });
  await answerOnce(page);
  await expect.poll(() => committedAtSend.length).toBeGreaterThan(0);
  expect(committedAtSend[0]).toBe(1);
  expect(await queued(page)).toHaveLength(1);

  // The page dies with the answer unsent.
  await page.close();
  const next = await context.newPage();
  const order: string[] = [];
  next.on("request", (r) => {
    if (r.method() !== "POST") return;
    const path = new URL(r.url()).pathname;
    if (path.endsWith("/answer")) order.push("answer");
    if (path === "/api/adventure/resume") order.push("resume");
  });
  await next.goto("/#/play");
  await expect.poll(() => order.includes("resume")).toBe(true);
  expect(order.indexOf("answer")).toBeGreaterThanOrEqual(0);
  expect(order.indexOf("answer")).toBeLessThan(order.indexOf("resume"));
  expect(attempts(itemId)).toBe(1);
  await expect.poll(async () => (await queued(next)).length).toBe(0);
});

test("REQ-2434, REQ-2436, REQ-2438: with the network cut the waiting scene shows, no outcome and no new task, and the answer reaches the log once", async ({
  page,
  context,
}) => {
  await pairDevice(page);
  await ready(page, "/play");
  await expect(page.locator(".play .task")).toBeVisible();
  const shown = await page.locator(".play .task").innerText();

  const sent: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().endsWith("/answer"))
      sent.push((r.postDataJSON() as { itemId: string }).itemId);
  });
  await context.setOffline(true);
  await answerOnce(page);

  // The waiting scene, with no outcome, no correct answer and no next task.
  await expect(page.locator("[data-waiting]")).toContainText(WAITING);
  await expect(page.locator(".play .badge")).toHaveCount(0);
  await expect(page.locator(".play .solution")).toHaveCount(0);
  await expect(page.locator('[data-action="play-next"]')).toHaveCount(0);
  await expect(page.locator('[data-action="play-submit"]')).toHaveCount(0);
  expect(await queued(page)).toHaveLength(1);

  // The network comes back: the outcome and its grants arrive together.
  await context.setOffline(false);
  await expect(page.locator(".play .badge")).toBeVisible({ timeout: 40_000 });
  await expect(page.locator(".play .solution")).toBeVisible();
  await expect(page.locator("[data-waiting]")).toHaveCount(0);
  expect(await page.locator(".play .task").count()).toBe(0);
  await expect.poll(async () => (await queued(page)).length).toBe(0);
  const itemId = sent[0] ?? "";
  expect(itemId).not.toBe("");
  expect(attempts(itemId)).toBe(1);
  expect(shown.length).toBeGreaterThan(0);
});

test("REQ-2434: a closed client sends its answer once when the network is back", async ({
  page,
  context,
}) => {
  await pairDevice(page);
  await ready(page, "/play");
  await expect(page.locator(".play .task")).toBeVisible();
  let itemId = "";
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().endsWith("/answer"))
      itemId = (r.postDataJSON() as { itemId: string }).itemId;
  });
  await context.setOffline(true);
  await answerOnce(page);
  await expect(page.locator("[data-waiting]")).toBeVisible();
  await page.close();
  await context.setOffline(false);

  const next = await context.newPage();
  await next.goto("/#/play");
  await expect.poll(() => attempts(itemId)).toBe(1);
  await expect.poll(async () => (await queued(next)).length).toBe(0);
  // Another launch finds nothing left to send, and the log still holds it once.
  await next.reload();
  await expect(next.locator("[data-busy]")).toHaveCount(0);
  expect(attempts(itemId)).toBe(1);
});

test("REQ-2434: an answer unsent for 24 hours shows as queue_stuck in the settings with a retry", async ({
  page,
  context,
}) => {
  await page.clock.install({ time: Date.now() });
  await pairDevice(page);
  await ready(page, "/play");
  await expect(page.locator(".play .task")).toBeVisible();
  let itemId = "";
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().endsWith("/answer"))
      itemId = (r.postDataJSON() as { itemId: string }).itemId;
  });
  await context.setOffline(true);
  await answerOnce(page);
  await expect(page.locator("[data-waiting]")).toBeVisible();

  // Under 24 hours nothing is stuck yet.
  await page.evaluate(() => {
    location.hash = "#/settings";
  });
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/settings",
  );
  await expect(page.locator("[data-queue-stuck]")).toHaveCount(0);

  await page.clock.fastForward(24 * 60 * 60 * 1000 + 60_000);
  await page.evaluate(() => {
    location.hash = "#/";
  });
  await page.evaluate(() => {
    location.hash = "#/settings";
  });
  await expect(page.locator("[data-queue-stuck]")).toBeVisible();
  await expect(page.locator("[data-queue-stuck]")).toContainText("queue_stuck");
  await expect(page.locator("[data-queue-stuck] time")).toHaveCount(1);
  const retry = page.locator('[data-action="queue-retry"]');
  await expect(retry).toBeVisible();

  await context.setOffline(false);
  await retry.click();
  await expect.poll(() => attempts(itemId)).toBe(1);
  await expect(page.locator("[data-queue-stuck]")).toHaveCount(0);
});
