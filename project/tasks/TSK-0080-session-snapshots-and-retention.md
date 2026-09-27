---
id: TSK-0080
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2526, REQ-2530]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A snapshot after each session, retention, and the backup and storage notices

After this task, `tower` takes a snapshot when a session ends, keeps the newest 30 and the first of every calendar month, and raises `backup_failed` and `storage_ceiling` for the parent.

## Acceptance criteria

1. Given a session ends, when the session end reaches the server, then a new snapshot appears in `data/snapshots/`. Closed by: an integration test.
2. Given 40 simulated sessions spread over three months with a fake clock, when the last one ends, then `data/snapshots/` holds the newest 30 plus the first of each month, and each snapshot opens in a SQLite client and lists its events. Closed by: the retention test's report.
3. Given a snapshot fails, when the parent opens the Parent Room or runs `./tower status`, then `backup_failed` shows once, and the next good snapshot clears it. Closed by: an integration test.
4. Given `data/` passes 20 GB, when the next snapshot finishes, then `storage_ceiling` shows once, and again only at each further 10 GB. Closed by: an integration test with a simulated size.

## What to do

Take a snapshot on the session end ADR-0030 defines, prune after each snapshot, and raise the two notices, as SPC-0010 states them. Monthly snapshots have no end date.

## Depends on

TSK-0070, because it reuses the snapshot worker. TSK-0050, because the notices show in the Parent Room. Criterion 2 lists events, which needs the `events` table from the epic realising ADR-0020.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 35 test files, 331 Vitest tests and 13 Playwright tests passed. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees are cited from `git write-tree`: `src` `8649dfa6dd3533c78d18d2bde86708436404c7e3`, `tests` `f533b61fe7f6679e9f66868f7298f69cd771191c`, `content` `48f98ac9b78f8d8fdbe3c7b1e0cedea781db50af`, and the script `meowtower` `71f4ecbebfbdf595f680b2c8e137af1f07474a03`.
- Seen failing first, each break alone and restored: with the pause route not calling the session-end hook, 3 of the 4 tests in `tests/integration/backups.test.ts` failed; with no monthly keep, the retention test failed; with a failure never cleared, the notice test failed; with the storage notice raised on every snapshot above 20 GB, the storage test failed; with the name-collision step removed, the same-second test failed.
- Criterion 1, REQ-2526: a session started, shown a task and left through `POST /api/session/:id/pause` leaves `meowtower-<UTC time>.sqlite` in the snapshots folder, named by the time of the leave, with both notices clear.
- Criterion 2, REQ-2530: 40 sessions spread over 91 days of a fake clock printed `retention: 40 sessions over 3 months kept 31 snapshots: the newest 30 and the first of 2026-07, 2026-08, 2026-09; events from 6 to 162`; the files kept are exactly the newest 30 and the first of each month, and each opens read-only in SQLite and counts its events, each more than the one before.
- Criterion 3: a live database that isn't there makes two snapshots fail; `notices.json` holds one `backup_failed`, the server logs it once, and the Mac's Parent Room page shows one alert «Резервная копия не получилась…»; the next good snapshot clears it and the page shows none. `./meowtower status`, run in a git worktree of the project with a sample `notices.json`, printed `backup_failed: the snapshot at 2026-09-27T20:00:00.000Z failed; the next good one clears this.` and `storage_ceiling: data/ holds more than 30 GB.`, and neither line once the file was clear; this manual run stands in for an integration test of the status half.
- Criterion 4: with the folder's size simulated at 19.9, 20.4, 25, 29.9, 30.1, 31 and 41 GB over seven snapshots, the notice reads none, 20, 20, 20, 30, 30 and 40, raised three times, and the page says «больше 40 ГБ».

Choices this task made, where SPC-0010 left a gap:

- The notices live in `data/snapshots/notices.json`, beside `last.json`, so `./meowtower status` reads them from the Mac without the server, and the Mac's Parent Room page shows them; the Parent Room's pages on the iPad show them once ADR-0180 builds them.
- `notices.json` is one object keyed by notice kind, so a later kind, such as those TSK-0200 and TSK-0260 send to the parent, adds a key to it and a line to `./meowtower status`, and the type in `src/server/backups.ts` gains the key then.
- The storage notice counts what the server's container sees of `data/`: `blobs`, `snapshots` and `exports`. Caddy's small state in `data/caddy` is in the other container.
- Snapshot names have one-second resolution, so a second session ending in the same second takes the next free second's name; the test ends two sessions in one second and finds two snapshots and no notice.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- A session also ends by lease expiry (ADR-0030), which TSK-0350 builds; the snapshot follows every `session_ended` only once TSK-0350 calls the same session-end hook the pause route calls (`onSessionEnded` in `src/server/play.ts`). Not built here: lease expiry is TSK-0350's, and TSK-0350's criteria don't yet name the snapshot, so REQ-2526 holds fully only once that task, or an amendment to it, does.
- Criterion 3 says the Parent Room shows `backup_failed`; the Mac's Parent Room page does, and the iPad's Parent Room pages will once ADR-0180's epic builds them. Not changed: the criterion is frozen.
- What to do says monthly snapshots have no end date without the reason, which is REQ-2530's: one copy per calendar month, kept with no limit. Not changed: that section is frozen.
- The summary and criterion 3 name `tower` and `./tower status`, from before the rename; the command is `./meowtower status`. Not changed: those sections are frozen.
- Where the notices live and what the storage ceiling counts are contracts SPC-0010 doesn't state yet; they go into the SPC-0010 amendment waiting for approval.

## Left alone

A copy off the Mac, which no decision makes.
