// REQ-8258, REQ-8276: the studio draws the campaign as a graph of arcs, opening a node opens the graph
// inside it, a breadcrumb goes back, a node can be added and approved, and the logs of the played
// adventures are listed. The e2e server has no studio data, so the studio routes are answered here.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

async function ready(page: Page): Promise<void> {
  await page.goto("about:blank");
  await page.goto("/#/studio");
  await expect(page.locator("body")).toHaveAttribute("data-screen", "/studio");
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

interface Fake {
  id: string;
  level: string;
  parentId: string | null;
  title: string;
  status: string;
  version: number;
  links: string[];
}

/** What the sandbox was asked to force, in order. */
const forces: object[] = [];

/** What the sandbox was asked to set, in order. */
const levers: object[] = [];

/** What the sandbox was asked to start, in order. */
const started: object[] = [];

/** A tiny studio server with one campaign, two arcs that lead from the first to the second. */
async function stub(page: Page): Promise<Fake[]> {
  const nodes: Fake[] = [
    {
      id: "c1",
      level: "campaign",
      parentId: null,
      title: "The year",
      status: "draft",
      version: 1,
      links: [],
    },
    {
      id: "a1",
      level: "arc",
      parentId: "c1",
      title: "The bridge",
      status: "draft",
      version: 1,
      links: ["a2"],
    },
    {
      id: "a2",
      level: "arc",
      parentId: "c1",
      title: "The lock",
      status: "draft",
      version: 1,
      links: [],
    },
    {
      id: "d1",
      level: "adventure",
      parentId: "a1",
      title: "The fog",
      status: "draft",
      version: 1,
      links: [],
    },
  ];
  await page.route("**/api/parent/studio/**", async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname.replace("/api/parent/studio", "");
    const method = route.request().method();
    const json = (status: number, body: object) =>
      route.fulfill({ status, json: body });
    if (path === "/nodes" && method === "GET") {
      const parent = url.searchParams.get("parent");
      return json(200, {
        nodes: nodes.filter((n) => n.parentId === (parent ?? null)),
      });
    }
    if (path === "/nodes" && method === "POST") {
      const b = route.request().postDataJSON() as {
        level: string;
        parentId: string | null;
        title: string;
      };
      const made: Fake = {
        id: `n${String(nodes.length)}`,
        level: b.level,
        parentId: b.parentId,
        title: b.title,
        status: "draft",
        version: 1,
        links: [],
      };
      nodes.push(made);
      return json(201, made);
    }
    const status = /^\/nodes\/([^/]+)\/status$/.exec(path);
    if (status && method === "POST") {
      const n = nodes.find((x) => x.id === status[1]);
      if (n)
        n.status = (
          route.request().postDataJSON() as { status: string }
        ).status;
      return json(200, n ?? {});
    }
    if (path === "/sandbox/play/adventures/d1/encounters")
      return json(200, {
        encounters: [
          { id: "e1", title: "The gate", status: "draft" },
          { id: "e2", title: "The bridge", status: "approved" },
        ],
      });
    if (path === "/sandbox/play/start" && method === "POST") {
      started.push(route.request().postDataJSON() as object);
      return json(200, { sessionId: "s1", scene: {} });
    }
    if (path === "/sandbox/force" && method === "POST") {
      forces.push(route.request().postDataJSON() as object);
      return json(200, { status: "ok" });
    }
    if (path === "/sandbox/levers" && method === "POST") {
      levers.push(route.request().postDataJSON() as object);
      return json(200, { status: "ok" });
    }
    if (path === "/logs/adventures")
      return json(200, { adventures: [{ adventureId: "adv-1", events: 3 }] });
    if (path === "/logs/adventures/adv-1")
      return json(200, {
        events: [
          { seq: 1, ts: "t", type: "adventure_planned" },
          { seq: 2, ts: "t", type: "session_started" },
        ],
      });
    return json(404, { error: "unknown" });
  });
  return nodes;
}

