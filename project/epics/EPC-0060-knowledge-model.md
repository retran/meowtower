---
id: EPC-0060
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0060
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The knowledge model is BKT with forgetting plus two beta estimates, with report states from explicit rules, versioned and recomputed from the event log

Realises exactly ADR-0060: the observations the model reads, the Bayesian knowledge tracing estimate "on her own" with its forgetting and its parameter validator, the priors by level and school group, the node aggregate and its uncertainty, the fluency and "with help" estimates, the review ladder, the full block and the probe, the rules that give each node its state, "stable", inference and cut-off, the obligations for the Director, the three moments the model runs, the snapshots and the held-out gate for a new parameter file. SPC-0060 states what the finished part does.

Until the epic realising ADR-0050 supplies the graph, the tasks run on a fixture graph with the same query module. Until the epic realising ADR-0180 owns the thresholds, they read the catalogue values of RES-1200 through one function. Until the epic realising ADR-0070 writes the rapid-guess mark and the fatigue weight, fixture logs carry both by hand. Each task names what it leaves to those epics.

## Acceptance criteria

1. Deleting `node_estimates` and the active-version rows of `node_snapshots` and running a full recompute gives tables whose hash equals the hash before the deletion. Evidence: the integration test's report, from TSK-0527.
2. The property test finds no parameter set that passes the validator and no catalogue template for which a right answer lowers `pKnow`, over at least 10,000 generated cases. Evidence: the property test's report, from TSK-0518.
3. A parameter file with `pGuess + pSlip >= 1` for one template fails to load, and the error names the template. Evidence: the unit test's report, from TSK-0518.
4. Fixture logs give "not mastered" at block scores 2 and 2,5 and "understands" at 3 and 3,5. At 4 they give "understands, needs speed" with slow right answers and "fluent" with fast ones, and "stable" comes only after two fluent checks 14 days apart with one of them a block. Evidence: the rule tests' reports, from TSK-0524 and TSK-0525.
5. A block with a lesson mark for its node between its third and fourth tasks isn't complete until five tasks follow the mark. Evidence: the unit test's report, from TSK-0523.
6. With no new evidence, a pair's `pKnow` after 60 days is half its value at the last observation when `H` is 60 days. Evidence: the unit test's report, from TSK-0517.
7. An assisted attempt changes the "with help" estimate and leaves `pKnow` and the fluency estimate of its node unchanged. Evidence: the unit test's report, from TSK-0521.
8. Three fresh observations halve `uncertainty` against the prior's entropy, and a node with none keeps its full entropy. Evidence: the unit test's report, from TSK-0520.
9. After five unassisted successes in a row the next review is 30 days after the last one, and after a failure it is 1 day after it. Evidence: the unit test's report, from TSK-0522.
10. Changing `RULES_VERSION` makes the next server start run a full recompute, and the count of earlier-version rows in `node_snapshots` is the same before and after it. Evidence: the integration test's report, from TSK-0527 and TSK-0528.
11. Changing the school-group setting in the Parent Room writes a new model version and a full recompute, no date or clock change alters the priors, and no tracked file holds the group. Evidence: the integration test's report and the static check's output, from TSK-0519.
12. The full recompute over a synthetic log of 365 play days finishes within 10 s on the family Mac, and the per-node update within 50 ms at the 95th percentile. Evidence: the timing test's output, from TSK-0527.
13. `./meowtower model activate` refuses a candidate that is worse on held-out log-loss or calibration and accepts one that is better on both. Evidence: the command's output on two fixtures, from TSK-0529.
14. Every requirement ADR-0060 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure three things before it is finished: the time of the full recompute over 365 play days against the 10-second budget, the time of the per-node update at the 95th percentile against 50 ms, and the share of fixture nodes the rule engine leaves "being clarified" over the 30-day synthetic log, all from TSK-0527. ADR-0060's first reversal condition, that a per-node beta estimate predicts held-out days as well as BKT, can only be tested on real play after the refit.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0516 The model reads only graded unassisted first attempts as observations, each with a score and a weight
      closes: REQ-0914, REQ-0916, REQ-0918, REQ-0930
      depends: none
- [ ] T-002 TSK-0517 Each pair of node and subtype keeps its own "on her own" estimate, which falls with time and rises after a walkthrough
      closes: REQ-0908, REQ-0912, REQ-0920
      depends: TSK-0516 (blocking) - the observations with their scores and weights.
- [ ] T-003 [P] TSK-0518 A parameter file that could let a right answer lower the estimate never loads
      closes: REQ-0986
      depends: TSK-0517 (blocking) - the update whose bounds the validator guards.
- [ ] T-004 [P] TSK-0519 Starting estimates follow the subtype's level and the school group the parent set, and change only through a new model version
      closes: REQ-0982, REQ-0984, REQ-3712
      depends: TSK-0517 (blocking) - the parameter file and the update that reads `pInit`.
- [ ] T-005 TSK-0520 A node's estimate is the weighted mean of its subtypes', carries an uncertainty, and exists for every node up to group 8
      closes: REQ-0910, REQ-0988, REQ-0994
      depends: TSK-0517 (blocking) - the pair estimates the aggregate reads.; TSK-0519 (blocking) - the prior of each pair.
- [ ] T-006 [P] TSK-0521 Assisted attempts feed a "with help" estimate, and speed feeds a fluency estimate, and neither touches the "on her own" estimate
      closes: REQ-0922, REQ-0924, REQ-0926, REQ-0928
      depends: TSK-0516 (blocking) - the observations with their scores, weights and time flags.
- [ ] T-007 [P] TSK-0522 After an unassisted failure a node's next review falls one day later, and the row carries its last-seen date, staleness and confidence
      closes: REQ-0992
      depends: TSK-0520 (blocking) - the row the fields sit on.
