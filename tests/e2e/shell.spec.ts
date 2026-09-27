import { expect, test } from "./fixtures.js";

test("REQ-2504: the installable page reaches the client without the model key", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  const manifest = await page.request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  await page.goto("/icon-512.png");
});

// The recorder must catch a leak: a response carrying the key fails the test.
test.fail(
  "the recorder fails a response that carries the key",
  async ({ page }) => {
    await page.route("**/leak", (route) =>
      route.fulfill({ status: 200, body: "sk-or-v1-e2e-fake-key-0000" }),
    );
    await page.goto("/leak");
  },
);
