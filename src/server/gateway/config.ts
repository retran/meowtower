// The gateway's configuration (ADR-3100): each role is one value, `<route>:<model>`, and the code fixes
// each role's tier, bucket, timeout and `max_tokens`, so configuration changes a model and never a tier.
export type RouteName = "openrouter" | "anthropic";
export type Tier = "player" | "content";
export type RoleName = "TASK_TEXT_MODEL" | "LIVE_CHECK_MODEL" | "SAFETY_MODEL";

export interface RoleSpec {
  readonly tier: Tier;
  readonly timeoutMs: number;
  readonly maxTokens: number;
}

export const ROLES: Readonly<Record<RoleName, RoleSpec>> = {
  TASK_TEXT_MODEL: { tier: "content", timeoutMs: 30_000, maxTokens: 4000 },
  LIVE_CHECK_MODEL: { tier: "player", timeoutMs: 10_000, maxTokens: 1000 },
  SAFETY_MODEL: { tier: "player", timeoutMs: 5000, maxTokens: 200 },
};

/** The roles that draw a picture have no direct route, because Claude models give text only (REQ-7630). */
export const IMAGE_ROLES: readonly string[] = [
  "ART_MODEL_CHAR",
  "ART_MODEL_KEY",
  "ART_MODEL_BG",
  "LIVE_ART_MODEL",
];

export interface RoleRoute {
  readonly route: RouteName;
  readonly model: string;
}

/** `verify` spends from the offline key and records; `replay` answers from recordings and opens no connection. */
export type GatewayMode = "play" | "verify" | "replay";

export interface GatewayConfig {
  readonly mode: GatewayMode;
  readonly roles: Readonly<Record<RoleName, RoleRoute>>;
  readonly playerProviders: readonly string[];
  readonly contentProviders: readonly string[];
  readonly openrouterKey: string | undefined;
  readonly anthropicKey: string | undefined;
}

export class ConfigInvalid extends Error {
  constructor(role: string, fact: string) {
    super(`model_config_invalid: ${role}: ${fact}`);
  }
}

/** Reads one `<route>:<model>` value and refuses a route its role may not take. */
export function parseRole(
  role: string,
  value: string,
  tier: Tier,
  attested: boolean,
): RoleRoute {
  const at = value.indexOf(":");
  const route = value.slice(0, at);
  const model = value.slice(at + 1);
  if ((route !== "openrouter" && route !== "anthropic") || model === "")
    throw new ConfigInvalid(role, `no known route in "${value}"`);
  if (route === "anthropic" && IMAGE_ROLES.includes(role))
    throw new ConfigInvalid(role, "image output has no direct route");
  if (route === "anthropic" && tier === "player" && !attested)
    throw new ConfigInvalid(
      role,
      "a player-tier role needs ANTHROPIC_ZDR_ATTESTED=true on the direct route",
    );
  return { route, model };
}

const listOf = (value: string | undefined, fallback: string): string[] =>
  (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

/** The configuration, or null while a role is unset, which leaves live frames off. */
export function readConfig(
  env: Readonly<Record<string, string | undefined>>,
): GatewayConfig | null {
  const attested = env["ANTHROPIC_ZDR_ATTESTED"] === "true";
  const mode = env["GATEWAY_MODE"] ?? "play";
  if (mode !== "play" && mode !== "verify" && mode !== "replay")
    throw new ConfigInvalid("GATEWAY_MODE", `unknown mode "${mode}"`);
  const openrouterKey =
    mode === "verify"
      ? env["OPENROUTER_OFFLINE_KEY"]
      : env["OPENROUTER_PLAY_KEY"];
  const names = Object.keys(ROLES) as RoleName[];
  if (names.some((name) => !env[name])) return null;
  const roles = Object.fromEntries(
    names.map((name) => [
      name,
      parseRole(name, env[name] ?? "", ROLES[name].tier, attested),
    ]),
  ) as Record<RoleName, RoleRoute>;
  for (const name of names) {
    const route = roles[name].route;
    const key =
      route === "anthropic" ? env["ANTHROPIC_API_KEY"] : openrouterKey;
    if (!key && mode !== "replay")
      throw new ConfigInvalid(name, `no key for the route ${route}`);
  }
  return {
    mode,
    roles,
    playerProviders: listOf(
      env["PLAYER_TIER_PROVIDERS"],
      "google-vertex,amazon-bedrock,azure,xai",
    ),
    contentProviders: listOf(
      env["CONTENT_TIER_PROVIDERS"],
      "anthropic,openai,google-ai-studio,seed,mistral",
    ),
    openrouterKey,
    anthropicKey: env["ANTHROPIC_API_KEY"],
  };
}

/** A tier's `only` list for a model: an entry `slug:prefix` counts only for models with that prefix. */
export function providersFor(
  config: GatewayConfig,
  tier: Tier,
  model: string,
): string[] {
  const entries =
    tier === "player"
      ? config.playerProviders
      : [...config.playerProviders, ...config.contentProviders];
  return entries.flatMap((entry) => {
    const [slug = "", prefix] = entry.split(":");
    return prefix === undefined || model.startsWith(prefix) ? [slug] : [];
  });
}
