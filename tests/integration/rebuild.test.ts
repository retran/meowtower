// TSK-0260: the full recompute. Each projection rebuilds identical from the
// log alone (REQ-2200), the seven service tables stay as they were (REQ-2242),
// appends go on during it, a stored row that differs is reported, a failure
// leaves the old projections in place, and a large log raises its notice.
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { storeScratch } from "../../src/engine/blobs/store.js";
import { PROJECTIONS } from "../../src/engine/projections/registry.js";
import {
  checkProjections,
  recompute,
  shadowOf,
  VERSION_LABEL,
} from "../../src/engine/recompute.js";
import { readNotices } from "../../src/server/backups.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { checkLogSize, runRecompute } from "../../src/server/recompute.js";
import { createParentApp } from "../../src/server/parent.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";
import { webp } from "../helpers/webp.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-recompute-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});

let worlds = 0;
/** A database holding the synthetic 30-day log, a device and a stored image. */
function world() {
  const base = join(root, `w${++worlds}`);
  mkdirSync(base, { recursive: true });
  const db = openDatabase(join(base, "live.sqlite"));
  opened.push(db);
  const events = writeSyntheticLog(db, { days: 30, tasksPerDay: 20, seed: 7 });
  registerDevice(db, "tablet");
  storeScratch(db, join(base, "blobs"), webp("pad"), {
    itemId: "item-7-0-0",
    attemptNo: 1,
    origin: "server",
  });
  return { base, db, events, dir: join(base, "snapshots") };
}

/** Every row of a table, `computed_at` left out, in a fixed order. */
function rows(db: Db, table: string): string {
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
}

const SERVICE_TABLES = [
  "blobs",
  "explain_cache",
  "devices",
  "llm_log",
  "art_jobs",
  "frames",
  "bakeoff",
];

