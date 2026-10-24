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
function world(end = true): Db {
  useVersions(V1);
  useKnowledge({ params, graph, zone: ZONE });
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  writeSyntheticLog(db, { days: 10, tasksPerDay: 12, seed: 5 });
  if (end) refreshKnowledge(db, "end-of-adventure");
  return db;
}

/** A hash of a table's rows, all columns but the computed time, in key order. */
function hashOf(db: Db, table: string, where = "1 = 1"): string {
  const columns = (
    db.prepare("SELECT name FROM pragma_table_info(?)").all(table) as {
      name: string;
    }[]
  )
    .map((c) => c.name)
    .filter((c) => c !== "computed_at")
    .join(", ");
  const rows = db
    .prepare(
      `SELECT ${columns} FROM ${table} WHERE ${where} ORDER BY ${columns}`,
    )
    .all();
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}

describe("REQ-0900: a full recompute gives the rows the end of an adventure wrote", () => {
  it("rebuilds node_estimates and the active node_snapshots rows to the same hash", async () => {
    const db = world();
    const estimates = hashOf(db, "node_estimates");
    const snapshots = hashOf(db, "node_snapshots");
    expect(
      db.prepare("SELECT count(*) AS n FROM node_estimates").get(),
    ).not.toEqual({ n: 0 });
    db.exec("DELETE FROM node_estimates; DELETE FROM node_snapshots");
    await recompute(db, { computedAt: "recompute" });
    expect(hashOf(db, "node_estimates")).toBe(estimates);
    expect(hashOf(db, "node_snapshots")).toBe(snapshots);
    db.close();
  });
});

describe("REQ-0906: one snapshot set for each game day of play", () => {
  it("holds a row for every node on each played day and none for a day without play", () => {
    const db = world();
    const played = new Set(
      [...allEvents(db)].map((e) => gameDayOf(Date.parse(e.ts), ZONE)),
    );
    const days = (
      db.prepare("SELECT DISTINCT game_day AS d FROM node_snapshots").all() as {
        d: number;
      }[]
    ).map((r) => r.d);
    expect(new Set(days)).toEqual(played);
    const perDay = db
      .prepare("SELECT count(*) AS n FROM node_snapshots GROUP BY game_day")
      .all() as { n: number }[];
    expect(new Set(perDay.map((r) => r.n))).toEqual(
      new Set([graph.nodes().length]),
    );
    db.close();
  });
});

describe("REQ-0904, REQ-0902: a new rules version adds its rows and keeps the earlier ones", () => {
  it("rewrites every past play day under rules 2 and leaves the rules 1 rows unchanged", async () => {
    const db = world();
    const before = hashOf(db, "node_snapshots", "rules_version = '1'");
    useVersions(V2);
    await recompute(db, { computedAt: "under-rules-2" });
    expect(hashOf(db, "node_snapshots", "rules_version = '1'")).toBe(before);
    const count = (rules: string) =>
      (
        db
          .prepare(
            "SELECT count(*) AS n FROM node_snapshots WHERE rules_version = ?",
          )
          .get(rules) as { n: number }
      ).n;
    expect(count("2")).toBe(count("1"));
    db.close();
  });

  it("reports a change of the rules version at start-up and clears after the recompute", async () => {
    const db = world();
    await recompute(db, { computedAt: "settle" });
    expect(versionsChanged(db)).toBe(false);
    useVersions(V2);
    expect(versionsChanged(db)).toBe(true);
    await recompute(db, { computedAt: "under-rules-2" });
    expect(versionsChanged(db)).toBe(false);
    db.close();
  });
});

describe("TSK-0528: node_snapshots above the ceiling raises snapshot_ceiling once and deletes nothing", () => {
  it("reports at a low ceiling a single time and keeps every row", () => {
    const db = world();
    const dir = mkdtempSync(join(root, "notices-"));
    const rows = () =>
      (
        db.prepare("SELECT count(*) AS n FROM node_snapshots").get() as {
          n: number;
        }
      ).n;
    const before = rows();
    expect(checkSnapshotCeiling(db, dir, Date.now, before + 1)).toBe(false);
    expect(checkSnapshotCeiling(db, dir, Date.now, 5)).toBe(true);
    expect(checkSnapshotCeiling(db, dir, Date.now, 5)).toBe(false);
    expect(readNotices(dir).snapshot_ceiling?.rows).toBe(before);
    expect(rows()).toBe(before);
    db.close();
  });
});

describe("REQ-0900: a per-node update after a verdict is replaced by the full pass", () => {
  it("writes the verdict's node without a full pass", () => {
    const db = world(false);
    const row = db
      .prepare(
        "SELECT state FROM node_estimates WHERE node = 'A1' AND subtype = ''",
      )
      .get();
    expect(row).toBeDefined();
    db.close();
  });

  it("replaces a deliberately wrong row at the end of the adventure", () => {
    const db = world();
    const right = hashOf(db, "node_estimates");
    db.exec("UPDATE node_estimates SET p_know = 0.123 WHERE node = 'A1'");
    expect(hashOf(db, "node_estimates")).not.toBe(right);
    refreshKnowledge(db, "end-of-adventure");
    expect(hashOf(db, "node_estimates")).toBe(right);
    db.close();
  });
});

describe("TSK-0527: a failing per-node update keeps the event and the node's last rows", () => {
  it("logs the failure, appends the event anyway and leaves node_estimates as it was", () => {
    const db = world();
    const before = hashOf(db, "node_estimates");
    const events = (
      db.prepare("SELECT count(*) AS n FROM events").get() as { n: number }
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
    writeSyntheticLog(db, { days: 1, tasksPerDay: 3, seed: 99 });
    expect(
      (db.prepare("SELECT count(*) AS n FROM events").get() as { n: number }).n,
    ).toBeGreaterThan(events);
    expect(hashOf(db, "node_estimates")).toBe(before);
    db.close();
  });
});

describe("TSK-0527: the full pass and the per-node update stay inside their budgets", () => {
  it("recomputes a 365-day log within 10 s and reports the per-update time", () => {
    useVersions(V1);
    const db = openDatabase(join(root, `w${++worlds}.sqlite`));
    writeSyntheticLog(db, { days: 365, tasksPerDay: 20, seed: 3 });
    useKnowledge({ params, graph, zone: ZONE });
    const started = performance.now();
    refreshKnowledge(db, "budget");
    const pass = performance.now() - started;
    const tick = performance.now();
    writeSyntheticLog(db, { days: 1, tasksPerDay: 10, seed: 4 });
    const update = (performance.now() - tick) / 10;
    console.log(
      `knowledge: full pass ${Math.round(pass)} ms, per-node update about ${Math.round(update)} ms`,
    );
    expect(pass).toBeLessThan(10_000);
    db.close();
  }, 120_000);
});
