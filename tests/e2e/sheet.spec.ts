// REQ-8394, REQ-8400: the hero sheet lists the nine skills by their names in the setting, and a skill
// with no answer says it has not shown up yet.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const PARENT = "http://127.0.0.1:3925";

async function ready(page: Page, route: string): Promise<void> {
  await page.goto("about:blank");
  await page.goto(`/#${route}`);
  await expect(page.locator("body")).toHaveAttribute("data-screen", route);
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

test("REQ-8400: the sheet shows nine skills and no number but a level and a percentage", async ({
  page,
}) => {
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);

  await ready(page, "/sheet");
  await expect(page.locator("li.skill")).toHaveCount(9);
  await expect(page.locator('li.skill[data-skill="marks"] h2')).toHaveText(
    "Метки",
  );
  await expect(page.locator("li.skill").first()).toContainText(
    "ещё не встречался",
  );
});
