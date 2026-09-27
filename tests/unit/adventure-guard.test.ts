// TSK-0330, REQ-2404: appendEvents refuses an event that would make a complete
// or wrapped-up adventure active or paused, and the whole batch rolls back.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  AdventureClosed,
  appendEvents,
  type NewEvent,
} from "../../src/engine/events/append.js";
import { openDatabase } from "../../src/server/database.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-guard-"));
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

const lifecycle = (type: string, adventureId: string): NewEvent => ({
  type,
  v: 1,
  payload:
    type === "adventure_paused"
      ? { reason: "leave" }
      : type === "adventure_resumed"
        ? { pausedMs: 0 }
        : type === "adventure_wrapped_up"
          ? { adventureId, unopenedSecrets: [] }
          : { adventureId },
  origin: "server",
  adventureId,
});
const logged = (): number =>
  (db.prepare("SELECT count(*) AS n FROM events").get() as { n: number }).n;
const state = (adventureId: string): string | undefined =>
  (
    db
      .prepare("SELECT state FROM adventures WHERE adventure_id = ?")
      .get(adventureId) as { state: string } | undefined
  )?.state;

describe("REQ-2404: no event reopens a finished adventure", () => {
  for (const end of ["adventure_completed", "adventure_wrapped_up"]) {
    for (const reopen of [
      "adventure_started",
      "adventure_resumed",
      "adventure_paused",
    ]) {
      it(`refuses ${reopen} after ${end} and rolls the batch back`, () => {
        const id = `${end}-${reopen}`;
        appendEvents(db, [
          lifecycle("adventure_planned", id),
          lifecycle("adventure_started", id),
          lifecycle(end, id),
        ]);
        const finished = state(id);
        const before = logged();
        // A valid event first in the batch is rolled back with the refused one.
        expect(() =>
          appendEvents(db, [
            {
              type: "attempt_submitted",
              v: 0,
              payload: { raw: "1" },
              origin: "server",
            },
            lifecycle(reopen, id),
          ]),
        ).toThrow(AdventureClosed);
        expect(logged()).toBe(before);
        expect(state(id)).toBe(finished);
      });
    }
  }

  it("refuses a batch that completes an adventure and then pauses it", () => {
    appendEvents(db, [
      lifecycle("adventure_planned", "batch"),
      lifecycle("adventure_started", "batch"),
    ]);
    const before = logged();
    expect(() =>
      appendEvents(db, [
        lifecycle("adventure_completed", "batch"),
        lifecycle("adventure_paused", "batch"),
      ]),
    ).toThrow(AdventureClosed);
    expect(logged()).toBe(before);
    expect(state("batch")).toBe("active");
  });

  it("lets an open adventure pause and resume", () => {
    appendEvents(db, [
      lifecycle("adventure_planned", "open"),
      lifecycle("adventure_started", "open"),
      lifecycle("adventure_paused", "open"),
      lifecycle("adventure_resumed", "open"),
    ]);
    expect(state("open")).toBe("active");
  });
});
