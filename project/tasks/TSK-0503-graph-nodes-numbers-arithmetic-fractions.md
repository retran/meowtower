---
id: TSK-0503
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0800]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph file holds the nodes of numbers, arithmetic and fractions with their subtypes, and the five science topics

After this task, `content/graph.yaml` holds the 33 maths nodes of domains N, A and F as RES-0800 lists them, each with its level, typical group, prerequisites and subtypes, and the topics E1 to E5, so the first third of the graph loads, validates and answers the query module.

## Acceptance criteria

1. Given the node tables of RES-0800 for domains N, A and F, when the validator compares the file with `tests/fixtures/res-0800.yaml`, then both hold the same 33 nodes, N1 to N8, A1 to A16 with A6a, and F1 to F8, with the same codes, levels and prerequisites, and the stretch nodes N8, A12, A15 and A16 each have a non-empty `stretchGate` (REQ-0800). Closed by: the fixture comparison and a unit test that counts the nodes and the stretch nodes of each domain.
2. Given any of these nodes, when its subtypes are read, then every subtype has its own level, a positive weight and `slo` ids that may be empty until TSK-0507, the weights of the node's subtypes sum to 1 and are equal, and a node at `1F/1S` has a subtype at each level, as for N3, N6, N7, A11, A13, A14 and F3 to F7. Closed by: a unit test over the 33 nodes.
3. Given the subtype prerequisites RES-0800 names in these domains, `F3.same_den` and `F3.line`, when `prereqs("F3")` is read, then each tagged link carries its subtype tag and each untagged link carries none. Closed by: a unit test on the two nodes.
4. Given the five topics, when the file is loaded, then E1 to E5 each have an id and a name and none has a prerequisite field. Closed by: a unit test on `topics()`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the nodes, the topics and the matching rows of `tests/fixtures/res-0800.yaml` from RES-0800's node tables and its finding that 17 nodes move to `1F/1S`. Name each node's subtypes from the template catalogue of RES-1200 and split the 11 `1F/1S` nodes of these domains into 1F and 1S subtypes by the SLO table in RES-0800.

RES-0800 left three things open, and ADR-0050 chose these defaults, which this task applies: weights are equal across a node's subtypes, `typicalGroup` comes from the Utrecht learning line and the SLO concretisation, and `ruOnly` stays false unless the SLO check finds no Dutch goal for a subtype. The parent reviews the first version as a diff, as TSK-0505 states.

## Depends on

- TSK-0501 (blocking): the validator that checks the nodes as they are written.
- TSK-0502 (blocking): the fixture and its comparison, which this task fills with rows.

## Evidence

Not yet.

## Left alone

The nodes of the other six domains, which TSK-0504 and TSK-0505 write in the same file, the SLO goals, which TSK-0507 maps, and the measurement `method` field, which TSK-0506 adds to M4, M5 and M7.
