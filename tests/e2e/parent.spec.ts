// TSK-0050 on screen: a revoked device says it needs pairing from the Parent
// Room (REQ-2520), and a lockout names the time attempts resume (REQ-2522).
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
