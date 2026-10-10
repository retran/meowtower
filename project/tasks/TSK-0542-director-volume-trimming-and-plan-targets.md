---
id: TSK-0542
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1040, REQ-1048, REQ-1050, REQ-1052]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The plan fits the adventure before the soft stop by trimming in a fixed order, and never plans fewer than 28 graded first attempts

After this task, `planFloor` recomputes the volume forecast from the player's actual pace before each floor and, when the adventure won't fit before the soft stop, trims rooms, then room length, then moves the fourth floor, protecting mental arithmetic, control facts and the last room of a floor with an open probe or escalation.

## Acceptance criteria

1. Given a forecast built from the median pace of the last 5 adventure days, when the player's actual pace in the first floor differs, then the forecast before the second floor reflects the actual pace (REQ-1048). Closed by: a unit test with two paces.
2. Given a forecast that exceeds the soft stop at 60 minutes of active time, when the plan is trimmed, then it first cuts the number of rooms on a floor down to one, then the length of new rooms down to 3 tasks, and only then moves the route's fourth floor to the next day (REQ-1050). Closed by: a unit test that checks the order at three forecasts.
3. Given a trimmed plan, when its parts are read, then mental arithmetic, control facts and the last room on a floor with an open probe or escalation are all still there (REQ-1052). Closed by: a unit test.
4. Given a plan, when its graded first attempts are counted, then it targets 30 to 40 calibrated to difficulty, 30 to 32 for multi-step or heavy domains and up to 38 to 42 for rapid arithmetic and place-value facts, never plans fewer than 28, or 25 once rooms are trimmed for a slow pace, and never trims below 25 planned attempts (REQ-1040). Closed by: a unit test over four mixes.
5. Given an adventure that stops at the soft stop or by «Закончить на сегодня» before its plan is done, when it is read, then it isn't complete and resumes the next game day from the same place. Closed by: an integration test.
6. Given a plan that can't reach 25 planned attempts before the soft stop, when it runs, then it plays to the soft stop and the log records `graded_minimum_missed` if it closes short. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the forecast and the trim to `src/engine/director/`. The volume forecast, the soft stop and the median pace come from the epic realising ADR-0090; until it exists the forecast reads a stand-in pace from a parameter and the test fixes it. The parent's advance planning from the Parent Room (REQ-0105, REQ-0107) is outside this decision's requirements.

The timed simulation of stage 0.1 checks the minimums at 1.0 and 1.5 times the fluency threshold on a 60-minute adventure; TSK-0547 runs it. A Volley counting as 2 attempts and the Dutch letters' minimum are the epics' of ADR-0290 and ADR-0430.

## Depends on

- TSK-0539 (blocking): the floor's parts that the trim removes.
- The epic realising ADR-0090 supplies the forecast, the soft stop and the median pace.

## Evidence

Not yet.

## Left alone

The Volley and letter counts in the plan, which ADR-0290's and ADR-0430's epics add, and the story's share of the time, which TSK-0543 caps.
