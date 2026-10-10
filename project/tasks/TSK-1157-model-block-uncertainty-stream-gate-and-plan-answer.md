---
id: TSK-1157
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-0950, REQ-0988, REQ-5318, REQ-7506, REQ-5646, REQ-7508]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The model's block, uncertainty, number-sense stream and parameter gate follow the settled rules, and a submitted plan logs its choice

After this task, the full block is defined by the graph file's weights, a row's uncertainty describes its own estimate, the number-sense stream learns with the "on her own" rates, a parameter file replaces the active one only through a held-out gate, and the answer after a plan counts as any other answer and logs its `planChoice`. This settles entries 10 to 14, 45 and 46 of ADR-0460.

## Acceptance criteria

1. Given a subtype whose weight in the graph file is 0.2 and a new form admitted so that the subtype would scale to 0.18, when the full block is built, then the block still covers that subtype, and it holds the node's last 5 graded tasks within 7 days (REQ-0950). Closed by: a unit test over the admission.
2. Given a subtype row and a node row, when `nEff` is computed, then the subtype row sums that subtype's observations alone with that pair's half-life and the node row sums the node's, the uncertainty falls as fresh observations accumulate and stays high while there are none (REQ-0988). Closed by: a unit test over rows with 0, 5 and 40 observations.
3. Given the `estimate` stream, when it is updated, then it uses the "on her own" estimate's `pLearnFeedback` and `pLearnPractice` and runs all four steps, and the parameter validator covers the stream with the values it already checks (REQ-5318). Closed by: a unit test and the validator's report.
4. Given a new parameter file, when it is offered, then it replaces the active one only when it predicts the next unassisted first attempt on held-out days better by log-loss and by calibration; given a change of school group, then another prior row of the same file is picked and no gate runs (REQ-7506). Closed by: two unit tests over a better file, a worse file and a group change.
5. Given a problem that opened with a plan, when she submits the plan and answers, then the time of the answer runs from `plan_submitted` less `checkMs`, enters the fluency estimate as any other time does, and the attempt logs `planChoice` as one of `correct`, `extra_step`, `missing_step`, `wrong_order` and `used_distractor`; given «Нельзя узнать» before she submits, then no `planChoice` is logged (REQ-5646, REQ-7508). Closed by: an integration test over both cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 10 to 14 as written. In addition, the verify report names a template for `plan_unavailable` again only when its 30-day share is higher than the share at that template's last report. The held-out gate's comparison is the one ADR-0370 entry 15 settled. The gate itself is `./meowtower model activate` and `tools/eval-model.ts`, which the epic realising ADR-0060 builds in its parameter-gate task; this task changes only the comparison that tool applies and proves it with that tool's fixtures.

## Depends on

Nothing. The epics realising ADR-0060 and ADR-0270 own the model and the plan phase; this task runs on their fixtures.

## Evidence

Not yet.

## Left alone

The graph file's weights, which ADR-0050 owns, and the plan screen, which ADR-0270 builds.
