// The play API's packets (SPC-0030). Every body is parsed with its strict
// schema before it leaves the server, so an unlisted field can't leak.
import { z } from "zod";

// Every request that changes state carries clientSeq, the device's own counter:
// a repeat with the same value appends nothing and gets the first reply.
const clientSeq = z.number().int().nonnegative();

export const SessionStartIn = z
  .object({
    mode: z.enum(["zero", "daily"]),
    /** The device's IANA time zone, which the game day follows (SPC-0090). */
    zone: z.string().min(1).max(64).optional(),
    clientSeq,
  })
  .strict();
export const SessionStartOut = z
  .object({
    sessionId: z.string(),
    /** The adventure the session continues, or null for Session 0. */
    adventureId: z.string().nullable(),
    /** True when the adventure has reached its limit of adventure days (REQ-0228). */
    wrapUp: z.boolean(),
  })
  .strict();

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

/** One line of a scene: who speaks it and what is said. */
const SceneLine = z.object({ speaker: z.string(), text: z.string() }).strict();

/**
 * A scene as it passed the safety checks, with the draft she last typed in it
 * (REQ-0216). The stand-in scene's lines and branches are fixed.
 */
export const Scene = z
  .object({
    kind: z.literal("scene"),
    sceneId: z.string(),
    lines: z.array(SceneLine).min(1),
    branches: z.array(
      z.object({ choiceId: z.string(), text: z.string() }).strict(),
    ),
    draft: z.string().nullable(),
  })
  .strict();
export type Scene = z.infer<typeof Scene>;

/** A chest of three options, the same three each time it is shown (REQ-0218). */
export const Chest = z
  .object({
    kind: z.literal("chest"),
    chestId: z.string(),
    options: z
      .array(
        z
          .object({
            kind: z.string(),
            rewardId: z.string(),
            quality: z.string(),
          })
          .strict(),
      )
      .length(3),
  })
  .strict();
export type Chest = z.infer<typeof Chest>;

/** A grant the client shows and then acknowledges. */
export const Grant = z
  .object({
    rewardId: z.string(),
    kind: z.string(),
    amount: z.number().int().positive(),
  })
  .strict();
export type Grant = z.infer<typeof Grant>;

/**
 * The day's play is over for now. `canExtend` is false once the parent has
 * finished the day, and then the client offers no extra row (REQ-2444).
 */
export const StopOffer = z
  .object({ kind: z.literal("stop_offer"), canExtend: z.boolean() })
  .strict();
export type StopOffer = z.infer<typeof StopOffer>;

/** The adventure has reached its finale; a new session plans the next one. */
export const End = z.object({ kind: z.literal("end") }).strict();

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
    clientSeq,
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

/**
 * What she does in a scene: picks an option, sends her free text, or lets the
 * client save a draft of it. The text a model would clean first is ADR-0110's
 * to clean; the stand-in trims it.
 */
export const SceneInputIn = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("choice"),
      sceneId: z.string().min(1),
      choiceId: z.string().min(1),
      clientSeq,
    })
    .strict(),
  z
    .object({
      kind: z.literal("text"),
      sceneId: z.string().min(1),
      text: z.string().trim().min(1).max(500),
      clientSeq,
    })
    .strict(),
  z
    .object({
      kind: z.literal("draft"),
      sceneId: z.string().min(1),
      text: z.string().max(500),
      clientSeq,
    })
    .strict(),
]);
export const SceneInputOut = z
  .object({ status: z.enum(["saved", "done"]), grants: z.array(Grant) })
  .strict();

/** Her pick of one of the chest's three options. */
export const ChestIn = z
  .object({
    chestId: z.string().min(1),
    rewardId: z.string().min(1),
    clientSeq,
  })
  .strict();
export const ChestOut = z.object({ grants: z.array(Grant) }).strict();

/** The client's acknowledgement that it showed these grants. */
export const RewardsDeliveredIn = z
  .object({ rewardIds: z.array(z.string().min(1)).min(1), clientSeq })
  .strict();
