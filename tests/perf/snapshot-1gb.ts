// ADR-0190 Baselines: a snapshot of a 1 GB database finishes within 60 s.
// Run by hand: node --import tsx tests/perf/snapshot-1gb.ts <scratch dir>
import { mkdirSync, statSync } from "node:fs";
import { appendEvents } from "../../src/engine/events/append.js";
import { openDatabase } from "../../src/server/database.js";
import { takeSnapshot } from "../../src/server/snapshots.js";

const dir = process.argv[2] ?? "/tmp/meowtower-perf";
mkdirSync(dir, { recursive: true });
const live = `${dir}/live.sqlite`;
const db = openDatabase(live);
const batch = Array.from({ length: 1000 }, (_, i) => ({
  type: "attempt_submitted",
  v: 0,
  payload: { raw: "x".repeat(4000) + String(i) },
  origin: "server" as const,
}));
const size = (): number =>
  statSync(live).size +
  (statSync(`${live}-wal`, { throwIfNoEntry: false })?.size ?? 0);
while (size() < 1024 ** 3) appendEvents(db, batch);
db.pragma("wal_checkpoint(TRUNCATE)");
console.log(
  `live database: ${(statSync(live).size / 1024 ** 3).toFixed(2)} GB`,
);
const taken = await takeSnapshot(live, `${dir}/snaps`, new Date());
console.log(`snapshot of 1 GB: ${taken.ms} ms`);
db.close();
