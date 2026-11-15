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
  needsReview?: boolean;
}

/** What the Master was asked in a turn, in order. */
const turned: object[] = [];

/** What the sandbox was asked to force, in order. */
const forces: object[] = [];

/** What the sandbox was asked to set, in order. */
const levers: object[] = [];

/** What the sandbox was asked to start, in order. */
const started: object[] = [];

/** The nodes that have a generated version waiting, and what the parent decided about them. */
const waiting = new Set<string>();
const decided: string[] = [];

/** What the studio asked a generator to write, and the jobs it will read back in turn. */
const generated: object[] = [];
let jobFlow: { state: string; progress: number; message: string }[] = [];

/** The nodes the studio was told were reviewed, in order. */
const reviewedLog: string[] = [];

/** The nodes the studio was asked to archive and to bring back, in order. */
const archivedLog: string[] = [];
const hidden = new Set<string>();

/** The versions the studio was asked to restore, in order. */
const restored: number[] = [];

/** The edits the studio was asked to store, in order. */
const saved: { id: string; body: Record<string, unknown> }[] = [];

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
      version: 3,
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
      needsReview: true,
    },
    {
      id: "e1",
      level: "encounter",
      parentId: "d1",
      title: "The gate",
      status: "draft",
      version: 1,
      links: ["e2"],
    },
    {
      id: "e2",
      level: "encounter",
      parentId: "d1",
      title: "The bridge",
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
      const archived = url.searchParams.get("archived") === "1";
      return json(200, {
        nodes: nodes.filter(
          (n) =>
            n.parentId === (parent ?? null) && hidden.has(n.id) === archived,
        ),
      });
    }
    const reviewed = /^\/nodes\/([^/]+)\/reviewed$/.exec(path);
    if (reviewed && method === "POST") {
      reviewedLog.push(reviewed[1] ?? "");
      const n = nodes.find((x) => x.id === reviewed[1]);
      if (n) n.needsReview = false;
      return json(200, n ?? {});
    }
    const archive = /^\/nodes\/([^/]+)\/(archive|unarchive)$/.exec(path);
    if (archive && method === "POST") {
      archivedLog.push(`${archive[2] ?? ""} ${archive[1] ?? ""}`);
      if (archive[2] === "archive") hidden.add(archive[1] ?? "");
      else hidden.delete(archive[1] ?? "");
      return json(200, nodes.find((x) => x.id === archive[1]) ?? {});
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
    const one = /^\/nodes\/([^/]+)$/.exec(path);
    if (one && method === "GET")
      return json(200, {
        node: nodes.find((x) => x.id === one[1]),
        body:
          one[1] === "e1"
            ? { place: "A gate in the fog" }
            : one[1] === "d1"
              ? { premise: "A fog", scenario: { x: 1 } }
              : null,
      });
    if (one && method === "PUT") {
      const b = route.request().postDataJSON() as {
        body: Record<string, unknown>;
      };
      if (b.body["logline"] === "FAULT")
        return json(400, {
          error: "edit_refused",
          fault: {
            field: "logline",
            code: "too_long",
            held: "4001",
            need: "4000",
          },
        });
      if (b.body["situation"] === "FAULT")
        return json(400, {
          error: "edit_refused",
          fault: {
            field: "situation",
            code: "too_long",
            held: "700",
            need: "600",
          },
        });
      saved.push({ id: one[1] ?? "", body: b.body });
      const n = nodes.find((x) => x.id === one[1]);
      if (n) n.version += 1;
      return json(200, n ?? {});
    }
    const versions = /^\/nodes\/([^/]+)\/versions$/.exec(path);
    if (versions && method === "GET") {
      const n = nodes.find((x) => x.id === versions[1]);
      return json(200, {
        versions: [
          ...Array.from({ length: n?.version ?? 1 }, (_, i) => ({
            version: i + 1,
            state: i + 1 === (n?.version ?? 1) ? "current" : "history",
            body: { place: "A gate", goal: "Cross" },
            prompt: null,
            author: i === 1 ? "generator" : "parent",
            createdAt: "2026-11-10T12:00:00.000Z",
          })),
          ...(waiting.has(versions[1] ?? "")
            ? [
                {
                  version: (n?.version ?? 1) + 1,
                  state: "pending",
                  body: {
                    place: "A new gate",
                    goal: "Cross",
                    pressure: "Dusk",
                    review: {
                      revisions: 6,
                      unresolved: ["No turn in encounter 3"],
                      minor: ["a small thing"],
                    },
                  },
                  prompt: "p",
                  author: "generator",
                  createdAt: "2026-11-10T12:00:00.000Z",
                },
              ]
            : []),
        ],
      });
    }
    if (path === "/nodes/d1/generate/estimate")
      return json(200, {
        calls: { min: 4, max: 17 },
        spentUsd: 1.5,
        estimateUsd: { min: 0.2, max: 0.85 },
        basis: "default",
        measuredCalls: 0,
      });
    if (path === "/nodes/d1/generate" && method === "POST") {
      generated.push(route.request().postDataJSON() as object);
      return json(202, {
        job: { id: "j1", state: "queued", progress: 0, message: "" },
      });
    }
    if (path === "/jobs/j1") {
      const next = jobFlow.length > 1 ? jobFlow.shift() : jobFlow[0];
      return json(200, { id: "j1", kind: "generate", nodeId: "d1", ...next });
    }
    const decide = /^\/nodes\/([^/]+)\/pending\/(keep|discard)$/.exec(path);
    if (decide && method === "POST") {
      decided.push(`${decide[2] ?? ""} ${decide[1] ?? ""}`);
      waiting.delete(decide[1] ?? "");
      return json(200, {
        ...(nodes.find((x) => x.id === decide[1]) ?? {}),
        created: decide[2] === "keep" ? 3 : 0,
      });
    }
    const restore = /^\/nodes\/([^/]+)\/versions\/(\d+)\/restore$/.exec(path);
    if (restore && method === "POST") {
      restored.push(Number(restore[2]));
      const n = nodes.find((x) => x.id === restore[1]);
      if (n) n.version += 1;
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
    if (path === "/sandbox/play/turn" && method === "POST") {
      turned.push(route.request().postDataJSON() as object);
      return json(200, {
        reply: "The bridge sways.",
        blocked: false,
        calls: [],
        refused: [],
      });
    }
    if (path === "/sandbox/play/turns")
      return json(200, {
        turns: [
          {
            encounter: "e2",
            said: "I step onto the bridge",
            reply: "The bridge sways.",
            changes: [{ kind: "place", name: "bridge", note: "it sways" }],
            check: { node: "N1", subtype: "a", purpose: "review" },
          },
        ],
        modelCalls: [
          {
            at: "t",
            costUsd: 0.0123,
            latencyMs: 456,
            request: "REQ-TEXT",
            response: "RESP-TEXT",
          },
        ],
      });
    if (path === "/sandbox/play/reached")
      return json(200, {
        encounters: ["e1"],
        exits: [{ from: "e1", to: "e2" }],
      });
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
  await page.locator('button[data-node="n6"]').click();
  await expect(page.getByText("черновик").first()).toBeVisible();
  await page.locator('[data-action="studio-approve"]').click();
  await page.locator('button[data-node="n6"]').click();
  await expect(page.locator('[data-action="studio-draft"]')).toBeVisible();
  await page.locator('[data-action="studio-draft"]').click();
  await page.locator('button[data-node="n6"]').click();
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

test("REQ-8296: the encounters and exits a test reached are marked on the graph", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="d1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await expect(page.locator('button[data-node="e1"]')).toHaveAttribute(
    "data-reached",
    "1",
  );
  await expect(page.locator('button[data-node="e2"]')).not.toHaveAttribute(
    "data-reached",
    "1",
  );
  await expect(page.locator("svg line[data-reached]")).toHaveCount(1);
  await expect(page.locator('button[data-node="e1"]')).toContainText(
    "Достигнуто",
  );
});

