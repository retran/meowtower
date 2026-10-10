---
id: TSK-1000
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-1004, REQ-1006, REQ-1008, REQ-1010, REQ-1124, REQ-1130, REQ-6402, REQ-6404, REQ-6406]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Raised mode gives review at least the ordinary share, rapid guesses skip interrupted attempts, and one stretch block at a time completes within 3 adventure days

After this task, inside the success corridor the ordinary rule takes review below `0.30 * (n + 1)` rounded up and raised mode below the larger of that count and `0.40 * (n + 1)` rounded down, a rapid guess is never marked on an interrupted, cross-device or estimate attempt, and at most one stretch block is open, completing within 3 adventure days of its probe's day.

## Acceptance criteria

1. Given a 90-day simulation, when each adventure's in-corridor slots are read, then review is within 30 % to 40 % of them for any adventure of 8 or more such slots, raised mode's review count is at or above the ordinary count after every slot and above it in total, and below and above the corridor every slot is review or frontier by the success share (REQ-1006, REQ-1008, REQ-1010, REQ-1124, REQ-1130). Closed by: the simulation's band test.
2. Given 10, 20 and 30 in-corridor slots, when raised mode is on, then it gives one, two and three more review tasks than the ordinary rule, and in an adventure of fewer than 10 such slots both rules give the same count (REQ-1130). Closed by: a table-driven unit test of the two formulas.
3. Given an answer faster than its template's minimum time on an interrupted attempt, a cross-device attempt and an attempt on an item with an estimate, when the guard runs, then none is marked a rapid guess, and the same answer on an ordinary attempt is (REQ-6402). Closed by: a unit test over the four attempts.
4. Given a stretch node whose probe leaves its state open, when the Director plans the following adventure days, then the block completes within 3 adventure days of the probe's day at no more than 2 stretch tasks a day, and no second stretch block opens while one is open (REQ-1004, REQ-6404). Closed by: a simulation test over a player who plays on 2 of 7 calendar days.
5. Given a probe that scores 0 out of 2, when the session is planned, then the block comes first in each session until it completes, within the daily cap of 2 (REQ-6406). Closed by: a planner test over three consecutive sessions.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the review-share rule, the rapid-guess guard and the stretch gate as the amended ADR-0070 lines say. Leave REQ-1130 with no extra raise below 10 in-corridor slots; ADR-0360's third reversal condition lets the owner reopen REQ-1010 after the first stage 0.3 sessions, and this task changes nothing about that choice.

## Depends on

- TSK-0999 (not blocking): it changes the route builder in the same planner, and the two can land in either order.

The epics realising ADR-0070 and ADR-0240 supply the planner, the slot types and the estimate step; until they exist, the tests run on fixture slots and fixture attempts, and the real planner is left to those epics.

## Evidence

Not yet.

## Left alone

The domain window, the trims and the Sources floor, which TSK-0999 changes, and any exception to REQ-1010 for raised mode, which the owner decides.
