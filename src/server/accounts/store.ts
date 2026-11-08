// The parent's accounts and their sign-in codes (ADR-3320, REQ-8500, REQ-8502). A parent enters an
// email, the game sends a six-digit code that lives 10 minutes, and a right code verifies the
// address and makes the account. Five wrong tries lock the address for 15 minutes, as the PIN is.
import { createHash, randomInt, randomUUID } from "node:crypto";
import { migrate } from "../database.js";
import { type Db, openPostgres } from "../db/index.js";
import { t } from "../../shared/i18n.js";
import type { Mailer } from "./mailer.js";

const MIGRATIONS = new URL("../../../migrations/accounts/", import.meta.url);

export const CODE_LIFETIME_MS = 10 * 60 * 1000;
export const CODE_GAP_MS = 30 * 1000;
export const WRONG_LIMIT = 5;
export const LOCK_MS = 15 * 60 * 1000;

export interface Account {
  readonly id: string;
  readonly email: string;
}

export type Issued =
  | { result: "sent" }
  | { result: "invalid" }
  | { result: "too_soon"; retryAt: number }
  | { result: "locked"; retryAt: number };

export type Checked =
  | { result: "ok"; account: Account }
  | { result: "wrong" | "expired" | "invalid" }
  | { result: "locked"; retryAt: number };

/** Opens the schema that holds the accounts, applying the migrations that have not run. */
export async function openAccounts(url: string, schema = "acct"): Promise<Db> {
  const db = await openPostgres(url, schema);
  try {
    await migrate(db, MIGRATIONS);
  } catch (err) {
    await db.close();
    throw err;
  }
  return db;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** The address as the game keeps it: trimmed and in lower case, or null where it is no address. */
export function normaliseEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : null;
}

const hashOf = (email: string, code: string): string =>
  createHash("sha256").update(`${email}:${code}`).digest("hex");

interface CodeRow {
  code_hash: string;
  issued_at_ms: number;
  expires_at_ms: number;
  wrong: number;
  locked_until_ms: number;
}

const rowOf = async (db: Db, email: string): Promise<CodeRow | undefined> =>
  (await db
    .prepare(
      "SELECT code_hash, issued_at_ms, expires_at_ms, wrong, locked_until_ms FROM sign_in_codes WHERE email = ?",
    )
    .get(email)) as CodeRow | undefined;

/**
 * Sends a new code to an address. A locked address gets none, and a second code within 30 seconds
 * waits, so the form cannot be used to flood a mailbox.
 */
export async function issueCode(
  db: Db,
  mailer: Mailer,
  raw: string,
  now: number,
): Promise<Issued> {
  const email = normaliseEmail(raw);
  if (!email) return { result: "invalid" };
  const prior = await rowOf(db, email);
  if (prior && now < prior.locked_until_ms)
    return { result: "locked", retryAt: prior.locked_until_ms };
  if (prior && now < prior.issued_at_ms + CODE_GAP_MS)
    return { result: "too_soon", retryAt: prior.issued_at_ms + CODE_GAP_MS };
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db
    .prepare(
      `INSERT INTO sign_in_codes (email, code_hash, issued_at_ms, expires_at_ms, wrong, locked_until_ms)
       VALUES (?, ?, ?, ?, 0, 0)
       ON CONFLICT (email) DO UPDATE SET code_hash = excluded.code_hash,
         issued_at_ms = excluded.issued_at_ms, expires_at_ms = excluded.expires_at_ms,
         wrong = 0, locked_until_ms = 0`,
    )
    .run(email, hashOf(email, code), now, now + CODE_LIFETIME_MS);
  await mailer.send(
    email,
    t("ui.account.mail.subject"),
    t("ui.account.mail.body", {
      code,
      minutes: CODE_LIFETIME_MS / 60_000,
    }),
  );
  return { result: "sent" };
}

/**
 * Checks a code. A right one is used up, verifies the address and makes the account where there is
 * none. A wrong one counts; the fifth locks the address.
 */
export async function checkCode(
  db: Db,
  raw: string,
  code: string,
  now: number,
): Promise<Checked> {
  const email = normaliseEmail(raw);
  if (!email) return { result: "invalid" };
  return await db.transaction(async (): Promise<Checked> => {
    const row = await rowOf(db, email);
    if (!row) return { result: "expired" };
    if (now < row.locked_until_ms)
      return { result: "locked", retryAt: row.locked_until_ms };
    if (now >= row.expires_at_ms) {
      await db.prepare("DELETE FROM sign_in_codes WHERE email = ?").run(email);
      return { result: "expired" };
    }
    if (hashOf(email, code.trim()) !== row.code_hash) {
      const wrong = row.wrong + 1;
      if (wrong >= WRONG_LIMIT) {
        const until = now + LOCK_MS;
        await db
          .prepare(
            "UPDATE sign_in_codes SET wrong = 0, locked_until_ms = ? WHERE email = ?",
          )
          .run(until, email);
        return { result: "locked", retryAt: until };
      }
      await db
        .prepare("UPDATE sign_in_codes SET wrong = ? WHERE email = ?")
        .run(wrong, email);
      return { result: "wrong" };
    }
    await db.prepare("DELETE FROM sign_in_codes WHERE email = ?").run(email);
    const stamp = new Date(now).toISOString();
    const existing = (await db
      .prepare("SELECT id FROM accounts WHERE email = ?")
      .get(email)) as { id: string } | undefined;
    if (existing) {
      await db
        .prepare(
          "UPDATE accounts SET verified_at = COALESCE(verified_at, ?) WHERE id = ?",
        )
        .run(stamp, existing.id);
      return { result: "ok", account: { id: existing.id, email } };
    }
    const id = randomUUID();
    await db
      .prepare(
        "INSERT INTO accounts (id, email, verified_at, created_at) VALUES (?, ?, ?, ?)",
      )
      .run(id, email, stamp, stamp);
    return { result: "ok", account: { id, email } };
  })();
}
