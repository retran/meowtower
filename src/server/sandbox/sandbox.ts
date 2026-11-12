// The parent's sandbox (ADR-3350, REQ-8284, REQ-6322, REQ-8314): a schema beside a profile's own,
// made empty or as a copy of her game with no credential in it, and a gateway of its own with its
// own month limit. Nothing here opens her schema for writing: the copy only reads it.
import { eventCount } from "../../engine/events/transfer.js";
import { openProfile } from "../database.js";
import { dropSchema, type Db } from "../db/index.js";
import { createGateway, type Gateway } from "../gateway/gateway.js";
import type { GatewayConfig } from "../gateway/config.js";
import type { Routes } from "../gateway/routes.js";
import { type MoveReport, transfer } from "../move.js";

/** What a copy leaves out: the credentials, and her model call log, so the sandbox's spend is its own. */
export const NOT_COPIED = [
  "devices",
  "parent_pin",
  "lockouts",
  "llm_log",
  "frames",
  "text_blocked",
  "text_counters",
] as const;

/** The default month limit of testing, in dollars (ADR-3280's proposal). */
export const SANDBOX_MONTH_USD = 50;

/** The schema of the sandbox beside a profile's schema. */
export const sandboxSchemaOf = (schema: string): string =>
  `s_${schema.replace(/^p_/, "")}`;

/** The month limit of testing: the owner's setting, or the default. */
export function sandboxLimit(env: NodeJS.ProcessEnv = process.env): number {
  const set = Number(env["MEOWTOWER_SANDBOX_MONTH_USD"]);
  return Number.isFinite(set) && set > 0 ? set : SANDBOX_MONTH_USD;
}

export interface SandboxMade {
  readonly db: Db;
  /** The report of the copy; null where the sandbox started empty. */
  readonly copied: MoveReport | null;
}

/**
 * Makes the sandbox of the profile in `source`, dropping an earlier one first. `from: "copy"`
 * carries her log, blobs and graph versions and rebuilds the projections; `"empty"` starts from
 * nothing. The caller closes the database it gets.
 */
export async function createSandbox(
  url: string,
  source: Db,
  from: "empty" | "copy",
): Promise<SandboxMade> {
  const schema = sandboxSchemaOf(source.name);
  await dropSchema(url, schema);
  const db = await openProfile(url, schema);
  if (from === "empty") return { db, copied: null };
  try {
    return { db, copied: await transfer(source, db, undefined, NOT_COPIED) };
  } catch (err) {
    await db.close();
    await dropSchema(url, schema);
    throw err;
  }
}

/** Whether the sandbox exists, how many events it holds and what it spent this month. */
export async function sandboxState(
  url: string,
  source: Db,
  now: number,
): Promise<{
  exists: boolean;
  events: number;
  spentUsd: number;
  limitUsd: number;
}> {
  const schema = sandboxSchemaOf(source.name);
  const limitUsd = sandboxLimit();
  const probe = await openPostgresIfExists(url, schema);
  if (!probe) return { exists: false, events: 0, spentUsd: 0, limitUsd };
  try {
    const events = await eventCount(probe);
    const month = `${new Date(now).toISOString().slice(0, 7)}-01`;
    const spent = (await probe
      .prepare(
        "SELECT COALESCE(SUM(cost_usd), 0) AS s FROM llm_log WHERE at >= ?",
      )
      .get(month)) as { s: number };
    return { exists: true, events, spentUsd: spent.s, limitUsd };
  } finally {
    await probe.close();
  }
}

export async function openPostgresIfExists(
  url: string,
  schema: string,
): Promise<Db | null> {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: url, max: 1 });
  try {
    const found = await pool.query(
      "SELECT 1 FROM pg_namespace WHERE nspname = $1",
      [schema],
    );
    if (found.rows.length === 0) return null;
  } finally {
    await pool.end();
  }
  return await openProfile(url, schema);
}

/**
 * The gateway of the sandbox: its calls are logged in the sandbox's own schema and count against
 * the testing limit, never an account's budget (REQ-8314).
 */
export function createSandboxGateway(options: {
  db: Db;
  config: GatewayConfig;
  routes: Routes;
  now?: () => number;
  limit?: number;
}): Gateway {
  return createGateway({
    db: options.db,
    config: options.config,
    routes: options.routes,
    ...(options.now ? { now: options.now } : {}),
    limits: {
      adventure: options.limit ?? sandboxLimit(),
      month: options.limit ?? sandboxLimit(),
    },
  });
}
