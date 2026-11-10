// REQ-8264, REQ-8274, REQ-8278, REQ-8316, REQ-8318: every edit adds a version and keeps the old
// ones, a node moves only through its statuses, a library entry shows where it is used, and a job
// reports its progress. The test runs on both databases.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";
import type { Db } from "../../src/server/db/index.js";
import {
  addEntry,
  childrenOf,
  createNode,
  editEntry,
  editNode,
  getNode,
  getJob,
  jobsOf,
  reportJob,
  setStatus,
  startJob,
  StudioRefused,
  unuseEntry,
  useEntry,
  usesOf,
  versionOf,
  versionsOf,
} from "../../src/server/studio/store.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-studio-"));
let db: Db;
beforeAll(async () => {
  db = await openDatabase(join(root, "studio.sqlite"));
});
afterAll(async () => {
  await db.close();
  rmSync(root, { recursive: true, force: true });
});
let clock = Date.UTC(2026, 10, 10, 12, 0, 0);
const tick = (): number => (clock += 1000);

it("builds the three levels and lists what sits in each node", async () => {
  const campaign = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "The year",
    body: { premise: "a tower in the fog" },
  });
  const arc = await createNode(db, tick(), {
    level: "arc",
    parentId: campaign.id,
    title: "The bridge",
    body: {},
  });
  const adventure = await createNode(db, tick(), {
    level: "adventure",
    parentId: arc.id,
    title: "The lock",
    body: {},
  });
  expect((await childrenOf(db, null)).map((n) => n.id)).toContain(campaign.id);
  expect((await childrenOf(db, campaign.id)).map((n) => n.id)).toEqual([
    arc.id,
  ]);
  expect((await childrenOf(db, arc.id)).map((n) => n.id)).toEqual([
    adventure.id,
  ]);
});

it("refuses a node in the wrong place or with no title", async () => {
  const campaign = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "Another year",
    body: {},
  });
  await expect(
    createNode(db, tick(), {
      level: "adventure",
      parentId: campaign.id,
      title: "x",
      body: {},
    }),
  ).rejects.toThrow(StudioRefused);
  await expect(
    createNode(db, tick(), {
      level: "arc",
      parentId: null,
      title: "x",
      body: {},
    }),
  ).rejects.toThrow("sits in a campaign");
  await expect(
    createNode(db, tick(), {
      level: "campaign",
      parentId: null,
      title: "  ",
      body: {},
    }),
  ).rejects.toThrow("title");
});

it("adds a version for every edit and keeps the older ones readable", async () => {
  const node = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "Versions",
    body: { text: "one" },
  });
  const edited = await editNode(
    db,
    tick(),
    node.id,
    { text: "two" },
    {
      prompt: "make it darker",
      author: "generator",
    },
  );
  expect(edited.version).toBe(2);
  const all = await versionsOf(db, node.id);
  expect(all.map((v) => v.version)).toEqual([1, 2]);
  expect((await versionOf(db, node.id, 1))?.body).toEqual({ text: "one" });
  expect(all[1]).toMatchObject({
    prompt: "make it darker",
    author: "generator",
  });
});

it("refuses to change or delete a stored version", async () => {
  const node = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "Fixed",
    body: {},
  });
  await expect(
    db
      .prepare("UPDATE story_versions SET body = '{}' WHERE node_id = ?")
      .run(node.id),
  ).rejects.toThrow("append-only");
  await expect(
    db.prepare("DELETE FROM story_versions WHERE node_id = ?").run(node.id),
  ).rejects.toThrow("append-only");
});

it("moves a node through its statuses, and an edit sends an approved one back to draft", async () => {
  const campaign = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "S",
    body: {},
  });
  const arc = await createNode(db, tick(), {
    level: "arc",
    parentId: campaign.id,
    title: "A",
    body: {},
  });
  expect(arc.status).toBe("draft");
  await expect(setStatus(db, tick(), arc.id, "playing")).rejects.toThrow(
    StudioRefused,
  );
  expect((await setStatus(db, tick(), arc.id, "approved")).status).toBe(
    "approved",
  );
  expect((await editNode(db, tick(), arc.id, { more: true })).status).toBe(
    "draft",
  );
  await setStatus(db, tick(), arc.id, "approved");
  await setStatus(db, tick(), arc.id, "playing");
  await expect(editNode(db, tick(), arc.id, {})).rejects.toThrow("not edited");
  expect((await setStatus(db, tick(), arc.id, "played")).status).toBe("played");
  await expect(setStatus(db, tick(), arc.id, "draft")).rejects.toThrow(
    StudioRefused,
  );
  expect((await getNode(db, arc.id))?.status).toBe("played");
});

it("keeps a library entry's versions and shows where it is used", async () => {
  const campaign = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "L",
    body: {},
  });
  const arc = await createNode(db, tick(), {
    level: "arc",
    parentId: campaign.id,
    title: "Used in",
    body: {},
  });
  const entry = await addEntry(db, tick(), {
    kind: "character",
    name: "Keeper",
    body: "a gatekeeper",
  });
  const edited = await editEntry(db, tick(), entry.id, {
    name: "Old keeper",
    body: "a tired gatekeeper",
  });
  expect(edited.version).toBe(2);
  await useEntry(db, entry.id, arc.id);
  await useEntry(db, entry.id, arc.id);
  expect(await usesOf(db, entry.id)).toEqual([
    { nodeId: arc.id, level: "arc", title: "Used in" },
  ]);
  await unuseEntry(db, entry.id, arc.id);
  expect(await usesOf(db, entry.id)).toEqual([]);
  await expect(useEntry(db, "missing", arc.id)).rejects.toThrow(
    "no such entry",
  );
});

it("reports a job's progress and stops changing it once it is done", async () => {
  const campaign = await createNode(db, tick(), {
    level: "campaign",
    parentId: null,
    title: "J",
    body: {},
  });
  const job = await startJob(db, tick(), "generate_arcs", campaign.id);
  expect(job).toMatchObject({ state: "queued", progress: 0 });
  expect(
    await reportJob(db, tick(), job.id, { progress: 40, message: "writing" }),
  ).toMatchObject({
    state: "running",
    progress: 40,
    message: "writing",
  });
  expect(
    (await reportJob(db, tick(), job.id, { state: "done" })).progress,
  ).toBe(100);
  await expect(reportJob(db, tick(), job.id, { progress: 10 })).rejects.toThrow(
    "does not change",
  );
  expect((await getJob(db, job.id))?.state).toBe("done");
  expect((await jobsOf(db, campaign.id)).map((j) => j.id)).toEqual([job.id]);
});