/** Each service table's row count and a hash of its rows, or "absent". */
function services(db: Db): Record<string, string> {
  return Object.fromEntries(
    SERVICE_TABLES.map((t) => {
      const there = db
        .prepare(
          "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get(t);
      if (!there) return [t, "absent"];
      const all = db.prepare(`SELECT * FROM ${t} ORDER BY rowid`).all();
      return [
        t,
        `${all.length} ${createHash("sha256").update(JSON.stringify(all)).digest("hex")}`,
      ];
    }),
  );
}

const shadowsLeft = (db: Db): string[] =>
  (
    db
      .prepare(
        "SELECT name FROM sqlite_master WHERE name LIKE '%\\_\\_next' ESCAPE '\\'",
      )
      .all() as { name: string }[]
  ).map((r) => r.name);

describe("REQ-2200: each projection rebuilds identical from the log alone", () => {
  it("rebuilds every table after it is deleted, the same in every column but computed_at", async () => {
    const w = world();
    const report: string[] = [];
    for (const p of PROJECTIONS) {
      const before = rows(w.db, p.table);
      const count = (
        w.db.prepare(`SELECT count(*) AS n FROM ${p.table}`).get() as {
          n: number;
        }
      ).n;
      w.db.exec(`DROP TABLE ${p.table}`);
      const result = await recompute(w.db, { computedAt: "later" });
      expect(rows(w.db, p.table)).toEqual(before);
      report.push(`${p.table} ${count} rows`);
      expect(result.tables).toContain(p.table);
    }
    expect(shadowsLeft(w.db)).toEqual([]);
    console.log(`rebuild: ${w.events} events; ${report.join(", ")}`);
  });
});

describe("REQ-2242: the seven service tables stay as they were", () => {
  it("leaves the row counts and a hash of each unchanged", async () => {
    const w = world();
    const before = services(w.db);
    expect(before["blobs"]).not.toBe("absent");
    expect(before["devices"]).not.toBe("absent");
    await recompute(w.db, { computedAt: "later" });
    expect(services(w.db)).toEqual(before);
    console.log(`services: ${JSON.stringify(before)}`);
  });
});

describe("appends go on while a recompute runs", () => {
  it("waits no append beyond one chunk, and the swapped tables hold the appended events", async () => {
    const w = world();
    let done = false;
    let worst = 0;
    let appended = 0;
    const running = recompute(w.db, { computedAt: "later", chunk: 200 }).then(
      (r) => {
        done = true;
        return r;
      },
    );
    while (!done) {
      const t0 = performance.now();
      appendEvents(w.db, [
        {
          type: "item_shown",
          v: 1,
          payload: {
            itemId: `during-${appended}`,
            view: {
              locale: "ru",
              text: "1 + 1",
              svg: null,
              options: null,
              terms: [],
            },
            templateId: "A1.sum",
            templateVersion: 1,
            seed: `during-${appended}`,
            params: { a: 1, b: 1 },
            node: "A1",
            subtype: "sum",
            purpose: "frontier",
            attemptNo: 1,
            correctAnswer: "2",
            shortSolution: ["1 + 1 = 2"],
          },
          origin: "server",
          sessionId: "during",
        },
      ]);
      worst = Math.max(worst, performance.now() - t0);
      appended++;
      await new Promise((r) => setImmediate(r));
    }
    const result = await running;
    const shown = (
      w.db
        .prepare(
          "SELECT count(*) AS n FROM items_view WHERE item_id LIKE 'during-%'",
        )
        .get() as { n: number }
    ).n;
    expect(appended).toBeGreaterThan(1);
    expect(shown).toBe(appended);
    expect(worst).toBeLessThan(50);
    console.log(
      `appends during recompute: ${appended}, longest wait ${worst.toFixed(2)} ms, recompute ${result.ms} ms`,
    );
  });
});

describe("projection_diverged", () => {
  it("names the table and the first differing row, and nothing on a clean database", async () => {
    const w = world();
    expect(checkProjections(w.db)).toEqual([]);
    w.db
      .prepare(
        "UPDATE attempts_view SET verdict = 'wrong' WHERE item_id = 'item-7-3-4' AND attempt_no = 1",
      )
      .run();
    const found = checkProjections(w.db);
    expect(found).toHaveLength(1);
    expect(found[0]?.check).toBe("projection_diverged");
    expect(found[0]?.table).toBe("attempts_view");
    expect(found[0]?.stored).not.toEqual(found[0]?.derived);
    expect(
      [found[0]?.stored?.["item_id"], found[0]?.derived?.["item_id"]].every(
        (id) => typeof id === "string",
      ),
    ).toBe(true);
  });
});

describe("recompute_failed", () => {
  it("keeps the old projections, leaves no shadow table, and tells the parent the version and time", async () => {
    const w = world();
    const before = Object.fromEntries(
      PROJECTIONS.map((p) => [p.table, rows(w.db, p.table)]),
    );
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    let chunks = 0;
    await expect(
      runRecompute(w.db, {
        dir: w.dir,
        now: () => Date.parse("2026-09-27T21:00:00Z"),
        chunk: 300,
        onChunk: () => {
          if (++chunks === 3) throw new Error("disk full");
        },
      }),
    ).rejects.toThrow("disk full");
    for (const p of PROJECTIONS)
      expect(rows(w.db, p.table)).toEqual(before[p.table]);
    expect(shadowsLeft(w.db)).toEqual([]);
    expect(PROJECTIONS.map((p) => shadowOf(p.table))).not.toContain(undefined);
    expect(readNotices(w.dir).recompute_failed).toEqual({
      at: "2026-09-27T21:00:00.000Z",
      version: VERSION_LABEL,
      reason: "disk full",
    });
    const page = await (
      await createParentApp({ db: w.db, snapshots: w.dir }).request("/")
    ).text();
    expect(page).toContain("Пересчёт не удался (2026-09-27T21:00:00.000Z");
    // The next good recompute clears it.
    await runRecompute(w.db, { dir: w.dir, now: Date.now });
    expect(readNotices(w.dir).recompute_failed).toBeNull();
    errors.mockRestore();
  });
});

describe("recompute_slow and log_large", () => {
  it("raises recompute_slow once when a recompute passes the budget", async () => {
    const w = world();
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    await runRecompute(w.db, { dir: w.dir, now: Date.now, budgetMs: -1 });
    const first = readNotices(w.dir).recompute_slow;
    expect(first?.ms).toBeGreaterThanOrEqual(0);
    await runRecompute(w.db, { dir: w.dir, now: Date.now, budgetMs: -1 });
    expect(readNotices(w.dir).recompute_slow).toEqual(first);
    expect(
      errors.mock.calls.filter((c) =>
        String(c[0]).startsWith("recompute_slow"),
      ),
    ).toHaveLength(1);
    errors.mockRestore();
  });

  it("raises log_large once when the log passes the limit", () => {
    const w = world();
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(checkLogSize(w.db, w.dir, Date.now)).toBe(false);
    expect(readNotices(w.dir).log_large ?? null).toBeNull();
    expect(checkLogSize(w.db, w.dir, Date.now, 1024)).toBe(true);
    expect(checkLogSize(w.db, w.dir, Date.now, 1024)).toBe(false);
    expect(readNotices(w.dir).log_large?.bytes).toBeGreaterThan(1024);
    errors.mockRestore();
  });
});
