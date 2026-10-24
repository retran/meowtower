import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
// TSK-0270: a new model or threshold version recomputes every projection at
// start-up (REQ-2230), unchanged versions recompute nothing, and a recompute
// under a new model leaves the game tables as they were while node_snapshots
// keeps rows under both versions (REQ-2224).
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import {
  refreshKnowledge,
  useKnowledge,
} from "../../src/engine/projections/knowledge.js";
import { loadParams } from "../../src/engine/model/params.js";
import { RULES_VERSION } from "../../src/engine/states/version.js";
import {
  PROJECTIONS,
  useVersions,
  type Versions,
} from "../../src/engine/projections/registry.js";
import { recompute } from "../../src/engine/recompute.js";
import { openDatabase } from "../../src/server/database.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-versions-"));
// The graph version the server computes from content/graph.yaml at start (TSK-0500).
const GRAPH_OPEN = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const GRAPH = GRAPH_OPEN.graphVersion();
const rules = RULES_VERSION;
const NONE: Versions = {
  model: "none",
  thresholds: "none",
  graph: GRAPH,
  rules,
};
const A: Versions = { model: "A", thresholds: "t1", graph: GRAPH, rules };
const B: Versions = { model: "B", thresholds: "t1", graph: GRAPH, rules };
const A2: Versions = { model: "A", thresholds: "t2", graph: GRAPH, rules };
afterEach(() => {
  useVersions(NONE);
  useKnowledge(null);
});

/** The v1 parameters; model B starts every group-7 first-year subtype higher, so its estimates differ. */
const modelText = readFileSync(
  new URL("../../content/model.v1.json", import.meta.url),
  "utf8",
);
const paramsOf = (versions: Versions) => {
  const file = JSON.parse(modelText) as {
    pInit: Record<string, Record<string, number>>;
  };
  if (versions.model === "B")
    file.pInit["7"] = { ...file.pInit["7"], "1F": 0.65 };
  return loadParams(JSON.stringify(file));
};
const knowledgeFor = (versions: Versions) => ({
  params: paramsOf(versions),
  graph: GRAPH_OPEN,
  zone: "UTC",
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

let worlds = 0;
/** A database holding the 30-day log, computed under `versions`. */
function computedUnder(versions: Versions): string {
  const live = join(root, `w${++worlds}.sqlite`);
  useVersions(versions);
  useKnowledge(knowledgeFor(versions));
  const db = openDatabase(live);
  writeSyntheticLog(db, { days: 30, tasksPerDay: 20, seed: 11 });
  refreshKnowledge(db, "end-of-adventure");
  db.close();
  useVersions(NONE);
  useKnowledge(null);
  return live;
}

/** Starts the real server on a database with a content file naming `versions`, and stops it once it listens. */
async function start(live: string, versions: Versions): Promise<string> {
  const file = join(
    root,
    `versions-${worlds}-${versions.model}-${versions.thresholds}.json`,
  );
  writeFileSync(file, JSON.stringify(versions));
  const child = spawn(
    process.execPath,
    ["--import", "tsx", "src/server/main.ts"],
    {
      env: {
        ...process.env,
        PORT: "3951",
        PARENT_PORT: "3956",
        MEOWTOWER_DB: live,
        MEOWTOWER_SNAPSHOTS: join(root, "snapshots"),
        MEOWTOWER_EXPORTS: join(root, "exports"),
        MEOWTOWER_VERSIONS: file,
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let out = "";
  child.stdout.on("data", (d: Buffer) => (out += d.toString()));
  child.stderr.on("data", (d: Buffer) => (out += d.toString()));
  try {
    for (let i = 0; i < 200; i++) {
      try {
        if ((await fetch("http://127.0.0.1:3951/health")).ok) return out;
      } catch {
        // not listening yet
      }
      await new Promise((r) => setTimeout(r, 50));
    }
    throw new Error(`server did not start: ${out}`);
  } finally {
    const done = new Promise((r) => child.once("exit", r));
    child.kill("SIGTERM");
    await done;
  }
}

const meta = (live: string) => {
  const db = new Database(live, { readonly: true });
  const rows = db
    .prepare(
      "SELECT name, model_version, threshold_version, computed_at FROM derived_meta ORDER BY name",
    )
    .all() as {
    name: string;
    model_version: string;
    threshold_version: string;
    computed_at: string;
  }[];
  db.close();
  return rows;
};

describe("REQ-2230: a version change recomputes every projection at start-up", () => {
  it("recomputes when the model version changes, and every derived_meta row names the new one", async () => {
    const live = computedUnder(A);
    expect(meta(live).every((m) => m.model_version === "A")).toBe(true);
    const out = await start(live, B);
    expect(out).toContain(
      `startup_recompute: now model B, thresholds t1, graph ${GRAPH}`,
    );
    const after = meta(live);
    expect(after.map((m) => m.name)).toEqual(
      PROJECTIONS.map((p) => p.name).sort(),
    );
    expect(after.every((m) => m.model_version === "B")).toBe(true);
  }, 60000);

  it("recomputes when only the threshold version changes", async () => {
    const live = computedUnder(A);
    const out = await start(live, A2);
    expect(out).toContain("startup_recompute");
    expect(meta(live).every((m) => m.threshold_version === "t2")).toBe(true);
  }, 60000);

  it("recomputes nothing when the versions are unchanged", async () => {
    const live = computedUnder(A);
    const before = meta(live);
    const out = await start(live, A);
    expect(out).not.toContain("startup_recompute");
    expect(meta(live)).toEqual(before);
  }, 60000);
});

describe("REQ-2224: a new model changes the estimates, not what the game decided", () => {
  it("leaves every game table as it was and keeps node_snapshots rows under both versions", async () => {
    const live = computedUnder(A);
    const db = openDatabase(live);
    const game = PROJECTIONS.filter((p) => p.class === "game");
    const rows = (table: string) => {
      const columns = (
        db.prepare("SELECT name FROM pragma_table_info(?)").all(table) as {
          name: string;
        }[]
      )
        .map((c) => c.name)
        .filter((c) => c !== "computed_at")
        .join(", ");
      return JSON.stringify(
        db.prepare(`SELECT ${columns} FROM ${table} ORDER BY ${columns}`).all(),
      );
    };
    const before = Object.fromEntries(
      game.map((p) => [p.table, rows(p.table)]),
    );

    useVersions(B);
    useKnowledge(knowledgeFor(B));
    await recompute(db, { computedAt: "under-B" });

    for (const p of game)
      expect(rows(p.table), p.table).toEqual(before[p.table]);
    const snapshots = db
      .prepare(
        "SELECT model_version, threshold_version, graph_version, count(*) AS n, round(avg(p_know), 3) AS mean FROM node_snapshots GROUP BY 1, 2, 3 ORDER BY 1",
      )
      .all() as {
      model_version: string;
      threshold_version: string;
      graph_version: string;
      n: number;
      mean: number;
    }[];
    db.close();
    expect(snapshots.map((s) => s.model_version)).toEqual(["A", "B"]);
    expect(
      snapshots.every(
        (s) => s.threshold_version === "t1" && s.graph_version === GRAPH,
      ),
    ).toBe(true);
    expect(snapshots[0]?.n).toBe(snapshots[1]?.n);
    expect(snapshots[0]?.mean).not.toBe(snapshots[1]?.mean);
    console.log(
      `versions: game tables ${game.map((p) => p.table).join(", ")} unchanged; node_snapshots ${snapshots.map((s) => `${s.model_version}: ${s.n} rows, mean ${s.mean}`).join("; ")}`,
    );
  });
});
