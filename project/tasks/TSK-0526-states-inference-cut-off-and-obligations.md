---
id: TSK-0526
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0960, REQ-0962, REQ-0964, REQ-0968, REQ-0976]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Inferred and cut-off states sit beside the tested state, never add to it, and a cut-off node is no gap

After this task, the rule engine applies the inference rules after the tested states, keeps `inferredState` and `testedState` in separate fields, marks a cut-off node with `cutBy` and `isGap = false`, and writes `node_obligations` as a set keyed by node and kind for the Director to read.

## Acceptance criteria

1. Given a node tested "fluent" by a full block, when its ancestors are read, then each ancestor not tested for 30 days is "fluent (inferred)", and for a subtype with a prerequisite of its own only that prerequisite is; given a choice-only probe, then no ancestor gets it (REQ-0960, REQ-0962). Closed by: a unit test for each.
2. Given a full block that gives "not mastered" on node X, when its descendants are read, then each is "not tested, cut off by node X" with `cutBy` = X and `isGap = false` (REQ-0964). Closed by: a unit test.
3. Given a cut-off node and a tested "not mastered" node, when the gap count is read, then the count is 1 and holds only the tested node (REQ-0968). Closed by: a unit test.
4. Given a node with `testedState` "understands" and one ancestor inferred "fluent (inferred)", when `pKnow`, the beta estimates, `nEff`, the count of tested nodes and a coverage share are read, then the inferred state is in none of them, and a consumer needs two fields to add them (REQ-0976). Closed by: a unit test that varies `inferredState` and compares the others.
5. Given a node in "understands", when `node_obligations` is read, then it holds one probe obligation for each direct descendant; given a failed island check, then it holds the node and its prerequisites; given a probe of 0 out of 2, an open escalation, a stale node and a due review, then each has its row, and no node and kind appears twice. Closed by: a unit test for each kind.
6. Given the 79-node graph and any generated log, when `node_obligations` is read, then it holds at most 7 rows for each node, one for each kind. Closed by: a property test over generated logs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the inference rules 1 to 5 of ADR-0060 to `src/engine/states/` and the `node_obligations` projection, written on each run. Rule 6, the exclusion, is TSK-0516's.

The obligation kinds are seven, as ADR-0370 corrected ADR-0060's "six": open escalations, blocks owed after a probe scoring 0 out of 2, probes owed to the direct descendants of an "understands" node, nodes queued after a failed island check, cut-off nodes with their `cutBy`, stale nodes and due reviews. The block owed after a retention series is an escalation row that ADR-0400's epic writes after the MVP.

The descent through a subtype's own prerequisite reads `descentTargets` from the graph's query module.

## Depends on

- TSK-0524 (blocking): the tested states inference follows.
- TSK-0522 (blocking): `stale` and `nextReview`, which two obligation kinds read.
- The epic realising ADR-0050 supplies the graph's prerequisites and `descentTargets`; the task runs on a fixture graph until then.

## Evidence

Not yet.

## Left alone

What the Director does with each obligation row, which the epic realising ADR-0070 builds, and the island checks that produce a failed result, which the same epic places.