test("REQ-8168, REQ-8292: a turn is taken at the encounter that was started, and the inspector shows it", async ({
  page,
}) => {
  turned.length = 0;
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="d1"]').click();
  await page.locator('[data-action="studio-play"]').click();
  // Nothing is asked of the Master before an encounter is started.
  await expect(page.locator("#turn-said")).toHaveCount(0);
  await page.locator('[data-action="studio-play-from"]').nth(1).click();
  await page.locator("#turn-said").fill("I step onto the bridge");
  await page.locator('[data-action="turn-take"]').click();
  await expect(page.locator(".turn-reply")).toContainText("The bridge sways.");
  // The result of a check is sent only when the parent chooses one (REQ-8180).
  await page.locator("#turn-outcome").selectOption("partial");
  await page.locator('[data-action="turn-take"]').click();
  await expect.poll(() => turned.length).toBe(2);
  expect(turned).toEqual([
    { adventureId: "d1", encounterId: "e2", said: "I step onto the bridge" },
    {
      adventureId: "d1",
      encounterId: "e2",
      said: "I step onto the bridge",
      outcome: "partial",
    },
  ]);
  await expect(page.locator("ol.turns li")).toHaveCount(0);
  await page.locator('[data-action="turn-inspect"]').click();
  await expect(page.locator("ol.turns li")).toHaveCount(1);
  await expect(page.locator("ol.turns")).toContainText(
    "I step onto the bridge",
  );
  await expect(page.locator("ol.turns")).toContainText("bridge: it sways");
  // The Director's task for the check the turn asked for, with its node, subtype and purpose (REQ-8292).
  const director = page.locator('ol.turns [data-check="review"]');
  await expect(director).toBeVisible();
  await expect(director).toContainText("N1");
  await expect(director).toContainText("a");
  await expect(page.locator("ul.model-calls li")).toContainText("0.0123");
  await expect(page.locator("ul.model-calls li")).toContainText("RESP-TEXT");
});

