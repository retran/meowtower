// The routes the shell calls. The device token and the parent session travel
// as HttpOnly cookies. Every body is read, because an unread one stays open.
import type {
  HintOut,
  AnswerIn,
  Chest,
  Grant,
  ResumeOut,
  Room,
  Scene,
  SkillsOut,
  StopOffer,
} from "../shared/api.js";
import type { Interface } from "./interface.js";

export type DeviceState =
  | { state: "paired"; kind: Interface }
  | { state: "unpaired" }
  | { state: "revoked" }
  | { state: "offline" };

/** The status of a request that got no usable reply: no connection, or no JSON. */
export const UNREACHABLE = 0;

/** Where the sandbox's play surface answers; the child's routes follow it (REQ-8286). */
export const SANDBOX_CHILD = "/api/parent/studio/sandbox/play/child";

/**
 * The address of a game route. The sandbox frame opens the game with `?sandbox=1`, and then every
 * route goes to the child's routes on the sandbox, so the frame plays the parent's sandbox and
 * never her game.
 */
export const gamePath = (path: string): string =>
  typeof location !== "undefined" &&
  new URLSearchParams(location.search).get("sandbox") === "1"
    ? `${SANDBOX_CHILD}${path}`
    : path;

async function call(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; body: Record<string, unknown> }> {
  try {
    const res = await fetch(gamePath(path), {
      ...init,
      headers: { "content-type": "application/json" },
    });
    const body = (await res.json()) as Record<string, unknown>;
    // A request the device's rate cap refused goes again like one that got no reply, and is not
    // an answer that this device may not play (SPC-0030, REQ-2438). A lockout also answers 429,
    // with its own error, and keeps its screen (REQ-2522).
    if (res.status === 429 && body["error"] === "rate_limited")
      return { status: UNREACHABLE, body: {} };
    return { status: res.status, body };
  } catch {
    return { status: UNREACHABLE, body: {} };
  }
}

export async function device(): Promise<DeviceState> {
  const { status, body } = await call("/api/device");
  if (status === UNREACHABLE) return { state: "offline" };
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
  creepiness: 0 | 1 | 2;
  gender: "f" | "m";
  language: string;
  hideRankFalls: boolean;
}

/** One fall the Parent Room lists (REQ-8006). */
export type ParentFall =
  | {
      kind: "skill";
      skill: string;
      node: string;
      from: number;
      to: number;
      at: string;
    }
  | { kind: "rank"; from: string; to: string; day: number };

export async function parentFalls(): Promise<ParentReply<ParentFall[]>> {
  const { status, body } = await call("/api/parent/falls");
  return parentReply(status, body, () => body["falls"] as ParentFall[]);
}

export async function parentSettings(): Promise<ParentReply<ParentSettings>> {
  const { status, body } = await call("/api/parent/settings");
  return parentReply(status, body, () => body as unknown as ParentSettings);
}

