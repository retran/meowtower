// REQ-8280, REQ-8282: the parent writes the child's profile in the settings, and it is kept.
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

async function settings(page: Page): Promise<void> {
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
  await ready(page, "/parent/settings");
}

test("REQ-8280: the profile of the child is written, saved and still there after a reload", async ({
  page,
}) => {
  await settings(page);
  await page.locator("#profile").fill("Любит кошек и загадки.");
  await page.locator('[data-action="profile-save"]').click();
  await expect(page.getByRole("status").last()).toHaveText(/Сохранено/);
  await ready(page, "/parent/settings");
  await expect(page.locator("#profile")).toHaveValue("Любит кошек и загадки.");
});

test("REQ-8282: a profile that is too long is refused beside the field", async ({
  page,
}) => {
  await settings(page);
  await page.locator("#profile").fill("x".repeat(2001));
  await page.locator('[data-action="profile-save"]').click();
  await expect(page.locator('[data-fault="profile"]')).toBeVisible();
});
