// REQ-8006, REQ-8004: the Parent Room lists the falls of a node's level and of the rank, and the
// hide setting starts off.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";
import { fallsRead } from "../../src/server/falls.js";
import { parentSettings } from "../../src/server/parent-room.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-falls-"));
const db = openDatabase(join(root, "f.sqlite"));
afterAll(() => {
  db.close();
  rmSync(root, { recursive: true, force: true });
});

describe("falls in the Parent Room", () => {
  it("lists nothing while nothing has fallen", () => {
    expect(fallsRead(db)).toEqual([]);
  });

  it("lists a fall of a node and of the rank, and skips the rises", () => {
    const changes = JSON.stringify([
      { from: 1, to: 2, fell: false, itemId: "a", at: 1_000 },
      { from: 2, to: 1, fell: true, itemId: "b", at: 2_000 },
    ]);
    db.prepare(
      "INSERT INTO node_levels VALUES ('P3', 1, 'level.v1', 0, ?, 'x')",
    ).run(changes);
    db.prepare(
      "INSERT INTO rank_state VALUES (1, 'E', 'rank.v1', 0, ?, 'x')",
    ).run(
      JSON.stringify([
        { from: "E", to: "D", fell: false, day: 3 },
        { from: "D", to: "E", fell: true, day: 9 },
      ]),
    );
    expect(fallsRead(db)).toEqual([
      { kind: "rank", from: "D", to: "E", day: 9 },
      {
        kind: "skill",
        skill: "trade",
        node: "P3",
        from: 2,
        to: 1,
        at: "1970-01-01T00:00:02.000Z",
      },
    ]);
  });

  it("hides no fall of rank until the parent says so", () => {
    expect(parentSettings(db).hideRankFalls).toBe(false);
  });
});
