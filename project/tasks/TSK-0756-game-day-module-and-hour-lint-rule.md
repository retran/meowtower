---
id: TSK-0756
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5000, REQ-5008, REQ-5010]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One module turns a time into a game day, a lint rule bars hour reads elsewhere, and every daily job runs once per game day

After this task, `src/engine/day/` holds the only function that turns a time into a game day, `gameDayOf(ts, zone)`, a lint rule fails any other read of an hour of the day, and a daily job runner starts each of the ten jobs REQ-5008 lists once for each game day, so no job can open or close by the clock.

## Acceptance criteria

1. Given synthetic logs that cross 04:00 in `Europe/Amsterdam` and in `America/Los_Angeles`, when the daily job runner replays them, then each of the ten jobs REQ-5008 lists runs exactly once for each game day, and a log with a changed zone moves the boundary at the next 04:00 of the old zone (REQ-5000, REQ-5008). Closed by: a day test over the two zones and the zone change.
2. Given a fixture in engine code outside `src/engine/day/` that calls `getHours`, `getUTCHours`, `Intl.DateTimeFormat` with an `hour` option or a `Temporal` hour field, when the lint verb runs, then it reports each call and fails (REQ-5010). Closed by: the lint rule's fixture test.
3. Given a Parent Room fixture that formats the hour of the report's last update, and the task renderer's timetable code, when the lint verb runs, then neither is reported, and the lint verb passes on the tree (REQ-5010). Closed by: the lint rule's fixture test and the lint verb's output.
4. Given the tree, when a search runs for a second function that maps a time to a game day, then it finds none outside `src/engine/day/`. Closed by: a test that scans `src/` for the function's exported name and its callers' imports.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `src/engine/day/` with `gameDayOf` and move the code of `src/shared/game-day.ts` into it, so server code, engine code and the client import one function (ADR-0210). Add an ESLint rule that refuses the four hour reads named above in the engine, the server's job code and the player's client code. The rule skips `src/engine/day/`, the task renderer of ADR-0040 and the Parent Room's code, because ADR-0180 shows the parent when the report was updated and no daily job runs there.

Add a daily job runner that reads the game-day index from `gameDayOf` and never an hour. It holds ten named slots: the morning's guiding threads, the daily quests and daily rewards, the shop's new slots, the reset of the explanation budget, the end of a pause of live frames, the count of adventure days for the three-day rule, the end of «Закончить на сегодня» (Finish for today), the end of the frontier cap after a second anxiety signal, the end of the lowered creepiness level and the soft stop's daily reset. Each job keeps the owner that already defines it (ADR-0080, ADR-0090, ADR-0100, ADR-0110, ADR-0130, ADR-0140, SPC-0030). Where a job isn't built yet, its slot holds a named stand-in that the owner's epic replaces; the day test spies on every slot, so a stand-in still counts as one run.

I chose to run the jobs at the first server contact of a new game day, which is where ADR-0210 already plans the next adventure, so no timer reads the clock.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The jobs' own behaviour, which each owner's epic builds, and the Parent Room's formatting of times, which the rule leaves out on purpose.
