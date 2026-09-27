// REQ-2232: meowtower rebuilds a missing projection table from the log at
// start-up, before it listens, so no play request meets the missing table.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { openDatabase } from "../../src/server/database.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-rebuild-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

it("rebuilds items_view before the first request is accepted", async () => {
  const live = join(dir, "live.sqlite");
  const db = openDatabase(live);
  for (let i = 0; i < 50; i++) {
    appendEvents(db, [
      {
        type: "item_shown",
        v: 1,
        origin: "server",
        sessionId: "s",
        payload: {
          itemId: `i-${i}`,
          view: {
            locale: "ru",
            text: "t",
            svg: null,
            options: null,
            terms: [],
          },
          templateId: "A1.sum",
          templateVersion: 1,
          seed: `s${i}`,
          params: { a: i },
          node: "A1",
          subtype: "sum",
          purpose: "frontier",
          attemptNo: 1,
          correctAnswer: String(i),
          shortSolution: ["s"],
        },
      },
    ]);
  }
  appendEvents(db, [
    {
      type: "item_excluded",
      v: 1,
      origin: "server",
      payload: { itemId: "i-7", reason: "x" },
    },
  ]);
  const strip = (rows: Record<string, unknown>[]) =>
    rows.map((r) =>
      Object.fromEntries(
        Object.entries(r).filter(([k]) => k !== "computed_at"),
      ),
    );
  const before = strip(
    db.prepare("SELECT * FROM items_view ORDER BY item_id").all() as Record<
      string,
      unknown
    >[],
  );
  db.exec("DROP TABLE items_view");
  db.close();

  const child = spawn(
    process.execPath,
    ["--import", "tsx", "src/server/main.ts"],
    {
      env: {
        ...process.env,
        MEOWTOWER_DB: live,
        MEOWTOWER_SNAPSHOTS: join(dir, "snaps"),
        PORT: "3928",
        PARENT_PORT: "3929",
      },
      stdio: "ignore",
    },
  );
  let refusedBeforeReady = 0;
  for (let i = 0; i < 200; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3928/health")).ok) break;
    } catch {
      refusedBeforeReady++;
    }
    await new Promise((r) => setTimeout(r, 25));
  }
  // Once it listens, the table is back with the same rows.
  const check = new Database(live, { readonly: true });
  const after = strip(
    check.prepare("SELECT * FROM items_view ORDER BY item_id").all() as Record<
      string,
      unknown
    >[],
  );
  check.close();
  child.kill("SIGKILL");
  expect(refusedBeforeReady).toBeGreaterThan(0);
  expect(after).toEqual(before);
}, 30000);
