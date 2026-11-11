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
  await page.locator('button[data-node="n3"]').click();
  await expect(page.getByText("черновик").first()).toBeVisible();
  await page.locator('[data-action="studio-approve"]').click();
  await page.locator('button[data-node="n3"]').click();
  await expect(page.locator('[data-action="studio-draft"]')).toBeVisible();
  await page.locator('[data-action="studio-draft"]').click();
  await page.locator('button[data-node="n3"]').click();
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
