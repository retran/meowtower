// REQ-2204, REQ-2206, REQ-2208, REQ-2212, REQ-3804: every task and attempt
// event carries its required facts, or the log refuses it.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents, EventInvalid } from "../../src/engine/events/append.js";
import { openDatabase } from "../../src/server/database.js";
import {
  EVENT_CATALOGUE,
  EVENT_DEFS,
  fieldDictionary,
} from "../../src/shared/events.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-schemas-"));
const db = openDatabase(join(dir, "meowtower.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
const count = (): number =>
  (db.prepare("SELECT count(*) AS n FROM events").get() as { n: number }).n;

const valid: Record<string, Record<string, unknown>> = {
  item_shown: {
    itemId: "i-1",
    view: {
      locale: "ru",
      text: "{a} + {b}",
      svg: null,
      options: null,
      terms: [],
    },
    templateId: "A1.sum",
    templateVersion: 1,
    seed: "s-1",
    params: { a: 3, b: 4 },
    node: "A1",
    subtype: "sum",
    purpose: "frontier",
    attemptNo: 1,
    correctAnswer: "7",
    shortSolution: ["3 + 4 = 7"],
  },
  attempt_submitted: {
    itemId: "i-1",
    attemptNo: 1,
    input: {
      firstKeyMs: 900,
      submittedMs: 4200,
      edits: 1,
      erasures: 0,
      keyPresses: 2,
      focusLosses: { count: 0, totalMs: 0 },
      method: "keypad",
    },
    answer: { entered: "7", parsed: 7 },
    assisted: false,
    hintLevel: 0,
  },
  verdict: {
    itemId: "i-1",
    attemptNo: 1,
    verdict: "correct",
    outcome: "clean",
    trapId: null,
    errorClass: null,
    steps: [{ step: "s1", matched: true }],
  },
  hint_shown: { itemId: "i-1", attemptNo: 1, level: 1 },
  thread_spent: { itemId: "i-1", reason: "hint", count: 1 },
  solution_shown: { itemId: "i-1", attemptNo: 1, dwellMs: 3000 },
  explanation_shown: {
    itemId: "i-1",
    attemptNo: 1,
    dwellMs: 8000,
    source: "model",
  },
  glossary_opened: { itemId: "i-1", term: "знаменатель" },
  scene_shown: {
    sceneId: "sc-1",
    lines: [{ speaker: "system", text: "Узел ослаблен." }],
  },
  choice_made: { sceneId: "sc-1", choiceId: "c-2" },
  free_text: { sceneId: "sc-1", cleaned: "Я иду к мосту." },
  name_given: { target: "familiar", targetId: "f-1", name: "Пуговка" },
  reward_granted: {
    source: "quest",
    kind: "buttons",
    rewardId: "r-1",
    amount: 10,
  },
  chest_offered: {
    chestId: "ch-1",
    options: [
      { kind: "buttons", rewardId: "r-2", quality: "good" },
      { kind: "shards", rewardId: "r-3", quality: "ordinary" },
      { kind: "page", rewardId: "r-4", quality: "good" },
    ],
  },
  chest_chosen: { chestId: "ch-1", rewardId: "r-2" },
  forge_crafted: { recipeId: "rc-1", craftedId: "it-1" },
  shop_purchase: { shopItemId: "it-2", price: 80 },
  level_up: { level: 2 },
  quest_progress: { questId: "q-1", progress: 1, target: 3 },
  familiar_friendship: { familiarId: "f-1", points: 12, level: 1 },
  familiar_hatched: { familiarId: "f-1" },
  familiar_evolved: { familiarId: "f-1", stage: 2 },
  thread_granted: { source: "morning", count: 3 },
  adventure_paused: { reason: "idle" },
  adventure_resumed: { pausedMs: 600000 },
  device_lease_taken: { previousDeviceId: null },
  eye_exercise: { exerciseId: "e-1", completed: true },
  rest_stop_offered: { trigger: "fatigue" },
  rest_stop_started: { trigger: "button" },
  rest_stop_ended: { durationMs: 300000 },
  soft_stop: { activeMs: 3600000 },
  extension: { minutes: 20 },
  parent_tag_added: { node: "F2", subtype: null },
  parent_tag_removed: { node: "F2", subtype: null },
  item_flagged: { itemId: "i-1", note: null },
  item_excluded: { itemId: "i-1", reason: "ambiguous" },
  settings_changed: { key: "creepiness", value: 1 },
  safety_event: { level: "everyday", source: "free_text", sceneId: "sc-1" },
  llm_call: { llmLogId: "log-1", role: "master" },
};

const without = (o: object, key: string): Record<string, unknown> =>
  Object.fromEntries(Object.entries(o).filter(([k]) => k !== key));
const input = valid["attempt_submitted"]?.["input"] as object;
const view = valid["item_shown"]?.["view"] as object;

function append(type: string, payload: unknown): void {
  appendEvents(db, [{ type, v: 1, payload, origin: "server" }]);
}

describe("each schema accepts a payload with every required fact", () => {
  for (const [type, payload] of Object.entries(valid)) {
    it(type, () => {
      const before = count();
      append(type, payload);
      expect(count()).toBe(before + 1);
    });
  }
});

describe("a payload missing a required fact is refused and names the field", () => {
  for (const [type, payload] of Object.entries(valid)) {
    for (const field of Object.keys(payload)) {
      it(`${type} without ${field}`, () => {
        const before = count();
        const rest = without(payload, field);
        expect(() => append(type, rest)).toThrow(EventInvalid);
        expect(() => append(type, rest)).toThrow(field);
        expect(count()).toBe(before);
      });
    }
  }
  for (const part of Object.keys(input)) {
    it(`attempt_submitted without input.${part}`, () => {
      expect(() =>
        append("attempt_submitted", {
          ...valid["attempt_submitted"],
          input: without(input, part),
        }),
      ).toThrow(`input.${part}`);
    });
  }
  it("item_shown whose view lacks its locale", () => {
    expect(() =>
      append("item_shown", {
        ...valid["item_shown"],
        view: without(view, "locale"),
      }),
    ).toThrow("view.locale");
  });
});

describe("REQ-2206: a second attempt links the task it follows", () => {
  it("refuses a second attempt without parentItemId", () => {
    expect(() =>
      append("item_shown", { ...valid["item_shown"], attemptNo: 2 }),
    ).toThrow("parentItemId");
  });
  it("accepts a second attempt with parentItemId", () => {
    append("item_shown", {
      ...valid["item_shown"],
      itemId: "i-2",
      attemptNo: 2,
      parentItemId: "i-1",
    });
  });
});

describe("REQ-2208: the explanation's dwell time is logged, never its text", () => {
  it("refuses an explanation_shown carrying text", () => {
    expect(() =>
      append("explanation_shown", {
        ...valid["explanation_shown"],
        text: "Сначала…",
      }),
    ).toThrow(EventInvalid);
  });
});

describe("a batch is written whole or not at all", () => {
  it("writes nothing when one event of the batch is invalid", () => {
    const before = count();
    expect(() =>
      appendEvents(db, [
        {
          type: "hint_shown",
          v: 1,
          payload: valid["hint_shown"],
          origin: "server",
        },
        { type: "hint_shown", v: 1, payload: {}, origin: "server" },
      ]),
    ).toThrow(EventInvalid);
    expect(count()).toBe(before);
  });
  it("refuses a type or version with no schema", () => {
    expect(() => append("made_up", {})).toThrow("event_schema_unknown");
  });
});

describe("the field dictionary", () => {
  it("describes every field of every schema", () => {
    const rows = fieldDictionary();
    expect(rows.length).toBeGreaterThan(40);
    expect(rows.filter((r) => !r.description)).toEqual([]);
  });
});

describe("REQ-2214: her free text is logged only in its cleaned form", () => {
  it("free_text has no field for the text before cleaning", () => {
    expect(() =>
      append("free_text", {
        ...valid["free_text"],
        raw: "text before cleaning",
      }),
    ).toThrow(EventInvalid);
  });
});

describe("REQ-2222: every model call points to its llm_log row", () => {
  it("refuses llm_call without llmLogId", () => {
    expect(() => append("llm_call", { role: "master" })).toThrow("llmLogId");
  });
});

describe("REQ-2220: parent actions outside a session keep the device and both times", () => {
  for (const type of [
    "item_flagged",
    "item_excluded",
    "parent_tag_added",
    "parent_tag_removed",
    "settings_changed",
  ]) {
    it(type, () => {
      const [appended] = appendEvents(db, [
        {
          type,
          v: 1,
          payload: valid[type],
          origin: { deviceId: "parent-mac", clientMs: 1000 },
        },
      ]);
      const row = db
        .prepare(
          "SELECT device_id, ts, client_ms, session_id, adventure_id FROM events WHERE seq = ?",
        )
        .get(appended?.seq);
      expect(row).toMatchObject({
        device_id: "parent-mac",
        client_ms: 1000,
        session_id: null,
        adventure_id: null,
      });
      expect((row as { ts: string }).ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  }
});

describe("ADR-0020: every registered type is in the event catalogue", () => {
  it("names only catalogue types", () => {
    const outside = EVENT_DEFS.map((d) => d.type).filter(
      (t) => !EVENT_CATALOGUE.includes(t),
    );
    expect(outside).toEqual([]);
  });
});
