// REQ-8304: the checklist page names where each feature is tested, after the parent asks for it.
import { expect, test } from "./fixtures.js";

test("REQ-8304: the checklist page lists each feature with the tests that cover it", async ({
  page,
}) => {
  await page.route("**/api/parent/studio/checklist", (route) =>
    route.fulfill({
      json: {
        features: [
          { id: "screen:/play", tests: ["tests/e2e/play.spec.ts"] },
          {
            id: "api:POST /sandbox/force",
            tests: ["tests/integration/sandbox-force.test.ts"],
          },
        ],
      },
    }),
  );
  await page.goto("about:blank");
  await page.goto("/#/studio/checklist");
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/studio/checklist",
  );
  await expect(page.locator("ul.checklist li")).toHaveCount(0);
  await page.locator('[data-action="checklist-show"]').click();
  await expect(page.locator("ul.checklist li")).toHaveCount(2);
  await expect(page.locator("ul.checklist")).toContainText("screen:/play");
  await expect(page.locator("ul.checklist")).toContainText(
    "tests/integration/sandbox-force.test.ts",
  );
});