/** Opens the encounters of the stub's adventure and selects the first one. */
async function openGate(page: Page): Promise<void> {
  await stub(page);
  await ready(page);
  for (const id of ["c1", "a1", "d1"]) {
    await page.locator(`button[data-node="${id}"]`).click();
    if (id !== "d1") await page.locator('[data-action="studio-open"]').click();
  }
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="e1"]').click();
}

test("REQ-8306: an encounter is edited in a form and one save stores one new version", async ({
  page,
}) => {
  saved.length = 0;
  await openGate(page);
  await expect(page.locator("#enc-place")).toHaveValue("A gate in the fog");
  await page.locator("#enc-situation").fill("The gate is stuck.");
  await page.locator("#enc-checks").fill("2");
  await page.locator('[data-action="enc-exit-add"]').click();
  await page.locator("#enc-exit-when-0").fill("she opens it");
  await page.locator("#enc-exit-next-0").selectOption("e2");
  await page.locator('[data-action="studio-save"]').click();
  await expect.poll(() => saved.length).toBe(1);
  expect(saved[0]).toEqual({
    id: "e1",
    body: {
      place: "A gate in the fog",
      situation: "The gate is stuck.",
      checks: 2,
      exits: [{ when: "she opens it", next: "e2" }],
    },
  });
});

test("REQ-8600: a refused save names the field, what it holds and what it needs, beside the field", async ({
  page,
}) => {
  saved.length = 0;
  await openGate(page);
  await page.locator("#enc-situation").fill("FAULT");
  await page.locator('[data-action="studio-save"]').click();
  const fault = page.locator('[data-fault="situation"]');
  await expect(fault).toBeVisible();
  await expect(fault).toContainText("700");
  await expect(fault).toContainText("600");
  expect(saved).toHaveLength(0);
});

test("REQ-8618: an empty graph offers the action that fills it", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a2"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('[data-action="studio-empty-add"]').click();
  await expect(page.locator("#studio-title")).toBeFocused();
});

test("REQ-8624: on the tablet every control of the form is at least 56 px tall", async ({
  page,
}) => {
  await openGate(page);
  await page.evaluate(() => {
    document.documentElement.dataset["interface"] = "tablet";
  });
  for (const selector of [
    "#enc-situation",
    "#enc-checks",
    '[data-action="enc-exit-add"]',
    '[data-action="studio-save"]',
  ]) {
    const box = await page.locator(selector).boundingBox();
    expect(box?.height ?? 0, selector).toBeGreaterThanOrEqual(56);
  }
});

test("REQ-8602: the versions of a node are listed and an earlier one is restored as a new version", async ({
  page,
}) => {
  restored.length = 0;
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a2"]').click();
  await page.locator('[data-action="studio-versions"]').click();
  await expect(page.locator("ol.versions li")).toHaveCount(3);
  // The current version is not offered for a restore over itself.
  await expect(page.locator('[data-action="version-restore-3"]')).toHaveCount(
    0,
  );
  await page.locator('[data-action="version-restore-1"]').click();
  await expect.poll(() => restored).toEqual([1]);
  await expect(page.locator("ol.versions li")).toHaveCount(4);
});

