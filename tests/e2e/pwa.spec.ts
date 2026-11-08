// REQ-6510: a device that cannot reach the server says the game needs a connection, shows no task
// and no pairing field, and starts again by itself when the connection returns. The tests block
// the service worker, so the server is made unreachable at the request.
import { expect, test } from "./fixtures.js";

test("REQ-6510: a start with no reply shows the offline screen and no pairing field", async ({
  page,
}) => {
  await page.route("**/api/device", (route) => route.abort("connectionfailed"));
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-screen", "offline");
  await expect(page.locator('[data-action="retry"]')).toBeVisible();
  await expect(page.locator("#pair-code")).toHaveCount(0);

  await page.unroute("**/api/device");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-screen",
    "offline",
  );
  await expect(page.locator("body")).toHaveAttribute("data-screen", /.+/);
});
