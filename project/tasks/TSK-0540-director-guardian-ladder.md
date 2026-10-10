---
id: TSK-0540
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1028, REQ-1030, REQ-1032]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Guardian's first task of a day has one step more than the largest fluent word-problem node, and the ladder follows the outcomes

After this task, the Director sets each Guardian task's number of steps from the largest `k` for which T_k is fluent or stable: `k + 1` for the first task of the day, `k + 2` up to 4 after a `clean` outcome, `k` after any other, at least 1, and 1 throughout cold start.

## Acceptance criteria

1. Given T1 and T2 fluent and T3 not, when the day's first Guardian task is planned, then it has 3 steps; given T2 "fluent (inferred)", then the inferred state counts the same (REQ-1028). Closed by: a unit test for each.
2. Given a first Guardian task with 3 steps, when its outcome is `clean`, then the next that day has `k + 2` steps, and never more than 4; given `partial` or `alt`, then it has `k` steps (REQ-1030). Closed by: a unit test for each outcome and for the cap.
3. Given no T node fluent or stable, or a session in cold start, when the first Guardian task of the day is planned, then it has 1 step (REQ-1032). Closed by: a unit test for each.
4. Given `k` of 0 and a non-clean outcome, when the next task is planned, then it has 1 step, because a task has at least one. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/guardian.ts` as a pure function from the states of T1 to T4, the day's earlier Guardian outcomes and the cold-start flag of TSK-0541 to a number of steps. The number is the requested step count the generator receives from the epic realising ADR-0040; the Guardian's word-problem forms (unanswerable, surplus) are ADR-0250's draw and sit beside this.

## Depends on

- TSK-0541 (not blocking): the cold-start flag; either task can land first with the flag as a constant `false`.
- The epic realising ADR-0060 supplies the states of T1 to T4, inferred states included.

## Evidence

Not yet.

## Left alone

The draw that makes a Guardian problem unanswerable or surplus, which ADR-0250's epic builds, and the generator's use of the step count, which the epic realising ADR-0040 owns.
