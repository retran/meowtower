// A turn of the Master (ADR-3270, REQ-8168): she says what she does, the Master answers in story
// text and tool calls, and code decides what stands. The scenario and the guardrails go in the system
// prompt, which is the same for every turn so that it caches (REQ-8234, REQ-8252). A reply passes the
// forbidden-word list with no model call and is replaced by story text when it fails (REQ-8194,
// REQ-8220), and a tool call outside its contract never applies (REQ-8182, REQ-8256).
import { appendEvents, type NewEvent } from "../engine/events/append.js";
import type { Db } from "../server/db/index.js";
import { type GateLang, textGate } from "../shared/voice/gate.js";
import {
  MASTER_TOOL_NAMES,
  parseToolCall,
  type ToolCall,
} from "./master-tools.js";

/** What goes to the model: the stable prefix, and her words for this turn. */
export interface MasterRequest {
  readonly system: string;
  readonly said: string;
  readonly encounter: string;
}

/** What comes back: plain story text and the tool calls the model made, unchecked. */
export interface MasterReply {
  readonly text: string;
  readonly calls: readonly { tool: string; input: unknown }[];
}

export type MasterModel = (request: MasterRequest) => Promise<MasterReply>;

export interface TurnInput {
  readonly model: MasterModel;
  /** The prepared scenario as the Master reads it, in the system prompt. */
  readonly scenario: string;
  readonly encounter: string;
  readonly said: string;
  readonly lang: GateLang;
  /** The story text a blocked reply becomes, in the player's language. */
  readonly blockedText: string;
}

export interface Turn {
  /** The reply as shown, or `blockedText` where the reply failed the list. */
  readonly reply: string;
  readonly blocked: boolean;
  /** The calls that fit their contract; none where the reply was blocked. */
  readonly calls: readonly ToolCall[];
  readonly refused: readonly { tool: string; fault: string }[];
  /** The events this turn writes, for `recordTurn`. */
  readonly events: readonly Omit<NewEvent, "origin">[];
}

/**
 * The Master's system prompt. It holds the scenario, the guardrails and the tools, and nothing of
 * the turn, so every turn of an adventure sends the same prefix.
 */
export function masterSystemPrompt(scenario: string): string {
  return [
    "You are the Master of a tabletop adventure for one child. Describe the scene, answer what she does at once, and keep to the prepared scenario and its setting; you may adapt encounters and their links to what she does.",
    "Reply in plain story text. Signals and every technical act go through tool calls and never in the story.",
    "Guardrails: write nothing from the forbidden-content checklist, no word from the forbidden-word list, nothing that shames her for a mistake, and nothing that breaks the canon's rules or its truths. The canon fixes the world, its people and the Tower's secret.",
    "You never decide whether a check succeeds. Ask for one with request_check and tell what happened from its answer: success, cost or twist. Whatever you add to the world goes through change_world.",
    `Tools: ${MASTER_TOOL_NAMES.join(", ")}.`,
    `Scenario: ${scenario}`,
  ].join("\n\n");
}

/** Takes one turn: asks the model, checks the reply and the calls, and lists the events to write. */
export async function takeTurn(input: TurnInput): Promise<Turn> {
  const asked = await input.model({
    system: masterSystemPrompt(input.scenario),
    said: input.said,
    encounter: input.encounter,
  });
  const gate = textGate(asked.text, {
    lang: input.lang,
    kind: "story",
    source: "master",
  });
  const blocked = !gate.ok;
  const reply = blocked ? input.blockedText : asked.text;
  const calls: ToolCall[] = [];
  const refused: { tool: string; fault: string }[] = [];
  if (!blocked)
    for (const c of asked.calls) {
      const parsed = parseToolCall(c.tool, c.input);
      if (parsed.ok) calls.push(parsed.call);
      else refused.push({ tool: parsed.tool, fault: parsed.fault });
    }
  const events: Omit<NewEvent, "origin">[] = [
    {
      type: "turn_taken",
      v: 1,
      payload: { encounter: input.encounter, said: input.said, reply },
    },
    ...calls.flatMap((c) =>
      c.tool === "change_world"
        ? [{ type: "world_changed", v: 1, payload: { ...c.input } }]
        : [],
    ),
  ];
  return { reply, blocked, calls, refused, events };
}

/** Appends a turn's events to the log, in order, as the server's own. */
export async function recordTurn(db: Db, turn: Turn): Promise<void> {
  await appendEvents(
    db,
    turn.events.map((e) => ({ ...e, origin: "server" as const })),
  );
}
