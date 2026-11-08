// The Master's tools (ADR-3270, REQ-8182, REQ-8256): the only way it changes the world or asks
// the game for anything. Every input is strict, so a call that names a node, a level, a task or
// a check's outcome is refused, and a check answers with `success`, `cost` or `twist` alone.
import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);

export const SIGNALS = ["none", "everyday", "scared", "serious"] as const;
export const OUTCOMES = ["success", "cost", "twist"] as const;
export type Outcome = (typeof OUTCOMES)[number];

/** Each tool's input; `.strict()` rejects any field the contract does not name. */
export const MASTER_TOOLS = {
  request_check: z
    .object({
      tried: text(300).describe("what she tried"),
      hard: text(300).describe("why it is hard"),
    })
    .strict(),
  change_world: z
    .object({
      kind: z.enum(["person", "place", "item", "relation", "state"]),
      name: text(80),
      note: text(300),
    })
    .strict(),
  query_world: z.object({ subject: text(120) }).strict(),
  record_fact: z.object({ fact: text(300) }).strict(),
  record_event: z.object({ event: text(300) }).strict(),
  report_signal: z.object({ signal: z.enum(SIGNALS) }).strict(),
  at_encounter: z.object({ encounter: text(80) }).strict(),
  adapt_scenario: z.object({ encounter: text(80), change: text(400) }).strict(),
  end_scene: z.object({}).strict(),
} as const;

export type MasterToolName = keyof typeof MASTER_TOOLS;
export const MASTER_TOOL_NAMES = Object.keys(MASTER_TOOLS) as MasterToolName[];

export type ToolCall = {
  [K in MasterToolName]: { tool: K; input: z.infer<(typeof MASTER_TOOLS)[K]> };
}[MasterToolName];

export type ParsedCall =
  | { ok: true; call: ToolCall }
  | { ok: false; fault: "tool_unknown" | "tool_input_invalid"; tool: string };

/** Checks one call from the model: a known tool and an input that fits its contract. */
export function parseToolCall(tool: string, input: unknown): ParsedCall {
  if (!(MASTER_TOOL_NAMES as string[]).includes(tool))
    return { ok: false, fault: "tool_unknown", tool };
  const schema = MASTER_TOOLS[tool as MasterToolName];
  const parsed = schema.safeParse(input);
  return parsed.success
    ? { ok: true, call: { tool, input: parsed.data } as ToolCall }
    : { ok: false, fault: "tool_input_invalid", tool };
}

/** The reply a check gives the Master: the outcome and nothing of the model (REQ-8176). */
export const CheckReply = z.object({ outcome: z.enum(OUTCOMES) }).strict();
