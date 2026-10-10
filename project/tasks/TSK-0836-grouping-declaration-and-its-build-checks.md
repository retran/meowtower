---
id: TSK-0836
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5512, REQ-5514, REQ-5516, REQ-5518, REQ-5524, REQ-5588]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A grouping template declares its host node, technique, admissible links and optimal plans, and the build fails one that breaks a rule

After this task, the template contract holds the optional `grouping` declaration with `hostNode`, `technique`, `admissible` and `optimalPlans`, and the build fails a template with `grouping_template_invalid` for each case ADR-0260 lists.

## Acceptance criteria

1. Given a template with mixed operations, such as `2 + 3 · 4`, when the build check runs, then it fails with `grouping_template_invalid`; given an all-addition or all-multiplication expression of 2 to 5 numbers, it passes, and 6 numbers fail (REQ-5524). Closed by: the build check's fixtures.
2. Given a product with one factor to round, such as `99 · 6`, when it declares anything but `rounding`, then the build fails, and a template that declares `distributive` fails whatever its expression (REQ-5516, REQ-5518). Closed by: the build check's fixtures.
3. Given a plan that links 25 and 4, 125 and 8 or 50 and 2, when it declares `commutative_associative`, then the build fails, and given any other regrouping or a plan with a mark, a declaration other than `commutative_associative` or `rounding` fails; the filing rule has one right declaration for each plan. Closed by: the build check's fixtures.
4. Given a template whose plain calculation has a step outside every subtype of the declared host node, when the build check runs, then it fails; given A13 as host and a step outside the subtypes of A7 and A11, it fails (REQ-5514, REQ-5588). Closed by: the build check's fixtures.
5. Given an optimal plan whose computation differs from `solve()` over 1,000 seeds, when the build check replays it, then the build fails, and a plan that agrees passes. Closed by: the build check's fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the declaration to the template contract (REQ-5512) in `src/templates/`, and the checks to the build, as ADR-0260 amends ADR-0040. `admissible` is the whole set of pairs and single numbers, because a client that could link only some pairs would show her the shortcut through the controls it disables. `sampleParallel` keeps the technique, the number of numbers and the plan's structure.

The filing rule of ADR-0260 is the choice made for REQ-5516: a plan that joins a convenient pair declares `convenient_pairs`, any other regrouping declares `commutative_associative`, and a mark declares `rounding`.

## Depends on

The epic realising ADR-0040 supplies the template contract, `solve()` and the subtype test the host-node check reuses. The epic realising ADR-0050 supplies RES-0800's node table with A7, A11 and A13; the checks run against a fixture node table until it lands and leave the real nodes' hosting to it.

## Evidence

Not yet.

## Left alone

The shipped templates, which TSK-0837 writes, and the scoring of submitted links, which TSK-0838 builds.
