// The Master's model through the gateway (ADR-3270, ADR-3100, REQ-8236): one call of the MASTER_MODEL
// role for each turn. The gateway carries text only, so the model's tool calls come back inside a
// structured reply, `{ text, calls }`, which the gateway's schema asks for. The turn checks each call
// against its contract, so a reply that names a tool the Master does not have is refused there.
import { z } from "zod";
import type { Gateway } from "../server/gateway/gateway.js";
import { MASTER_TOOL_NAMES, MASTER_TOOLS } from "./master-tools.js";
import type { MasterModel } from "./turn.js";

const Reply = z
  .object({
    text: z.string().trim().min(1),
    calls: z
      .array(z.object({ tool: z.string(), input: z.unknown() }))
      .default([]),
    starters: z.array(z.string().trim().min(1).max(80)).max(3).default([]),
  })
  .strict();

/**
 * The schema the model is asked to follow (BUG-0020): each call names one of the Master's tools and holds
 * that tool's input. The provider refuses a schema that accepts any value, so `input` cannot be left open.
 * What comes back is still read by `Reply` and checked by `parseToolCall`, so a reply that names a tool
 * the Master does not have reaches the turn and is refused there.
 */
const SentCall = z.union(
  MASTER_TOOL_NAMES.map((name) =>
    z
      .object({ tool: z.enum([name] as [string]), input: MASTER_TOOLS[name] })
      .strict(),
  ) as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]],
);
export const MASTER_REPLY_SCHEMA = z.toJSONSchema(
  z
    .object({
      text: z.string(),
      calls: z.array(SentCall),
      starters: z.array(z.string()),
    })
    .strict(),
);

export class MasterFailed extends Error {
  constructor(
    readonly reason: "budget_exhausted" | "provider_failed" | "reply_invalid",
  ) {
    super(`master_failed: ${reason}`);
    this.name = "MasterFailed";
  }
}

/**
 * The gateway as a `MasterModel`. The system prompt is the same each turn, so the provider can
 * cache it; her words and the encounter are the turn's own message.
 */
export function gatewayMaster(gateway: Gateway, bucket: string): MasterModel {
  return async ({ system, said, encounter, checkResult }) => {
    const reply = await gateway.call({
      role: "MASTER_MODEL",
      bucket,
      system,
      user:
        `Encounter: ${encounter}\nShe says: ${said}` +
        (checkResult
          ? `\nCheck result: ${checkResult}. This is settled and you cannot change it; tell what happens.`
          : ""),
      schema: MASTER_REPLY_SCHEMA,
    });
    if (!reply.ok) throw new MasterFailed(reply.reason);
    try {
      return Reply.parse(JSON.parse(reply.text));
    } catch {
      throw new MasterFailed("reply_invalid");
    }
  };
}