test("REQ-8604, REQ-8606: a generated version waits, and the parent keeps it or discards it", async ({
  page,
}) => {
  decided.length = 0;
  waiting.clear();
  waiting.add("a2");
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a2"]').click();
  await page.locator('[data-action="studio-versions"]').click();
  // Three versions and the one that waits; only the waiting one offers a decision.
  await expect(page.locator("ol.versions li")).toHaveCount(4);
  await expect(page.locator('[data-action="version-keep"]')).toHaveCount(1);
  await page.locator('[data-action="version-discard"]').click();
  await expect.poll(() => decided).toEqual(["discard a2"]);
  await expect(page.locator("ol.versions li")).toHaveCount(3);
  await expect(page.locator('[data-action="version-keep"]')).toHaveCount(0);
});

test("REQ-8308: a waiting version shows beside the current one with its changes marked", async ({
  page,
}) => {
  decided.length = 0;
  waiting.clear();
  waiting.add("a2");
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a2"]').click();
  await page.locator('[data-action="studio-versions"]').click();
  const compare = page.locator(".compare");
  await expect(compare).toBeVisible();
  await expect(compare.locator('[data-change="changed"]')).toHaveCount(1);
  await expect(compare.locator('[data-change="added"]')).toHaveCount(1);
  // What the critic still found is shown beside the comparison, and is not a row of it (REQ-8642).
  const review = compare.locator("[data-review]");
  await expect(review).toContainText("No turn in encounter 3");
  await expect(review).toContainText("1");
  await expect(compare.locator('[data-change="removed"]')).toHaveCount(0);
  await expect(compare.locator('[data-change="changed"]')).toContainText(
    "A gate",
  );
  await expect(compare.locator('[data-change="changed"]')).toContainText(
    "A new gate",
  );
  // Keep and discard sit beside the comparison and nowhere else.
  await expect(compare.locator('[data-action="version-keep"]')).toHaveCount(1);
  await expect(page.locator('[data-action="version-keep"]')).toHaveCount(1);
  await compare.locator('[data-action="version-keep"]').click();
  await expect.poll(() => decided).toEqual(["keep a2"]);
  // A kept generated adventure says how many encounters it added (REQ-8260).
  await expect(
    page.locator("p.status").filter({ hasText: "3" }).first(),
  ).toBeVisible();
  await expect(page.locator(".compare")).toHaveCount(0);
});

test("REQ-8616: an encounter starts play at its current text in one action from its own panel", async ({
  page,
}) => {
  started.length = 0;
  await openGate(page);
  await page.locator('[data-action="studio-play-here"]').click();
  await expect(
    page.locator('[data-action="studio-play-frame"]'),
  ).toHaveAttribute("src", /\?sandbox=1/);
  expect(started).toEqual([{ adventureId: "d1", encounterId: "e1" }]);
});

/** Opens the adventure's graph of encounters, with the reached marks the sandbox answers. */
async function openEncounters(
  page: Page,
  reached: { status: number; body: object },
): Promise<void> {
  await stub(page);
  await page.route("**/api/parent/studio/sandbox/play/reached", (route) =>
    route.fulfill({ status: reached.status, json: reached.body }),
  );
  await ready(page);
  for (const id of ["c1", "a1", "d1"]) {
    await page.locator(`button[data-node="${id}"]`).click();
    await page.locator('[data-action="studio-open"]').click();
  }
}

test("REQ-8614: the graph marks an encounter and an exit that no test has reached", async ({
  page,
}) => {
  await openEncounters(page, {
    status: 200,
    body: { encounters: ["e1"], exits: [] },
  });
  await expect(page.locator('button[data-node="e1"]')).toHaveAttribute(
    "data-reached",
    "1",
  );
  await expect(page.locator('button[data-node="e2"]')).toHaveAttribute(
    "data-reached",
    "0",
  );
  await expect(page.locator('button[data-node="e2"]')).toContainText(
    "Не проверено",
  );
  await expect(page.locator('line[data-reached="0"]')).toHaveCount(1);
  // The count of what is left is written out, for a reader of the page and not only of the picture.
  await expect(page.locator("[data-left]")).toHaveAttribute("data-left", "1,1");
});

