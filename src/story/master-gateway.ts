// The Master's model through the gateway (ADR-3270, ADR-3100, REQ-8236): one call of the MASTER_MODEL
// role for each turn. The gateway carries text only, so the model's tool calls come back inside a
// structured reply, `{ text, calls }`, which the gateway's schema asks for. The turn checks each call
// against its contract, so a reply that names a tool the Master does not have is refused there.
import { z } from "zod";
import type { Gateway } from "../server/gateway/gateway.js";
import type { MasterModel } from "./turn.js";

const Reply = z
  .object({
    text: z.string().trim().min(1),
    calls: z
      .array(z.object({ tool: z.string(), input: z.unknown() }))
      .default([]),
  })
  .strict();

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
  return async ({ system, said, encounter }) => {
    const reply = await gateway.call({
      role: "MASTER_MODEL",
      bucket,
      system,
      user: `Encounter: ${encounter}\nShe says: ${said}`,
      schema: z.toJSONSchema(Reply),
    });
    if (!reply.ok) throw new MasterFailed(reply.reason);
    try {
      return Reply.parse(JSON.parse(reply.text));
    } catch {
      throw new MasterFailed("reply_invalid");
    }
  };
}
