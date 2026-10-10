---
id: TSK-0854
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5624, REQ-5626, REQ-5628, REQ-5630, REQ-5632, REQ-5634, REQ-5672]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server grades a plan into one of five labels, and the exact-permutation rule of `order` answers stays as it is

After this task, `gradePlan(plan, laid)` returns `used_distractor`, `missing_step`, `extra_step`, `wrong_order` or `correct`, taking the first fault in that order, and `PlanSpec` is a spec of its own that the checker's `order` kind never grades.

## Acceptance criteria

1. Given every ordered subset of every generated plan's cards for 1,000 seeds, when the brute-force test grades them, then exactly one card set is `correct`, both orders of every fork are `correct`, and each label matches an independent reference grader's fault list and the precedence (REQ-5632). Closed by: the brute-force test's report.
2. Given a plan with a `trap` or `surplus` decoy laid, a needed card missing, a `stated` decoy laid or a card before a card whose quantity it needs, when it is graded, then the labels are `used_distractor`, `missing_step`, `extra_step` and `wrong_order` (REQ-5624, REQ-5626, REQ-5628, REQ-5630). Closed by: four fixtures.
3. Given a plan with several faults, when it is graded, then the label is the first that applies in the order `used_distractor`, `missing_step`, `extra_step`, `wrong_order`, and `faults` lists every fault that applied (REQ-5634). Closed by: a fixture with all four faults.
4. Given the question card laid before a card it needs, when it is graded, then the label is `wrong_order`. Closed by: a fixture.
5. Given an `order` answer, when the checker grades it, then the exact-permutation rule of REQ-0772 still holds, and `gradePlan` is the only grader of a plan (REQ-5672). Closed by: the checker's existing `order` fixtures and a test that finds no import of `gradePlan` in the checker.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `gradePlan` to `src/templates/plan.ts` as a pure function on the server and `PlanSpec` beside the answer specs. Compute every fault, then choose the label by order. A card stands "wrong order" when a laid needed card stands before a laid needed card whose quantity it needs, directly or through other steps, with decoys ignored.

I chose a separate spec over the addendum's wording `AnswerSpec.order` with a partial choice, as ADR-0270 does, because the `order` kind returns credit 1, 0.5 or 0 and the plan returns a label and no credit.

## Depends on

- TSK-0852 (blocking): the function reads that task's plan, kinds and dependencies.

The epic realising ADR-0040 supplies the checker and REQ-0772's `order` kind.

## Evidence

Not yet.

## Left alone

The label's use in the log and the report, which TSK-0856 and TSK-0860 build.
