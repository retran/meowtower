// ADR-0510, TSK-0529: a candidate is written active only when it predicts the held-out attempts
// better on log-loss and on calibration; the first version has no predecessor and no gate.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { eventsOfType } from "../../src/engine/events/read.js";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import {
  loadParams,
  ModelParamsInvalid,
} from "../../src/engine/model/params.js";
import { openDatabase } from "../../src/server/database.js";
import { activateModel } from "../../src/server/model-activate.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-activate-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));
const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const v1Text = readFileSync(
  new URL("../../content/model.v1.json", import.meta.url),
  "utf8",
);
const v1 = loadParams(v1Text);
/** The v1 file as another version, with the group-7 first-year prior set to `prior`. */
const variant = (version: string, prior: number): string => {
  const file = JSON.parse(v1Text) as {
    version: string;
    pInit: Record<string, Record<string, number>>;
  };
  file.version = version;
  file.pInit["7"] = { ...file.pInit["7"], "1F": prior };
  return JSON.stringify(file);
};
let n = 0;
const fresh = () => {
  const db = openDatabase(join(root, `a${++n}.sqlite`));
  writeSyntheticLog(db, { days: 20, tasksPerDay: 15, seed: 8 });
  return db;
};
const activated = (db: ReturnType<typeof fresh>) =>
  eventsOfType(db, "model_activated");

describe("TSK-0529 AC3: the first version has no predecessor, so the gate is skipped", () => {
  it("writes model_activated with no earlier figures", () => {
    const db = fresh();
    const r = activateModel(db, v1Text, {
      graph,
      zone: "UTC",
      active: () => null,
    });
    expect(r.accepted).toBe(true);
    expect(r.previous).toBeNull();
    const payload = activated(db)[0]?.payload as {
      figures: { active: unknown };
    };
    expect(payload.figures.active).toBeNull();
    db.close();
  });
});

describe("TSK-0529 AC1, AC2: the event is written exactly when the candidate beats the active version on both measures", () => {
  it.each([
    ["v2", 0.95],
    ["v3", 0.01],
  ])("agrees with the figures for candidate %s", (version, prior) => {
    const db = fresh();
    const r = activateModel(db, variant(version, prior), {
      graph,
      zone: "UTC",
      active: () => v1,
    });
    const a = r.figures.active;
    const c = r.figures.candidate;
    const better = a !== null && c.logLoss < a.logLoss && c.ece < a.ece;
    expect(r.accepted).toBe(better);
    expect(activated(db)).toHaveLength(better ? 1 : 0);
    if (!better) expect(r.reasons.length).toBeGreaterThan(0);
    db.close();
  });

  it("separates the two candidates, so one is refused and one differs", () => {
    const db = fresh();
    const context = { graph, zone: "UTC", active: () => v1 };
    const low = activateModel(db, variant("v3", 0.01), context);
    const high = activateModel(db, variant("v2", 0.95), context);
    expect(low.figures.candidate).not.toEqual(high.figures.candidate);
    db.close();
  });
});

describe("TSK-0529: a file already active and an invalid file", () => {
  it("refuses the active version again and writes no event", () => {
    const db = fresh();
    const r = activateModel(db, v1Text, {
      graph,
      zone: "UTC",
      active: () => v1,
    });
    expect(r.accepted).toBe(false);
    expect(activated(db)).toHaveLength(0);
    db.close();
  });

  it("throws for a file the validator refuses", () => {
    const db = fresh();
    const bad = JSON.stringify({ ...JSON.parse(v1Text), pGuessFree: 2 });
    expect(() =>
      activateModel(db, bad, { graph, zone: "UTC", active: () => v1 }),
    ).toThrow(ModelParamsInvalid);
    db.close();
  });
});
