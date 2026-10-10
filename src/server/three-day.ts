// The three-day rule (SPC-0030, REQ-0228, REQ-0236): an adventure's adventure
// days are the game days on which a task or a scene of it was shown, and the
// first game day after `threeDayLimit` of them wraps the adventure up. Both
// questions are answered from the log, so a restart changes nothing.
import {
  adventureEvents,
  sessionEvents,
  type StoredEvent,
} from "../engine/events/read.js";
import { gameDayOf, isZone } from "../shared/game-day.js";
import type { Db } from "./database.js";
import { parentSettings } from "./parent-room.js";

/** The zone a device that sent none plays in: the server's own. */
export const defaultZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

/** A zone the device sent, or the default where it sent none or an unknown one. */
export const zoneOrDefault = (zone: string | null | undefined): string =>
  zone && isZone(zone) ? zone : defaultZone();

/** The events that show a task or a scene of the adventure to her. */
const SHOWS = new Set(["item_shown", "scene_prepared", "scene_shown"]);

/** The game days with a task or a scene of the adventure shown, in each session's zone. */
export function adventureDays(events: StoredEvent[]): Set<number> {
  const zones = new Map<string, string>();
  for (const e of events)
    if (e.type === "session_started" && e.sessionId)
      zones.set(
        e.sessionId,
        zoneOrDefault((e.payload as { zone?: string | null }).zone),
      );
  const days = new Set<number>();
  for (const e of events) {
    if (!SHOWS.has(e.type)) continue;
    const zone = (e.sessionId && zones.get(e.sessionId)) || defaultZone();
    days.add(gameDayOf(Date.parse(e.ts), zone));
  }
  return days;
}

/**
 * True when the adventure already has `threeDayLimit` adventure days before
 * today's game day, which makes today the day it wraps up on. The days before
 * today are counted, so the answer holds for the whole of that game day
 * whatever she is shown on it, and a limit the parent lowers below the days an
 * adventure already has takes hold at the next new game day.
 */
export function wrapUpDue(
  db: Db,
  adventureId: string,
  zone: string,
  nowMs: number,
): boolean {
  const limit = parentSettings(db).threeDayLimit;
  if (limit === null) return false;
  const today = gameDayOf(nowMs, zone);
  let before = 0;
  for (const day of adventureDays(adventureEvents(db, adventureId)))
    if (day < today) before++;
  return before >= limit;
}

/** The zone a session was started in, or the default for one that sent none. */
export function sessionZone(db: Db, sessionId: string): string {
  const started = sessionEvents(db, sessionId).find(
    (e) => e.type === "session_started",
  );
  return zoneOrDefault(
    started && (started.payload as { zone?: string | null }).zone,
  );
}
