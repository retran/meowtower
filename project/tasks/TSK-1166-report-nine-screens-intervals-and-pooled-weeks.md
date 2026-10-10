---
id: TSK-1166
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-6064, REQ-6616, REQ-7502]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Report v1 has nine screens, its interval table covers every count, and a thin week pools up to four weeks

After this task, report v1 lists nine screens with «Работа с источниками» as the ninth, the reference table of Wilson intervals runs from 0 of 1 to 1,000 of 1,000 and every row is compared, and a trajectory point whose week holds fewer than 5 first attempts pools earlier weeks and names them. This settles entries 2, 33 and 35 of ADR-0460.

## Acceptance criteria

1. Given the report's screen list, when it is read, then it holds the summary, VWO readiness, the graph map, the node card, misconceptions, limits, science, the story book and «Работа с источниками», nine in all, and the tab «Гипотезы» isn't one of them (REQ-6064). Closed by: a unit test over the screen registry.
2. Given `tests/reference/intervals.json`, when the realisation test runs, then it compares every row the table holds from 0 of 1 to 1,000 of 1,000 against the report's 80 % Wilson interval, and fails on one row changed by a count (REQ-6616). Closed by: the realisation test's report and a mutation fixture that edits one row.
3. Given a share in a report part that addendum 2 adds, when it is rendered over a 28-game-day window, then it shows its right answers and attempts, its 80 % Wilson interval over the raw unweighted counts and the window it names, or «мало данных» under its floor (REQ-6616). Closed by: a view test over one share above and one below its floor.
4. Given a node whose week holds 3 first attempts and whose earlier weeks hold 1, 2 and 4, when the trajectory's «сама» share is computed for that week, then it pools the week with the two earlier weeks that reach 5 and names them, and given four weeks that still hold fewer than 5, then the point shows «мало данных» (REQ-7502). Closed by: a unit test over the two cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read the screen list from one registry. Generate `tests/reference/intervals.json` once from an independent implementation and keep it in the tree, since a 28-game-day window holds about 840 attempts and a test that stops at 60 would leave most counts the report shows untested. Pool backwards a week at a time over at most 4 weeks in all, the point's own week included: a reading of REQ-6818's "up to 4 earlier weeks" would pool 5, which REQ-7502 replaced.

## Depends on

Nothing. The epics realising ADR-0180, ADR-0380 and ADR-0400 own the report, the interval and the trajectories; this task runs on their fixtures.

## Evidence

Not yet.

## Left alone

The full limits screen after the MVP, which REQ-1306 asks for and no decision builds yet, and the report's other screens, which ADR-0180 owns.
