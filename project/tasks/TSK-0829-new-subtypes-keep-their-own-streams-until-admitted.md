---
id: TSK-0829
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5028, REQ-5424, REQ-5450, REQ-5452]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Surplus and unanswerable subtypes write streams of their own and move no estimate until a model version admits them

After this task, observations of `T1.surplus` to `T3.surplus` write the stream `surplus`, those of `T1.insufficient` to `T4.insufficient` write the stream `missing`, the estimator ignores a `form: new` subtype until its stream is in the active model version's `admittedForms`, and the knowledge model scores the three new verdicts 1, 0.5 and 0.

## Acceptance criteria

1. Given observations of the new subtypes, when the knowledge model runs on a log with the active model version's `admittedForms` empty, then no T node estimate, no "on her own" estimate and no node state changes against the same log without them (REQ-5028, REQ-5452). Closed by: the model test's report.
2. Given a model version that admits `surplus` and `missing`, when the estimator runs, then the new subtypes' weight 0.1 counts, the ordinary subtypes' weights are scaled by 1 minus the admitted new weights, and the node's weights sum to 1 (REQ-5450). Closed by: the model test's report.
3. Given the graph file, when a model version is activated, then the graph file is unchanged and no new graph version is needed. Closed by: a test that compares the file's hash before and after the activation.
4. Given the verdicts `insufficient_correct`, `insufficient_partial` and `false_insufficient`, when the model scores them, then the scores are 1, 0.5 and 0 (REQ-5424). Closed by: a unit test.
5. Given ordinary T4 with its unused number, when a log is projected, then it writes neither stream, and a node's state rules read only ordinary subtypes' observations. Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Read `form: new` from the graph (TSK-0820) in the estimator and the projection that routes an observation to its stream, under the rule for new forms that ADR-0210 owns. Add the three scores. The pGuess of 0.06 for the unanswerable subtypes comes from ADR-0250's arithmetic, and the bounds of ADR-0060 hold with it.

During the MVP no model version admits these streams, because ADR-0060's held-out comparison passes after it. This task builds the rule and not the activation.

## Depends on

- TSK-0820 (blocking): `form: new` and `weight` come from the graph file.
- TSK-0821 (not blocking): the verdict names exist as strings in this task's tests, and a fixture log can carry them before the checker writes them.

The epics realising ADR-0060 and ADR-0210 supply the estimator, the admission rule and the stream registry. This task extends them for these subtypes.

## Evidence

Not yet.

## Left alone

The activation rule and the refit tool, which ADR-0060 and ADR-0210 leave until after the MVP.
