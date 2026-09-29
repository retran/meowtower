// TSK-0350 on screen: a second device's tap moves the lease and turns the
// first device view-only (REQ-0220, REQ-0222), and two open devices that
// nobody taps take no lease (REQ-0220). The e2e server is shared, so each test
// pairs its own devices and reads its own sessions' events.
import Database from "better-sqlite3";
import type { BrowserContext, Page } from "@playwright/test";
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

async function play(page: Page): Promise<string> {
  const started = page.waitForResponse("**/api/session/start");
  await ready(page, "/play");
  const { sessionId } = (await (await started).json()) as {
    sessionId: string;
  };
  await expect(page.locator(".play .task")).toBeVisible();
  return sessionId;
}

function leaseTaken(sessionIds: string[]): number {
  const db = new Database(DB, { readonly: true });
  const marks = sessionIds.map(() => "?").join(",");
  const { n } = db
    .prepare(
      `SELECT COUNT(*) AS n FROM events WHERE type = 'device_lease_taken' AND session_id IN (${marks})`,
    )
    .get(...sessionIds) as { n: number };
  db.close();
  return n;
}

async function pairedContext(
  browser: import("@playwright/test").Browser,
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await pairDevice(page);
  return { context, page };
}

test("REQ-0220, REQ-0222: the second device's tap turns the first view-only within 5 seconds, and its next answer gets 409 lease_moved", async ({
  browser,
}) => {
  const first = await pairedContext(browser);
  const second = await pairedContext(browser);
  const firstSession = await play(first.page);

  await play(second.page);

  await expect(
    first.page.getByText("Приключение продолжено в другом месте"),
  ).toBeVisible({ timeout: 5000 });
  const late = await first.context.request.post(
    `/api/session/${firstSession}/answer`,
    {
      data: {
        itemId: "none",
        raw: "7",
        dontKnow: false,
        clientSeq: 1_000_000,
      },
    },
  );
  expect(late.status()).toBe(409);
  expect(((await late.json()) as { error: string }).error).toBe("lease_moved");
  await first.context.close();
  await second.context.close();
});

test("REQ-0220: two open devices that nobody taps take no lease beyond the first", async ({
  browser,
}) => {
  const first = await pairedContext(browser);
  const second = await pairedContext(browser);
  await first.page.clock.install();
  await second.page.clock.install();
  const session = await play(first.page);

  await first.page.clock.fastForward("10:00");
  await second.page.clock.fastForward("10:00");

  expect(leaseTaken([session])).toBe(1);
  await first.context.close();
  await second.context.close();
});
