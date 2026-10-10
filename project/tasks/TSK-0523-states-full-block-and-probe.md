---
id: TSK-0523
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0932, REQ-0950, REQ-0952, REQ-0954]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A full block and a probe are defined from the node's graded attempts, never spanning a lesson mark and never holding a control fact

After this task, `src/engine/states/` holds the two definitions every state rule reads: a full block is the node's last 5 graded observations within 7 days covering every subtype of weight 0,2 or more, and a probe is 2 observations of different subtypes or, for a choice-only node, 3 choice observations of at least 4 options.

## Acceptance criteria

1. Given 5 graded observations on one node within 7 days that cover every subtype of weight 0,2 or more, when blocks are read, then a full block exists; given the same 5 with one subtype of weight 0,3 uncovered, or one observation 8 days old, then no block exists (REQ-0950). Closed by: a unit test for each case.
2. Given a `parent_tag_added` event for the node between the third and fourth of 5 observations, when blocks are read, then no block forms across it, and the block completes only after 5 graded observations follow the mark; given a `parent_tag_removed` for that mark, then the recompute reads the mark as never set (REQ-0952). Closed by: a unit test.
3. Given a control fact among a node's last 5 observations, when blocks and probes are read, then the control fact is in neither (REQ-0932). Closed by: a unit test.
4. Given two observations with `purpose: probe` on different subtypes, then a probe exists; given two on the same subtype, then none; given a node the graph tests only by choice tasks, 3 choice observations of 4 options each form a probe and 3 of 3 options don't (REQ-0954). Closed by: a unit test for each case.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/states/checks.ts` with the two definitions as pure functions over the observations of TSK-0516 and the subtype weights from the graph's query module. A block counts unassisted graded first attempts only. The weight threshold of 0,2 reads the weights in the graph before any scaling for admitted forms, as SPC-0060 states.

The fatigue guard on blocks (REQ-1110) and the escalation of a probe that falls short belong to the epic realising ADR-0070; this task defines the checks, and TSK-0524 turns them into states.

## Depends on

- TSK-0516 (blocking): the observations a block is made of.
- The epic realising ADR-0050 supplies the graph's subtype weights; the task runs on a fixture graph until then.

## Evidence

Not yet.

## Left alone

The state a block or probe gives, which TSK-0524 writes, and the lesson mark's creation in the Parent Room, which ADR-0180's epic builds.
