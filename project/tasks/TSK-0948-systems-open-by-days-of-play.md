---
id: TSK-0948
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0330
closes: [REQ-6244, REQ-6246, REQ-6252]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Systems open by days of play, and every route of a closed system answers 404

After this task, `src/engine/systems/` appends `system_unlocked` for each system the schedule opens when a day's first adventure scene starts, the projection `systems_open` folds those events, every route of a closed system answers `404 system_closed`, the Parent Room's `openAllSystems` setting opens everything still closed, and a chest offers its categories only for systems that are open.

## Acceptance criteria

1. Given 9 calendar days of which 3 hold no `scene_shown` of an adventure, when the first adventure scene of each day of play starts, then days of play 1 to 8 append `system_unlocked` with `source: "schedule"` for exactly the systems of the schedule table (levels and the chest on day 1; guiding threads, the hint ladder and the volley on day 2; daily quests and the first knot on day 3; the Diary and the bestiary on day 4; a second familiar on day 5; the forge on day 6; the shop, «Свободное перо» (Free Pen) and the Tower's dictionary on day 8), the 3 calendar days with no play move the schedule by nothing, and Session 0 appends the day-1 unlocks only (REQ-6244). Closed by: a projection test over a synthetic log.
2. Given a familiar whose friendship grant brings it to its evolution threshold, and the Director's first slip, when each commits, then `system_unlocked` with `source: "event"` is appended in the same transaction as the grant or the slip, a grant that rolls back leaves no unlock, and a system whose event never comes stays closed (REQ-6244). Closed by: a transaction test with a forced rollback.
3. Given a closed system, when a client sends a request to one of its routes, then the server answers `404 system_closed` and logs it, and the client draws no entry to the system; given a day spent only in her room or the pen, then nothing opens (REQ-6244). Closed by: a route test over each closed system's routes, and a Playwright test on day 1 that finds no shop, forge or pen entry.
4. Given the setting `openAllSystems` on, when the parent switches it on, then `system_unlocked` with `source: "parent"` is appended for every system still closed, and switching it off appends nothing and closes nothing (REQ-6246). Closed by: a settings route test.
5. Given the Diary is closed, when a chest opens, then it offers three rewards, one from each of cosmetics, the star-steel and star-yarn category, and buttons; given the Diary is open, then it offers three rewards from three different categories among four (REQ-6252). Closed by: a unit test over 1,000 seeded chests for each state.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `src/engine/systems/` with the schedule table, `systems_open` and the check that every route of a closed system runs, and register `system_unlocked` with the payload ADR-0330 gives. `src/engine/systems/` reads only `system_unlocked` and `scene_shown` events, the settings, and the friendship grant and slip whose transactions it joins, and imports nothing from the Master service or the client; a lint rule enforces this, because SPC-0330 permits no other direction.

A day of play is a game day whose log holds at least one adventure `scene_shown`, Session 0 excluded. The server appends the day's unlocks when the scene «В прошлый раз…» (Last time…) starts, so a system never opens in the middle of an adventure. Choice I made: for `source: "event"` and `source: "parent"` the payload's `dayOfPlay` is the count of days of play so far, because the schema requires a number and no day of its own exists for those sources.

The chest reads `systems_open` for the Diary. Switching `openAllSystems` off again closes nothing, because a closed shop would strand the items and buttons she already holds.

## Depends on

Nothing in this epic. The epic realising ADR-0140 supplies the chest, the friendship grant and each system's own rules; until it exists, the task runs on a stand-in chest and a stand-in grant in the test fixtures, and the shop, forge and other screens read `systems_open` when that epic builds them. The epic realising ADR-0110 supplies the Director's first slip, which a fixture stands in for. The epic realising ADR-0020 holds the event catalogue and the upcasters this task registers into.

## Evidence

Not yet.

## Left alone

What each system does once open, which ADR-0140 owns, and the guiding threads' own behaviour before and after they open, which TSK-0949 builds on this projection.
