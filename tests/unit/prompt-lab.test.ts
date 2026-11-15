// REQ-8302 (ADR-3280): the parent reads each prompt's version, tries a change and compares two runs. A
// version is the hash of the prompt's text, a change is held in memory for one run and leaves the file and
// every other run as it was, and a run reports the story, the judge's score and what it cost.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { baseSeed } from "../../src/math/rng.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { frameSystem, promptOf } from "../../src/server/frames/request.js";
import type {
  Gateway,
  GatewayRequest,
} from "../../src/server/gateway/gateway.js";
import {
  promptVersions,
  runFrame,
  withPromptPatch,
} from "../../src/server/studio/lab.js";
import { templates } from "../../src/templates/index.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-lab-"));
const opened: Db[] = [];
afterAll(async () => {
  for (const db of opened) await db.close();
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const database = async (): Promise<Db> => {
  n += 1;
  const db = await openDatabase(join(root, `${n.toString()}.sqlite`));
  opened.push(db);
  return db;
};

const template = templates.find(
  (t) => t.answer === "integer" && t.blank("ru").includes("{a}"),
);
if (!template) throw new Error("no_framable_template");
const seed = baseSeed("lab", template.id, 1);
const right = template.make(seed, "ru").entry;

/** A gateway that writes `story`, answers the judge as `ignores`, and logs a cost for each call. */
const fakeGateway = (
  db: Db,
  story: string,
  ignores = 0,
): Gateway & { seen: GatewayRequest[] } => ({
  seen: [],
  async call(r) {
    this.seen.push(r);
    await db
      .prepare(
        `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
           cost_usd, latency_ms, outcome, request, response)
         VALUES (?, ?, 'r', 'm', 'content', 'b', 1, 1, 0.01, 1, 'ok', '{}', '{}')`,
      )
      .run(new Date().toISOString(), r.role);
    return r.role === "TASK_TEXT_MODEL"
      ? { ok: true, text: JSON.stringify({ story }) }
      : {
          ok: true,
          text: JSON.stringify({
            unsafe: 0,
            changed: 0,
            fits: 0.5,
            flows: 0.5,
            clear: 0.5,
            alive: 0.5,
            sense: 0.5,
            numbers: 0,
            ...(r.system.includes("ignores:") ? { ignores } : {}),
            answer: right,
          }),
        };
  },
});

describe("REQ-8302: the version of a prompt", () => {
  it("lists the prompts of the frames and of the scenario writer in each language, with a hash of the text", () => {
    const list = promptVersions();
    expect(list.map((p) => p.id).sort()).toEqual(
      [
        "frames.en",
        "frames.nl",
        "frames.ru",
        "scenario.en",
        "scenario.nl",
        "scenario.ru",
      ].sort(),
    );
    for (const p of list) expect(p.version, p.id).toMatch(/^[0-9a-f]{12}$/);
    expect(new Set(list.map((p) => p.version)).size).toBe(list.length);
    expect(promptVersions()).toEqual(list);
  });

  it("names the fields of a prompt that are text, so one can be tried with a change", () => {
    const frames = promptVersions().find((p) => p.id === "frames.ru");
    expect(frames?.fields).toEqual(
      expect.arrayContaining(["intro", "setting", "never", "continuation"]),
    );
  });
});

describe("REQ-8302: a change held for one run", () => {
  it("changes the prompt inside the run, and leaves it as it was outside and after", async () => {
    const before = promptOf("ru").intro;
    const inside = await withPromptPatch(
      "ru",
      { field: "intro", text: "PATCHED INTRO" },
      async () => {
        await new Promise((r) => setTimeout(r, 5));
        return frameSystem("ru", 2);
      },
    );
    expect(inside).toContain("PATCHED INTRO");
    expect(promptOf("ru").intro).toBe(before);
    expect(frameSystem("ru", 2)).not.toContain("PATCHED INTRO");
  });

  it("keeps two runs that overlap apart", async () => {
    const [a, b] = await Promise.all([
      withPromptPatch("ru", { field: "intro", text: "ONE" }, async () => {
        await new Promise((r) => setTimeout(r, 10));
        return promptOf("ru").intro;
      }),
      withPromptPatch("ru", { field: "intro", text: "TWO" }, async () => {
        await new Promise((r) => setTimeout(r, 1));
        return promptOf("ru").intro;
      }),
    ]);
    expect([a, b]).toEqual(["ONE", "TWO"]);
  });

  it("refuses a field that holds no text", () => {
    expect(() =>
      withPromptPatch("ru", { field: "rules", text: "x" }, () => 1),
    ).toThrow(/field/);
  });
});

describe("REQ-8302: a run of a frame", () => {
  it("returns the story, the judge's score and what the run cost, with the change in the author's prompt", async () => {
    const db = await database();
    const gateway = fakeGateway(db, "Страж просит найти число?");
    const run = await runFrame(gateway, db, {
      template,
      base: seed,
      lang: "ru",
      patch: { field: "intro", text: "PATCHED INTRO" },
    });
    expect(run.story).toBe("Страж просит найти число?");
    expect(typeof run.score).toBe("number");
    expect(run.costUsd).toBeCloseTo(0.02, 5);
    expect(gateway.seen[0]?.system).toContain("PATCHED INTRO");
    expect(gateway.seen[1]?.system).not.toContain("PATCHED INTRO");
    expect(run.version).toBe(
      promptVersions().find((p) => p.id === "frames.ru")?.version,
    );
    expect(run.patched).toBe(true);
  });

  it("scores a story that ignores the action lower than one that follows it", async () => {
    const db = await database();
    const action = { tried: "pick the lock", hard: "it is stiff" };
    const follows = await runFrame(fakeGateway(db, "Замок?", 0), db, {
      template,
      base: seed,
      lang: "ru",
      action,
    });
    const ignores = await runFrame(fakeGateway(db, "Замок?", 1), db, {
      template,
      base: seed,
      lang: "ru",
      action,
    });
    expect((follows.score ?? 0) - (ignores.score ?? 0)).toBeCloseTo(1, 5);
  });

  it("says so when the author's reply fails the checks of code", async () => {
    const db = await database();
    const run = await runFrame(fakeGateway(db, "Это ошибка"), db, {
      template,
      base: seed,
      lang: "ru",
    });
    expect(run.fault).toBe("gate");
  });
});
