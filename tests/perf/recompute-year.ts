// ADR-0190 Baselines: a full recompute of one year's log, about 180,000
// events by ADR-0020's estimate, finishes within 60 s on the Mac.
// Run by hand: node --import tsx tests/perf/recompute-year.ts <scratch dir>
import { mkdirSync, rmSync } from "node:fs";
import { appendEvents } from "../../src/engine/events/append.js";
import { recompute } from "../../src/engine/recompute.js";
import { openDatabase } from "../../src/server/database.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const dir = process.argv[2] ?? "/tmp/meowtower-perf-recompute";
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const db = openDatabase(`${dir}/live.sqlite`);
const t0 = performance.now();
const events = writeSyntheticLog(db, {
  days: 365,
  tasksPerDay: 155,
  seed: 2026,
  batch: 1000,
});
const wrote = performance.now() - t0;
// Appends go on during the recompute, as play would; each one's wait is timed.
let done = false;
let worst = 0;
let appended = 0;
const running = recompute(db, { computedAt: new Date().toISOString() }).then(
  (r) => {
    done = true;
    return r;
  },
);
while (!done) {
  const a = performance.now();
  appendEvents(db, [
    {
      type: "session_started",
      v: 1,
      payload: { sessionId: `during-${appended}`, mode: "daily" },
      origin: "server",
      sessionId: `during-${appended}`,
    },
  ]);
  worst = Math.max(worst, performance.now() - a);
  appended++;
  await new Promise((resolve) => setImmediate(resolve));
}
const result = await running;
console.log(
  `recompute-year: ${events} events written in ${(wrote / 1000).toFixed(1)} s; full recompute of ${result.tables.length} tables in ${result.ms} ms against the 60,000 ms budget; ${appended} appends during it, the longest waiting ${worst.toFixed(2)} ms`,
);
db.close();
process.exit(result.ms <= 60_000 ? 0 : 1);
