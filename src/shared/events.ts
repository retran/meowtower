// The event schemas (ADR-0020): one zod schema per event type and payload
// version, the upcasters between versions, and the field dictionary.
import { z } from "zod";

export interface EventDef {
  type: string;
  v: number;
  schema: z.ZodType;
  /** Lifts a payload of version v - 1 to this version. */
  upcastFrom?: (payload: unknown) => unknown;
}

/** A payload failed its schema; the message names each field. */
export class EventInvalid extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EventInvalid";
  }
}

export interface Registry {
  has(type: string, v: number): boolean;
  validate(type: string, v: number, payload: unknown): void;
  upcast(
    type: string,
    v: number,
    payload: unknown,
  ): { v: number; payload: unknown };
  defs(): readonly EventDef[];
}

export function createRegistry(defs: readonly EventDef[]): Registry {
  const byType = new Map<string, Map<number, EventDef>>();
  for (const d of defs) {
    const versions = byType.get(d.type) ?? new Map<number, EventDef>();
    versions.set(d.v, d);
    byType.set(d.type, versions);
  }
  const get = (type: string, v: number): EventDef | undefined =>
    byType.get(type)?.get(v);
  return {
    has: (type, v) => get(type, v) !== undefined,
    validate(type, v, payload) {
      const def = get(type, v);
      if (!def) throw new EventInvalid(`event_schema_unknown: ${type} v${v}`);
      const result = def.schema.safeParse(payload);
      if (!result.success) {
        const fields = result.error.issues
          .map((i) => `${i.path.join(".") || "(payload)"}: ${i.message}`)
          .join("; ");
        throw new EventInvalid(`event_invalid: ${type} v${v}: ${fields}`);
      }
    },
    upcast(type, v, payload) {
      let current = { v, payload };
      for (;;) {
        const next = get(type, current.v + 1);
        if (!next?.upcastFrom) return current;
        current = { v: next.v, payload: next.upcastFrom(current.payload) };
      }
    },
    defs: () => defs,
  };
}

// Shared parts of the task and attempt events.
const itemId = z
  .string()
  .min(1)
  .describe("the opaque identifier of the task shown");
const attemptNo = z
  .union([z.literal(1), z.literal(2)])
  .describe("1 for the first attempt, 2 for the second");

const itemShownV1 = z
  .object({
    itemId,
    view: z
      .object({
        locale: z
          .enum(["ru"])
          .describe("the language the view was rendered in"),
        text: z.string().describe("the task's text as rendered"),
        svg: z
          .string()
          .nullable()
          .describe("the task's picture as rendered, or null"),
        options: z
          .array(z.string())
          .nullable()
          .describe("the answer options shown, or null for free input"),
        terms: z
          .array(z.string())
          .describe("the term hints marked in the text"),
      })
      .strict()
      .describe("the full rendered view the player saw"),
    templateId: z
      .string()
      .min(1)
      .describe("the template that generated the task"),
    templateVersion: z
      .number()
      .int()
      .positive()
      .describe("the template's version"),
    seed: z.string().min(1).describe("the seed the task was generated from"),
    params: z
      .record(z.string(), z.unknown())
      .describe("the task's language-free parameters"),
    node: z.string().min(1).describe("the skill-graph node"),
    subtype: z.string().min(1).describe("the node's subtype"),
    purpose: z.string().min(1).describe("why the Director chose the task"),
    attemptNo,
    parentItemId: z
      .string()
      .min(1)
      .optional()
      .describe("for a second attempt, the itemId of the first"),
    correctAnswer: z
      .string()
      .min(1)
      .describe("the correct answer as it would be shown"),
    shortSolution: z
      .array(z.string())
      .min(1)
      .describe("the short solution's steps as they would be shown"),
  })
  .strict()
  .superRefine((p, ctx) => {
    if (p.attemptNo === 2 && p.parentItemId === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["parentItemId"],
        message: "required for a second attempt",
      });
    }
  });

const attemptSubmittedV0 = z
  .object({ raw: z.string().describe("stage 0: the answer as entered") })
  .strict();

