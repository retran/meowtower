// «Закончить на сегодня» (SPC-0030, REQ-2444): once the parent has finished the
// day, the rest of that game day gets no extension. The answer comes from the
// log, so a restart changes nothing.
import { latestEvent } from "../engine/events/read.js";
import { gameDayOf } from "../shared/game-day.js";
import type { Db } from "./database.js";

/** True when the newest `finish_today` was logged on the game day `nowMs` is on. */
export function finishedToday(db: Db, nowMs: number, zone: string): boolean {
  const finished = latestEvent(db, "finish_today");
  return (
    finished !== undefined &&
    gameDayOf(Date.parse(finished.ts), zone) === gameDayOf(nowMs, zone)
  );
}
