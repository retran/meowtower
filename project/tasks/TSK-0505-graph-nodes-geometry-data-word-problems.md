---
id: TSK-0505
artifact: task
status: approved
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

Not yet.

## Left alone

The SLO goals and their mapping, which TSK-0507 adds, and the overlay rule, which TSK-0510 adds.
