import { createHash, randomBytes, randomUUID } from "node:crypto";
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
