---
id: TSK-0483
artifact: task
status: draft
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0760, REQ-0762, REQ-0766, REQ-0768, REQ-0770, REQ-0772]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The checker accepts time, point, choice, grid and order answers exactly

After this task, `src/shared/answer.ts` also holds the structured kinds: clock time, digital time, point, single choice and sign, grid cells and order, and each accepts exactly what the requirements name.

## Acceptance criteria

1. Given an analogue clock showing a quarter past three, when the entry is `3:15`, `03:15` or `15:15`, then it is accepted; given a digital time 9:05, when the entry is `9:05` or `09:05`, then it is accepted (REQ-0760, REQ-0762). Closed by: one fixture each.
2. Given the point (3; 5), when the entry is `(3; 5)`, then it is accepted, and `(5; 3)` is classified as the swapped-coordinates trap (REQ-0766). Closed by: one fixture each.
3. Given a choice task or a sign comparison, when two options or two signs are marked, then the entry is `unparsed`, and exactly one option or sign is the answer (REQ-0768). Closed by: one fixture each.
4. Given a grid task, when the marked cells are exactly the correct set, then it is accepted, and one cell more or fewer is wrong; given an order task, when the entry is exactly the correct permutation, then it is accepted and any other order is wrong (REQ-0770, REQ-0772). Closed by: one fixture each.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the kinds beside the number kinds of TSK-0482 and extend its acceptance test. A point is accepted only as a grid node, as ADR-0040 states.

## Depends on

- TSK-0482 (blocking): it builds the module and the result type these kinds share.

## Evidence

Not yet.

## Left alone

Drawing the clock, the grid and the order cards, which ADR-0150 and TSK-0490 own.
