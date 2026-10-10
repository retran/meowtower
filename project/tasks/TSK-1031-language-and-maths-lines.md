---
id: TSK-1031
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6602, REQ-6632, REQ-6634, REQ-6638, REQ-6644, REQ-7400]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The language line and the maths line appear at 95 % and say «пока не ясно» otherwise

After this task, the report computes the language line and the maths line from a probe's counts at three checkpoints, shows a line when its 95 % interval clears its threshold and «пока не ясно» otherwise, and shows each weak side as clearly as a strong one.

## Acceptance criteria

1. Given Russian 18 of 20, Dutch 9 of 20 and Dutch after the words 11 of 20, when the language line is built, then it appears; given Russian 15 of 20, Dutch 12 of 20 and Dutch after the words 15 of 20, then it reads «пока не ясно»; given Russian 13 of 20, Dutch 9 of 20 and Dutch after the words 18 of 20, where only the second difference clears, then it appears (REQ-7400). Closed by: a report test on the three fixed counts.
2. Given any counts, when the language line is built, then it compares Russian with Dutch and Dutch with Dutch after the words and never bare with Dutch (REQ-6632). Closed by: a property test that sets the bare share to extreme values and finds no change in the line.
3. Given the pooled bare and Russian share at 22 of 40, 30 of 40 and 38 of 40, when the maths line is built, then the first appears, the second reads «пока не ясно», and the third shows neither a line nor «пока не ясно» (REQ-6634, REQ-6638, REQ-6644). Closed by: a report test.
4. Given the cells `bare`, `ru`, `nl` and `nl_after_words`, when each first holds 20, 40 and 80 graded first attempts, then the lines are computed at those three checkpoints only and the last result shows between them, and a first phase that closes doesn't reset the cells (REQ-6632, REQ-6634). Closed by: a report test over a count stream that crosses the three checkpoints.
5. Given a fixture with a maths gap and one with a language gap, when the parent reads each report, then each weak side shows as clearly as a strong one (REQ-6602). Closed by: judgement, the parent reads both at the probe stage's acceptance, because "as clearly" is a reading and a test can only count lines.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two lines to `src/parent/contrasts.ts`. The language line appears when the 95 % Newcombe interval of at least one of its two differences lies wholly above zero with the Dutch share the lower. Every state of the language contrast short of a line reads «пока не ясно», a Dutch share clearly above Russian included, because a third reading would be a new contrast that needs its own decision. A maths share whose 95 % interval lies wholly above 0.8 shows no line and no «пока не ясно», because the data then says there is no maths gap.

I chose three checkpoints because a line recomputed at every rebuild gets a new chance to clear 95 % after each adventure, and at three looks a student with no gap sees a false line on at most about 4.5 % of seeds by the union bound. I read REQ-6632's "current phase" as the probe's whole run, because resetting the cells at the first phase's close would throw away the only data the lines have.

REQ-7400 replaces REQ-6636, which asked for both differences, so build to REQ-7400.

## Depends on

- TSK-1028 (blocking): the Newcombe and Wilson intervals at 95 %.
- TSK-1030 (blocking): the contrast list the lines belong to.

The epic realising ADR-0430 supplies the probe's cells. Until it exists, a test feeds counts by presentation and nothing reads a log.

## Evidence

Not yet.

## Left alone

Where the lines sit on the probe's screen, which ADR-0430 places, and the lines' Russian texts, which TSK-1032 holds to its rules.
