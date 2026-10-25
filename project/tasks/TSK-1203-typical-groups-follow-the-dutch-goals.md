---
id: TSK-1203
artifact: task
status: done
revised: 2026-10-25
realises: ADR-0530
closes: [REQ-0800]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph's typical groups follow the Dutch goals where the prerequisite order allows

After this task, `content/graph.yaml` holds the Dutch group for 24 nodes and keeps the earlier group for 13 nodes whose prerequisite links block the move (ADR-0530).

## Acceptance criteria

1. Given the changed graph, when `./meowtower graph check` runs, then it passes the schema, counts, fixture and SLO rules and lists no group-order failure. Closed by: the command's output.
2. Given the real graph file, when the group-order test of ADR-0470 reads it, then every prerequisite link is in order. Closed by: `tests/unit/graph-group-order.test.ts`.
3. Given the 24 nodes, when their groups are read, then each equals the Dutch group in ADR-0530. Closed by: the diff of `content/graph.yaml` against that table, read in review; no test pins the 24 values.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Set the 24 values in `content/graph.yaml` and state the source in SPC-0050.

## Depends on

Nothing.

## Evidence

Closed by the tests in tests/unit/graph-group-order.test.ts and the graph check, and by the stages of the repository run on this branch. Criterion 3 rests on reading the diff.

## Left alone

The review of the prerequisite links of the 13 held nodes.
