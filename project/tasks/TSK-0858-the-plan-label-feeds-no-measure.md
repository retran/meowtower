---
id: TSK-0858
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5644, REQ-5646]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The answer after a plan counts as the answer after no phase, and the label feeds no credit, outcome or estimate

After this task, the same answers through a plan problem and a no-phase problem give equal credit, outcome, success share, holding-steps value and estimate for every label, and the label and `plan_submitted` form a stream `plan` that stays out of the "on her own" estimate.

## Acceptance criteria

1. Given the same answer sequence through a plan problem and a no-phase problem, when the measures are computed, then credit, outcome, success share, holding-steps value and estimate are equal for each of the five labels (REQ-5644, REQ-5646). Closed by: the measurement test's report.
2. Given a log with plan problems, when the knowledge model runs, then the stream `plan` moves no "on her own" estimate under ADR-0210's rule for new forms. Closed by: a model test.
3. Given an attempt after a plan, when its event is read, then `openingPhase` is `plan` and the label is on `plan_submitted` alone, per ADR-0360. Closed by: a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the credit, outcome and estimate readers ignore the plan fields, and register the stream `plan` under the rule for new forms. `openingPhase` stays on every attempt so an offline refit can test whether answers after a plan are more often right than answers after no phase.

## Depends on

- TSK-0856 (blocking): the test reads `plan_submitted`.
- TSK-0854 (not blocking): the labels exist as values in this task's fixtures.

The epics realising ADR-0060 and ADR-0210 supply the estimator and the rule for new forms.

## Evidence

Not yet.

## Left alone

The label's appearance in the report, which TSK-0860 builds; per ADR-0390 the profile's model-building bar may read it later, which that decision's epic settles.
