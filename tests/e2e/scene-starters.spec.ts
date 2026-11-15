// REQ-6210, REQ-6212: a starter of a scene goes into the field on a tap, and the keys 1 to 3 insert it into an
// empty field; nothing is sent either way. The next scene is stood in for by the test, because the server's
// own scene has no starters until the Master writes one.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const PARENT = "http://127.0.0.1:3925";

async function pairDevice(page: Page): Promise<void> {
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await page.goto("about:blank");
  await page.goto("/#/pair");
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);
}

test("a tap inserts a starter at the cursor and the keys 1 to 3 insert into an empty field, with nothing sent", async ({
  page,
}) => {
  await pairDevice(page);
  await page.route("**/api/session/*/next", (route) =>
    route.fulfill({
      json: {
        kind: "scene",
        sceneId: "gate~1",
        lines: [{ speaker: "narrator", text: "The gate creaks." }],
        branches: [],
        draft: null,
        starters: ["Lift the lantern", "Knock twice", "Look behind"],
      },
    }),
  );
  const sent: unknown[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/scene/input")) sent.push(r.postDataJSON());
  });
  await page.goto("about:blank");
  await page.goto("/#/play");
  const field = page.locator("#scene-draft");
  await expect(field).toBeVisible();
  await expect(page.locator(".starter")).toHaveCount(3);

  await field.focus();
  await page.keyboard.press("2");
  await expect(field).toHaveValue("Knock twice");
  // The field holds text now, so a digit types itself.
  await page.keyboard.press("1");
  await expect(field).toHaveValue("Knock twice1");

  await field.fill("I");
  await page.locator('[data-action="scene-starter-1"]').click();
  await expect(field).toHaveValue("I Lift the lantern");

  expect(sent.filter((b) => (b as { kind: string }).kind === "text")).toEqual(
    [],
  );
});