const attemptSubmittedV1 = z
  .object({
    itemId,
    attemptNo,
    input: z
      .object({
        firstKeyMs: z
          .number()
          .int()
          .nonnegative()
          .describe("time from showing the task to the first key press"),
        submittedMs: z
          .number()
          .int()
          .nonnegative()
          .describe("time from showing the task to submission"),
        edits: z
          .number()
          .int()
          .nonnegative()
          .describe("edits made to the answer"),
        erasures: z
          .number()
          .int()
          .nonnegative()
          .describe("erasures made to the answer"),
        keyPresses: z
          .number()
          .int()
          .nonnegative()
          .describe("key presses on the answer"),
        focusLosses: z
          .object({
            count: z
              .number()
              .int()
              .nonnegative()
              .describe("times the task lost focus"),
            totalMs: z
              .number()
              .int()
              .nonnegative()
              .describe("total time the task was out of focus"),
          })
          .strict()
          .describe("focus losses and their duration"),
        method: z
          .enum(["keypad", "keyboard", "choice", "voice"])
          .describe("how the answer was entered"),
      })
      .strict()
      .describe("the input summary of the attempt"),
    answer: z
      .object({
        entered: z.string().describe("the answer as entered"),
        parsed: z
          .unknown()
          .describe("the answer as parsed, or null when it couldn't be parsed"),
      })
      .strict()
      .describe("the answer"),
    assisted: z.boolean().describe("whether help came before the answer"),
    hintLevel: z
      .number()
      .int()
      .min(0)
      .max(3)
      .describe("the highest hint rung shown before the answer"),
  })
  .strict();

// Version 2 adds the two flags that keep an attempt's time out of every
// measure (REQ-0212, REQ-0224); an earlier attempt had neither.
const attemptSubmittedV2 = attemptSubmittedV1
  .extend({
    interrupted: z
      .boolean()
      .describe("whether a pause lay between showing the task and the answer"),
    crossDevice: z
      .boolean()
      .describe("whether the answer came from another kind of device"),
  })
  .strict();

const verdictV1 = z
  .object({
    itemId,
    attemptNo,
    verdict: z
      .enum(["correct", "partial", "wrong", "dont_know", "unparsed"])
      .describe("the checker's verdict"),
    outcome: z.enum(["clean", "partial", "alt"]).describe("the game outcome"),
    trapId: z
      .string()
      .nullable()
      .describe("the misconception the answer matched, or null"),
    errorClass: z.string().nullable().describe("the class of error, or null"),
    steps: z
      .array(
        z
          .object({
            step: z.string().describe("the step of the solution graph"),
            matched: z
              .boolean()
              .describe("whether the answer's work matched the step"),
          })
          .strict(),
      )
      .describe("the step matching of the attempt"),
  })
  .strict();

const hintShownV1 = z
  .object({
    itemId,
    attemptNo,
    level: z.number().int().min(1).max(3).describe("the hint rung shown"),
  })
  .strict();

const threadSpentV1 = z
  .object({
    itemId: z
      .string()
      .min(1)
      .nullable()
      .describe("the task the thread was spent on, or null outside a task"),
    reason: z
      .enum(["hint", "explanation"])
      .describe("what the guiding thread paid for"),
    count: z.number().int().positive().describe("guiding threads spent"),
  })
  .strict();

const explanationBoughtV1 = z.object({ itemId, attemptNo }).strict();

const solutionShownV1 = z
  .object({
    itemId,
    attemptNo,
    dwellMs: z
      .number()
      .int()
      .nonnegative()
      .describe("how long the short solution was shown"),
  })
  .strict();

// Never the explanation's text: the strict schema refuses any field for it.
const explanationShownV1 = z
  .object({
    itemId,
    attemptNo,
    dwellMs: z
      .number()
      .int()
      .nonnegative()
      .describe("how long the detailed explanation was shown"),
    source: z
      .enum(["model", "cache", "template"])
      .describe("where the explanation came from"),
  })
  .strict();

const glossaryOpenedV1 = z
  .object({
    itemId,
    term: z.string().min(1).describe("the term whose hint was opened"),
  })
  .strict();

// Story, economy, break, parent, safety and model-call events (TSK-0220). Each
// owning epic adds its own fields through a new version.
const id = (what: string) => z.string().min(1).describe(what);
const count = (what: string) => z.number().int().nonnegative().describe(what);
const ms = (what: string) => z.number().int().nonnegative().describe(what);
const obj = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

