// REQ-8298, REQ-8300: the task lab opens a template as a task in a chosen language and seed, and the
// screen lab shows a child's screen in a frame in a chosen language. The studio routes are answered here.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const row = {
  id: "A1.add",
  node: "A1",
  subtype: "add",
  form: "numeric",
  groups: [3, 4],
  answerKind: "integer",
};

async function stub(page: Page, langs: string[]): Promise<void> {
  await page.route("**/api/parent/studio/tasks**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/tasks"))
      return route.fulfill({ status: 200, json: { templates: [row] } });
    langs.push(url.searchParams.get("lang") ?? "");
    return route.fulfill({
      status: 200,
      json: {
        template: row,
        seed: url.searchParams.get("seed") ?? "1a",
        lang: url.searchParams.get("lang"),
        text: "2 + 3?",
        svg: null,
        options: null,
        answer: "5",
        solution: ["2 + 3 = 5"],
        hints: ["Count on"],
        traps: [
          { id: "t", kind: "slip", entry: "6", explanation: "Off by one" },
        ],
        blank: "{a} + {b}",
        storyEstimateUsd: 0.0012,
      },
    });
  });
}

test("the task lab opens a template in another language and seed", async ({
  page,
}) => {
  const langs: string[] = [];
  await stub(page, langs);
  await page.goto("about:blank");
  await page.goto("/#/studio/tasks");
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/studio/tasks",
  );
  await page.locator('[data-action="task-A1.add"]').click();
  await expect(page.locator(".task-text")).toHaveText("2 + 3?");
  await page.locator('[data-action="task-lang-nl"]').click();
  await expect.poll(() => langs.at(-1)).toBe("nl");
  await page.locator('[data-action="task-next-seed"]').click();
  await expect(page.locator("#task-seed")).toHaveValue("1b");
});

test("the screen lab shows a child's screen in a frame in the chosen language", async ({
  page,
}) => {
  await page.goto("about:blank");
  await page.goto("/#/studio/screens");
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/studio/screens",
  );
  await page.locator('[data-action="screen-home-nl"]').click();
  await expect(page.locator("iframe.screen-frame")).toHaveAttribute(
    "src",
    "/?lang=nl#/",
  );
});