export const RewardsDeliveredOut = z
  .object({ status: z.literal("ok") })
  .strict();

/** A hint request names the rung it buys, so a repeat can't buy the next one. */
export const HintIn = z
  .object({ level: z.number().int().min(1).max(3), clientSeq })
  .strict();
export const HintOut = z
  .object({
    level: z.number().int().min(1).max(3),
    text: z.string().min(1),
    threads: z.number().int().nonnegative(),
  })
  .strict();

/** «Ещё один ряд»: the reply once the extension is logged. */
export const ExtendOut = z.object({ status: z.literal("extended") }).strict();

/** The body of the explain and second-attempt requests. */
export const ItemActionIn = z.object({ clientSeq }).strict();

export const ExplainOut = z
  .object({
    status: z.literal("pending"),
    threads: z.number().int().nonnegative(),
  })
  .strict();

// The stream's messages (SPC-0030), each carrying the seq of the event it
// reports. This part sends explanation_ready; later parts add the others.
export const ExplanationReady = z
  .object({
    type: z.literal("explanation_ready"),
    seq: z.number().int().positive(),
    itemId: z.string(),
    source: z.enum(["model", "template"]),
    text: z.string().min(1),
  })
  .strict();
/** The lease moved to another device; the one it left turns view-only (REQ-0222). */
export const LeaseMoved = z
  .object({ type: z.literal("lease_moved"), seq: z.number().int().positive() })
  .strict();
export const StreamMessage = z.discriminatedUnion("type", [
  ExplanationReady,
  LeaseMoved,
]);
export type StreamMessage = z.infer<typeof StreamMessage>;

export const PollOut = z.object({ messages: z.array(StreamMessage) }).strict();

/** «Сохранить и уйти», the page hidden, or no input for too long (SPC-0030). */
export const HeartbeatIn = z.object({ clientSeq }).strict();
export const HeartbeatOut = z.object({ status: z.literal("ok") }).strict();

export const PauseIn = z
  .object({ reason: z.enum(["leave", "background", "idle"]), clientSeq })
  .strict();
export const PauseOut = z.object({ status: z.literal("paused") }).strict();

/** The rest-stop button starts a rest stop, and its end resumes play. */
export const BreakIn = z
  .object({ action: z.enum(["start", "end"]), clientSeq })
  .strict();
export const BreakOut = z
  .object({ status: z.enum(["resting", "playing"]) })
  .strict();

/** Opens a session on the open adventure; the reply says where play stopped (REQ-0204). */
export const ResumeIn = z
  .object({ zone: z.string().min(1).max(64).optional(), clientSeq })
  .strict();
export const ResumeOut = z
  .object({
    sessionId: z.string(),
    adventureId: z.string(),
    floor: z.number().int().positive(),
    room: z.number().int().positive(),
    slot: z.number().int().nonnegative(),
    /** The task left open, or null between two tasks. */
    itemId: z.string().nullable(),
    view: View.nullable(),
    attemptNo: z.union([z.literal(1), z.literal(2)]).nullable(),
    hintLevels: z.array(z.number().int()),
    /** The tasks of the open room whose explanation she bought. */
    explainedItemIds: z.array(z.string()),
    /** The scene left open with her last draft, or null (REQ-0216). */
    scene: Scene.nullable(),
    /** The chest left open with its three options, or null (REQ-0218). */
    chest: Chest.nullable(),
    /** The grants the client has not yet shown. */
    rewards: z.array(Grant),
    /** True when the adventure has reached its limit of adventure days (REQ-0228). */
    wrapUp: z.boolean(),
  })
  .strict();
export type ResumeOut = z.infer<typeof ResumeOut>;

export const AdventureCurrentOut = z
  .object({
    adventure: z
      .object({
        adventureId: z.string(),
        state: z.enum(["planned", "active", "paused"]),
        floor: z.number().int().positive(),
        room: z.number().int().positive(),
        slot: z.number().int().nonnegative(),
      })
      .strict()
      .nullable(),
  })
  .strict();
