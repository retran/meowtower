// ADR-3470: the Parent Room is one frame with a left-hand menu of the parent's jobs. The PIN opens
// the overview, every screen behind it shows the menu with its own item marked, the logs read the
// tasks and model calls, the studio's inspector sits beside the graph, and a narrow window shows the
// menu as a bar above the screen.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const PARENT = "http://127.0.0.1:3925";
const PIN = "4821";

/** The menu's items, the route each opens, in the menu's order (REQ-7674). */
const MENU = [
  ["open-overview", "/parent/home"],
  ["open-studio", "/studio"],
  ["open-checklist", "/studio/checklist"],
  ["open-task-lab", "/studio/tasks"],
  ["open-prompt-lab", "/studio/prompts"],
  ["open-screen-lab", "/studio/screens"],
  ["open-logs", "/parent/logs"],
  ["open-parent-devices", "/parent/devices"],
  ["open-parent-settings", "/parent/settings"],
  ["open-account", "/account"],
] as const;

/** Pairs the page's device and opens a parent session with the PIN. */
async function enter(page: Page): Promise<void> {
  await page.request.post(`${PARENT}/pin`, { data: { pin: PIN } });
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await page.goto("about:blank");
  await page.goto("/#/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);
  await page.goto("/#/parent");
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/parent");
  // The PIN entry stands alone, without the menu (REQ-7676).
  await expect(page.locator(".room-menu")).toHaveCount(0);
  await page.locator("#parent-pin").fill(PIN);
  await page.locator('[data-action="parent-login"]').click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-screen",
    "/parent/home",
  );
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

test("REQ-7672, REQ-7674, REQ-7676: the PIN opens the overview and the menu reaches every screen, marking it", async ({
  page,
}) => {
  await enter(page);
  const actions = await page
    .locator(".room-menu a[data-action]")
    .evaluateAll((links) =>
      links.map((a) => (a as HTMLElement).dataset["action"]),
    );
  expect(actions).toEqual([...MENU.map(([action]) => action), "back"]);
  for (const [action, route] of MENU) {
    await page.locator(`.room-menu [data-action="${action}"]`).click();
    await expect(page.locator("body")).toHaveAttribute("data-screen", route);
    const current = page.locator('.room-menu [aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute("data-action", action);
  }
  await page.locator('.room-menu [data-action="back"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/");
  await expect(page.locator(".room-menu")).toHaveCount(0);
});

test("REQ-7678: the overview shows six figures as tiles, the notices, the falls and the finish control", async ({
  page,
}) => {
  await enter(page);
  await expect(page.locator("[data-kpi]")).toHaveCount(6);
  await expect(page.locator('[data-kpi="month"]')).toContainText("$");
  await expect(page.locator("ul.falls li")).toHaveCount(1);
  const finish = page.locator('[data-action="finish-today"]');
  await expect(finish).toBeVisible();
  // The first press asks again; the test stops there, so the shared server's game day goes on.
  await finish.click();
  await expect(page.getByRole("status").last()).toHaveText(/Нажмите ещё раз/);
});

test("REQ-7682: the logs show a task played and a model call in full", async ({
  page,
}) => {
  await enter(page);
  await page.route("**/api/parent/audit/llm*", (route) =>
    route.fulfill({
      json: [
        {
          id: 1,
          at: "2026-11-15T10:00:00Z",
          role: "MASTER_MODEL",
          route: "openrouter",
          model: "anthropic/claude-sonnet-5.5",
          input_tokens: 10,
          output_tokens: 20,
          cost_usd: 0.002,
          latency_ms: 900,
          outcome: "ok",
          request: "the whole request",
          response: "the whole reply",
        },
      ],
    }),
  );
  await page.route("**/api/parent/audit/play*", (route) =>
    route.fulfill({
      json: [
        {
          at: "2026-11-15T10:00:00Z",
          templateId: "A1-T1",
          node: "A1",
          source: "template",
          text: "Сколько будет 2 + 3?",
          correctAnswer: "5",
          answer: "5",
          verdict: "correct",
          hints: 0,
        },
      ],
    }),
  );
  await page.locator('[data-action="open-logs"]').click();
  await expect(page.locator("[data-busy]")).toHaveCount(0);
  await expect(page.locator("table tbody tr")).toHaveCount(1);
  await expect(page.locator("table tbody")).toContainText("A1-T1");
  await page.locator('[data-action="log-tab-calls"]').click();
  await expect(page.locator("table tbody")).toContainText("MASTER_MODEL");
  await page.locator("table tbody summary").click();
  await expect(page.locator("table tbody pre").first()).toHaveText(
    "the whole request",
  );
  await expect(page.locator("table tbody pre").last()).toHaveText(
    "the whole reply",
  );
});

test("REQ-7686: the studio's inspector sits beside the graph on the computer, and the sandbox's tools on the testing screen", async ({
  page,
}, info) => {
  await enter(page);
  await page.locator('[data-action="open-studio"]').click();
  await expect(page.locator("[data-busy]")).toHaveCount(0);
  const canvas = await page.locator(".canvas").boundingBox();
  const inspector = await page.locator(".inspector-panel").boundingBox();
  expect(canvas && inspector).toBeTruthy();
  if (info.project.name === "computer")
    expect(inspector?.x ?? 0).toBeGreaterThan(
      (canvas?.x ?? 0) + (canvas?.width ?? 0) - 1,
    );
  await expect(page.locator("#lever-kind")).toHaveCount(0);
  await page.locator('[data-action="open-checklist"]').click();
  await expect(page.locator("#lever-kind")).toBeVisible();
  await expect(page.locator("#force-next")).toBeVisible();
});

test("REQ-7688: under 768 px the menu is a bar above the screen", async ({
  page,
}) => {
  await enter(page);
  await page.setViewportSize({ width: 700, height: 900 });
  const bar = await page.locator(".room .navbar-vertical").boundingBox();
  const title = await page.locator("#screen-title").boundingBox();
  expect(bar && title).toBeTruthy();
  expect((bar?.y ?? 0) + (bar?.height ?? 0)).toBeLessThanOrEqual(
    (title?.y ?? 0) + 1,
  );
  await expect(
    page.locator('.room-menu [data-action="open-account"]'),
  ).toBeAttached();
});

test("REQ-7692: the room follows the device's theme until the parent picks light or dark, and keeps the choice", async ({
  page,
}) => {
  await enter(page);
  const root = page.locator("html");
  await page.locator('[data-action="open-parent-settings"]').click();
  await expect(page.locator("[data-busy]")).toHaveCount(0);
  // The device's own setting rules while the choice is the device's.
  await page.locator('[data-action="room-theme-auto"]').check();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(root).toHaveAttribute("data-bs-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(root).toHaveAttribute("data-bs-theme", "light");
  // The menu's switch picks the other theme and the server keeps it across a reload.
  await page.locator('[data-action="room-theme"]').click();
  await expect(root).toHaveAttribute("data-bs-theme", "dark");
  await expect
    .poll(async () =>
      page.evaluate(async () => {
        const res = await fetch("/api/parent/settings");
        return ((await res.json()) as { roomTheme: string }).roomTheme;
      }),
    )
    .toBe("dark");
  await page.reload();
  await expect(page.locator("[data-busy]")).toHaveCount(0);
  await expect(root).toHaveAttribute("data-bs-theme", "dark");
  // The game keeps its own look.
  await page.locator('.room-menu [data-action="back"]').click();
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/");
  await expect(root).not.toHaveAttribute("data-bs-theme", /./);
  // Back to the device's, so the shared server leaves the other tests as they were.
  await page.evaluate(async () => {
    const res = await fetch("/api/parent/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ roomTheme: "auto" }),
    });
    await res.json();
  });
});
