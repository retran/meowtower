// TSK-0410 on screen: the stop offer without «Ещё один ряд» (REQ-2444). The
// finish-today rule itself is on the server and has its own tests with a fake
// clock; finishing the day for real would close the shared e2e server's game
// day for every later test, so these tests hand the client the packet the
// server sends and watch what it draws and sends.
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

/** Answers every `next` with the offer, as the server does after finish-today. */
async function offer(page: Page, canExtend: boolean): Promise<void> {
  await page.route("**/api/session/*/next", (route) =>
    route.fulfill({
      json: { kind: "stop_offer", canExtend },
    }),
  );
}

test("REQ-2444: after finish-today the stop screen offers no extra row and saves on leave", async ({
  page,
}) => {
  await pairDevice(page);
  await offer(page, false);
  const paused = page.waitForRequest("**/api/session/*/pause");
  await ready(page, "/play");
  await expect(page.locator(".play .stop")).toBeVisible();
  await expect(page.locator('[data-action="stop-extend"]')).toHaveCount(0);
  await expect(page.locator(".play")).not.toContainText("Ещё один ряд");

  await page.locator('[data-action="stop-leave"]').click();
  expect((await paused).postDataJSON()).toMatchObject({ reason: "leave" });
});

test("REQ-2444: a stop offer that can extend shows «Ещё один ряд» and asks the server", async ({
  page,
}) => {
  await pairDevice(page);
  await offer(page, true);
  await ready(page, "/play");
  const extend = page.locator('[data-action="stop-extend"]');
  await expect(extend).toHaveText("Ещё один ряд");

  const asked = page.waitForRequest("**/api/session/*/extend");
  await extend.click();
  expect((await asked).method()).toBe("POST");
});

test("REQ-2444: a refused extend keeps the screen without the button", async ({
  page,
}) => {
  await pairDevice(page);
  await offer(page, true);
  await page.route("**/api/session/*/extend", (route) =>
    route.fulfill({ status: 409, json: { error: "day_finished" } }),
  );
  await ready(page, "/play");
  await page.locator('[data-action="stop-extend"]').click();
  await expect(page.locator('[data-action="stop-extend"]')).toHaveCount(0);
  await expect(page.locator(".play .stop")).toBeVisible();
});