const storyDefs: EventDef[] = [
  {
    type: "scene_shown",
    v: 1,
    schema: obj({
      sceneId: id("the scene shown"),
      lines: z
        .array(
          obj({
            speaker: id("who speaks the line"),
            text: z.string().describe("the line as shown"),
          }),
        )
        .min(1)
        .describe("the scene's lines as shown"),
    }),
  },
  {
    type: "choice_made",
    v: 1,
    schema: obj({
      sceneId: id("the scene"),
      choiceId: id("the option chosen"),
    }),
  },
  // Only the cleaned form: the strict schema has no field for the text before cleaning.
  {
    type: "free_text",
    v: 1,
    schema: obj({
      sceneId: id("the scene"),
      cleaned: z.string().describe("her free text after cleaning"),
    }),
  },
  {
    type: "name_given",
    v: 1,
    schema: obj({
      target: z
        .enum(["heroine", "familiar", "floor", "tangle", "room", "item"])
        .describe("what she named"),
      targetId: id("the thing named"),
      name: z.string().min(1).describe("the name she gave"),
    }),
  },
];

const economyDefs: EventDef[] = [
  {
    type: "reward_granted",
    v: 1,
    schema: obj({
      source: id("what the reward came from"),
      kind: id("the kind of reward"),
      rewardId: id("the reward"),
      amount: count("how much was granted"),
    }),
  },
  {
    type: "chest_offered",
    v: 1,
    schema: obj({
      chestId: id("the chest"),
      options: z
        .array(
          obj({
            kind: id("the reward's kind"),
            rewardId: id("the reward"),
            quality: id("the reward's quality"),
          }),
        )
        .length(3)
        .describe("the three rewards offered"),
    }),
  },
  {
    type: "chest_chosen",
    v: 1,
    schema: obj({
      chestId: id("the chest"),
      rewardId: id("the reward chosen"),
    }),
  },
  {
    type: "forge_crafted",
    v: 1,
    schema: obj({ recipeId: id("the recipe"), craftedId: id("the item made") }),
  },
  {
    type: "shop_purchase",
    v: 1,
    schema: obj({
      shopItemId: id("the item bought"),
      price: count("its price in buttons"),
    }),
  },
  {
    type: "level_up",
    v: 1,
    schema: obj({
      level: z.number().int().positive().describe("the new level"),
    }),
  },
  {
    type: "quest_progress",
    v: 1,
    schema: obj({
      questId: id("the quest"),
      progress: count("progress made"),
      target: count("progress needed"),
    }),
  },
  {
    type: "familiar_friendship",
    v: 1,
    schema: obj({
      familiarId: id("the familiar"),
      points: count("friendship points"),
      level: count("friendship level"),
    }),
  },
  {
    type: "familiar_hatched",
    v: 1,
    schema: obj({ familiarId: id("the familiar that hatched") }),
  },
  {
    type: "familiar_evolved",
    v: 1,
    schema: obj({
      familiarId: id("the familiar"),
      stage: z.number().int().positive().describe("the new stage"),
    }),
  },
  {
    type: "thread_granted",
    v: 1,
    schema: obj({
      source: id("what granted the threads"),
      count: count("threads granted"),
    }),
  },
];

const breakDefs: EventDef[] = [
  {
    type: "adventure_paused",
    v: 1,
    schema: obj({
      reason: z
        .enum(["background", "idle", "leave", "lease_expired"])
        .describe("why play paused"),
    }),
  },
  {
    type: "adventure_resumed",
    v: 1,
    schema: obj({ pausedMs: ms("how long the pause lasted") }),
  },
  {
    type: "device_lease_taken",
    v: 1,
    schema: obj({
      previousDeviceId: z
        .string()
        .nullable()
        .describe("the device that held the lease, or null"),
    }),
  },
  {
    type: "eye_exercise",
    v: 1,
    schema: obj({
      exerciseId: id("the exercise shown"),
      completed: z.boolean().describe("whether it was completed"),
    }),
  },
  {
    type: "rest_stop_offered",
    v: 1,
    schema: obj({ trigger: id("what offered the rest stop") }),
  },
  {
    type: "rest_stop_started",
    v: 1,
    schema: obj({ trigger: id("what started the rest stop") }),
  },
  {
    type: "rest_stop_ended",
    v: 1,
    schema: obj({ durationMs: ms("how long the rest stop lasted") }),
  },
  {
    type: "soft_stop",
    v: 1,
    schema: obj({
      activeMs: ms("the day's active time when the soft stop played"),
    }),
  },
  {
    type: "extension",
    v: 1,
    schema: obj({
      minutes: z.number().int().positive().describe("minutes added"),
    }),
  },
  // The parent ended the day's play from the Parent Room (REQ-2444); the
  // envelope's time says which game day it closes.
  { type: "finish_today", v: 1, schema: obj({}) },
];

