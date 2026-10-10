---
id: TSK-0823
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5408, REQ-5410, REQ-5466]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An unanswerable problem is a complete problem with one given withheld, so its steps, hints and step count come from the complete graph

After this task, an unanswerable template extends an ordinary template of the same node and structure, the generator withholds one leaf given drawn from the stream `hash(baseSeed, "withhold")`, and the problem keeps the complete problem's model choice, step fields, three hint rungs, plan cards and step count.

## Acceptance criteria

1. Given 10,000 seeds of every unanswerable template, when the template test runs, then the withheld value can't be computed from the stated givens, and the text holds no clause that states it (REQ-5408). Closed by: the template test's report.
2. Given an unanswerable problem and the ordinary problem it extends, when both are built from the same candidate, then the step count is equal, and the model choice, the step fields and the three hint rungs come from the complete graph (REQ-5408, REQ-5410). Closed by: a unit test over 1,000 seeds per tier.
3. Given a model choice of an unanswerable problem, when it is built, then a number appears only for a given the text states, and the withheld given and every intermediate result are labelled blank segments. Closed by: a unit test over the model choice's segments.
4. Given a hint rung of an unanswerable problem or of a solvable T1 to T4 problem, when a rung would print a given, then it names the quantity and prints no given's value. Closed by: a unit test over every rung of 1,000 seeds.
5. Given the generator can't withhold a given that leaves the problem unanswerable within 1,000 candidates, when it falls back, then it takes a fallback entry the build has checked, and a failing fallback entry fails the build. Given an unanswerable problem, when the Dutch bridge's keyword list is applied, then no keyword appears in its text, and an item whose `forms` holds `missing` carries that value in its logged `item_shown` (REQ-5466). Closed by: a build test with a broken fallback fixture and a keyword test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the unanswerable extension to the template contract and the withholding step to the generator, as ADR-0250 amends ADR-0040. Draw the withheld given at random among the graph's leaf givens, because a fixed choice is a pattern she could learn, and reject a candidate where the stated givens compute the withheld value. Log `withheldGiven` and the kind in `forms` on `item_shown`, kept on the server.

The rule that rungs of every T1 to T4 problem name each given by its quantity comes from ADR-0360's amendment of ADR-0250 and holds for both kinds, because a rung that prints a value on one kind only would tell her the kind.

## Depends on

- TSK-0820 (blocking): the template names the subtype the graph holds.

The epic realising ADR-0040 supplies the generator, the graph and the hint builder this task extends. The epic realising ADR-0210 supplies the Dutch bridge's keyword list and its item selector; this task ships the check that an unanswerable problem carries no keyword, and the selector's own skip of items whose `forms` holds `missing` stays with that epic. A keyword fixture stands in until that list exists.

## Evidence

Not yet.

## Left alone

The option builder and the packet, which TSK-0824 builds; the plan cards' look, which the epic realising ADR-0270 builds; and the real templates for the real nodes.
