// TSK-0250: projections folded in the log's transaction (REQ-3802), corrections
// as new events (REQ-2228), and pure, repeatable folds.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents, type NewEvent } from "../../src/engine/events/append.js";
import { itemEvents } from "../../src/engine/events/read.js";
import {
  PROJECTIONS,
  withProjection,
} from "../../src/engine/projections/registry.js";
import { openDatabase, type Db } from "../../src/server/database.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-proj-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
let n = 0;
const fresh = (): Db => openDatabase(join(dir, `p${n++}.sqlite`));

const shown = (itemId: string): NewEvent => ({
  type: "item_shown",
  v: 1,
  origin: "server",
  sessionId: "s-1",
  payload: {
    itemId,
    view: { locale: "ru", text: "3 + 4", svg: null, options: null, terms: [] },
    templateId: "A1.sum",
    templateVersion: 1,
    seed: "s",
    params: { a: 3, b: 4 },
    node: "A1",
    subtype: "sum",
    purpose: "frontier",
    attemptNo: 1,
    correctAnswer: "7",
    shortSolution: ["3 + 4 = 7"],
  },
});
const attempt = (itemId: string): NewEvent[] => [
  {
    type: "attempt_submitted",
    v: 1,
    origin: "server",
    sessionId: "s-1",
    payload: {
      itemId,
      attemptNo: 1,
      input: {
        firstKeyMs: 500,
        submittedMs: 1500,
        edits: 0,
        erasures: 0,
        keyPresses: 1,
        focusLosses: { count: 0, totalMs: 0 },
        method: "keypad",
      },
      answer: { entered: "7", parsed: "7" },
      assisted: false,
      hintLevel: 0,
    },
  },
  {
    type: "verdict",
    v: 1,
    origin: "server",
    sessionId: "s-1",
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
const rows = (db: Db, table: string): Record<string, unknown>[] =>
  db.prepare(`SELECT * FROM ${table} ORDER BY 1, 2`).all() as Record<
    string,
    unknown
  >[];

describe("REQ-3802: derived_meta records versions, the last seq and the time", () => {
  it("has a row per projection with the versions, the last seq and a UTC time", () => {
    const db = fresh();
    const appended = appendEvents(db, [shown("i-1"), ...attempt("i-1")]);
    const meta = rows(db, "derived_meta");
    expect(meta.map((m) => m["name"]).sort()).toEqual(
      PROJECTIONS.map((p) => p.name).sort(),
    );
    for (const m of meta) {
      expect(m).toMatchObject({
        model_version: expect.any(String),
        threshold_version: expect.any(String),
        graph_version: expect.any(String),
        last_seq: appended.at(-1)?.seq,
      });
      expect(String(m["computed_at"])).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
    }
    db.close();
  });
});

describe("the flat views fold in the log's transaction", () => {
  it("holds one items_view row per task shown and one attempts_view row per attempt", () => {
    const db = fresh();
    appendEvents(db, [shown("i-1"), ...attempt("i-1"), shown("i-2")]);
    expect(rows(db, "items_view").map((r) => r["item_id"])).toEqual([
      "i-1",
      "i-2",
    ]);
    expect(rows(db, "attempts_view")).toHaveLength(1);
    expect(rows(db, "attempts_view")[0]).toMatchObject({
      item_id: "i-1",
      attempt_no: 1,
      entered: "7",
      verdict: "correct",
      outcome: "clean",
      excluded: 0,
      flagged: 0,
    });
    db.close();
  });

  it("writes neither the events nor the rows when a projection throws", () => {
    const db = fresh();
    const failing = {
      name: "failing",
      table: "failing_view",
      create: "CREATE TABLE failing_view (x INTEGER) STRICT",
      apply: () => {
        throw new Error("projection failed");
      },
    };
    withProjection(failing, () => {
      expect(() => appendEvents(db, [shown("i-9")])).toThrow();
    });
    expect(itemEvents(db, "i-9")).toEqual([]);
    expect(rows(db, "items_view")).toEqual([]);
    db.close();
  });
});

describe("REQ-2228: a correction is a new event, the original untouched", () => {
  it("marks a task excluded and flagged, leaving item_shown and verdict as they were", () => {
    const db = fresh();
    appendEvents(db, [shown("i-1"), ...attempt("i-1")]);
    const before = itemEvents(db, "i-1").map((e) => JSON.stringify(e.payload));
    appendEvents(db, [
      {
        type: "item_flagged",
        v: 1,
        origin: "server",
        payload: { itemId: "i-1", note: null },
      },
      {
        type: "item_excluded",
        v: 1,
        origin: "server",
        payload: { itemId: "i-1", reason: "ambiguous" },
      },
    ]);
    expect(rows(db, "items_view")[0]).toMatchObject({
      excluded: 1,
      flagged: 1,
    });
    expect(rows(db, "attempts_view")[0]).toMatchObject({
      excluded: 1,
      flagged: 1,
    });
    const after = itemEvents(db, "i-1")
      .filter((e) =>
        ["item_shown", "attempt_submitted", "verdict"].includes(e.type),
      )
      .map((e) => JSON.stringify(e.payload));
    expect(after).toEqual(before);
    db.close();
  });
});

describe("folds are pure", () => {
  it("gives equal rows for the same events", () => {
    const a = fresh();
    const b = fresh();
    for (const db of [a, b])
      appendEvents(db, [shown("i-1"), ...attempt("i-1")]);
    const strip = (r: Record<string, unknown>[]) =>
      r.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([k]) => k !== "computed_at"),
        ),
      );
    expect(strip(rows(a, "items_view"))).toEqual(strip(rows(b, "items_view")));
    expect(strip(rows(a, "attempts_view"))).toEqual(
      strip(rows(b, "attempts_view")),
    );
    a.close();
    b.close();
  });
});
