// TSK-0280, REQ-3816: emptying the explanation cache loses no fact about
// play. After the cache is emptied and a full recompute runs, every event and
// every projection row is as it was; `report_cache` joins the comparison once
// ADR-0180 registers it.
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";
import { PROJECTIONS } from "../../src/engine/projections/registry.js";
import { recompute } from "../../src/engine/recompute.js";
import { openDatabase } from "../../src/server/database.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-explain-cache-"));
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

/** A table's rows, `computed_at` left out, in a fixed order. */
function rows(table: string): string {
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

const events = (): string =>
  createHash("sha256")
    .update(
      JSON.stringify(db.prepare("SELECT * FROM events ORDER BY seq").all()),
    )
    .digest("hex");

it("leaves every event and projection row as it was after the cache is emptied and a recompute runs", async () => {
  // The cache fills while she plays, so the projections fold with it full.
  const fill = db.prepare(
    `INSERT INTO explain_cache (variant_id, group_key, text, status, prompt_version, checks, reuse_failures, created_at)
     VALUES (?, ?, ?, 'visible', 'p1', '{}', 0, '2026-09-28T00:00:00Z')`,
  );
  for (let i = 0; i < 40; i++)
    fill.run(`v-${i}`, `A1.sum:${i % 8}`, `Разбор ${i}.`);

  const written = writeSyntheticLog(db, {
    days: 30,
    tasksPerDay: 20,
    seed: 5,
    explanations: true,
  });
  const shown = (
    db
      .prepare(
        "SELECT count(*) AS n FROM events WHERE type = 'explanation_shown'",
      )
      .get() as { n: number }
  ).n;
  expect(shown).toBeGreaterThan(0);
  const tables = PROJECTIONS.map((p) => p.table);
  const before = Object.fromEntries(tables.map((t) => [t, rows(t)]));
  const log = events();

  db.exec("DELETE FROM explain_cache");
  await recompute(db, { computedAt: "after-emptying" });

  expect(events()).toBe(log);
  for (const t of tables) expect(rows(t), t).toBe(before[t]);
  expect(
    (
      db.prepare("SELECT count(*) AS n FROM explain_cache").get() as {
        n: number;
      }
    ).n,
  ).toBe(0);
  console.log(
    `explain_cache: ${written} events with ${shown} explanations shown; 40 cached variants emptied; ${tables.join(", ")} and the log unchanged after the recompute`,
  );
});