- [ ] T-008 [P] TSK-0523 A full block and a probe are defined from the node's graded attempts, never spanning a lesson mark and never holding a control fact
      closes: REQ-0932, REQ-0950, REQ-0952, REQ-0954
      depends: TSK-0516 (blocking) - the observations a block is made of.
- [ ] T-009 TSK-0524 Each node's state follows from a named rule over its listed attempts, never from a probability
      closes: REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0946
      depends: TSK-0523 (blocking) - the block and probe definitions.; TSK-0521 (blocking) - the fluency threshold and `fast`.
- [ ] T-010 TSK-0525 A node becomes "stable" only after "fluent" in two checks at least 14 days apart, one of them a full block
      closes: REQ-0944
      depends: TSK-0524 (blocking) - the rule table and the golden test this rule joins.
- [ ] T-011 TSK-0526 Inferred and cut-off states sit beside the tested state, never add to it, and a cut-off node is no gap
      closes: REQ-0960, REQ-0962, REQ-0964, REQ-0968, REQ-0976
      depends: TSK-0524 (blocking) - the tested states inference follows.; TSK-0522 (blocking) - `stale` and `nextReview`, which two obligation kinds read.
- [ ] T-012 TSK-0527 The model runs after each graded attempt, recomputes everything at the end of an adventure and recomputes again when a version changes
      closes: REQ-0900, REQ-0902
      depends: TSK-0526 (blocking) - the full set of rows the run writes.; TSK-0521 (blocking) - the beta estimates that are part of every row.; TSK-0525 (blocking) - the last state rule the golden test covers.
- [ ] T-013 TSK-0528 One snapshot is saved for each game day of play, and a version change keeps the earlier versions' snapshots
      closes: REQ-0904, REQ-0906
      depends: TSK-0527 (blocking) - the recompute whose output the snapshot records.
- [ ] T-014 [P] TSK-0529 A new parameter file replaces the active one only when it predicts held-out attempts better on both log-loss and calibration
      closes: REQ-0984
      depends: TSK-0527 (blocking) - the recompute the tool replays with a candidate.; TSK-0518 (blocking) - the validator a candidate passes first.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0516.
- After TSK-0516: TSK-0517, TSK-0521 and TSK-0523.
- After TSK-0517: TSK-0518 and TSK-0519.
- After TSK-0517 and TSK-0519: TSK-0520, then TSK-0522.
- After TSK-0521 and TSK-0523: TSK-0524, then TSK-0525 and TSK-0526.
- After TSK-0526, TSK-0521 and TSK-0525: TSK-0527, then TSK-0528.
- After TSK-0527 and TSK-0518: TSK-0529.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0516 | REQ-0914, REQ-0916, REQ-0918, REQ-0930 |
| TSK-0517 | REQ-0908, REQ-0912, REQ-0920 |
| TSK-0518 | REQ-0986 |
| TSK-0519 | REQ-0982, REQ-0984, REQ-3712 |
| TSK-0520 | REQ-0910, REQ-0988, REQ-0994 |
| TSK-0521 | REQ-0922, REQ-0924, REQ-0926, REQ-0928 |
| TSK-0522 | REQ-0992 |
| TSK-0523 | REQ-0932, REQ-0950, REQ-0952, REQ-0954 |
| TSK-0524 | REQ-0934, REQ-0936, REQ-0938, REQ-0940, REQ-0942, REQ-0946 |
| TSK-0525 | REQ-0944 |
| TSK-0526 | REQ-0960, REQ-0962, REQ-0964, REQ-0968, REQ-0976 |
| TSK-0527 | REQ-0900, REQ-0902 |
| TSK-0528 | REQ-0904, REQ-0906 |
| TSK-0529 | REQ-0984 |

The smallest set of tasks that would test the decision is TSK-0517, TSK-0524, TSK-0527 and TSK-0528. Together they show whether the estimate forgets as a half-life says, whether a state follows from a named rule over counted attempts, whether the per-node shortcut and the full recompute agree, and whether earlier versions' snapshots survive a version change, which are the failures the decision's premortem names.

## Not covered

- How the Director uses the estimates and obligations, which are escalation to a block (REQ-0956), the probes of the descendants of an "understands" node (REQ-0970), island checks (REQ-0972, REQ-0974) and the exclusion of cut-off nodes (REQ-0966): ADR-0070's epic. TSK-0526 writes the obligation rows they read.
- The rapid-guess mark and the fatigue weight on each attempt: ADR-0070's epic. TSK-0516 reads both from the log.
- How the report draws states, coverage, trends and the evidence behind a state, and how the parent marks lessons and excludes tasks: ADR-0180's epic. The fluency thresholds, their versions per device type and the motor correction are its too.
- The streams of new forms, the `estimate` stream, the shares by depth of help, the retention check and the transfer holds, which later decisions added to SPC-0060: the epics realising ADR-0210, ADR-0220, ADR-0240, ADR-0250, ADR-0400 and ADR-0410.
- REQ-7506, the held-out gate, which supersedes REQ-0980 and which ADR-0460 addresses: the epic realising ADR-0460 closes it. TSK-0529 builds the command and the replay it runs on and closes REQ-0984 through it, since a prior row of another group reaches the estimates only that way.
- REQ-0990, which ADR-0060 no longer addresses because REQ-6842 supersedes it: the ladder after a retention check belongs to ADR-0400's epic, and TSK-0522 builds the ladder before it.
- The refit of the parameters, `tools/fit-model.ts`, which the draft defers until after the MVP, and the Ascent anchor forms that would count as checks for "stable".
- The simulation's classification accuracy on synthetic profiles (REQ-2908, REQ-2910, REQ-2922): ADR-0190's epic.
