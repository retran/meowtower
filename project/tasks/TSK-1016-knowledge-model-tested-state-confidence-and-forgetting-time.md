---
id: TSK-1016
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-0912, REQ-0918, REQ-0926, REQ-0934, REQ-0956, REQ-0984, REQ-6402]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The knowledge model fixes which check sets a state, when forgetting is read, and what a partial answer does

After this task, the newest complete check sets a node's tested state, a recompute reads forgetting at the newest event's time, `confidence` has three stated bands, a school-group change passes no gate, and an attempt whose time measures nothing stays out of fluency.

## Acceptance criteria

1. Given two complete checks that both match a node, when its tested state is built, then the one whose last observation has the larger `seq` sets it and `stable` still reads the whole history; given a complete probe short of `probe-fast`, then the node is `open` until a full block forms (REQ-0934, REQ-0956). Closed by: two knowledge-model tests.
2. Given a recompute that no event triggers, the one at server start included, when forgetting is evaluated, then it uses the server time of the newest event in the log, and the same log gives the same projections at two different wall-clock hours (REQ-0912). Closed by: a test that recomputes under two fake clocks and compares bytes.
3. Given a full block 10 days old, a full block 20 days old, a probe 20 days old, an inferred state and a full block 40 days old, when `confidence` is read, then it is high, medium, medium, low and low, and a probe never gives high. Closed by: a table test over the five fixtures.
4. Given a change of the school-group setting, when it is applied, then no held-out gate runs, no `model_activated` is written, `settings_changed` is logged and a full recompute starts under the new model version (REQ-0984). Closed by: an integration test.
5. Given an attempt marked `interrupted`, one marked `crossDevice` and one on an item with an estimate, when fluency and accuracy are updated, then fluency ignores the three and accuracy counts them; given a partial answer, then it counts as half right and half wrong and leaves the half-life `H` as it was; and `node_obligations` holds the seven kinds ADR-0060 lists, one row at most for each node and kind (REQ-0918, REQ-0926, REQ-6402). Closed by: three unit tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `src/engine/projections/knowledge.ts`. The newest evidence is the best measure of what she knows now. Evaluating forgetting at the newest event's time is what ADR-0060 gives as its reason for using the event's time. A probe has 2 tasks against a block's 5, so it never gives high confidence. An attempt whose time counts in no measure has a `fast` of 0, which says nothing about her speed, and counting it as slow would lower fluency for time nobody measured. The gate tests a parameter file with all its prior rows when `./tower model activate` runs, and the school-group setting only picks one of those rows. ADR-0060's "six kinds" is a miscount, and its list holds seven.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The model's parameter file and its held-out gate, which ADR-0060 owns, and the Director's use of confidence, which ADR-0070 owns.
