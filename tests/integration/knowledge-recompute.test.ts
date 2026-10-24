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
function world(): Db {
  useVersions(V1);
  useKnowledge({ params, graph, zone: ZONE });
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  writeSyntheticLog(db, { days: 10, tasksPerDay: 12, seed: 5 });
  refreshKnowledge(db, "end-of-adventure");
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
