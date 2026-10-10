---
id: TSK-0730
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-2922]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A new knowledge-model version scores no lower than the last one on any simulation metric

After this task, group 3 compares a new knowledge-model version's accuracy metrics with the latest file in `verify/model-metrics/` and fails, naming the metric, when any one is lower.

## Acceptance criteria

1. Given a latest file `verify/model-metrics/<version>.json` and a new version that scores lower on one metric, when group 3 runs, then it fails and names the metric and both values (REQ-2922). Closed by: an integration test with a lowered fixture metric.
2. Given a new version that scores equal or higher on every metric, when group 3 runs, then the check passes. Closed by: an integration test.
3. Given no file in `verify/model-metrics/`, when group 3 runs, then the check reports that no earlier version exists and passes only the first version. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `verify/model-metrics/` and the comparison. Each approved version's metrics file holds the metrics of TSK-0728's checks: the classification share on each profile, the convergence errors and the "knows" accuracy. The file of a version is committed with the decision record that approves the version. The check compares against the latest file, ordered by the version string, so an older file never raises the bar.

## Depends on

- TSK-0728 (blocking): the metrics are its checks' outputs.

## Evidence

Not yet.

## Left alone

The knowledge model's values and its versions, which ADR-0060 owns, and the refit after 4 to 6 weeks of play.