test("REQ-8614: with no sandbox nothing is marked as unreached", async ({
  page,
}) => {
  await openEncounters(page, {
    status: 409,
    body: { error: "sandbox_unavailable" },
  });
  await expect(page.locator('button[data-node="e2"]')).toBeVisible();
  await expect(page.locator('[data-reached="0"]')).toHaveCount(0);
  await expect(page.locator("[data-left]")).toHaveCount(0);
});

/** Opens the adventure d1 of the stub, so its panel shows. */
async function selectAdventure(page: Page): Promise<void> {
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="d1"]').click();
}

test("REQ-8608, REQ-8318: the page shows the calls and the spend before a generation, then its step", async ({
  page,
}) => {
  generated.length = 0;
  jobFlow = [
    { state: "running", progress: 40, message: "draft:2" },
    { state: "done", progress: 100, message: "version:3" },
  ];
  await selectAdventure(page);
  const estimate = page.locator("[data-estimate]");
  await expect(estimate).toContainText("4");
  await expect(estimate).toContainText("17");
  await expect(estimate).toContainText("1.5");
  // The estimate is in dollars and names its basis (REQ-8630, REQ-8632).
  await expect(estimate).toContainText("0.20");
  await expect(estimate).toContainText("0.85");
  await expect(estimate).toHaveAttribute("data-basis", "default");
  await page.locator("#gen-prompt").fill("autumn fog");
  await page.locator('[data-action="gen-start"]').click();
  expect(generated).toEqual([{ prompt: "autumn fog" }]);
  const progress = page.locator("[data-job]");
  await expect(progress).toHaveAttribute("data-state", "running");
  await expect(progress).toContainText("2");
  await expect(progress).toHaveAttribute("data-state", "done", {
    timeout: 8000,
  });
});

test("REQ-8610: a generation that stops names its cause beside the button", async ({
  page,
}) => {
  jobFlow = [{ state: "failed", progress: 40, message: "budget_exhausted" }];
  await selectAdventure(page);
  await page.locator("#gen-prompt").fill("autumn fog");
  await page.locator('[data-action="gen-start"]').click();
  await expect(page.locator('[data-cause="budget_exhausted"]')).toBeVisible({
    timeout: 8000,
  });
});

test("REQ-8632: an estimate measured over earlier calls says how many", async ({
  page,
}) => {
  await stub(page);
  await page.route("**/api/parent/studio/nodes/d1/generate/estimate", (route) =>
    route.fulfill({
      json: {
        calls: { min: 4, max: 17 },
        spentUsd: 3,
        estimateUsd: { min: 0.08, max: 0.34 },
        basis: "measured",
        measuredCalls: 42,
      },
    }),
  );
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="d1"]').click();
  const estimate = page.locator("[data-estimate]");
  await expect(estimate).toHaveAttribute("data-basis", "measured");
  await expect(estimate).toContainText("42");
  await expect(estimate).toContainText("0.08");
});

test("REQ-8612: a job a restart cut off shows as failed with its last step, and never as running", async ({
  page,
}) => {
  jobFlow = [{ state: "failed", progress: 40, message: "interrupted:draft:2" }];
  await selectAdventure(page);
  await page.locator("#gen-prompt").fill("autumn fog");
  await page.locator('[data-action="gen-start"]').click();
  const cause = page.locator('[data-cause="interrupted"]');
  await expect(cause).toBeVisible({ timeout: 8000 });
  await expect(cause).toContainText("2");
  await expect(page.locator('[data-job][data-state="running"]')).toHaveCount(0);
});

test("REQ-8306: an adventure is edited in a form, and what the form lacks is kept", async ({
  page,
}) => {
  saved.length = 0;
  await selectAdventure(page);
  await page.locator("#lf-logline").fill("A fog story");
  await page.locator("#lf-kind").selectOption("case");
  await page.locator("#lf-conflict-wants").fill("to cross");
  await page.locator('[data-action="level-save"]').click();
  await expect.poll(() => saved.length).toBe(1);
  expect(saved[0]).toEqual({
    id: "d1",
    body: {
      premise: "A fog",
      scenario: { x: 1 },
      logline: "A fog story",
      kind: "case",
      conflict: { wants: "to cross" },
    },
  });
});

