// TSK-0050 on screen: a revoked device says it needs pairing from the Parent
// Room (REQ-2520), and a lockout names the time attempts resume (REQ-2522).
// TSK-0390 on screen: an expired parent session asks for the PIN on the page
// it expired on (REQ-2440), where the parent sets the three-day limit
// (REQ-0234).
// The lockout replies are routed here, so the shared e2e server never locks.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const PARENT = "http://127.0.0.1:3925";
const PIN = "4821";

async function ready(page: Page, route: string): Promise<void> {
  await page.goto("about:blank");
  await page.goto(`/#${route}`);
  await expect(page.locator("body")).toHaveAttribute("data-screen", route);
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

test("REQ-2520: a device the parent revokes shows that it needs pairing", async ({
  page,
}) => {
  await page.request.post(`${PARENT}/pin`, { data: { pin: PIN } });
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);

  await ready(page, "/parent");
  await page.locator("#parent-pin").fill(PIN);
  await page.locator('[data-action="parent-login"]').click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/parent/devices",
  );
  await expect(page.locator("[data-busy]")).toHaveCount(0);
  const mine = page.locator(".devices li", { hasText: "это устройство" });
  const revokeMine = mine.locator("button");
  await revokeMine.click();
  await expect(revokeMine).toHaveText("Точно отключить?");
  await revokeMine.click();

  // Revoking itself sends the device home, which says what it needs.
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/");
  await expect(page.getByRole("status")).toHaveText(
    /отключено в Комнате родителя/,
  );
  // A fresh start asks the server and says the same.
  await ready(page, "/");
  await expect(page.getByRole("status")).toHaveText(
    /отключено в Комнате родителя/,
  );
  // From the page, so the request carries the device's cookie.
  const reply = await page.evaluate(async () => {
    const res = await fetch("/api/device");
    return { status: res.status, body: (await res.json()) as unknown };
  });
  expect(reply).toEqual({ status: 401, body: { error: "device_revoked" } });
});

test("REQ-2522: the pairing and PIN screens name when attempts resume", async ({
  page,
}) => {
  const retryAt = new Date(Date.now() + 15 * 60 * 1000);
  const time = retryAt.toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
  await page.route("**/api/pair", (route) =>
    route.fulfill({
      status: 429,
      json: { error: "pairing_locked", retryAt: retryAt.toISOString() },
    }),
  );
  await ready(page, "/pair");
  await page.locator("#pair-code").fill("123456");
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(
    `Слишком много неверных кодов. Попробуй снова в ${time}.`,
  );

  await page.route("**/api/parent/login", (route) =>
    route.fulfill({
      status: 429,
      json: { error: "pin_locked", retryAt: retryAt.toISOString() },
    }),
  );
  await ready(page, "/parent");
  await page.locator("#parent-pin").fill(PIN);
  await page.locator('[data-action="parent-login"]').click();
  await expect(page.getByRole("status")).toHaveText(
    `Слишком много неверных PIN. Вход снова откроется в ${time}.`,
  );
});

test("REQ-2440, REQ-0234: an expired session asks for the PIN in place and keeps the choice", async ({
  page,
}) => {
  await page.request.post(`${PARENT}/pin`, { data: { pin: PIN } });
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);
  await ready(page, "/parent");
  await page.locator("#parent-pin").fill(PIN);
  await page.locator('[data-action="parent-login"]').click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/parent/devices",
  );

  // The e2e server is shared, so an earlier run may have changed the limit;
  // the integration test proves the default.
  // The body is read, because an unread one stays open.
  await page.evaluate(async () => {
    const res = await fetch("/api/parent/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ threeDayLimit: 3 }),
    });
    await res.json();
  });
  await ready(page, "/parent/settings");
  await expect(page.locator('[data-action="three-day-3"]')).toBeChecked();
  // The server's own expiry takes 30 minutes; the first save here meets the
  // reply it gives then.
  let expired = false;
  await page.route("**/api/parent/settings", (route) => {
    if (route.request().method() !== "PUT" || expired) return route.continue();
    expired = true;
    return route.fulfill({
      status: 401,
      json: { error: "parent_session_expired" },
    });
  });
  await page.locator('[data-action="three-day-5"]').check();
  await expect(page.getByRole("status")).toHaveText(/Прошло 30 минут/);
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/parent/settings",
  );
  await expect(page.locator('[data-action="three-day-5"]')).toBeChecked();
  await page.locator("#parent-pin").fill(PIN);
  await page.locator('[data-action="parent-login"]').click();
  await expect(page.getByRole("status")).toHaveText("Сохранено.");
  await expect(page.locator("#parent-pin")).toHaveCount(0);

  await ready(page, "/parent/settings");
  await expect(page.locator('[data-action="three-day-5"]')).toBeChecked();
  await page.locator('[data-action="three-day-off"]').check();
  await expect(page.getByRole("status")).toHaveText("Сохранено.");
  await ready(page, "/parent/settings");
  await expect(page.locator('[data-action="three-day-off"]')).toBeChecked();
});
