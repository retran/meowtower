---
id: TSK-0904
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5916, REQ-5926, REQ-5928]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Track first attempts are counted apart, and a 60-minute adventure with track tasks still yields 28 graph first attempts

After this task, `tools/simulate.ts` plays each day's track tasks and reports `trackFirstAttempts` apart from `graphFirstAttempts`, and the day's minimums and targets read graph attempts only.

## Acceptance criteria

1. Given a simulated adventure with track tasks, when the simulation reports, then it holds `graphFirstAttempts` and `trackFirstAttempts` as two counts and no single total (REQ-5916). Closed by: the simulation's report.
2. Given a 60-minute adventure with its track tasks in and answer times equal to 1.0 times the fluency threshold, when the simulation runs, then it yields at least 28 graph first attempts (REQ-5928). Closed by: the simulation's report, against the baseline ADR-0190 keeps.
3. Given a fixture day with 28 graph first attempts and 5 track first attempts, when the minimum of 28, the minimum of 25 at 1.5 times the threshold and the plan target of 30 to 40 are checked, then each reads 28 and counts none of the 5 (REQ-5926). Closed by: a unit test of the day's counters.
4. Given a day whose last 10 graded first attempts hold 4 on track tasks, when the success share is read, then it reads the last 10 on graph tasks, and a trim never removes a track task (ADR-0300). Closed by: a unit test and a trim test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two counts to `tools/simulate.ts` and a time model for track tasks of the same kind as the other tasks' model. Change the counters of the day plan, the minimum of 28, the minimum of 25 and the plan target of 30, so each reads graph first attempts only, as the owner set all three on maths fluency. Keep track attempts out of the flow corridor's success share, a choice of mine in ADR-0300, because a misread timetable would otherwise push the next room slot towards review for a mistake no maths node made.

If the simulation can't reach 28 graph first attempts with 2 track tasks in, ADR-0300's second reversal condition applies: the owner chooses between 1 track task a host day and the minimum, and this task reports the numbers that decision needs.

## Depends on

- TSK-0902 (blocking): the track tasks the simulated day holds.
- TSK-0903 (blocking): the window and node choice that decide which days carry them.
- TSK-0905 (not blocking): the template contract; the time model uses a fixture track template until that task lands.

The epic realising ADR-0190 supplies the simulation's profiles and its baseline.

## Evidence

Not yet.

## Left alone

The 60-day simulation of the Director's terms, which ADR-0290's epic runs. Real timings, which the owner judges at the stage's acceptance from the player's first days.
