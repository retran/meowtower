---
id: TSK-0510
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-3812]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A curriculum overlay adds nodes and links and never changes the base graph

After this task, the loader reads every `content/graph.<curriculum>.yaml` beside the base file, the validator fails an overlay that reuses a base id or changes a base field, and the overlay's content joins the base hash in `graphVersion`, so a later Dutch layer can be switched on without a rule of its own.

## Acceptance criteria

1. Given an overlay that adds a node, with its subtypes and a prerequisite on a base node, when the loader reads base and overlay, then the node appears in `nodes()` after the base nodes and the base nodes' weights, prerequisites and descent targets are unchanged (REQ-3812). Closed by: a unit test on the small fixture graph.
2. Given an overlay that reuses a base node id, one that adds a subtype or a prerequisite to a base node, and one that changes a base node's level, when each is validated, then each fails naming the overlay entry (REQ-3812). Closed by: three unit tests.
3. Given the base file and the same file with an overlay present, when `graphVersion()` is read, then the two differ, and removing the overlay returns the base version. Closed by: a unit test.
4. Given an overlay node whose prerequisites form a cycle with a base node, when the validator runs, then rule 1 fails, and given an overlay that adds a node, then the counts of rule 2 and the comparison of rule 3 still read the base file alone. Closed by: two unit tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend the loader to read the base file and each overlay file by file name order, and the validator to apply SPC-0050's rule 7. The first version of the game ships no overlay and the overlay's content, the `nl` curriculum layer, waits until after the MVP (RES-2550); this task builds only the rule every overlay must pass, tested on a fixture overlay. The loader hands every rule the base and overlay graph together, except rules 2 and 3, which read the base file alone, so the measurement and SLO rules of TSK-0506 and TSK-0507 cover an overlay without a change here.

## Depends on

- TSK-0500 (blocking): the loader and version hash.
- TSK-0501 (blocking): the validator whose rules the overlay shares.

## Evidence

Not yet.

## Left alone

The content of `graph.nl.yaml` and the Dutch curriculum layer, which RES-2550 defers until after the MVP.
