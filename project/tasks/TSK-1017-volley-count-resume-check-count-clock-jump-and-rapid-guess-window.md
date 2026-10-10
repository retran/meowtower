---
id: TSK-1017
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-1040, REQ-6414]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Volley counts as two first attempts, and three measurement edge cases get one rule each

After this task, a Volley counts as 2 graded first attempts towards the adventure's minimum and towards buttons, a resume never resets the count of 3 checks, an interval across a clock jump keeps its measured part, and the rapid-guess signal is tested only from the 20th first attempt.

## Acceptance criteria

1. Given an adventure with a Volley of 8 facts that replaces 2 mental arithmetic tasks, when the first attempts are counted, then the Volley adds 2 graded first attempts towards the minimum of 28, or 25 when rooms were trimmed, and 2 buttons (REQ-1040, REQ-6414). Closed by: a Director test and a rewards test over one log.
2. Given an item with 3 `self_check_used` events and a resume, when the player asks for a fourth check, then the server refuses it with `409 check_limit_reached`, because it counts the events in the log and a resume removes none. Closed by: a route test.
3. Given an active interval that spans a `clock_jump`, when active time is computed, then the interval closes at the last event before the jump and a new one opens at the first event after it, so the gap counts as nothing and the time before the jump stays counted. Closed by: a play-time test over a log with a jump.
4. Given a session of 25 first attempts with a rising rapid-guess rate, when the signal is tested, then no test runs before the 20th first attempt and the two windows of 10 never share an attempt. Closed by: a unit test that checks the windows' indices.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the Director's minimum counter (ADR-0290's Volley rule) and the button grant, the self-check count in `src/server/play.ts`, the active-interval rule of ADR-0090 and the rapid-guess signal. One count per fact would let a floor with a Volley meet the minimum with fewer tasks outside it, and one for the whole Volley would make the Director add tasks to floors that already did their work, so each Volley counts as the 2 it replaces. A rise measured between two windows that share attempts compares part of the session with itself.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The Volley's own selection and timing, which ADR-0290 owns.
