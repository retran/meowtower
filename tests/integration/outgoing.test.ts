// TSK-0683: the server runs the gate on every line before it leaves, and a blocked line is replaced
// by the fallback (ADR-0160, REQ-3326).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Hono } from "hono";
import { afterAll, describe, expect, it } from "vitest";
import { Scene } from "../../src/shared/api.js";
import { t } from "../../src/shared/i18n.js";
import { readNotices } from "../../src/server/backups.js";
import { openDatabase } from "../../src/server/database.js";
import { useNoticesDir } from "../../src/server/failures.js";
import {
  createOutgoing,
  KEEP_ROWS,
  type Source,
} from "../../src/server/outgoing.js";
import { send } from "../../src/server/send.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-outgoing-"));
afterAll(() => {
  useNoticesDir(null);
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const fresh = () => openDatabase(join(root, `o${++n}.sqlite`));
const BAD = "Опять ошибкой?";
const rows = (db: ReturnType<typeof fresh>) =>
  db
    .prepare(
      "SELECT source, kind, rule, match, line FROM text_blocked ORDER BY id",
    )
    .all();

describe("REQ-3326: a forbidden line from any source never leaves and leaves one row", () => {
  const sources: Source[] = [
    "master",
    "pool",
    "explainer",
    "template",
    "fixed",
  ];

  it("replaces the line and records the source, kind, rule, form and the line", () => {
    const db = fresh();
    const out = createOutgoing(db);
    for (const source of sources)
      expect(out.line(BAD, { source })).toBe(t("system.fallback.line"));
    expect(rows(db)).toEqual(
      sources.map((source) => ({
        source,
        kind: "story",
        rule: "forbidden_form",
        match: "ошибкой",
        line: BAD,
      })),
    );
    db.close();
  });

  it("lets a clean line and the player's own words through", () => {
    const db = fresh();
    const out = createOutgoing(db);
    expect(out.line("Тропа открыта", { source: "master" })).toBe(
      "Тропа открыта",
    );
    expect(out.line(BAD, { source: "player" })).toBe(BAD);
    expect(rows(db)).toEqual([]);
    db.close();
  });

  it("gates a body on its way out, so the response carries the fallback", async () => {
    const db = fresh();
    const outgoing = createOutgoing(db);
    const app = new Hono();
    app.use("*", async (c, next) => {
      c.set("outgoing", outgoing);
      await next();
    });
    app.get("/scene", (c) =>
      send(c, Scene, {
        kind: "scene",
        sceneId: "s",
        lines: [{ speaker: "narrator", text: BAD }],
        branches: [],
        draft: null,
      }),
    );
    const body = await (await app.request("/scene")).text();
    expect(body).not.toContain("ошибкой");
    expect(body).toContain(t("system.fallback.line"));
    expect(rows(db)).toHaveLength(1);
    db.close();
  });
});

describe("REQ-3326: the table keeps the newest 1,000 rows", () => {
  it("drops the oldest row when a blocked line arrives at the limit", () => {
    const db = fresh();
    const out = createOutgoing(db);
    for (let i = 0; i < KEEP_ROWS + 5; i += 1)
      out.line(`${BAD} ${i}`, { source: "master" });
    const count = (
      db.prepare("SELECT count(*) AS n FROM text_blocked").get() as {
        n: number;
      }
    ).n;
    const oldest = (
      db.prepare("SELECT line FROM text_blocked ORDER BY id LIMIT 1").get() as {
        line: string;
      }
    ).line;
    expect(count).toBe(KEEP_ROWS);
    expect(oldest).toBe(`${BAD} 5`);
    db.close();
  });
});

describe("REQ-3326: text_blocked_high is raised once and again only on a large change of share", () => {
  it("counts lines per source and day and reports a share over 5 %", () => {
    const db = fresh();
    const dir = join(root, "notices");
    useNoticesDir(dir);
    let clock = Date.UTC(2026, 9, 1, 10);
    const out = createOutgoing(db, () => clock);
    const lines = (clean: number, bad: number) => {
      for (let i = 0; i < clean; i += 1)
        out.line("Тропа открыта", { source: "pool" });
      for (let i = 0; i < bad; i += 1) out.line(BAD, { source: "pool" });
    };
    lines(18, 2); // 2 of 20: 10 %
    const first = readNotices(dir).text_blocked_high?.["pool"];
    expect(first?.share).toBeCloseTo(0.1, 12);
    lines(0, 0);
    out.line("Тропа открыта", { source: "pool" }); // 2 of 21: about 9.5 %, within half of the last
    expect(readNotices(dir).text_blocked_high?.["pool"]).toEqual(first);
    lines(0, 10); // 12 of 31: each step past half of the last report updates it
    const later = readNotices(dir).text_blocked_high?.["pool"];
    expect(later?.share).toBeGreaterThan((first?.share ?? 1) * 1.5);
    expect(later?.share).toBeLessThanOrEqual(12 / 31);
    const counter = db
      .prepare(
        "SELECT checked, blocked FROM text_counters WHERE source = 'pool'",
      )
      .get();
    expect(counter).toEqual({ checked: 31, blocked: 12 });
    clock += 24 * 3_600_000; // the next game day starts a counter of its own
    out.line("Тропа открыта", { source: "pool" });
    expect(
      db
        .prepare(
          "SELECT count(*) AS n FROM text_counters WHERE source = 'pool'",
        )
        .get(),
    ).toEqual({ n: 2 });
    db.close();
  });
});
