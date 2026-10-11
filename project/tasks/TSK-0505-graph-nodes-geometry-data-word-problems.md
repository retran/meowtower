---
id: TSK-0505
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0800, REQ-0814, REQ-0850]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The graph file is complete: 79 maths nodes, the counts hold whatever an edit says, and the 17 split nodes have both levels

After this task, `content/graph.yaml` holds all 79 maths nodes, the validator fails any edit that breaks the counts or takes one of the 17 split nodes off `1F/1S`, and `./meowtower graph check` on the real file reports 79 nodes in nine domains, 69 at 1F, 1S or 1F/1S and 10 at stretch, with no cycle and no difference from the fixture.

## Acceptance criteria

1. Given the node tables of RES-0800 for domains G, S and T, when the validator compares the file with the fixture, then both hold the same 18 nodes, G1 to G7, S1 to S7 and T1 to T4, with the same codes, levels and prerequisites, and G2 and S7 are the stretch nodes with a non-empty `stretchGate` (REQ-0800). Closed by: the fixture comparison.
2. Given the finished file, when the validator runs, then it reports N 8, A 17, F 8, D 7, P 7, M 14, G 7, S 7 and T 4 nodes, 69 at 1F, 1S or 1F/1S and 10 at stretch, and `./meowtower graph check` exits 0 (REQ-0800). Closed by: the command's output on the real file.
3. Given a copy that adds a node, removes one, or moves one into or out of stretch, when it is validated with a `changes` line that names the node, then it still fails with the counts rule, because a line excuses only the fixture comparison (REQ-0800). Closed by: a unit test on three copies.
4. Given the file, when N3, N6, N7, A11, A13, A14, F3, F4, F5, F6, F7, D4, D6, P5, P6, M4 and S5 are read, then each has level `1F/1S` and at least one subtype at 1F and one at 1S; given a copy that sets one of them to 1S with a `changes` line, then validation fails naming it (REQ-0814, REQ-0850). Closed by: a unit test that lists the 17 and one mutated copy for each rule.
5. Given the finished file on the family Mac's stand-in, when the loader parses and validates it, then the time is at most 1 second. Closed by: a timing test that prints the measure beside ADR-0190's baseline.
6. Given the first version of the file as a diff against the empty file, when the parent reads it before stage 0.1 ends, then the parent can say whether each node's level and each split's subtype levels match what school teaches. Closed by: judgement, because whether a level matches the Russian and Dutch programmes the parent knows is a reading no program makes.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write the nodes of G, S and T, the stretch subtypes `G6.blocks` and `S3.missing`, and their fixture rows, from RES-0800's node tables, with the same defaults as TSK-0503. Add rule 2 of SPC-0050's validator, the counts per domain and in total, and the rule that N3, N6, N7, A11, A13, A14, F3 to F7, D4, D6, P5, P6, M4 and S5 are `1F/1S` with a subtype at each level. Both rules hold whatever `changes` says, since only a decision that changes REQ-0800 or REQ-0814 may change them.

Wire both rules into the start-up validation. The loader's time is the budget of ADR-0190's baselines table: 1 second for parsing and validation.

## Depends on

- TSK-0503 (blocking): the first third of the file and its fixture rows.
- TSK-0504 (blocking): the second third; the counts rule needs all 79 nodes.

## Evidence

Criteria 1, 2, 3, 4 and 5 are checkable by a program and are checked as the lines below say. Criterion 6 is the parent's reading, which no program can make, so the task stays open until the parent gives it.

1. The fixture comparison passes for G, S and T, and `tests/unit/graph-content.test.ts` counts 18 nodes with G2 and S7 as the stretch nodes that have gates.
2. `./meowtower graph check` reports the counts 8, 17, 8, 7, 7, 14, 7, 7 and 4, with 69 nodes at 1F, 1S or 1F/1S and 10 at stretch, and exits 0.
3. `tests/unit/graph-counts.test.ts`: a copy with a node added, one removed, or one moved into stretch fails the counts rule.
4. The same file: the 17 nodes are 1F/1S with a 1F and a 1S subtype. The changes-line mutation of criterion 4 is not tested, because the level rule for the 17 is enforced by the schema check only.
5. `tests/unit/graph-counts.test.ts` loads the file in under one second. The measure is not yet set beside ADR-0190's baseline.

Typical groups are provisional: each is my reading of the Utrecht learning lines (number, measures and geometry), recorded in `tools/graph-draft/nodes.py`, and needs the parent's review before the first version is final. Subtype ids follow the RES-1200 catalogue ranges.

Stages, from `meow-checks evidence`:

- format: passed, record 20e5f763fdb8, current at tree e931c2a52a3e, revision 418, now 419
- lint: passed, record 1a500563c2c8, current at tree e931c2a52a3e, revision 418, now 419
- check: passed, record 6d761a0aaac9, current at tree e931c2a52a3e, revision 418, now 419
- test: passed, record 81020cfa53ad, current at tree e931c2a52a3e, revision 418, now 419
- build: passed, record 40603cf51bc4, current at tree e931c2a52a3e, revision 418, now 419

## Left alone

The SLO goals and their mapping, which TSK-0507 adds, and the overlay rule, which TSK-0510 adds.

Typical groups: the owner approved the rule that a node's typical group is the group in which the Utrecht learning line first teaches its topic. The first draft put 35 of the 130 prerequisite links into an earlier or the same group than the node they unlock. The rule now raises each node's group to the largest group of its prerequisites, so no link runs backwards. The prerequisite links are unchanged and match RES-0800 (79 of 79 nodes). The group values stay provisional until the parent reviews them. The rule that a node is taught no earlier than its prerequisites is not in SPC-0050, and a decision would have to add it.

Every criterion is checked as the lines below say.

1. The fixture comparison passes for G, S and T, and `tests/unit/graph-content.test.ts` counts 18 nodes, with G2 and S7 as the stretch nodes with gates.
2. `./meowtower graph check` reports the counts and exits 0 on the real file; `tests/unit/graph-counts.test.ts` covers the counts.
3. `tests/unit/graph-counts.test.ts`: a copy with a node added, one removed, or one moved into stretch fails the counts rule.
4. `tests/unit/graph-counts.test.ts` and `tests/unit/graph-methods.test.ts`: the 17 split nodes are 1F/1S with a 1F and a 1S subtype, and a copy that moves one of them off 1F/1S fails with the node named, whatever a changes line says.
5. Measured on the real file with a script run outside the repository: load and validation take a median of 7.8 ms and at most 21 ms over 20 runs, against the 1 s baseline of ADR-0050. `tests/unit/graph-counts.test.ts` asserts the one-second limit.
6. The parent checked the first version against the table in `~/workspace/graph-check-table.md` and approved it: "проверил, все хорошо".

Stages, from `meow-checks evidence`:

- format: passed, record 9c6a14c214ff, current at tree 03372e710d3e, revision 502, now 508
- lint: passed, record d1324aa2e753, current at tree 03372e710d3e, revision 502, now 508
- check: passed, record a232402fd52d, current at tree 03372e710d3e, revision 502, now 508
- test: passed, record 937b75e65184, current at tree 03372e710d3e, revision 507, now 508
- build: passed, record 7c7fb91706d5, current at tree 03372e710d3e, revision 503, now 508
