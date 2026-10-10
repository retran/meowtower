---
id: TSK-0506
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0050
closes: [REQ-0816, REQ-0818]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Area and volume by formula sit at 1S, and the perimeter node M4 splits as the requirement says

After this task, every subtype of M4, M5 and M7 carries a `method`, the validator fails a formula subtype at 1F, and M4 holds one rectangle perimeter at 1F and three non-rectangle subtypes at 1S, so the graph never asks for a formula at the level that takes squares and sides.

## Acceptance criteria

1. Given the file, when the subtypes of M4, M5 and M7 are read, then each carries a `method`, `formula`, `squares` or `sides` on M4 and M5 and `formula` or `cubes` on M7, and no other node carries one (REQ-0816). Closed by: a unit test over all nodes.
2. Given a copy that sets a `formula` subtype of M5 to 1F, one that gives a 1F subtype of M7 the method `squares`, and one whose M4 subtype lacks a `method`, when each is validated, then each fails naming the subtype (REQ-0816). Closed by: three unit tests.
3. Given the file, when M4's subtypes are read, then `rect-squares` and `rect-sides` are 1F, and `not-rect`, `side-from-perimeter` and `same-area` are 1S, where `same-area` stands for one area with different perimeters (REQ-0818). Closed by: a unit test.
4. Given the parameter ranges of the 1F measurement templates, when the reviewing agent reads them, then each holds only rectangular figures with simple numbers (REQ-0816). Closed by: judgement of the reviewing agent, because the validator can't read a template's numbers and SPC-0050 assigns this limit to the review of each template's ranges.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the optional `method` field to the subtype schema, and rule 4 of SPC-0050's validator: it is present on every subtype of M4, M5 and M7 and absent elsewhere, a `formula` subtype is 1S, and a 1F subtype is `squares` or `sides` on M4 and M5 and `cubes` on M7. Rename or split the subtypes of M4, M5 and M7 that TSK-0504 wrote so they meet it, using the five ids of M4 above, which SPC-0050 chose because no record names them.

The reviewing agent's step belongs to the epic realising ADR-0040's templates, because the ranges live in templates; this task states the check and lists the 1F measurement subtypes it applies to.

## Depends on

- TSK-0504 (blocking): the M nodes and their subtypes.

## Evidence

Not yet.

## Left alone

The templates' parameter ranges, which the epic realising ADR-0040 writes and the reviewing agent reads.