test("REQ-8258: the campaign shows as a graph, a node opens the graph inside it, and a crumb goes back", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await expect(page.locator('button[data-node="c1"]')).toBeVisible();
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await expect(page.locator('button[data-node="a1"]')).toBeVisible();
  await expect(page.locator('button[data-node="a2"]')).toBeVisible();
  // The first arc leads to the second, so the second is in the layer to the right.
  const first = await page.locator('button[data-node="a1"]').boundingBox();
  const second = await page.locator('button[data-node="a2"]').boundingBox();
  expect(first && second && second.x > first.x + first.width - 1).toBe(true);
  await page.locator('[data-action="crumb-root"]').click();
  await expect(page.locator('button[data-node="c1"]')).toBeVisible();
});

test("REQ-8274: a node is added, approved and sent back to draft from the panel", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await page.locator("#studio-title").fill("Another year");
  await page.locator('[data-action="studio-add"]').click();
  await expect(page.getByText("Добавлено.")).toBeVisible();
  await page.locator('button[data-node="n4"]').click();
  await expect(page.getByText("черновик").first()).toBeVisible();
  await page.locator('[data-action="studio-approve"]').click();
  await page.locator('button[data-node="n4"]').click();
  await expect(page.locator('[data-action="studio-draft"]')).toBeVisible();
  await page.locator('[data-action="studio-draft"]').click();
  await page.locator('button[data-node="n4"]').click();
  await expect(page.locator('[data-action="studio-approve"]')).toBeVisible();
});

test("REQ-8276: the logs of the played adventures are listed and one can be read", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await expect(page.getByText("3 событий")).toBeVisible();
  await page.locator('[data-action="log-adv-1"]').click();
  await expect(page.locator("ol.log li")).toHaveCount(2);
  await expect(page.locator("ol.log")).toContainText("session_started");
});

test("REQ-8286: any encounter of a draft adventure starts play in the sandbox frame", async ({
  page,
}) => {
  started.length = 0;
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="d1"]').click();
  await page.locator('[data-action="studio-play"]').click();
  const from = page.locator('[data-action="studio-play-from"]');
  await expect(from).toHaveCount(2);
  await from.nth(1).click();
  await expect(
    page.locator('[data-action="studio-play-frame"]'),
  ).toHaveAttribute("src", /\?sandbox=1&lang=\w+#\/play/);
  expect(started).toEqual([{ adventureId: "d1", encounterId: "e2" }]);
});

test("REQ-8286: the game opened with sandbox=1 asks the sandbox and never her game", async ({
  page,
}) => {
  const asked: string[] = [];
  await page.route("**/api/**", (route) => {
    asked.push(new URL(route.request().url()).pathname);
    return route.fulfill({
      status: 401,
      json: { error: "device_token_missing" },
    });
  });
  await page.goto("about:blank");
  await page.goto("/?sandbox=1#/play");
  await expect.poll(() => asked.length).toBeGreaterThan(0);
  expect(
    asked.every((p) =>
      p.startsWith("/api/parent/studio/sandbox/play/child/api/"),
    ),
  ).toBe(true);
});

test("REQ-8288: a state is picked, filled in and set in the sandbox", async ({
  page,
}) => {
  levers.length = 0;
  await stub(page);
  await ready(page);
  await page.locator("#lever-kind").selectOption("friendship");
  await page.locator("#lever-familiarId").fill("f1");
  await page.locator("#lever-points").fill("12");
  await page.locator("#lever-level").fill("3");
  await page.locator('[data-action="lever-set"]').click();
  await expect(page.getByText("Задано в песочнице.")).toBeVisible();
  await page.locator("#lever-kind").selectOption("creepiness");
  await page.locator("#lever-value").fill("2");
  await page.locator('[data-action="lever-set"]').click();
  await expect.poll(() => levers.length).toBe(2);
  expect(levers).toEqual([
    { kind: "friendship", familiarId: "f1", points: 12, level: 3 },
    { kind: "creepiness", value: 2 },
  ]);
});

test("REQ-8290: the next outcome is chosen and forced in the sandbox", async ({
  page,
}) => {
  forces.length = 0;
  await stub(page);
  await ready(page);
  await page.locator("#force-next").selectOption("partial");
  await page.locator('[data-action="force-set"]').click();
  await expect(page.getByText("Задано в песочнице.")).toBeVisible();
  await page.locator("#force-next").selectOption("fall");
  await page.locator('[data-action="force-set"]').click();
  await expect.poll(() => forces.length).toBe(2);
  expect(forces).toEqual([{ next: "partial" }, { next: "fall" }]);
});
