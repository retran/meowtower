// TSK-0420 on screen: a device keeps only the unsent entries of its event
// queue (REQ-6506). The client asks for persistent storage on its first
// launch, and a device that has played holds nothing else a page can see:
// IndexedDB with the queue's store, no localStorage or sessionStorage, no
// cookie the page can read, an empty origin-private file system, and a
// service worker cache of code and pictures only.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

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

test("REQ-6506: the client asks for persistent storage on its first launch", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const calls: number[] = [];
    (window as unknown as { persistCalls: number[] }).persistCalls = calls;
    const storage = navigator.storage;
    storage.persist = () => {
      calls.push(Date.now());
      return Promise.resolve(true);
    };
  });
  await ready(page, "/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { persistCalls: number[] }).persistCalls.length,
      ),
    )
    .toBeGreaterThan(0);
});

test("REQ-6506: a device that has played holds only the queue's store and code and pictures in its caches", async ({
  page,
}) => {
  await pairDevice(page);
  await ready(page, "/play");
  await expect(page.locator(".play .task")).toBeVisible();
  await page.locator("#play-answer").fill("7");
  await page.locator('[data-action="play-submit"]').click();
  await expect(page.locator(".play .badge")).toBeVisible();
  // Let the service worker take the page and fill its cache.
  await page.reload();
  await expect(page.locator("[data-busy]")).toHaveCount(0);

  const held = await page.evaluate(async () => {
    const dbs = (await indexedDB.databases()).map((d) => d.name);
    const stores: Record<string, string[]> = {};
    const entries: unknown[] = [];
    for (const name of dbs) {
      if (!name) continue;
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const open = indexedDB.open(name);
        open.onsuccess = () => resolve(open.result);
        open.onerror = () => reject(open.error);
      });
      stores[name] = [...db.objectStoreNames];
      for (const store of db.objectStoreNames) {
        const all = await new Promise<unknown[]>((resolve, reject) => {
          const req = db.transaction(store).objectStore(store).getAll();
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        entries.push(...all);
      }
      db.close();
    }
    let opfs: string[] | null = null;
    if (navigator.storage.getDirectory) {
      const root = await navigator.storage.getDirectory();
      opfs = [];
      for await (const key of (
        root as unknown as { keys(): AsyncIterable<string> }
      ).keys())
        opfs.push(key);
    }
    const cached: string[] = [];
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const req of await cache.keys())
        cached.push(new URL(req.url).pathname);
    }
    return {
      dbs,
      stores,
      entries,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
      cookie: document.cookie,
      opfs,
      cached,
    };
  });

  expect(held.dbs.filter(Boolean)).toEqual(["meowtower-queue"]);
  expect(held.stores["meowtower-queue"]).toEqual(["entries"]);
  expect(held.entries).toEqual([]);
  expect(held.localStorage).toBe(0);
  expect(held.sessionStorage).toBe(0);
  expect(held.cookie).toBe("");
  if (held.opfs !== null) expect(held.opfs).toEqual([]);
  // Code, the language file and pictures; no answer, no packet, no sound.
  for (const path of held.cached)
    expect(path).toMatch(
      /^(\/|\/client\/[a-z-]+\.js|\/i18n\/[a-z]+\.json|\/manifest\.webmanifest|\/icon-512\.png)$/,
    );
  expect(held.cached.some((p) => p.startsWith("/api/"))).toBe(false);
});

test("REQ-6506: the queue's store keeps each of the five entry kinds in the order made", async ({
  page,
}) => {
  await ready(page, "/");
  const result = await page.evaluate(async () => {
    const url = "/client/event-queue.js";
    const queue = (await import(url)) as {
      enqueue(kind: string, idemKey: string, body: unknown): Promise<unknown>;
      entries(): Promise<{ idemKey: string; kind: string }[]>;
      remove(idemKey: string): Promise<void>;
    };
    const kinds = [
      "answer",
      "grouping_set",
      "looks_set",
      "glossary_opened",
      "plan_draft",
    ];
    for (const [i, kind] of kinds.entries())
      await queue.enqueue(kind, `k-${i}`, { n: i });
    const listed = (await queue.entries()).map((e) => [e.idemKey, e.kind]);
    await queue.remove("k-1");
    const after = (await queue.entries()).map((e) => e.idemKey);
    for (const e of await queue.entries()) await queue.remove(e.idemKey);
    const empty = (await queue.entries()).length;
    return { listed, after, empty };
  });
  expect(result.listed).toEqual([
    ["k-0", "answer"],
    ["k-1", "grouping_set"],
    ["k-2", "looks_set"],
    ["k-3", "glossary_opened"],
    ["k-4", "plan_draft"],
  ]);
  expect(result.after).toEqual(["k-0", "k-2", "k-3", "k-4"]);
  expect(result.empty).toBe(0);
});
