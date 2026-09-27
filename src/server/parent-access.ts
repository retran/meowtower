// The Parent Room's PIN, the two lockouts and the parent session (SPC-0010,
// TSK-0050). Wrong pairing codes and wrong PINs are counted in a row, each
// kind apart; the fifth wrong entry locks that kind for 15 minutes, and a
// correct entry outside a lockout resets its count (REQ-2522).
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Db } from "./database.js";
import { hashToken } from "./devices.js";

export type LockKind = "pairing" | "pin";

export const WRONG_LIMIT = 5;
export const LOCK_MS = 15 * 60 * 1000;

export type Attempt =
  | { result: "ok" }
  | { result: "wrong" }
  | { result: "locked"; retryAt: number };

/**
 * Runs one attempt of a kind: refused while locked, counted when wrong, and
 * resetting the count when right. `check` runs only outside a lockout.
 */
export function attempt(
  db: Db,
  kind: LockKind,
  now: number,
  check: () => boolean,
): Attempt {
  return db.transaction((): Attempt => {
    const row = (db
      .prepare("SELECT wrong, locked_until_ms FROM lockouts WHERE kind = ?")
      .get(kind) as { wrong: number; locked_until_ms: number } | undefined) ?? {
      wrong: 0,
      locked_until_ms: 0,
    };
    if (now < row.locked_until_ms)
      return { result: "locked", retryAt: row.locked_until_ms };
    const save = db.prepare(
      `INSERT INTO lockouts (kind, wrong, locked_until_ms) VALUES (?, ?, ?)
       ON CONFLICT(kind) DO UPDATE SET wrong = excluded.wrong,
         locked_until_ms = excluded.locked_until_ms`,
    );
    if (check()) {
      save.run(kind, 0, 0);
      return { result: "ok" };
    }
    const wrong = row.wrong + 1;
    // The fifth wrong entry starts the lockout, and the count starts again after it.
    if (wrong >= WRONG_LIMIT) save.run(kind, 0, now + LOCK_MS);
    else save.run(kind, wrong, 0);
    return { result: "wrong" };
  })();
}

const scrypt = (pin: string, salt: string): Buffer => scryptSync(pin, salt, 32);

export const PIN_PATTERN = /^\d{4,8}$/;

export function setPin(db: Db, pin: string, at: Date): void {
  const salt = randomBytes(16).toString("hex");
  db.prepare(
    `INSERT INTO parent_pin (id, hash, salt, set_at) VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET hash = excluded.hash, salt = excluded.salt,
       set_at = excluded.set_at`,
  ).run(scrypt(pin, salt).toString("hex"), salt, at.toISOString());
}

export function pinIsSet(db: Db): boolean {
  return (
    db.prepare("SELECT 1 FROM parent_pin WHERE id = 1").get() !== undefined
  );
}

export function pinMatches(db: Db, pin: string): boolean {
  const row = db
    .prepare("SELECT hash, salt FROM parent_pin WHERE id = 1")
    .get() as { hash: string; salt: string } | undefined;
  if (!row) return false;
  return timingSafeEqual(scrypt(pin, row.salt), Buffer.from(row.hash, "hex"));
}

/**
 * Parent sessions, each bound to the device that opened it. They live in
 * memory, so a restart asks for the PIN again; their idle expiry is
 * ADR-0030's (REQ-2440).
 */
export class ParentSessions {
  private readonly sessions = new Map<string, string>();

  open(deviceId: string): string {
    const token = randomBytes(32).toString("base64url");
    this.sessions.set(hashToken(token), deviceId);
    return token;
  }

  /** True when the token opened a session on this device. */
  holds(token: string | undefined, deviceId: string): boolean {
    return (
      token !== undefined && this.sessions.get(hashToken(token)) === deviceId
    );
  }
}