test("REQ-8600: a refused save of an adventure names the field beside it", async ({
  page,
}) => {
  saved.length = 0;
  await selectAdventure(page);
  await page.locator("#lf-logline").fill("FAULT");
  await page.locator('[data-action="level-save"]').click();
  const fault = page.locator('[data-fault="logline"]');
  await expect(fault).toBeVisible();
  await expect(fault).toContainText("4001");
  expect(saved).toHaveLength(0);
});

test("REQ-8306: the whole body can be edited as text, and text that is not JSON is not saved", async ({
  page,
}) => {
  saved.length = 0;
  await selectAdventure(page);
  await expect(page.locator("#lf-json")).toHaveValue(/A fog/);
  await page.locator("#lf-json").fill("{ not json");
  await page.locator('[data-action="level-json-save"]').click();
  await expect(page.locator('[data-fault="json"]')).toBeVisible();
  expect(saved).toHaveLength(0);
  await page.locator("#lf-json").fill('{"logline":"raw"}');
  await page.locator('[data-action="level-json-save"]').click();
  await expect.poll(() => saved.length).toBe(1);
  expect(saved[0]).toEqual({ id: "d1", body: { logline: "raw" } });
});

test("REQ-8306: a campaign shows its own fields and not an adventure's", async ({
  page,
}) => {
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await expect(page.locator("#lf-theme")).toBeVisible();
  await expect(page.locator("#lf-kind")).toHaveCount(0);
});

test("REQ-8258: an arc is linked to the arcs beside it from its form", async ({
  page,
}) => {
  saved.length = 0;
  await stub(page);
  await ready(page);
  await page.locator('button[data-node="c1"]').click();
  await page.locator('[data-action="studio-open"]').click();
  await page.locator('button[data-node="a1"]').click();
  // Only the arc beside it is offered, and a1 leads to a2 in the stub already.
  await expect(page.locator('input[data-action="lf-link-a2"]')).toBeVisible();
  await expect(page.locator('input[data-action="lf-link-a1"]')).toHaveCount(0);
  await page.locator('input[data-action="lf-link-a2"]').check();
  await page.locator('[data-action="level-save"]').click();
  await expect.poll(() => saved.length).toBe(1);
  expect(saved[0]).toEqual({ id: "a1", body: { links: ["a2"] } });
});

test("REQ-8634, REQ-8638, REQ-8640: a node is archived from its panel, listed with the archived ones and brought back", async ({
  page,
}) => {
  archivedLog.length = 0;
  hidden.clear();
  await openGate(page);
  await page.locator('[data-action="studio-archive"]').click();
  await expect.poll(() => archivedLog).toEqual(["archive e1"]);
  // The node leaves the graph of its level.
  await expect(page.locator('button[data-node="e1"]')).toHaveCount(0);
  await expect(page.locator('button[data-node="e2"]')).toBeVisible();
  // The archived ones are listed on request, with a way back.
  await page.locator('[data-action="studio-archived"]').click();
  const back = page.locator('[data-action="studio-unarchive-e1"]');
  await expect(back).toBeVisible();
  await back.click();
  await expect.poll(() => archivedLog).toEqual(["archive e1", "unarchive e1"]);
  await expect(page.locator('button[data-node="e1"]')).toBeVisible();
});

test("REQ-8270: an approved node a change above marked is labelled, and the parent says it was reviewed", async ({
  page,
}) => {
  reviewedLog.length = 0;
  await stub(page);
  await ready(page);
  for (const id of ["c1", "a1"]) {
    await page.locator(`button[data-node="${id}"]`).click();
    await page.locator('[data-action="studio-open"]').click();
  }
  const node = page.locator('button[data-node="d1"]');
  await expect(node).toHaveAttribute("data-needs-review", "1");
  await node.click();
  await page.locator('[data-action="studio-reviewed"]').click();
  await expect.poll(() => reviewedLog).toEqual(["d1"]);
  await expect(page.locator('button[data-node="d1"]')).not.toHaveAttribute(
    "data-needs-review",
    "1",
  );
  await expect(page.locator('[data-action="studio-reviewed"]')).toHaveCount(0);
});
