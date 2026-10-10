---
id: TSK-1071
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6852, REQ-6854]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A lesson mark cancels the plan and a new series follows the lesson's second recheck

After this task, a lesson mark or a «тренировали факты» mark on a node with a planned check ends its hold, logs `retention_check_cancelled`, and starts a new series when the lesson's second recheck leaves the node «устойчиво».

## Acceptance criteria

1. Given a node with a plan whose hold hasn't started because it waits for the next-day review, and a node with an active hold, when a lesson mark arrives on each, then the Director ends the hold and logs `retention_check_cancelled` with `nodeId`, `seriesId`, reason `lesson_mark` and the causing event's sequence number (REQ-6852). Closed by: two Director tests.
2. Given a cancelled series with two observations, when the report is built, then the observations stay in the list and the series has no result (REQ-6852). Closed by: a report test.
3. Given a lesson whose second recheck leaves the node «устойчиво», when the Director runs, then a new series starts at check number 1; given a second recheck that leaves it below, then the new series starts when the node is next «устойчиво» at a Director run after that recheck's window (REQ-6854). Closed by: two Director tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the cancel reaction and the restart rule to the planner. The new series, not the old one, is the default I chose, because the lesson changed what the earlier observations measured. The clause for a «тренировали факты» mark stays in the rule for REQ-6852's wording, although the exemption of TSK-1065 leaves no holdable node with facts.

## Depends on

- TSK-1066 (blocking): the plan the mark cancels.

The epic realising ADR-0180 supplies lesson marks and the lesson's two rechecks; fixture events stand in.

## Evidence

Not yet.

## Left alone

An observation made after a lesson mark inside the interval, which TSK-1064 already refuses.
