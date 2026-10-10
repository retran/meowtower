// The routes the shell calls. The device token and the parent session travel
// as HttpOnly cookies. Every body is read, because an unread one stays open.
import type {
  AnswerIn,
  AnswerOut,
  Chest,
  Grant,
  ResumeOut,
  Room,
  Scene,
} from "../shared/api.js";
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

// The play API (SPC-0030). The client imports only types from src/shared, and
// never compares an answer: it sends the raw text and draws the reply.

/** The packets the server sends today; later tasks add break and stop_offer. */
export type Packet = Room | Scene | Chest | { kind: "end" };

// Each state-changing request carries the device's own counter, and a repeat
// with the same value appends nothing. It starts from the clock, so a reload
// never reuses a value the server has seen.
let seq = Date.now();
export const nextSeq = (): number => ++seq;

export async function startSession(): Promise<string | null> {
  const { status, body } = await call("/api/session/start", {
    method: "POST",
    body: JSON.stringify({ mode: "daily", clientSeq: nextSeq() }),
  });
  return status === 200 ? String(body["sessionId"]) : null;
}

/**
 * Opens a session on the open adventure and says where play stopped, with the
 * grants no device has shown yet (REQ-0204); null when no adventure is open.
 */
export async function resumeAdventure(): Promise<ResumeOut | null> {
  const { status, body } = await call("/api/adventure/resume", {
    method: "POST",
    body: JSON.stringify({ clientSeq: nextSeq() }),
  });
  return status === 200 ? (body as unknown as ResumeOut) : null;
}

/** Another device holds the lease: this one turns view-only (REQ-0222). */
export const MOVED = "lease_moved";
export type Moved = typeof MOVED;

const isMoved = (status: number, body: Record<string, unknown>): boolean =>
  status === 409 && body["error"] === MOVED;

export async function nextPacket(
  sessionId: string,
): Promise<Packet | Moved | null> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/next`,
  );
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as Packet) : null;
}

/** The holder's heartbeat, sent every 15 seconds (SPC-0030). */
export async function heartbeat(
  sessionId: string,
): Promise<"ok" | Moved | "failed"> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/heartbeat`,
    { method: "POST", body: JSON.stringify({ clientSeq: nextSeq() }) },
  );
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? "ok" : "failed";
}

export async function answer(
  sessionId: string,
  sent: Omit<AnswerIn, "clientSeq">,
): Promise<AnswerOut | Moved | null> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/answer`,
    { method: "POST", body: JSON.stringify({ ...sent, clientSeq: nextSeq() }) },
  );
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as AnswerOut) : null;
}

/**
 * Pauses the adventure. The request uses `keepalive`, so it still leaves when
 * the page is being hidden or closed (REQ-2406).
 */
export function pause(
  sessionId: string,
  reason: "leave" | "background" | "idle",
): Promise<boolean> {
  return fetch(`/api/session/${encodeURIComponent(sessionId)}/pause`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ reason, clientSeq: nextSeq() }),
    keepalive: true,
  }).then(
    async (res) => {
      await res.json().catch(() => null);
      return res.ok;
    },
    () => false,
  );
}

/** Sends her pick, her text or a draft of it; a draft changes nothing she sees. */
export async function sceneInput(
  sessionId: string,
  input:
    | { kind: "choice"; sceneId: string; choiceId: string }
    | { kind: "text" | "draft"; sceneId: string; text: string },
): Promise<{ grants: Grant[] } | Moved | null> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/scene/input`,
    {
      method: "POST",
      body: JSON.stringify({ ...input, clientSeq: nextSeq() }),
    },
  );
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as { grants: Grant[] }) : null;
}

export async function pickChest(
  sessionId: string,
  chestId: string,
  rewardId: string,
): Promise<{ grants: Grant[] } | Moved | null> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/chest`,
    {
      method: "POST",
      body: JSON.stringify({ chestId, rewardId, clientSeq: nextSeq() }),
    },
  );
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as { grants: Grant[] }) : null;
}

/** Tells the server the client showed these grants, so no resume lists them again. */
export async function deliverRewards(
  sessionId: string,
  rewardIds: string[],
): Promise<boolean> {
  const { status } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/rewards/delivered`,
    {
      method: "POST",
      body: JSON.stringify({ rewardIds, clientSeq: nextSeq() }),
    },
  );
  return status === 200;
}
