// The two routes of ADR-3100 behind one interface. This is the only code that opens a connection to a
// model service, and each route returns the same normalised reply.
import Anthropic from "@anthropic-ai/sdk";
import type { GatewayConfig, RouteName, Tier } from "./config.js";
import { providersFor } from "./config.js";
import { costOf } from "./prices.js";

export interface RouteRequest {
  readonly model: string;
  readonly tier: Tier;
  readonly system: string;
  readonly user: string;
  readonly maxTokens: number;
  readonly timeoutMs: number;
  /** The JSON schema the reply must match, where the reply is structured. */
  readonly schema?: Readonly<Record<string, unknown>>;
}

export interface RouteReply {
  readonly text: string;
  readonly stopReason: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly costUsd: number;
}

export interface Route {
  /** The body as it leaves the Mac, which `llm_log` keeps. */
  body(request: RouteRequest): unknown;
  call(request: RouteRequest): Promise<RouteReply>;
  /** Whether the model exists on this route; a thrown error means the route can't be reached. */
  hasModel(model: string): Promise<boolean>;
}

export type Routes = Readonly<Record<RouteName, Route>>;

/** Effort stays low: reasoning takes most of the time, and a player waits for each story. */
const anthropicBody = ({
  model,
  system,
  user,
  maxTokens,
  schema,
}: RouteRequest) => ({
  model,
  max_tokens: maxTokens,
  // The rules and the setting repeat on every frame, so they are cached.
  system: [
    {
      type: "text" as const,
      text: system,
      cache_control: { type: "ephemeral" as const },
    },
  ],
  messages: [{ role: "user" as const, content: user }],
  output_config: {
    effort: "low" as const,
    ...(schema ? { format: { type: "json_schema" as const, schema } } : {}),
  },
});

export function anthropicRoute(client: Anthropic): Route {
  return {
    body: anthropicBody,
    async call(request) {
      const reply = await client.messages.create(anthropicBody(request), {
        timeout: request.timeoutMs,
        maxRetries: 0,
      });
      const text = reply.content
        .flatMap((b) => (b.type === "text" ? [b.text] : []))
        .join("");
      const { input_tokens: inputTokens, output_tokens: outputTokens } =
        reply.usage;
      return {
        text,
        stopReason: reply.stop_reason ?? "unknown",
        inputTokens,
        outputTokens,
        costUsd: costOf(request.model, inputTokens, outputTokens),
      };
    },
    async hasModel(model) {
      try {
        await client.models.retrieve(model);
        return true;
      } catch (err) {
        if (err instanceof Anthropic.NotFoundError) return false;
        throw err;
      }
    },
  };
}

const OPENROUTER = "https://openrouter.ai/api/v1";

interface OpenRouterReply {
  choices?: { message?: { content?: string }; finish_reason?: string }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    cost?: number;
  };
}

export function openRouterRoute(
  config: GatewayConfig,
  send: typeof fetch = fetch,
): Route {
  const headers = {
    authorization: `Bearer ${config.openrouterKey ?? ""}`,
    "content-type": "application/json",
  };
  const chatBody = (request: RouteRequest) => ({
    model: request.model,
    max_tokens: request.maxTokens,
    messages: [
      { role: "system", content: request.system },
      { role: "user", content: request.user },
    ],
    provider: {
      data_collection: "deny",
      ...(request.tier === "player" ? { zdr: true } : {}),
      only: providersFor(config, request.tier, request.model),
      ...(request.schema ? { require_parameters: true } : {}),
    },
    usage: { include: true },
    reasoning: { effort: "low" },
    ...(request.schema
      ? {
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "reply",
              strict: true,
              schema: request.schema,
            },
          },
        }
      : {}),
  });
  return {
    body: chatBody,
    async call(request) {
      const res = await send(`${OPENROUTER}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify(chatBody(request)),
        signal: AbortSignal.timeout(request.timeoutMs),
      });
      if (!res.ok) throw new Error(`openrouter_${res.status.toString()}`);
      const reply = (await res.json()) as OpenRouterReply;
      const inputTokens = reply.usage?.prompt_tokens ?? 0;
      const outputTokens = reply.usage?.completion_tokens ?? 0;
      return {
        text: reply.choices?.[0]?.message?.content ?? "",
        stopReason: reply.choices?.[0]?.finish_reason ?? "unknown",
        inputTokens,
        outputTokens,
        costUsd:
          reply.usage?.cost ?? costOf(request.model, inputTokens, outputTokens),
      };
    },
    async hasModel(model) {
      const res = await send(`${OPENROUTER}/models`);
      if (!res.ok) throw new Error(`openrouter_${res.status.toString()}`);
      const list = (await res.json()) as { data?: { id?: string }[] };
      return (list.data ?? []).some((m) => m.id === model);
    },
  };
}

export const liveRoutes = (config: GatewayConfig): Routes => ({
  anthropic: anthropicRoute(new Anthropic({ apiKey: config.anthropicKey })),
  openrouter: openRouterRoute(config),
});
