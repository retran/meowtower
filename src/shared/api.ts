// The play API's packets (SPC-0030). Every body is parsed with its strict
// schema before it leaves the server, so an unlisted field can't leak.
import { z } from "zod";

export const SessionStartIn = z
  .object({ mode: z.enum(["zero", "daily"]) })
  .strict();
export const SessionStartOut = z.object({ sessionId: z.string() }).strict();

const View = z
  .object({
    locale: z.enum(["ru"]),
    text: z.string(),
    svg: z.string().nullable(),
    options: z.array(z.string()).nullable(),
    terms: z.array(z.string()),
  })
  .strict();

export const InputSpec = z.object({ kind: z.enum(["integer"]) }).strict();

export const Room = z
  .object({
    kind: z.literal("room"),
    itemId: z.string(),
    view: View,
    input: InputSpec,
    slot: z.number().int().nonnegative(),
    roomLength: z.number().int().positive(),
    attemptNo: z.union([z.literal(1), z.literal(2)]),
    threads: z.number().int().nonnegative(),
    hintLevels: z.array(z.number().int()),
  })
  .strict();
export type Room = z.infer<typeof Room>;

export const AnswerIn = z
  .object({
    itemId: z.string().min(1),
    raw: z.string(),
    parsed: z.unknown().optional(),
    dontKnow: z.boolean(),
    input: z
      .object({
        firstKeyMs: z.number().int().nonnegative(),
        submittedMs: z.number().int().nonnegative(),
        edits: z.number().int().nonnegative(),
        erasures: z.number().int().nonnegative(),
        keyPresses: z.number().int().nonnegative(),
        focusLosses: z
          .object({
            count: z.number().int().nonnegative(),
            totalMs: z.number().int().nonnegative(),
          })
          .strict(),
        method: z.enum(["keypad", "keyboard", "choice", "voice"]),
      })
      .strict(),
    clientSeq: z.number().int().nonnegative(),
  })
  .strict();
export type AnswerIn = z.infer<typeof AnswerIn>;

// No verdict field: the game outcome stands in for it (REQ-2414).
export const AnswerOut = z
  .object({
    outcome: z.enum(["clean", "partial", "alt"]).optional(),
    streak: z.number().int().nonnegative(),
    grants: z.array(
      z.object({ kind: z.string(), amount: z.number().int() }).strict(),
    ),
    threads: z.number().int().nonnegative(),
    feedback: z.object({ correctAnswer: z.string() }).strict(),
    shortSolution: z.array(z.string()).min(1),
    battleLine: z.string().min(1),
  })
  .strict();
export type AnswerOut = z.infer<typeof AnswerOut>;
