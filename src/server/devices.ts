import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import type { Db } from "./database.js";

export const DEVICE_COOKIE = "meowtower_device";

export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

/** Adds a device and returns its token; pairing (TSK-0040) calls this. */
export function registerDevice(db: Db, kind: "tablet" | "computer"): string {
  const token = randomBytes(32).toString("base64url");
  db.prepare(
    "INSERT INTO devices (id, token_hash, kind, created_at) VALUES (?, ?, ?, ?)",
  ).run(randomUUID(), hashToken(token), kind, new Date().toISOString());
  return token;
}

export type DeviceLookup =
  | { ok: true; deviceId: string }
  | { ok: false; error: "device_token_missing" | "device_revoked" };

export function deviceForToken(
  db: Db,
  token: string | undefined,
): DeviceLookup {
  if (!token) return { ok: false, error: "device_token_missing" };
  const row = db
    .prepare("SELECT id, revoked FROM devices WHERE token_hash = ?")
    .get(hashToken(token)) as { id: string; revoked: number } | undefined;
  if (!row) return { ok: false, error: "device_token_missing" };
  if (row.revoked) return { ok: false, error: "device_revoked" };
  return { ok: true, deviceId: row.id };
}

const CODE_LIFETIME_MS = 5 * 60 * 1000;

/** Issues a 6-digit pairing code that lives 5 minutes (REQ-2516). */
export function issuePairingCode(db: Db, now: number): string {
  for (;;) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const taken = db
      .prepare("SELECT 1 FROM pairing_codes WHERE code = ?")
      .get(code);
    if (taken) continue;
    db.prepare(
      "INSERT INTO pairing_codes (code, issued_at_ms) VALUES (?, ?)",
    ).run(code, now);
    return code;
  }
}

/** Spends a code and registers the device, or returns null for a code that isn't live. */
export function pairDevice(
  db: Db,
  code: string,
  kind: "tablet" | "computer",
  now: number,
): string | null {
  return db.transaction(() => {
    const row = db
      .prepare("SELECT issued_at_ms, used FROM pairing_codes WHERE code = ?")
      .get(code) as { issued_at_ms: number; used: number } | undefined;
    if (!row || row.used || now - row.issued_at_ms > CODE_LIFETIME_MS)
      return null;
    db.prepare("UPDATE pairing_codes SET used = 1 WHERE code = ?").run(code);
    return registerDevice(db, kind);
  })();
}
