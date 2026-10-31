// The two routes of ADR-3100 behind one interface. This is the only code that opens a connection to a
// model service, and each route returns the same normalised reply.
import Anthropic from "@anthropic-ai/sdk";
import type { GatewayConfig, RouteName, Tier } from "./config.js";
import { providersFor } from "./config.js";
import { costOf } from "./prices.js";

export type JudgeQuestion =
  | string
  | {
      readonly instructions: string;
      readonly criteria: Readonly<Record<string, string>>;
    };

export interface RouteRequest {
  readonly model: string;
  readonly tier: Tier;
  readonly system: string;
  readonly user: string;
  readonly maxTokens: number;
  readonly timeoutMs: number;
  /** The JSON schema the reply must match, where the reply is structured. */
  readonly schema?: Readonly<Record<string, unknown>>;
  /** Named questions for a judge, which writes no text: a string asks yes or no, an object offers a choice. */
  readonly questions?: Readonly<Record<string, JudgeQuestion>>;
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

/** Thinking stays low: a frame is a short text, and thinking tokens bill as output. */
const anthropicBody = ({
  model,
  system,
  user,
  maxTokens,
  schema,
}: RouteRequest) => ({
  model,
  max_tokens: maxTokens,
  system,
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

interface JudgeReply {
  answers?: Record<
    string,
    { noul?: number; choice?: string; probabilities?: Record<string, number> }
  >;
  usage?: { input_tokens?: number; output_tokens?: number; cost?: number };
}

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
  /** Jev answers each named question with the probability of yes, and writes no text. */
  const judgeBody = ({ model, user, questions }: RouteRequest) => ({
    model,
    state: user,
    questions: Object.fromEntries(
      Object.entries(questions ?? {}).map(([name, question]) => [
        name,
        typeof question === "string"
          ? { type: "noul", instructions: question }
          : { type: "choice", ...question },
      ]),
    ),
  });
  const callJudge = async (request: RouteRequest): Promise<RouteReply> => {
    const res = await send(`${OPENROUTER}/systemone`, {
      method: "POST",
      headers,
      body: JSON.stringify(judgeBody(request)),
      signal: AbortSignal.timeout(request.timeoutMs),
    });
    if (!res.ok) throw new Error(`openrouter_${res.status.toString()}`);
    const reply = (await res.json()) as JudgeReply;
    const inputTokens = reply.usage?.input_tokens ?? 0;
    const outputTokens = reply.usage?.output_tokens ?? 0;
    return {
      text: JSON.stringify(
        Object.fromEntries(
          Object.entries(reply.answers ?? {}).map(([k, v]) => [
            k,
            v.choice === undefined
              ? v.noul
              : { choice: v.choice, probabilities: v.probabilities },
          ]),
        ),
      ),
      stopReason: "end_turn",
      inputTokens,
      outputTokens,
      costUsd: reply.usage?.cost ?? costOf(request.model, inputTokens, 0),
    };
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
    body: (request) =>
      request.questions ? judgeBody(request) : chatBody(request),
    async call(request) {
      if (request.questions) return callJudge(request);
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
      // Jev answers on its own endpoint, so the chat catalogue may leave it out.
      return (
        model.startsWith("typesafe/") ||
        (list.data ?? []).some((m) => m.id === model)
      );
    },
  };
}

export const liveRoutes = (config: GatewayConfig): Routes => ({
  anthropic: anthropicRoute(new Anthropic({ apiKey: config.anthropicKey })),
  openrouter: openRouterRoute(config),
});
