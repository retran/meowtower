// REQ-8394, REQ-8400: the sheet's route gives the nine skills as a whole level and a percentage, or
// "not yet shown", and never a node, an estimate or a chance.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { SkillsOut } from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-sheet-"));
const opened: Db[] = [];
afterAll(async () => {
  for (const db of opened) await db.close();
  rmSync(root, { recursive: true, force: true });
});

let worlds = 0;
async function world() {
  const db = await openDatabase(join(root, `w${String(++worlds)}.sqlite`));
  opened.push(db);
  const app = await createApp({ db, now: () => 1_000_000 });
  const cookie = `meowtower_device=${await registerDevice(db, "tablet")}`;
  return {
    db,
    skills: () => app.request("/api/player/skills", { headers: { cookie } }),
    anonymous: () => app.request("/api/player/skills"),
  };
}

describe("GET /api/player/skills", () => {
  it("refuses a request from a device the game does not know", async () => {
    expect((await (await world()).anonymous()).status).not.toBe(200);
  });

  it("gives all nine skills as not yet shown while nothing is scored", async () => {
    const res = await (await world()).skills();
    expect(res.status).toBe(200);
    const { skills } = SkillsOut.parse(await res.json());
    expect(skills.map((s) => s.skill)).toEqual([
      "marks",
      "mechanics",
      "sharing",
      "precision",
      "trade",
      "wayfinding",
      "shaping",
      "scouting",
      "interpreting",
    ]);
    expect(skills.every((s) => !s.shown)).toBe(true);
  });

  it("gives a scored skill its level and percentage and nothing else", async () => {
    const w = await world();
    await w.db
      .prepare(
        "INSERT INTO skill_scores VALUES ('trade', 1, 3, 40, '2026-11-04T00:00:00Z')",
      )
      .run();
    const body = (await (await w.skills()).json()) as {
      skills: Record<string, unknown>[];
    };
    expect(body.skills.find((s) => s.skill === "trade")).toEqual({
      skill: "trade",
      shown: true,
      level: 3,
      percent: 40,
    });
    expect(body.skills.find((s) => s.skill === "marks")).toEqual({
      skill: "marks",
      shown: false,
    });
  });
});
