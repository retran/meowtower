// A parent's session on one browser (ADR-3320, REQ-8504): a random token in a cookie, kept as a
// hash, valid while it is used at least once in 30 days, and revoked on sign-out.
import { randomBytes } from "node:crypto";
import type { Db } from "../db/index.js";
import { hashToken } from "../devices.js";
import type { Account } from "./store.js";

export const ACCOUNT_COOKIE = "meowtower_account";
export const SESSION_IDLE_MS = 30 * 24 * 60 * 60 * 1000;

export async function createSession(
  db: Db,
  accountId: string,
  now: number,
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db
    .prepare(
      "INSERT INTO account_sessions (token_hash, account_id, created_at_ms, last_used_ms) VALUES (?, ?, ?, ?)",
    )
    .run(hashToken(token), accountId, now, now);
  return token;
}

/** The account a token belongs to, or null where it is unknown, revoked or idle for 30 days. */
export async function accountForToken(
  db: Db,
  token: string | undefined,
  now: number,
): Promise<Account | null> {
  if (!token) return null;
  const hash = hashToken(token);
  const row = (await db
    .prepare(
      `SELECT s.last_used_ms AS last, s.revoked AS revoked, a.id AS id, a.email AS email
         FROM account_sessions s JOIN accounts a ON a.id = s.account_id
        WHERE s.token_hash = ?`,
    )
    .get(hash)) as
    { last: number; revoked: number; id: string; email: string } | undefined;
  if (!row || row.revoked === 1 || now - row.last >= SESSION_IDLE_MS)
    return null;
  await db
    .prepare(
      "UPDATE account_sessions SET last_used_ms = ? WHERE token_hash = ?",
    )
    .run(now, hash);
  return { id: row.id, email: row.email };
}

export async function revokeSession(
  db: Db,
  token: string | undefined,
): Promise<void> {
  if (!token) return;
  await db
    .prepare("UPDATE account_sessions SET revoked = 1 WHERE token_hash = ?")
    .run(hashToken(token));
}
