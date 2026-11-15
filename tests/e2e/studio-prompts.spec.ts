// REQ-8302: the prompt lab lists each prompt with its version, lets the parent change a field of one, and runs
// the same task with the prompt as it is and with the change, side by side. The studio routes are answered here.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const row = {
  id: "N1.compare.16",
  node: "N1",
  subtype: "compare",
  form: "numeric",
  groups: [3, 4],
  answerKind: "integer",
};

/** The bodies the page posted to run a frame, in order. */
const runs: Record<string, unknown>[] = [];

async function stub(page: Page): Promise<void> {
  await page.route("**/api/parent/studio/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace("/api/parent/studio", "");
    const json = (status: number, body: object) =>
      route.fulfill({ status, json: body });
    if (path === "/lab/prompts")
      return json(200, {
        prompts: [
          {
            id: "frames.ru",
            file: "content/frames/prompt.ru.json",
            version: "a1b2c3d4e5f6",
            fields: ["intro", "setting"],
          },
          {
            id: "scenario.ru",
            file: "content/story/scenario.ru.json",
            version: "0f0f0f0f0f0f",
            fields: ["system"],
          },
        ],
      });
    if (path === "/lab/prompts/frames.ru")
      return json(200, {
        id: "frames.ru",
        version: "a1b2c3d4e5f6",
        texts: { intro: "The old intro", setting: "The setting" },
      });
    if (path === "/tasks") return json(200, { templates: [row] });
    if (path === "/lab/run") {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      runs.push(body);
      return json(200, {
        story: body["patch"] ? "Story B with the change?" : "Story A as it is?",
        score: body["patch"] ? 0.81 : 0.63,
        fault: null,
        costUsd: 0.0021,
        version: "a1b2c3d4e5f6",
        patched: Boolean(body["patch"]),
      });
    }
    return json(404, { error: "unknown" });
  });
}

test("REQ-8302: the prompts are listed with their versions", async ({
  page,
}) => {
  await stub(page);
  await page.goto("/#/studio/prompts");
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/studio/prompts",
  );
  await expect(page.locator('[data-prompt="frames.ru"]')).toContainText(
    "a1b2c3d4e5f6",
  );
  await expect(page.locator('[data-prompt="scenario.ru"]')).toContainText(
    "0f0f0f0f0f0f",
  );
});

test("REQ-8302: a change is tried beside the prompt as it is, in two runs of the same task", async ({
  page,
}) => {
  runs.length = 0;
  await stub(page);
  await page.goto("/#/studio/prompts");
  await page.locator("#lab-prompt").selectOption("frames.ru");
  await page.locator("#lab-field").selectOption("intro");
  await expect(page.locator("#lab-text")).toHaveValue("The old intro");
  // With no change there is nothing to compare, and nothing is run.
  await page.locator('[data-action="lab-run"]').click();
  await expect(page.locator('[data-fault="lab"]')).toBeVisible();
  expect(runs).toHaveLength(0);

  await page.locator("#lab-text").fill("A better intro");
  await page.locator('[data-action="lab-run"]').click();
  const a = page.locator('[data-run="a"]');
  const b = page.locator('[data-run="b"]');
  await expect(a).toContainText("Story A as it is?");
  await expect(a).toContainText("0.63");
  await expect(b).toContainText("Story B with the change?");
  await expect(b).toContainText("0.81");
  await expect(b).toContainText("0.0021");
  expect(runs).toHaveLength(2);
  expect(runs[0]).not.toHaveProperty("patch");
  expect(runs[1]?.["patch"]).toEqual({
    field: "intro",
    text: "A better intro",
  });
  expect(runs[0]?.["templateId"]).toBe(runs[1]?.["templateId"]);
  expect(runs[0]?.["seed"]).toBe(runs[1]?.["seed"]);
});
