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

export const EVENT_DEFS: readonly EventDef[] = [
  { type: "item_shown", v: 1, schema: itemShownV1 },
  { type: "attempt_submitted", v: 0, schema: attemptSubmittedV0 },
  { type: "attempt_submitted", v: 1, schema: attemptSubmittedV1 },
  { type: "verdict", v: 1, schema: verdictV1 },
  { type: "hint_shown", v: 1, schema: hintShownV1 },
  { type: "thread_spent", v: 1, schema: threadSpentV1 },
  { type: "solution_shown", v: 1, schema: solutionShownV1 },
  { type: "explanation_shown", v: 1, schema: explanationShownV1 },
  { type: "glossary_opened", v: 1, schema: glossaryOpenedV1 },
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