const tag = obj({
  node: id("the skill-graph node"),
  subtype: z
    .string()
    .nullable()
    .describe("the subtype, or null for the whole node"),
});
const parentDefs: EventDef[] = [
  { type: "parent_tag_added", v: 1, schema: tag },
  { type: "parent_tag_removed", v: 1, schema: tag },
  {
    type: "item_flagged",
    v: 1,
    schema: obj({
      itemId: id("the task flagged"),
      note: z.string().nullable().describe("the parent's note, or null"),
    }),
  },
  {
    type: "item_excluded",
    v: 1,
    schema: obj({
      itemId: id("the task excluded"),
      reason: id("why it was excluded"),
    }),
  },
  {
    type: "settings_changed",
    v: 1,
    schema: obj({
      key: id("the setting changed"),
      value: z.unknown().describe("its new value"),
    }),
  },
];

const scratchDefs: EventDef[] = [
  {
    type: "scratch_snapshot",
    v: 1,
    schema: obj({
      itemId: id("the task the draft belongs to"),
      attemptNo: z
        .union([z.literal(1), z.literal(2)])
        .describe("the attempt the draft was submitted with"),
      sha256: z
        .string()
        .regex(/^[0-9a-f]{64}$/)
        .describe("the SHA-256 hash of the stored image, also its file name"),
    }),
  },
];

const sessionDefs: EventDef[] = [
  {
    type: "session_started",
    v: 1,
    schema: obj({
      sessionId: id("the session"),
      mode: z.enum(["zero", "daily"]).describe("Session 0 or a daily session"),
    }),
  },
  {
    type: "session_started",
    v: 2,
    schema: obj({
      sessionId: id("the session"),
      mode: z.enum(["zero", "daily"]).describe("Session 0 or a daily session"),
      zone: z
        .string()
        .nullable()
        .describe(
          "the IANA time zone of the device, or null where it sent none",
        ),
    }),
    upcastFrom: (payload) => ({ ...(payload as object), zone: null }),
  },
  {
    type: "attempt_late",
    v: 1,
    schema: obj({
      itemId: id("the item answered"),
      raw: z
        .string()
        .describe("the answer as entered, from a device that lost the lease"),
    }),
  },
  // What the resume point holds besides the task (SPC-0030): the scene as it
  // passed the safety checks, her free-text draft, and the grants the client
  // showed.
  {
    type: "scene_prepared",
    v: 1,
    schema: obj({
      sceneId: id("the scene prepared"),
      lines: z
        .array(
          obj({
            speaker: id("who speaks the line"),
            text: z.string().describe("the line as it passed the checks"),
          }),
        )
        .min(1)
        .describe("the scene's lines"),
      branches: z
        .array(
          obj({
            choiceId: id("the option"),
            text: z.string().describe("the option as it passed the checks"),
          }),
        )
        .describe("the options the scene offers"),
    }),
  },
  {
    type: "text_draft_saved",
    v: 1,
    schema: obj({
      sceneId: id("the scene the draft belongs to"),
      text: z.string().describe("her free-text draft as she held it"),
    }),
  },
  {
    type: "rewards_delivered",
    v: 1,
    schema: obj({
      rewardIds: z
        .array(id("a reward"))
        .min(1)
        .describe("the grants the client showed"),
    }),
  },
  {
    type: "session_ended",
    v: 1,
    schema: obj({
      sessionId: id("the session"),
      reason: z
        .enum(["leave", "background", "idle", "lease_expired"])
        .describe("why the session ended"),
    }),
  },
  // The adventure's lifecycle (SPC-0030). The adventure is the event's
  // envelope adventure_id and its payload's adventureId both.
  {
    type: "adventure_planned",
    v: 1,
    schema: obj({ adventureId: id("the adventure planned") }),
  },
  {
    type: "adventure_started",
    v: 1,
    schema: obj({ adventureId: id("the adventure that became active") }),
  },
  {
    type: "adventure_completed",
    v: 1,
    schema: obj({ adventureId: id("the adventure that reached its finale") }),
  },
  {
    type: "adventure_wrapped_up",
    v: 1,
    schema: obj({
      adventureId: id("the adventure the three-day rule closed"),
      unopenedSecrets: z
        .array(id("a secret"))
        .describe("the secrets she didn't open"),
    }),
  },
];

const safetyDefs: EventDef[] = [
  {
    type: "safety_event",
    v: 1,
    schema: obj({
      level: z
        .enum(["none", "everyday", "serious"])
        .describe("the signal's level"),
      source: id("what raised the signal"),
      sceneId: z.string().nullable().describe("the scene, or null"),
    }),
  },
  {
    type: "llm_call",
    v: 1,
    schema: obj({
      llmLogId: id("the llm_log row of the call"),
      role: id("the model role called"),
    }),
  },
];

