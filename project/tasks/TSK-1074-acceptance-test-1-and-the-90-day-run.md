---
id: TSK-1074
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6898]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Acceptance test 1 and a 90-day run show that no held node is met before its check

After this task, one acceptance test passes the five behaviours REQ-6898 lists, and a 90-simulated-day run asserts that no path shows a held node before its check and that the caps hold, so the hold can be trusted before the owner reads a series.

## Acceptance criteria

1. Given fixtures for a node's first «устойчиво», a lesson mark inside the interval, a recompute under a new threshold version and series ending at 2 of 2, 0 of 2, 1 of 3, 2 of 4 and 3 of 4, when acceptance test 1 runs, then the plan is due 28 to 35 game days after the latest meeting, no held node appears on any covered path before its check, an observation after a lesson mark inside the interval doesn't count, a lesson mark cancels the plan, a recompute leaves each series' observations unchanged, and each fixture reaches its result (REQ-6898). Closed by: acceptance test 1's report.
2. Given 90 simulated days, when the run ends, then no `item_shown` or `compose_shown` names a held node before its check on any path, `held_node_refused` never fires, at most 3 checks fall on an adventure day, none after a fatigue signal, each in the first room slot of its domain floor, and no plan was written for an exempt node. Closed by: the simulation's report.
3. Given the cases REQ-6898 leaves out, when the fixtures run, then a void check is replanned under the same number, a hinted check counts wrong, the next-day review is shown before the next hold, a third void cancels with `void_limit`, a plan at ship time gets the 7-day window and a lesson's second recheck restarts the series. Closed by: six fixture tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the acceptance test to `tests/integration/` and the run to `tools/simulate.ts`, which gains retention runs. The run uses the real Director where the epic realising ADR-0070 has built it, and otherwise a stand-in Director that asks the predicate of TSK-1067 for each of the 11 paths' candidate lists on a fixture graph and takes the first accepted task. State in the evidence which one ran.

## Depends on

- TSK-1066 (blocking): the plan.
- TSK-1067 (blocking): the hold.
- TSK-1068 (blocking): the placement and caps.
- TSK-1069 (blocking): the series.
- TSK-1070 (blocking): the failed series.
- TSK-1071 (blocking): the lesson cancel.
- TSK-1072 (blocking): ship time and recompute.

## Evidence

Not yet.

## Left alone

The reversal conditions of ADR-0400, which need weeks of real play to measure.
