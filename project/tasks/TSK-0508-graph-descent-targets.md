---
id: TSK-0508
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0810]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A failed subtype descends only to its own prerequisite

After this task, `descentTargets(node, subtype)` returns the prerequisites tagged with that subtype when any exist and the node's untagged prerequisites otherwise, so a failed `M1.decimal` descends to D3 alone and a failed `M5.grid` to A3 alone.

## Acceptance criteria

1. Given the finished graph, when `descentTargets("M1", "decimal")` is called, then it returns D3 and not N3, and `descentTargets("M5", "grid")` returns A3 and not another prerequisite of M5 (REQ-0810). Closed by: a unit test on the real file.
2. Given a node with prerequisites tagged for one subtype and untagged ones, when `descentTargets` is called for a subtype with no tag, then it returns the untagged prerequisites, and for a subtype with a tag it returns the tagged ones only (REQ-0810). Closed by: a unit test on the small fixture graph.
3. Given a node with no prerequisites, when `descentTargets` is called, then it returns an empty list. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `descentTargets` to `src/engine/graph.ts` as a pure query over the loaded graph. The Director and the knowledge model must read prerequisites through this module; lint already bars any other module from reading the file (TSK-0501).

## Depends on

- TSK-0504 (blocking): M1, M5, D3 and A3 with the subtype tags exist in the file.

## Evidence

Not yet.

## Left alone

What the Director does with the descent in play, which the epic realising ADR-0070 builds, and the inference rules of the model that read a subtype's own prerequisite, which the epic realising ADR-0060 builds.
