---
id: TSK-1062
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6816, REQ-6820, REQ-6822, REQ-6824]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The trajectory draws one point per node and week, with its share, its depth of help and its marks

After this task, the report holds for each node one point for each week with a counted first attempt, each carrying the share «сама» with its interval, the mean depth of help and the marks that can explain a change, so the parent reads a rise after a lesson at the date it happened.

## Acceptance criteria

1. Given a node with counted first attempts in weeks 1 and 3 only, when the trajectory is built, then it has two points and none for week 2 (REQ-6816). Closed by: a trajectory test.
2. Given a node with 2, 1 and 3 unassisted first attempts in three weeks, when the third week's share is built, then it pools all three weeks and names them; given 4 attempts over 4 weeks, then the point shows «мало данных» with its count; given 5 or more, then it shows the count and the 80 % Wilson interval (REQ-6824). Closed by: a trajectory test.
3. Given a week with a right unassisted attempt, an attempt `clean` after rung 2, and a wrong first attempt, when the mean depth is built, then the three score 0, 2 and 4, the mean shows one decimal with its count, and no floor applies (REQ-6820). Closed by: a trajectory test.
4. Given a node with a `solution_shown`, an `explanation_shown`, a lesson mark, a «тренировали факты» mark whose facts `content/facts.yaml` maps to the node, a review task and a retention observation with its result, when the trajectory is built, then each appears as a mark at its date (REQ-6822). Closed by: a trajectory test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/trajectory.ts` over TSK-1061's counted set. The share «сама» is the unassisted first attempts that ended `clean` over all unassisted first attempts of the point. The pooling spans at most 4 weeks in all, the point's own week included; I read "up to 4" that way because the requirement's reason names four weeks as the span the profile uses, and `Open review findings` in ADR-0400 records the other reading for the person approving. Take the intervals from `src/parent/intervals.ts`.

## Depends on

- TSK-1061 (blocking): the counted set and the bins.
- TSK-1060 (blocking): the marks include `solution_shown` and `hint_shown` by task.

The epic realising ADR-0380 supplies `src/parent/intervals.ts`; add it with the Wilson function only where it doesn't exist yet, and leave its reference table to that epic.

## Evidence

Not yet.

## Left alone

Drawing: the chart's layout belongs to ADR-0150's design system and the dynamics screen's specification.
