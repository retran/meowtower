// The sandbox's play surface (ADR-3280, REQ-8286): the parent plays any adventure, a draft
// included, from any encounter, through the child's own routes mounted on the sandbox's schema.
// Nothing here writes to a profile's own schema: the studio is only read for the encounter.
import { Hono } from "hono";
import { appendEvents } from "../../engine/events/append.js";
import { registerDevice } from "../devices.js";
import type { Db } from "../db/index.js";
import type { Forced } from "./force.js";
import { mountPairing } from "../pairing.js";
import { mountPlay } from "../play.js";
import { createStream } from "../stream.js";
import {
  childrenOf,
  getNode,
  StudioRefused,
  versionsOf,
} from "../studio/store.js";
import { openPostgresIfExists } from "./sandbox.js";

/** The cookie that carries the sandbox's own device, apart from the game's device cookie. */
export const SANDBOX_COOKIE = "meowtower_sandbox_device";

/** An encounter's scene in the shape the child's screen reads (`scene_prepared`). */
export interface Scene {
  readonly sceneId: string;
  readonly lines: { speaker: string; text: string }[];
  readonly branches: { choiceId: string; text: string }[];
}

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

/**
 * Turns an encounter node's current body into the scene the child sees: the narrator's lines from
 * its place, situation and goal (its title where it has none) and one option for each exit that
 * says something and names the next encounter. A draft with a bare body still shows.
 */
export function sceneOf(sceneId: string, title: string, body: unknown): Scene {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;
  const lines = [b["place"], b["situation"], b["goal"]]
    .map(text)
    .filter((t) => t !== "")
    .map((t) => ({ speaker: "narrator", text: t }));
  const exits = Array.isArray(b["exits"]) ? (b["exits"] as unknown[]) : [];
  const branches = exits.flatMap((e) => {
    const x = (typeof e === "object" && e !== null ? e : {}) as Record<
      string,
      unknown
    >;
    const when = text(x["when"]);
    const next = text(x["next"]);
    return when && next ? [{ choiceId: next, text: when }] : [];
  });
  return {
    sceneId,
    lines: lines.length ? lines : [{ speaker: "narrator", text: title }],
    branches,
  };
}

export interface EncounterRef {
  readonly id: string;
  readonly title: string;
  readonly status: string;
}

/** The encounters of an adventure, of any status; a refusal where the node is no adventure. */
export async function encountersOf(
  studio: Db,
  adventureId: string,
): Promise<EncounterRef[]> {
  const node = await getNode(studio, adventureId);
  if (node?.level !== "adventure") throw new StudioRefused("adventure_unknown");
  return (await childrenOf(studio, adventureId)).map((n) => ({
    id: n.id,
    title: n.title,
    status: n.status,
  }));
}

/** The scene of one encounter of an adventure; a refusal where it is not one of that adventure's. */
export async function enterEncounter(
  studio: Db,
  adventureId: string,
  encounterId: string,
): Promise<Scene> {
  const node = await getNode(studio, encounterId);
  if (node?.level !== "encounter" || node.parentId !== adventureId)
    throw new StudioRefused("encounter_not_in_adventure");
  const body = (await versionsOf(studio, encounterId)).at(-1)?.body ?? null;
  return sceneOf(encounterId, node.title, body);
}

/** The sandbox as it is open for play: its database and the child's routes mounted on it. */
export interface SandboxPlay {
  readonly db: Db;
  readonly app: Hono;
  /** Holds one thing for the next answer; the answer takes it, so it holds once. */
  force(next: Forced | null): void;
}

/**
 * Keeps the sandbox open between requests and mounts the child's routes on it once. `release`
 * closes it, which a reset does before it drops the schema.
 */
export function createSandboxPlay(
  url: string,
  schema: string,
  now: () => number,
): { open(): Promise<SandboxPlay | null>; release(): Promise<void> } {
  let held: SandboxPlay | null = null;
  return {
    async open() {
      if (held) return held;
      const db = await openPostgresIfExists(url, schema);
      if (!db) return null;
      const app = new Hono();
      let pending: Forced | null = null;
      // The game's page asks who the device is before it shows anything, so the sandbox answers too.
      mountPairing(app, db, now);
      mountPlay(app, db, {
        now,
        stream: createStream(),
        tasks: "registry",
        forced: () => {
          const taken = pending;
          pending = null;
          return taken;
        },
      });
      held = {
        db,
        app,
        force(next) {
          pending = next;
        },
      };
      return held;
    },
    async release() {
      const was = held;
      held = null;
      await was?.db.close();
    },
  };
}

/**
 * Starts play in the sandbox at one encounter: a device of the sandbox's own, a session through the
 * child's routes, and the encounter's scene as the first thing the session shows.
 */
export async function startAt(
  play: SandboxPlay,
  scene: Scene,
): Promise<{ sessionId: string; deviceToken: string }> {
  const deviceToken = await registerDevice(play.db, "tablet");
  const res = await play.app.request("/api/session/start", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: `meowtower_device=${deviceToken}`,
    },
    body: JSON.stringify({ mode: "daily", clientSeq: 1 }),
  });
  const started = (await res.json()) as {
    sessionId: string;
    adventureId: string | null;
  };
  await appendEvents(play.db, [
    {
      type: "scene_prepared",
      v: 1,
      payload: scene,
      origin: "server",
      sessionId: started.sessionId,
      ...(started.adventureId ? { adventureId: started.adventureId } : {}),
    },
  ]);
  return { sessionId: started.sessionId, deviceToken };
}
