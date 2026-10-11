---
id: TSK-0485
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0706, REQ-0708, REQ-0710]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The build fails a template whose choice, comparison or traps break a rule

After this task, a build check reads every template and fails one that asks for a choice outside the six choice classes, offers fewer than 4 options in a scored choice task, asks for a comparison in a form other than the largest of four or an order, or uses the sign form outside a warm-up, an easy unscored task and the Session 0 tutorial.

## Acceptance criteria

1. Given a fixture template with `inputClass: free` and a `choice` answer, when the check runs, then it fails and names the template (the rule behind REQ-0700). Closed by: the check's fixture test.
2. Given a scored choice task with 3 options, when the check runs, then it fails; with 4 it passes (REQ-0706). Closed by: one fixture each.
3. Given a scored comparison template that asks for a sign, when the check runs, then it fails; given one that asks for the largest of four or an order of 3 to 4 numbers, it passes; given the sign form under `warmup`, `easy` or `tutorial`, it passes (REQ-0708, REQ-0710). Closed by: one fixture each.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the checks to `tools/static-checks.ts` as verify group 1 checks, reading the templates where ADR-0040 places them, in the way `checkParamsLanguageFree` does. Before any real template exists they read the fixture template and say how many they read.

## Depends on

- TSK-0481 (blocking): the checks read the template contract.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Fixtures in `tests/unit/task-rules.test.ts`, eight tests:

1. REQ-0700: a fixture with free input and a choice answer fails and names the template `fixture.free-choice`.
2. REQ-0706: three options fail and four pass.
3. REQ-0708 and REQ-0710: a sign comparison fails outside warmup, easy and tutorial, and passes inside them; the largest of four passes; an order of 3 or 4 passes and 5 fails.
4. Unscored tasks are exempt.

The verify group reads the templates' `taskFacts` from `src/templates`. Before any real template exists it reads 0 templates, and `static-checks` prints that count.

Stages at tree `3e3d05b5f080`, from `meow-checks evidence`:

- format: passed, record fd0602ff0caf
- lint: passed, record 0753545535f2
- check: passed, record 8dca59f25543
- test: passed, record 978a1145ffad
- build: passed, record b4230d39c2e0

## Left alone

The catalogue's subtypes and levels, which ADR-0050 owns, and the glossary checks, which wait for ADR-0160's glossary file.
