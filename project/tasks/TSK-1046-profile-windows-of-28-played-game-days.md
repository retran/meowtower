---
id: TSK-1046
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6726, REQ-6728, REQ-6796]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each bar reads the last 28 played game days and the 28 before them

After this task, a function returns for any log the current window and the previous window, each of 28 played game days, and the dynamics read only the first attempts the bars read, so a week she didn't play never counts as an empty week.

## Acceptance criteria

1. Given a log spanning 40 calendar days of which 30 hold a graded first attempt, with a gap of five days inside, when the current window is computed, then it holds the last 28 of those 30 played days, the five idle days count for nothing, and the window ends at the log's last event (REQ-6726). Closed by: a unit test.
2. Given logs with 70, 40 and 20 played game days, when the previous window is computed, then it holds 28 days, the 12 remaining days and no days, and with fewer than 29 played days it reads «мало данных» with a count of 0 (REQ-6728). Closed by: three fixture logs.
3. Given a log where the mapping version changes between the two windows, when both windows are computed, then both use the current mapping version and the current threshold version, so no change shows that only the mapping made. Closed by: a fixture with two mapping versions.
4. Given an assisted first attempt and a first attempt on a rapid guess, when the windows are computed, then no bar counts either, and an unassisted Volley fact feeds basic facts only (REQ-6796). Closed by: a fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/windows.ts`. A played game day is a game day of ADR-0090 on which the log holds at least one graded first attempt; use `src/shared/game-day.ts` for the day. I chose played days over calendar days because a calendar window would fill with days she didn't play. The previous window is the 28 played days before the current one, or the days that remain. Take the mapping and threshold versions as arguments so both windows are computed under one pair.

## Depends on

- TSK-1044 (blocking): the windows live in the model's meta and bar entries.

The epic realising ADR-0090 supplies the game day's rules; `src/shared/game-day.ts` already holds the function this task calls.

## Evidence

Not yet.

## Left alone

The shares and intervals inside a window, which TSK-1047 builds, and the change line between two windows, which TSK-1048 builds.
