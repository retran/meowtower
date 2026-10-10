---
id: TSK-0536
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-0820, REQ-1004]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A stretch node is admitted only by tested results and gets at most 2 tasks in an adventure day

After this task, a stretch node joins the candidate set only when each of its prerequisites and each node of its `stretchGate` is «Бегло» or «Устойчиво» by a probe or a full block, and no stretch node takes more than 2 tasks in one adventure day across all sessions of that day.

## Acceptance criteria

1. Given a stretch node whose prerequisites and gate nodes are fluent by a full block, when the candidate set is built, then it holds the node; given one gate node "fluent (inferred)", or one prerequisite "understands", then it doesn't (REQ-0820). Closed by: a unit test for each case.
2. Given a stretch node admitted by a probe, when its gate node falls below "fluent", then the node leaves the candidate set and its earlier results stay in the log. Closed by: a unit test.
3. Given two sessions on one adventure day, when a stretch node has had 1 task in each, then no third is given that day (REQ-1004). Closed by: a unit test over two sessions.
4. Given a stretch node whose probe leaves its state open, when the adventure days follow, then the node takes both stretch tasks of each adventure day until its full block of 5 forms. Closed by: a unit test over three days.
5. Given the subtypes `G6.blocks` and `S3.missing`, when the candidate set is built, then they are admitted only when the ordinary subtypes of the same node are fluent or stable. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the gate to the candidate set of TSK-0534, reading `stretchGate` and prerequisites through `src/engine/graph.ts`. A tested result is a probe or a full block, and never an inferred state, because inference isn't a test. The cap counts tasks per adventure day and not per session, so a second session can't give two more.

ADR-0360 adds at most one open stretch block at a time, completed within 3 adventure days after its probe's day, and ADR-0250 turns the rule for `G6.blocks` and `S3.missing` into a `requires: { atLeast: fluent }` field on the subtype. Both belong to their epics; until the field exists, this task reads the two subtype ids from the graph's stretch subtypes.

## Depends on

- TSK-0534 (blocking): the candidate set the gate extends.
- The epic realising ADR-0050 supplies `stretchGate` and the stretch subtypes; the task runs on a fixture graph until then.

## Evidence

Not yet.

## Left alone

The block's completion deadline and the limit of one open block, which ADR-0360's epic adds, and the weekly limit on stable nodes in mental arithmetic, which TSK-0539 builds.
