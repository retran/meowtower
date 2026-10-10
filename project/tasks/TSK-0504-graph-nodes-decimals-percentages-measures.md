---
id: TSK-0504
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0800]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph file holds the nodes of decimals, percentages and measures with their subtypes

After this task, `content/graph.yaml` holds the 28 maths nodes of domains D, P and M as RES-0800 lists them, each with its level, typical group, prerequisites and subtypes, so two thirds of the graph load and the subtype-tagged prerequisites of M1, M3, M5 and P1 exist for the descent task.

## Acceptance criteria

1. Given the node tables of RES-0800 for domains D, P and M, when the validator compares the file with `tests/fixtures/res-0800.yaml`, then both hold the same 28 nodes, D1 to D7, P1 to P7 and M1 to M14, with the same codes, levels and prerequisites, and the stretch nodes D7, P7, M11 and M14 each have a non-empty `stretchGate` (REQ-0800). Closed by: the fixture comparison and a unit test that counts the nodes and the stretch nodes of each domain.
2. Given any of these nodes, when its subtypes are read, then every subtype has its own level and a positive weight, the weights of a node's subtypes sum to 1 and are equal, and a node at `1F/1S`, which is D4, D6, P5, P6 or M4 here, has a subtype at each level. Closed by: a unit test over the 28 nodes.
3. Given the subtype prerequisites RES-0800 names in these domains, `M1.whole` and `M1.decimal`, `M3.whole` and `M3.cents`, `M5.grid` and `M5.formula`, and `P1.half_tenth` and `P1.decimal`, when `prereqs` of each node is read, then each tagged link carries its subtype tag, and `M1.decimal` points to D3 and `M5.grid` to A3. Closed by: a unit test on the four nodes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the nodes and the matching rows of `tests/fixtures/res-0800.yaml` from RES-0800's node tables, with the defaults ADR-0050 chose and TSK-0503 applies: equal weights across a node's subtypes, `typicalGroup` from the Utrecht learning line and the SLO concretisation, and `ruOnly` false unless the SLO check finds no Dutch goal. Name the subtypes from the catalogue of RES-1200 and split D4, D6, P5, P6 and M4 by the SLO table.

M4, M5 and M7 hold their measurement subtypes with the `method` field in TSK-0506; here they carry the subtype names and levels RES-1200 gives and no `method`.

## Depends on

- TSK-0503 (not blocking): both tasks edit `content/graph.yaml` and the fixture, so merging in order avoids a conflict; this task can be written against the file as it stands.
- TSK-0501 (blocking): the validator.
- TSK-0502 (blocking): the fixture comparison.

## Evidence

Not yet.

## Left alone

Domains N, A and F, which TSK-0503 writes, domains G, S and T, which TSK-0505 writes, and the `method` field, which TSK-0506 adds.
