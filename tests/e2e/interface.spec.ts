// TSK-0100: one client shell with two interfaces. The first start picks one
// from the device (REQ-2536), the settings switch it and the device's row
// keeps it (REQ-2538), and the computer interface works from the keyboard
// alone with a visible focus ring (REQ-2540).
import Database from "better-sqlite3";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const DB = "/tmp/meowtower-e2e.sqlite";
const PARENT = "http://127.0.0.1:3925";

const shown = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset["interface"]);

// A full load each time: a hash change alone keeps the focus where it was,
// and the keyboard walk counts Tab presses from the top of the page.
async function ready(page: Page, route = "/"): Promise<void> {
  await page.goto("about:blank");
  await page.goto(`/#${route}`);
  await expect(page.locator("body")).toHaveAttribute("data-screen", route);
  // A screen that loads its content marks itself busy until it has.
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

test("REQ-2536: the first start picks the interface from the device", async ({
  page,
}, info) => {
  await ready(page);
  expect(await shown(page)).toBe(
    info.project.name === "ipad" ? "tablet" : "computer",
  );
});

test("REQ-2538: the switch in the settings holds after a reload and in the device's row", async ({
  page,
}, info) => {
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);

  const other = info.project.name === "ipad" ? "computer" : "tablet";
  await ready(page, "/settings");
  await page.locator(`[data-action="interface-${other}"]`).check();
  await expect(page.getByRole("status")).toHaveText("Сохранено.");
  // The client keeps nothing in the browser's storage, so after a reload only
  // the server's row can bring the choice back.
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await page.reload();
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/settings",
  );
  expect(await shown(page)).toBe(other);

  const db = new Database(DB, { readonly: true });
  const row = db
    .prepare("SELECT kind FROM devices ORDER BY created_at DESC LIMIT 1")
    .get() as { kind: string };
  db.close();
  expect(row.kind).toBe(other);
});

test("REQ-2540: every control of every route works from the keyboard with a focus ring", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "computer", "the computer interface only");
  await ready(page);
  const routes = JSON.parse(
    (await page.evaluate(() => document.documentElement.dataset["routes"])) ??
      "[]",
  ) as string[];
  expect(routes.length).toBeGreaterThan(0);
  const report: string[] = [];

  for (const route of routes) {
    await ready(page, route);
    // Walk the screen with Tab until focus comes back round.
    const controls: string[] = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          action: el.dataset["action"] ?? `untagged ${el.tagName}`,
          tag: el.tagName,
          type: (el as HTMLInputElement).type ?? "",
          ring:
            style.outlineStyle !== "none" &&
            parseFloat(style.outlineWidth) >= 2,
        };
      });
      if (!focused) continue;
      if (controls.includes(focused.action)) break;
      controls.push(focused.action);
      expect(focused.ring, `${route}: ${focused.action} has a focus ring`).toBe(
        true,
      );
      expect(focused.action).not.toMatch(/^untagged/);
    }
    expect(controls.length, `${route} has controls`).toBeGreaterThan(0);

    // Operate each control from the keyboard and see its action run.
    for (const [index, action] of controls.entries()) {
      await ready(page, route);
      await page.evaluate(() => delete document.body.dataset["lastAction"]);
      for (let i = 0; i <= index; i++) await page.keyboard.press("Tab");
      const kind = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement;
        return el.type === "radio" ? "radio" : el.tagName;
      });
      if (kind === "radio") await page.keyboard.press("ArrowDown");
      else if (kind === "INPUT") await page.keyboard.type("1");
      else await page.keyboard.press("Enter");
      const done = await page.evaluate(
        () => document.body.dataset["lastAction"] ?? null,
      );
      // A radio group's arrow key operates the next choice in the group.
      if (kind === "radio") expect(done).toMatch(/^interface-/);
      else expect(done).toBe(action);
      report.push(`${route} ${action}: ${done}`);
    }
  }
  console.log(`keyboard: ${report.length} controls on ${routes.length} routes`);
  for (const line of report) console.log(`  ${line}`);
});
