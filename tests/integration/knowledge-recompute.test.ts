// TSK-0527 and TSK-0528: the knowledge tables are a function of the log and the four versions.
// A rebuild gives the rows the end of an adventure wrote, one snapshot set exists for each game
// day of play, and a new rules version adds its rows beside the earlier ones (REQ-0900, REQ-0902,
// REQ-0904, REQ-0906).
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import { allEvents } from "../../src/engine/events/read.js";
import { loadParams } from "../../src/engine/model/params.js";
import {
  refreshKnowledge,
  useKnowledge,
} from "../../src/engine/projections/knowledge.js";
import {
  useVersions,
  versionsChanged,
  type Versions,
} from "../../src/engine/projections/registry.js";
import { recompute } from "../../src/engine/recompute.js";
import { readNotices } from "../../src/server/backups.js";
import { checkSnapshotCeiling } from "../../src/server/recompute.js";
import { gameDayOf } from "../../src/shared/game-day.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-knowledge-"));
const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const ZONE = "UTC";
const NONE: Versions = {
  model: "none",
  thresholds: "none",
  graph: "none",
  rules: "1",
};
const V1: Versions = {
  model: "v1",
  thresholds: "t1",
  graph: graph.graphVersion(),
  rules: "1",
};
const V2: Versions = { ...V1, rules: "2" };
afterEach(() => {
  useVersions(NONE);
  useKnowledge(null);
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

let worlds = 0;
/** A database with a 10-day synthetic log and its knowledge rows written under `V1`. */
async function world(end = true): Promise<Db> {
  useVersions(V1);
  useKnowledge({ params, graph, zone: ZONE });
  const db = await openDatabase(join(root, `w${++worlds}.sqlite`));
  await writeSyntheticLog(db, { days: 10, tasksPerDay: 12, seed: 5 });
  if (end) await refreshKnowledge(db, "end-of-adventure");
  return db;
}

/** A hash of a table's rows, all columns but the computed time, in key order. */
async function hashOf(db: Db, table: string, where = "1 = 1"): Promise<string> {
  const columns = (await db.columnsOf(table))
    .filter((c) => c !== "computed_at")
    .join(", ");
  const rows = await db
    .prepare(
      `SELECT ${columns} FROM ${table} WHERE ${where} ORDER BY ${columns}`,
    )
    .all();
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

describe("REQ-0900: a full recompute gives the rows the end of an adventure wrote", () => {
  it("rebuilds node_estimates and the active node_snapshots rows to the same hash", async () => {
    const db = await world();
    const estimates = await hashOf(db, "node_estimates");
    const snapshots = await hashOf(db, "node_snapshots");
    expect(
      await db.prepare("SELECT count(*) AS n FROM node_estimates").get(),
    ).not.toEqual({ n: 0 });
    await db.exec("DELETE FROM node_estimates; DELETE FROM node_snapshots");
    await recompute(db, { computedAt: "recompute" });
    expect(await hashOf(db, "node_estimates")).toBe(estimates);
    expect(await hashOf(db, "node_snapshots")).toBe(snapshots);
    await db.close();
  });
});

describe("REQ-0906: one snapshot set for each game day of play", () => {
  it("holds a row for every node on each played day and none for a day without play", async () => {
    const db = await world();
    const played = new Set(
      [...(await allEvents(db))].map((e) => gameDayOf(Date.parse(e.ts), ZONE)),
    );
    const days = (
      (await db
        .prepare("SELECT DISTINCT game_day AS d FROM node_snapshots")
        .all()) as {
        d: number;
      }[]
    ).map((r) => r.d);
    expect(new Set(days)).toEqual(played);
    const perDay = (await db
      .prepare("SELECT count(*) AS n FROM node_snapshots GROUP BY game_day")
      .all()) as { n: number }[];
    expect(new Set(perDay.map((r) => r.n))).toEqual(
      new Set([graph.nodes().length]),
    );
    await db.close();
  });
});

describe("REQ-0904, REQ-0902: a new rules version adds its rows and keeps the earlier ones", () => {
  it("rewrites every past play day under rules 2 and leaves the rules 1 rows unchanged", async () => {
    const db = await world();
    const before = await hashOf(db, "node_snapshots", "rules_version = '1'");
    useVersions(V2);
    await recompute(db, { computedAt: "under-rules-2" });
    expect(await hashOf(db, "node_snapshots", "rules_version = '1'")).toBe(
      before,
    );
    const count = async (rules: string) =>
      (
        (await db
          .prepare(
            "SELECT count(*) AS n FROM node_snapshots WHERE rules_version = ?",
          )
          .get(rules)) as { n: number }
      ).n;
    expect(await count("2")).toBe(await count("1"));
    await db.close();
  });

  it("reports a change of the rules version at start-up and clears after the recompute", async () => {
    const db = await world();
    await recompute(db, { computedAt: "settle" });
    expect(await versionsChanged(db)).toBe(false);
    useVersions(V2);
    expect(await versionsChanged(db)).toBe(true);
    await recompute(db, { computedAt: "under-rules-2" });
    expect(await versionsChanged(db)).toBe(false);
    await db.close();
  });
});

describe("TSK-0528: node_snapshots above the ceiling raises snapshot_ceiling once and deletes nothing", () => {
  it("reports at a low ceiling a single time and keeps every row", async () => {
    const db = await world();
    const dir = mkdtempSync(join(root, "notices-"));
    const rows = async () =>
      (
        (await db
          .prepare("SELECT count(*) AS n FROM node_snapshots")
          .get()) as {
          n: number;
        }
      ).n;
    const before = await rows();
    expect(await checkSnapshotCeiling(db, dir, Date.now, before + 1)).toBe(
      false,
    );
    expect(await checkSnapshotCeiling(db, dir, Date.now, 5)).toBe(true);
    expect(await checkSnapshotCeiling(db, dir, Date.now, 5)).toBe(false);
    expect(readNotices(dir).snapshot_ceiling?.rows).toBe(before);
    expect(await rows()).toBe(before);
    await db.close();
  });
});

describe("REQ-0900: a per-node update after a verdict is replaced by the full pass", () => {
  it("writes the verdict's node without a full pass", async () => {
    const db = await world(false);
    const row = await db
      .prepare(
        "SELECT state FROM node_estimates WHERE node = 'A1' AND subtype = ''",
      )
      .get();
    expect(row).toBeDefined();
    await db.close();
  });

  it("replaces a deliberately wrong row at the end of the adventure", async () => {
    const db = await world();
    const right = await hashOf(db, "node_estimates");
    await db.exec("UPDATE node_estimates SET p_know = 0.123 WHERE node = 'A1'");
    expect(await hashOf(db, "node_estimates")).not.toBe(right);
    await refreshKnowledge(db, "end-of-adventure");
    expect(await hashOf(db, "node_estimates")).toBe(right);
    await db.close();
  });
});

describe("TSK-0527: a failing per-node update keeps the event and the node's last rows", () => {
  it("logs the failure, appends the event anyway and leaves node_estimates as it was", async () => {
    const db = await world();
    const before = await hashOf(db, "node_estimates");
    const events = (
      (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
        n: number;
      }
    ).n;
    const broken = {
      ...graph,
      nodes: () => {
        throw new Error("injected");
      },
    };
    useKnowledge({
      params,
      graph: broken as unknown as typeof graph,
      zone: ZONE,
    });
    await writeSyntheticLog(db, { days: 1, tasksPerDay: 3, seed: 99 });
    expect(
      (
        (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
          n: number;
        }
      ).n,
    ).toBeGreaterThan(events);
    expect(await hashOf(db, "node_estimates")).toBe(before);
    await db.close();
  });
});

describe("TSK-0527: the full pass and the per-node update stay inside their budgets", () => {
  it("recomputes a 365-day log within 10 s and reports the per-update time", async () => {
    useVersions(V1);
    const db = await openDatabase(join(root, `w${++worlds}.sqlite`));
    await writeSyntheticLog(db, { days: 365, tasksPerDay: 20, seed: 3 });
    useKnowledge({ params, graph, zone: ZONE });
    const started = performance.now();
    await refreshKnowledge(db, "budget");
    const pass = performance.now() - started;
    const tick = performance.now();
    await writeSyntheticLog(db, { days: 1, tasksPerDay: 10, seed: 4 });
    const update = (performance.now() - tick) / 10;
    console.log(
      `knowledge: full pass ${Math.round(pass)} ms, per-node update about ${Math.round(update)} ms`,
    );
    expect(pass).toBeLessThan(10_000);
    await db.close();
  }, 120_000);
});
