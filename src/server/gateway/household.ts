// The month's spend of the profiles of one account (ADR-3340, REQ-8514). Every account has a budget
// of its own, so a gateway counts what the other profiles of its account spent this month, and what
// their calls that are still running have reserved, besides its own, and never what another
// account's profiles spent.
import type { Db } from "../db/index.js";

/** What one profile's gateway asks of the other profiles of its account. */
export interface Household {
  /** The cost the account's other profiles logged since `from`, an ISO date. */
  spentByOthers(from: string): Promise<number>;
  /** The worst case that the account's other profiles' calls still running have reserved. */
  heldByOthers(): Promise<number>;
  /** This profile reserves `delta` more (a negative one releases it). */
  hold(delta: number): void;
  /** The account's monthly budget in dollars, or null for the default. */
  monthLimit(): Promise<number | null>;
}

const SCHEMA = /^[a-z_][a-z0-9_]*$/;

/**
 * A ledger over the accounts' database. A profile no account owns, the first one until it is
 * claimed, is a group of one with the default limit. Every gateway of the process takes its own
 * view of it with `forProfile`.
 */
export function createLedger(accounts: Db): {
  forProfile(schema: string): Household;
} {
  const held = new Map<string, number>();
  /** The account a profile's schema belongs to, with the schemas of all its profiles. */
  const groupOf = async (
    schema: string,
  ): Promise<{ accountId: string | null; schemas: string[] }> => {
    const own = (await accounts
      .prepare("SELECT account_id AS id FROM profiles WHERE schema_name = ?")
      .get(schema)) as { id: string } | undefined;
    if (!own) return { accountId: null, schemas: [schema] };
    const rows = (await accounts
      .prepare(
        "SELECT schema_name AS schema FROM profiles WHERE account_id = ?",
      )
      .all(own.id)) as { schema: string }[];
    return { accountId: own.id, schemas: rows.map((r) => r.schema) };
  };
  return {
    forProfile(schema) {
      return {
        async spentByOthers(from) {
          let total = 0;
          for (const other of (await groupOf(schema)).schemas) {
            if (other === schema || !SCHEMA.test(other)) continue;
            const row = (await accounts
              .prepare(
                `SELECT COALESCE(SUM(cost_usd), 0) AS s FROM ${other}.llm_log WHERE at >= ?`,
              )
              .get(from)) as { s: number };
            total += row.s;
          }
          return total;
        },
        async heldByOthers() {
          let total = 0;
          for (const other of (await groupOf(schema)).schemas)
            if (other !== schema) total += held.get(other) ?? 0;
          return total;
        },
        hold(delta) {
          held.set(schema, (held.get(schema) ?? 0) + delta);
        },
        async monthLimit() {
          const { accountId } = await groupOf(schema);
          if (!accountId) return null;
          const row = (await accounts
            .prepare(
              "SELECT month_limit_usd AS limit FROM accounts WHERE id = ?",
            )
            .get(accountId)) as { limit: number | null } | undefined;
          return row?.limit ?? null;
        },
      };
    },
  };
}
