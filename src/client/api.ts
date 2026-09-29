// The routes the shell calls. The device token and the parent session travel
// as HttpOnly cookies. Every body is read, because an unread one stays open.
import type { Interface } from "./interface.js";

export type DeviceState =
  | { state: "paired"; kind: Interface }
  | { state: "unpaired" }
  | { state: "revoked" };

async function call(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; body: Record<string, unknown> }> {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json" },
  });
  return {
    status: res.status,
    body: (await res.json()) as Record<string, unknown>,
  };
}

export async function device(): Promise<DeviceState> {
  const { status, body } = await call("/api/device");
  if (status === 200)
    return { state: "paired", kind: body["kind"] as Interface };
  return body["error"] === "device_revoked"
    ? { state: "revoked" }
    : { state: "unpaired" };
}

export async function storeInterface(kind: Interface): Promise<boolean> {
  const { status } = await call("/api/device", {
    method: "PUT",
    body: JSON.stringify({ kind }),
  });
  return status === 200;
}

/** A refused attempt: wrong, or locked until `retryAt`. */
export type Tried = { ok: true } | { ok: false; error: string; retryAt?: Date };

const tried = (status: number, body: Record<string, unknown>): Tried =>
  status === 200
    ? { ok: true }
    : {
        ok: false,
        error: String(body["error"]),
        ...(typeof body["retryAt"] === "string"
          ? { retryAt: new Date(body["retryAt"]) }
          : {}),
      };

export async function pair(code: string, kind: Interface): Promise<Tried> {
  const { status, body } = await call("/api/pair", {
    method: "POST",
    body: JSON.stringify({ code, kind }),
  });
  return tried(status, body);
}

export async function parentLogin(pin: string): Promise<Tried> {
  const { status, body } = await call("/api/parent/login", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });
  return tried(status, body);
}

export interface ParentDevice {
  id: string;
  kind: Interface;
  revoked: boolean;
  createdAt: string;
  current: boolean;
}

/**
 * A Parent Room reply: the value, or the error that refused it. The error
 * `parent_session_expired` means the 30 minutes ran out and a PIN entry
 * reopens the session (REQ-2440).
 */
export type ParentReply<T> =
  { ok: true; value: T } | { ok: false; error: string };

const parentReply = <T>(
  status: number,
  body: Record<string, unknown>,
  value: () => T,
): ParentReply<T> =>
  status === 200
    ? { ok: true, value: value() }
    : { ok: false, error: String(body["error"]) };

export async function parentDevices(): Promise<ParentReply<ParentDevice[]>> {
  const { status, body } = await call("/api/parent/devices");
  return parentReply(status, body, () => body["devices"] as ParentDevice[]);
}

/** The parent settings; a null limit means the three-day rule is off (REQ-0234). */
export interface ParentSettings {
  threeDayLimit: number | null;
}

export async function parentSettings(): Promise<ParentReply<ParentSettings>> {
  const { status, body } = await call("/api/parent/settings");
  return parentReply(status, body, () => body as unknown as ParentSettings);
}

export async function saveParentSettings(
  settings: ParentSettings,
): Promise<ParentReply<ParentSettings>> {
  const { status, body } = await call("/api/parent/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return parentReply(status, body, () => body as unknown as ParentSettings);
}

export async function revoke(id: string): Promise<boolean> {
  const { status } = await call(
    `/api/parent/devices/${encodeURIComponent(id)}/revoke`,
    { method: "POST" },
  );
  return status === 200;
}

export async function newPairingCode(): Promise<{
  code: string;
  expiresAt: Date;
} | null> {
  const { status, body } = await call("/api/parent/pair-code", {
    method: "POST",
  });
  return status === 200
    ? {
        code: String(body["code"]),
        expiresAt: new Date(String(body["expiresAt"])),
      }
    : null;
}
