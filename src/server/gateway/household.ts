// The month's spend across all the profiles of a household (ADR-3320, REQ-8510). One key serves
// them all, so a gateway counts what the other profiles spent this month, and what they have
// reserved for calls in flight, besides its own.
import type { Db } from "../db/index.js";

/** What one profile's gateway asks of the others. */
export interface Household {
  /** The cost the other profiles logged since `from`, an ISO date. */
  spentByOthers(from: string): Promise<number>;
  /** The worst case the other profiles' calls in flight have reserved. */
  heldByOthers(): number;
  /** This profile reserves `delta` more (a negative one releases it). */
  hold(delta: number): void;
}

const SCHEMA = /^[a-z_][a-z0-9_]*$/;

/**
 * A ledger over the accounts' database and the schemas of the profiles not listed there. Every
 * gateway of the process takes its own view of it with `forProfile`.
 */
export function createLedger(
  accounts: Db,
  unlisted: readonly string[] = [],
): { forProfile(schema: string): Household } {
  const held = new Map<string, number>();
  const schemas = async (): Promise<string[]> => {
    const rows = (await accounts
      .prepare("SELECT schema_name AS schema FROM profiles")
      .all()) as { schema: string }[];
    return [...new Set([...unlisted, ...rows.map((r) => r.schema)])].filter(
      (s) => SCHEMA.test(s),
    );
  };
  return {
    forProfile(schema) {
      return {
        async spentByOthers(from) {
          let total = 0;
          for (const other of await schemas()) {
            if (other === schema) continue;
            const row = (await accounts
              .prepare(
                `SELECT COALESCE(SUM(cost_usd), 0) AS s FROM ${other}.llm_log WHERE at >= ?`,
              )
              .get(from)) as { s: number };
            total += row.s;
          }
          return total;
        },
        heldByOthers() {
          let total = 0;
          for (const [owner, amount] of held)
            if (owner !== schema) total += amount;
          return total;
        },
        hold(delta) {
          held.set(schema, (held.get(schema) ?? 0) + delta);
        },
      };
    },
  };
}
