---
id: TSK-0564
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0318, REQ-0312]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server projects the day's active time, the eye count and the soft-stop point from the event log

After this task, three projections in `src/engine/day/` fold the day's active time, the eye count and the soft-stop point from the event log alone, so no later task needs a timer on the device or a counter in memory.

## Acceptance criteria

1. Given a synthetic log with active intervals, one eye exercise and one rest stop, when the day's active time is projected, then it includes the time of the exercise and of the rest stop and leaves out paused time (REQ-0318). Closed by: a unit test that replays the log.
2. Given a log with a pause of 5 minutes 1 second, when the eye count is projected, then it is zero at the resume; given a pause of exactly 5 minutes, then the count carries on (REQ-0312). Closed by: a unit test with both pauses.
3. Given a log with a `clock_jump` inside an active interval, when the intervals are folded, then the interval closes at the last event before the jump, a new one opens at the first event after it, and the gap counts as no active time. Closed by: a unit test.
4. Given the same log replayed twice, or rebuilt by the shadow-table recompute of EPC-0020, when the three values are read, then they are identical, and no client-sent value enters any of them. Closed by: a unit test and the projection registry's rebuild test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three projections to the projection registry as ADR-0090's table fixes them. An active interval runs from a session start or resume to the next pause or session end, and the pause event carries the instant of her last activity, so the interval ends there and no heartbeat is logged. The eye count leaves out the eye exercise and the rest stop's campfire scene; the day's active time keeps both. The soft-stop point starts at 60 minutes of the day's active time and moves to 20 minutes after the instant of each `extension` event. All three reset at the change of game day that `gameDayOf` in `src/shared/game-day.ts` computes.

Choice I made: until ADR-0320's epic adds `eye_exercise_ended`, an eye exercise counts 35 seconds from its `eye_exercise` event, which is the length ADR-0090 chose; the projection reads `eye_exercise_ended` as soon as it exists.

## Depends on

Nothing in this epic. The event schemas of EPC-0020 already hold `eye_exercise`, `rest_stop_started`, `rest_stop_ended`, `extension` and `clock_jump`, and the pause events of EPC-0030 carry the instant of her last activity.

## Evidence

Not yet.

## Left alone

Which projection decides when a timed event plays, which TSK-0569 builds, and the long-day mark in the report, which ADR-0180's epic owns.
