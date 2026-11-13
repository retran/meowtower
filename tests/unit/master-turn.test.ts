// REQ-8168, REQ-8182, REQ-8194, REQ-8222, REQ-8252, REQ-8256, REQ-8218: a turn of the Master. The
// scenario and the guardrails go in the system prompt, the reply passes the forbidden-word list
// before it shows, a tool call outside its contract is refused, and each turn is logged.
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { openDatabase } from "../../src/server/database.js";
import { MASTER_TOOL_NAMES } from "../../src/story/master-tools.js";
import {
  masterSystemPrompt,
  recordTurn,
  takeTurn,
  type MasterModel,
} from "../../src/story/turn.js";

const SCENARIO = JSON.stringify({ id: "s1", premise: "Boats tied together" });
const BLOCKED = "The fog thickens and the scene fades.";
const forbidden = (
  JSON.parse(
    readFileSync(
      new URL("../../content/shaming.ru.json", import.meta.url),
      "utf8",
    ),
  ) as { forms: { forms: string[] }[] }
).forms[0]?.forms[0] as string;

const asked: { system: string; said: string }[] = [];
const modelSaying =
  (text: string, calls: { tool: string; input: unknown }[] = []): MasterModel =>
  (request) => {
    asked.push({ system: request.system, said: request.said });
    return Promise.resolve({ text, calls });
  };
const turn = (model: MasterModel, said = "I open the gate") =>
  takeTurn({
    model,
    scenario: SCENARIO,
    encounter: "e1",
    said,
    lang: "ru",
    blockedText: BLOCKED,
  });

describe("REQ-8252, REQ-8222, REQ-8234: the system prompt", () => {
  it("carries the scenario, the guardrails and every tool, and holds the same prefix each turn", async () => {
    asked.length = 0;
    await turn(modelSaying("The gate creaks."), "first");
    await turn(modelSaying("The gate swings."), "second");
    const system = asked[0]?.system ?? "";
    expect(system).toContain(SCENARIO);
    for (const tool of MASTER_TOOL_NAMES) expect(system).toContain(tool);
    expect(system).toMatch(/forbidden/i);
    expect(system).toMatch(/canon/i);
    expect(asked[1]?.system).toBe(system);
    // Her words are the turn's message and never part of the cached prefix.
    expect(system).not.toContain("first");
    expect(asked.map((a) => a.said)).toEqual(["first", "second"]);
    expect(masterSystemPrompt(SCENARIO)).toBe(system);
  });
});

describe("REQ-8194, REQ-8220: the reply", () => {
  it("shows a clean reply as written and logs it", async () => {
    const out = await turn(modelSaying("The gate creaks open."));
    expect(out.reply).toBe("The gate creaks open.");
    expect(out.blocked).toBe(false);
    expect(out.events[0]).toMatchObject({
      type: "turn_taken",
      payload: {
        encounter: "e1",
        said: "I open the gate",
        reply: "The gate creaks open.",
      },
    });
  });

  it("replaces a reply with a word from the list by story text, and drops its tool calls", async () => {
    const out = await turn(
      modelSaying(`The boatman says ${forbidden}.`, [
        { tool: "record_fact", input: { fact: "The boatman is angry" } },
      ]),
    );
    expect(out.blocked).toBe(true);
    expect(out.reply).toBe(BLOCKED);
    expect(out.calls).toEqual([]);
    expect(out.events).toHaveLength(1);
    expect(out.events[0]).toMatchObject({
      payload: { reply: BLOCKED },
    });
  });

  it("does not check her own words against the list", async () => {
    const out = await turn(modelSaying("Fine."), `I say ${forbidden}`);
    expect(out.blocked).toBe(false);
    expect(out.events[0]).toMatchObject({
      payload: { said: `I say ${forbidden}` },
    });
  });
});

describe("REQ-8182, REQ-8256: the tool calls", () => {
  it("keeps a call that fits its contract and writes a world change as an event", async () => {
    const out = await turn(
      modelSaying("A lantern appears.", [
        {
          tool: "change_world",
          input: { kind: "item", name: "lantern", note: "left on the quay" },
        },
        { tool: "request_check", input: { tried: "climb", hard: "it is wet" } },
      ]),
    );
    expect(out.calls.map((c) => c.tool)).toEqual([
      "change_world",
      "request_check",
    ]);
    expect(out.refused).toEqual([]);
    expect(out.events.map((e) => e.type)).toEqual([
      "turn_taken",
      "world_changed",
    ]);
    expect(out.events[1]).toMatchObject({
      payload: { kind: "item", name: "lantern", note: "left on the quay" },
    });
  });

  it("refuses a check that names its outcome, a tool that is not one and an input that does not fit", async () => {
    const out = await turn(
      modelSaying("Done.", [
        {
          tool: "request_check",
          input: { tried: "a", hard: "b", outcome: "success" },
        },
        { tool: "set_level", input: { level: 5 } },
        {
          tool: "change_world",
          input: { kind: "weather", name: "x", note: "y" },
        },
      ]),
    );
    expect(out.calls).toEqual([]);
    expect(out.refused).toEqual([
      { tool: "request_check", fault: "tool_input_invalid" },
      { tool: "set_level", fault: "tool_unknown" },
      { tool: "change_world", fault: "tool_input_invalid" },
    ]);
    expect(out.events.map((e) => e.type)).toEqual(["turn_taken"]);
  });
});

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});

describe("REQ-8218: each turn is in the log", () => {
  it("appends the turn and its world changes in order", async () => {
    const dir = mkdtempSync(join(tmpdir(), "meowtower-turn-"));
    dirs.push(dir);
    const db = await openDatabase(join(dir, "turn.sqlite"));
    try {
      const out = await turn(
        modelSaying("A lantern appears.", [
          {
            tool: "change_world",
            input: { kind: "item", name: "lantern", note: "on the quay" },
          },
        ]),
      );
      await recordTurn(db, out, appendEvents);
      const rows = (await db
        .prepare("SELECT type FROM events ORDER BY seq")
        .all()) as { type: string }[];
      expect(rows.map((r) => r.type)).toEqual(["turn_taken", "world_changed"]);
    } finally {
      await db.close();
    }
  });
});
