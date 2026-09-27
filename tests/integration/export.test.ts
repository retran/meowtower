// TSK-0290: the export (REQ-2234, REQ-2236, REQ-2238, REQ-2240), from a copy
// taken at its start, readable by DuckDB, with a field dictionary.
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DuckDBInstance } from "@duckdb/node-api";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents, type NewEvent } from "../../src/engine/events/append.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { exportAll, EXPORT_FILES } from "../../src/server/export.js";
import { createParentApp } from "../../src/server/parent.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-export-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const live = join(dir, "live.sqlite");
const exports = join(dir, "exports");
const db = openDatabase(live);

// A synthetic 30-day log: 30 sessions of 20 tasks, each answered.
const day = (d: number): NewEvent[] =>
  Array.from({ length: 20 }, (_, i) => {
    const itemId = `d${d}-i${i}`;
    const sessionId = `s-${d}`;
    const input = {
      firstKeyMs: 500 + i,
      submittedMs: 2000 + i,
      edits: 0,
      erasures: 0,
      keyPresses: 1,
      focusLosses: { count: 0, totalMs: 0 },
      method: "keypad",
    };
    return [
      {
        type: "item_shown",
        v: 1,
        origin: "server" as const,
        sessionId,
        payload: {
          itemId,
          view: {
            locale: "ru",
            text: `${i} + 1`,
            svg: null,
            options: null,
            terms: [],
          },
          templateId: "A1.sum",
          templateVersion: 1,
          seed: itemId,
          params: { a: i },
          node: "A1",
          subtype: "sum",
          purpose: "frontier",
          attemptNo: 1,
          correctAnswer: String(i + 1),
          shortSolution: [`${i} + 1 = ${i + 1}`],
        },
      },
      {
        type: "attempt_submitted",
        v: 1,
        origin: "server" as const,
        sessionId,
        payload: {
          itemId,
          attemptNo: 1,
          input,
          answer: { entered: String(i + 1), parsed: i + 1 },
          assisted: false,
          hintLevel: 0,
        },
      },
      {
        type: "verdict",
        v: 1,
        origin: "server" as const,
        sessionId,
        payload: {
          itemId,
          attemptNo: 1,
          verdict: "correct",
          outcome: "clean",
          trapId: null,
          errorClass: null,
          steps: [],
        },
      },
    ];
  }).flat();
for (let d = 0; d < 30; d++) appendEvents(db, day(d));

async function duckCount(file: string): Promise<number> {
  const duck = await DuckDBInstance.create(":memory:");
  const conn = await duck.connect();
  const reader = file.endsWith(".parquet") ? "read_parquet" : "read_json_auto";
  const rows = await conn.runAndReadAll(
    `SELECT count(*)::INTEGER AS n FROM ${reader}('${file}')`,
  );
  return Number(rows.getRows()[0]?.[0]);
}
const lines = (file: string): number =>
  readFileSync(file, "utf8").trimEnd().split("\n").length;

describe("the export writes seven files from a copy taken at its start", () => {
  let out = "";
  let counts = { events: 0, attempts: 0, items: 0 };

  it("writes every file into data/exports/<UTC timestamp>/", async () => {
    const running = exportAll(live, exports, new Date("2026-09-27T12:00:00Z"));
    // Play goes on during the export; the export must not see it.
    appendEvents(db, day(99));
    const result = await running;
    out = result.dir;
    counts = result.counts;
    expect(out).toBe(join(exports, "2026-09-27T12-00-00Z"));
    expect(readdirSync(out).sort()).toEqual([...EXPORT_FILES].sort());
  });

  it("REQ-2234, REQ-2236: DuckDB reads each Parquet file, with the copy's row counts", async () => {
    expect(counts.events).toBe(30 * 60);
    expect(lines(join(out, "events.jsonl"))).toBe(counts.events);
    expect(await duckCount(join(out, "events.parquet"))).toBe(counts.events);
    expect(await duckCount(join(out, "attempts.parquet"))).toBe(
      counts.attempts,
    );
    expect(await duckCount(join(out, "items.parquet"))).toBe(counts.items);
    expect(lines(join(out, "attempts.csv")) - 1).toBe(counts.attempts);
    expect(lines(join(out, "items.csv")) - 1).toBe(counts.items);
    expect(counts.items).toBe(600);
    expect(counts.attempts).toBe(600);
  });

  it("describes every column of every file in fields.csv", () => {
    const described = new Set(
      readFileSync(join(out, "fields.csv"), "utf8")
        .trimEnd()
        .split("\n")
        .slice(1)
        .filter((l) => !/,""?$/.test(l))
        .map((l) => l.split(",").slice(0, 2).join(",")),
    );
    for (const file of ["attempts.csv", "items.csv"]) {
      const header =
        readFileSync(join(out, file), "utf8").split("\n")[0]?.split(",") ?? [];
      for (const column of header)
        expect(described, `${file} ${column}`).toContain(`${file},${column}`);
    }
    const event = JSON.parse(
      readFileSync(join(out, "events.jsonl"), "utf8").split("\n")[0] ?? "{}",
    ) as object;
    for (const column of Object.keys(event))
      expect(described, `events ${column}`).toContain(`events,${column}`);
  });
});

describe("REQ-2240: the export is offered only on the Mac's loopback listener", () => {
  it("answers 404 on the game listener and serves the file on the Parent Room listener", async () => {
    const token = registerDevice(db, "computer");
    const game = await createApp({ db }).request(
      "/api/parent/export/events.jsonl",
      {
        headers: { cookie: `meowtower_device=${token}` },
      },
    );
    expect(game.status).toBe(404);
    const parent = createParentApp({ db, dbPath: live, exports });
    expect(
      (await parent.request("/api/parent/export", { method: "POST" })).status,
    ).toBe(200);
    const file = await parent.request("/api/parent/export/events.jsonl");
    expect(file.status).toBe(200);
    expect((await file.text()).split("\n")[0]).toContain('"type"');
  });
});

void Database;