export async function saveParentSettings(
  settings: Partial<ParentSettings>,
): Promise<ParentReply<ParentSettings>> {
  const { status, body } = await call("/api/parent/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
  return parentReply(status, body, () => body as unknown as ParentSettings);
}

/** The statistics reset; the server wants `confirm` and refuses without it (REQ-8386). */
export async function skills(): Promise<SkillsOut["skills"] | null> {
  const { status, body } = await call("/api/player/skills");
  return status === 200 ? (body as unknown as SkillsOut).skills : null;
}

export async function resetStats(): Promise<ParentReply<null>> {
  const { status, body } = await call("/api/parent/reset-stats", {
    method: "POST",
    body: JSON.stringify({ confirm: true }),
  });
  return parentReply(status, body, () => null);
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

/** The packets the server sends today; later tasks add break. */
export type Packet = Room | Scene | Chest | StopOffer | { kind: "end" };

// Each state-changing request carries the device's own counter, and a repeat
// with the same value appends nothing. It starts from the clock, so a reload
// never reuses a value the server has seen.
let seq = Date.now();
export const nextSeq = (): number => ++seq;

/** The device's IANA time zone, which the game day follows (SPC-0090). */
const zone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function startSession(): Promise<
  string | null | typeof UNREACHABLE
> {
  const { status, body } = await call("/api/session/start", {
    method: "POST",
    body: JSON.stringify({ mode: "daily", zone: zone(), clientSeq: nextSeq() }),
  });
  if (status === UNREACHABLE) return UNREACHABLE;
  return status === 200 ? String(body["sessionId"]) : null;
}

/**
 * Opens a session on the open adventure and says where play stopped, with the
 * grants no device has shown yet (REQ-0204); null when no adventure is open.
 */
export async function resumeAdventure(): Promise<
  ResumeOut | null | typeof UNREACHABLE
> {
  const { status, body } = await call("/api/adventure/resume", {
    method: "POST",
    body: JSON.stringify({ zone: zone(), clientSeq: nextSeq() }),
  });
  if (status === UNREACHABLE) return UNREACHABLE;
  return status === 200 ? (body as unknown as ResumeOut) : null;
}

/** Another device holds the lease: this one turns view-only (REQ-0222). */
export const MOVED = "lease_moved";
export type Moved = typeof MOVED;

const isMoved = (status: number, body: Record<string, unknown>): boolean =>
  status === 409 && body["error"] === MOVED;

export async function nextPacket(
  sessionId: string,
): Promise<Packet | Moved | null | typeof UNREACHABLE> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/next`,
  );
  if (status === UNREACHABLE) return UNREACHABLE;
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as Packet) : null;
}

/** The parallel task of a failed first attempt; a repeat returns the same one (REQ-2426). */
export async function secondAttempt(
  itemId: string,
): Promise<Room | Moved | null | typeof UNREACHABLE> {
  const { status, body } = await call(
    `/api/item/${encodeURIComponent(itemId)}/second-attempt`,
    { method: "POST", body: JSON.stringify({ clientSeq: nextSeq() }) },
  );
  if (status === UNREACHABLE) return UNREACHABLE;
  if (isMoved(status, body)) return MOVED;
  return status === 200 ? (body as unknown as Room) : null;
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

/**
 * One send of a queued answer. The body carries its `clientSeq`, so a resend
 * after a lost reply is recorded once (REQ-2432). `status` is `UNREACHABLE`
 * when no reply came.
 */
/** Buys a rung of the hint ladder, or shows one already bought; null when it can't be had. */
export async function buyHint(
  itemId: string,
  level: number,
): Promise<HintOut | null> {
  const { status, body } = await call(
    `/api/item/${encodeURIComponent(itemId)}/hint`,
    { method: "POST", body: JSON.stringify({ level, clientSeq: nextSeq() }) },
  );
  return status === 200 ? (body as unknown as HintOut) : null;
}

export function postAnswer(
  sessionId: string,
  sent: AnswerIn,
): Promise<{ status: number; body: Record<string, unknown> }> {
  return call(`/api/session/${encodeURIComponent(sessionId)}/answer`, {
    method: "POST",
    body: JSON.stringify(sent),
  });
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

/** The extension by one row: the server refuses with `day_finished` once the parent ended the day. */
export async function extend(
  sessionId: string,
): Promise<"ok" | "day_finished" | Moved | null> {
  const { status, body } = await call(
    `/api/session/${encodeURIComponent(sessionId)}/extend`,
    { method: "POST", body: JSON.stringify({ clientSeq: nextSeq() }) },
  );
  if (isMoved(status, body)) return MOVED;
  if (status === 409 && body["error"] === "day_finished") return "day_finished";
  return status === 200 ? "ok" : null;
}

/** The reply of an account route: the value, or the error and the time it may be tried again. */
export type AccountReply<T> =
  { ok: true; value: T } | { ok: false; error: string; retryAt?: number };

async function account<T>(
  path: string,
  init: RequestInit | undefined,
  value: (body: Record<string, unknown>) => T,
): Promise<AccountReply<T>> {
  const { status, body } = await call(path, init);
  if (status === UNREACHABLE) return { ok: false, error: "unreachable" };
  if (status >= 200 && status < 300) return { ok: true, value: value(body) };
  const retryAt =
    typeof body["retryAt"] === "number" ? body["retryAt"] : undefined;
  return {
    ok: false,
    error:
      status === 404 && !body["error"] ? "unavailable" : String(body["error"]),
    ...(retryAt === undefined ? {} : { retryAt }),
  };
}

const jsonBody = (method: string, body: object): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export interface AccountView {
  email: string;
  profiles: { id: string; label: string }[];
}
export interface SpendView {
  usd: number;
  limitUsd: number;
}

export const accountCode = (email: string) =>
  account("/api/account/code", jsonBody("POST", { email }), () => true);
export const accountLogin = (email: string, code: string) =>
  account("/api/account/login", jsonBody("POST", { email, code }), () => true);
export const accountLogout = () =>
  account("/api/account/logout", jsonBody("POST", {}), () => true);
export const accountMe = () =>
  account("/api/account/me", undefined, (b) => b as unknown as AccountView);
export const accountSpend = () =>
  account("/api/account/spend", undefined, (b) => b as unknown as SpendView);
export const addProfile = (label: string) =>
  account("/api/account/profiles", jsonBody("POST", { label }), () => true);
export const profilePairCode = (id: string) =>
  account(
    `/api/account/profiles/${encodeURIComponent(id)}/pair-code`,
    jsonBody("POST", {}),
    (b) => String(b["code"]),
  );
export const setBudget = (monthUsd: number) =>
  account("/api/account/budget", jsonBody("PUT", { monthUsd }), () => true);

/** A node of the studio's graphs (ADR-3280). */
export interface StudioNode {
  id: string;
  level: "campaign" | "arc" | "adventure" | "encounter";
  parentId: string | null;
  title: string;
  status: "draft" | "approved" | "playing" | "played";
  version: number;
  /** The ids of the sibling nodes this one leads to. */
  links: string[];
}

export async function studioNodes(
  parent: string | null,
): Promise<ParentReply<StudioNode[]>> {
  const { status, body } = await call(
    `/api/parent/studio/nodes${parent ? `?parent=${encodeURIComponent(parent)}` : ""}`,
  );
  return parentReply(status, body, () => body["nodes"] as StudioNode[]);
}

/** A node's body, from which the graph reads its links. */
export async function studioNode(
  id: string,
): Promise<
  ParentReply<{ node: StudioNode; body: Record<string, unknown> | null }>
> {
  const { status, body } = await call(
    `/api/parent/studio/nodes/${encodeURIComponent(id)}`,
  );
  return parentReply(
    status,
    body,
    () =>
      body as unknown as {
        node: StudioNode;
        body: Record<string, unknown> | null;
      },
  );
}

export async function studioCreate(input: {
  level: StudioNode["level"];
  parentId: string | null;
  title: string;
}): Promise<ParentReply<StudioNode>> {
  const { status, body } = await call("/api/parent/studio/nodes", {
    method: "POST",
    body: JSON.stringify({ ...input, body: {} }),
  });
  return status === 201
    ? { ok: true, value: body as unknown as StudioNode }
    : { ok: false, error: String(body["reason"] ?? body["error"]) };
}

export async function studioStatus(
  id: string,
  next: StudioNode["status"],
): Promise<ParentReply<StudioNode>> {
  const { status, body } = await call(
    `/api/parent/studio/nodes/${encodeURIComponent(id)}/status`,
    { method: "POST", body: JSON.stringify({ status: next }) },
  );
  return status === 200
    ? { ok: true, value: body as unknown as StudioNode }
    : { ok: false, error: String(body["reason"] ?? body["error"]) };
}

export interface AdventureLogEntry {
  adventureId: string;
  events: number;
}

export async function studioLogs(): Promise<ParentReply<AdventureLogEntry[]>> {
  const { status, body } = await call("/api/parent/studio/logs/adventures");
  return parentReply(
    status,
    body,
    () => body["adventures"] as AdventureLogEntry[],
  );
}

export async function studioLog(
  adventureId: string,
): Promise<ParentReply<{ seq: number; ts: string; type: string }[]>> {
  const { status, body } = await call(
    `/api/parent/studio/logs/adventures/${encodeURIComponent(adventureId)}`,
  );
  return parentReply(
    status,
    body,
    () => body["events"] as { seq: number; ts: string; type: string }[],
  );
}

export interface TemplateRow {
  id: string;
  node: string;
  subtype: string;
  form: string;
  groups: [number, number];
  answerKind: string;
}

export interface OpenedTask {
  template: TemplateRow;
  seed: string;
  lang: string;
  text: string;
  svg: string | null;
  options: string[] | null;
  answer: string;
  solution: string[];
  hints: string[];
  traps: { id: string; kind: string; entry: string; explanation: string }[];
  blank: string;
  storyEstimateUsd: number;
}

export async function studioTemplates(): Promise<ParentReply<TemplateRow[]>> {
  const { status, body } = await call("/api/parent/studio/tasks");
  return parentReply(status, body, () => body["templates"] as TemplateRow[]);
}

export async function studioTask(
  id: string,
  seed: string,
  lang: string,
): Promise<ParentReply<OpenedTask>> {
  const query = new URLSearchParams({ lang, ...(seed ? { seed } : {}) });
  const { status, body } = await call(
    `/api/parent/studio/tasks/${encodeURIComponent(id)}?${query.toString()}`,
  );
  return parentReply(status, body, () => body as unknown as OpenedTask);
}

export interface SandboxEncounter {
  id: string;
  title: string;
  status: string;
}

/** The encounters of an adventure, of any status, for the sandbox to start at (REQ-8286). */
export async function studioEncounters(
  adventureId: string,
): Promise<ParentReply<SandboxEncounter[]>> {
  const { status, body } = await call(
    `/api/parent/studio/sandbox/play/adventures/${encodeURIComponent(adventureId)}/encounters`,
  );
  return parentReply(
    status,
    body,
    () => body["encounters"] as SandboxEncounter[],
  );
}

/** Starts play in the sandbox at one encounter and sets the sandbox's device cookie. */
export async function studioPlayStart(
  adventureId: string,
  encounterId: string,
): Promise<ParentReply<{ sessionId: string }>> {
  const { status, body } = await call("/api/parent/studio/sandbox/play/start", {
    method: "POST",
    body: JSON.stringify({ adventureId, encounterId }),
  });
  return parentReply(status, body, () => ({
    sessionId: String(body["sessionId"]),
  }));
}

/** Sets one state of the game in the sandbox (REQ-8288). */
export async function studioLever(
  lever: Record<string, unknown>,
): Promise<ParentReply<null>> {
  const { status, body } = await call("/api/parent/studio/sandbox/levers", {
    method: "POST",
    body: JSON.stringify(lever),
  });
  return parentReply(status, body, () => null);
}

/** Forces the outcome, a fall or a rise of the next check in the sandbox (REQ-8290). */
export async function studioForce(next: string): Promise<ParentReply<null>> {
  const { status, body } = await call("/api/parent/studio/sandbox/force", {
    method: "POST",
    body: JSON.stringify({ next }),
  });
  return parentReply(status, body, () => null);
}