export const EVENT_DEFS: readonly EventDef[] = [
  { type: "item_shown", v: 1, schema: itemShownV1 },
  { type: "attempt_submitted", v: 0, schema: attemptSubmittedV0 },
  { type: "attempt_submitted", v: 1, schema: attemptSubmittedV1 },
  {
    type: "attempt_submitted",
    v: 2,
    schema: attemptSubmittedV2,
    upcastFrom: (payload) => ({
      ...(payload as object),
      interrupted: false,
      crossDevice: false,
    }),
  },
  { type: "verdict", v: 1, schema: verdictV1 },
  { type: "hint_shown", v: 1, schema: hintShownV1 },
  { type: "thread_spent", v: 1, schema: threadSpentV1 },
  { type: "explanation_bought", v: 1, schema: explanationBoughtV1 },
  { type: "solution_shown", v: 1, schema: solutionShownV1 },
  { type: "explanation_shown", v: 1, schema: explanationShownV1 },
  { type: "glossary_opened", v: 1, schema: glossaryOpenedV1 },
  ...storyDefs,
  ...economyDefs,
  ...breakDefs,
  ...parentDefs,
  ...safetyDefs,
  ...sessionDefs,
  ...scratchDefs,
];

/** ADR-0020's Event catalogue: the only type names the registry may hold. */
export const EVENT_CATALOGUE: readonly string[] = [
  "adventure_planned",
  "adventure_started",
  "adventure_paused",
  "adventure_resumed",
  "adventure_completed",
  "adventure_wrapped_up",
  "session_started",
  "session_ended",
  "device_lease_taken",
  "settings_changed",
  "scene_prepared",
  "text_draft_saved",
  "rewards_delivered",
  "attempt_late",
  "item_focus",
  "item_shown",
  "verdict",
  "scratch_snapshot",
  "item_flagged",
  "model_activated",
  "attempt_submitted",
  "hint_shown",
  "solution_shown",
  "explanation_bought",
  "twin_unavailable",
  "thread_granted",
  "thread_spent",
  "pocket_thread_given",
  "day_opened",
  "plan_built",
  "floor_entered",
  "room_opened",
  "eye_exercise",
  "rest_stop_offered",
  "rest_stop_started",
  "rest_stop_ended",
  "soft_stop",
  "extension",
  "save_accepted",
  "finish_today",
  "avoidance_signal",
  "anxiety_signal",
  "zone_changed",
  "clock_jump",
  "llm_call",
  "budget_month_spent",
  "master_pick_rejected",
  "scene_shown",
  "choice_made",
  "free_text",
  "name_given",
  "plan_written",
  "safety_event",
  "line_approved",
  "diary_cipher",
  "explanation_shown",
  "frame_accepted",
  "frame_removed",
  "live_frames_paused",
  "science_approved",
  "room_outcome",
  "floor_outcome",
  "combo",
  "reward_reopened",
  "reward_granted",
  "chest_offered",
  "chest_chosen",
  "level_up",
  "quest_progress",
  "forge_crafted",
  "shop_purchase",
  "familiar_friendship",
  "familiar_evolved",
  "familiar_hatched",
  "looks_set",
  "glossary_opened",
  "parent_tag_added",
  "parent_tag_removed",
  "item_excluded",
  "glossary_entry_approved",
  "calibration",
];

export const events = createRegistry(EVENT_DEFS);

export interface FieldRow {
  type: string;
  v: number;
  field: string;
  description: string;
}

type Json = {
  description?: string;
  properties?: Record<string, Json>;
  items?: Json;
};

/** One row per field of every schema: the source of the export's fields.csv. */
export function fieldDictionary(
  defs: readonly EventDef[] = EVENT_DEFS,
): FieldRow[] {
  const rows: FieldRow[] = [];
  const walk = (node: Json, path: string, def: EventDef): void => {
    for (const [key, child] of Object.entries(node.properties ?? {})) {
      const field = path ? `${path}.${key}` : key;
      rows.push({
        type: def.type,
        v: def.v,
        field,
        description: child.description ?? "",
      });
      walk(child, field, def);
      if (child.items) walk(child.items, `${field}[]`, def);
    }
  };
  for (const def of defs)
    walk(
      z.toJSONSchema(def.schema, { unrepresentable: "any" }) as Json,
      "",
      def,
    );
  return rows;
}
