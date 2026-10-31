---
id: TSK-0488
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0780, REQ-0782, REQ-0786, REQ-0788, REQ-0836]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A word problem takes one of the seven structures, with numbers fixed before the story

After this task, a word problem template declares one of the seven structures, stores every valid graph and its structure traps, fixes its steps, numbers and answer before a story frame is chosen, forms every noun after a number in its Russian case, carries exactly one unused number at tier T4, and offers a model choice of four notes drawn by code.

## Acceptance criteria

1. Given a word problem template, when the check runs, then it declares one of the seven structures of RES-0700 and fails otherwise (REQ-0780). Closed by: the check's fixture test.
2. Given a generated word problem, when its frame is chosen, then the steps, numbers and answer were fixed first and the frame's placeholders hold only roles (REQ-0782). Closed by: a unit test that fails when the frame is chosen first.
3. Given 10,000 seeds of tier T4, when the problems are generated, then each holds exactly one number the solution doesn't use (REQ-0786). Closed by: a property test.
4. Given the numbers 1, 3 and 5 after «зелье», when the noun is formed, then the texts read `1 зелье`, `3 зелья` and `5 зелий` (REQ-0788). Closed by: one fixture each, and a property test over 1 to 100.
5. Given a T template, when the model choice is built, then it has four notes, one from the valid graph and three from the structure traps, drawn as SVG by code, and one problem in four opens with it (REQ-0836). Closed by: a unit test and a count over 1,000 seeds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/templates/word-problem.ts` for the structure contract and `src/render/model.ts` for the notes. The numbers of a step come from a set of allowed nodes the caller passes; the knowledge model's state is not read here, so REQ-0784 stays with ADR-0060's epic. A word problem with no allowed node returns `no_fluent_numbers` and builds nothing.

## Depends on

- TSK-0486 (blocking): it supplies the graph the structures extend.
- TSK-0481 (blocking): the generator draws the numbers.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Tests in `tests/unit/word-problem.test.ts`, ten tests, and the check's fixture:

1. REQ-0780: the catalogue has exactly the seven structures, and `checkWordStructures` in `tools/word-rules.ts` fails `guess` and names `fixture.story`. The verify group reads `wordFacts` from `src/templates` and reads 0 templates until one exists.
2. REQ-0782: `compose` hands the frame chooser the numbers and the answer already fixed, so a frame chosen first has no answer to receive. With no allowed node it returns `no_fluent_numbers`.
3. REQ-0786: a property test over 10,000 seeds: each T4 problem has exactly one number its solution doesn't use.
4. REQ-0788: `nounForm` gives зелье, зелья and зелий for 1, 3 and 5, and matches the Russian rule for every number from 1 to 100.
5. REQ-0836: `modelChoice` gives four notes, one correct and three from the traps, each drawn as an SVG bar. `opensWithModel` holds for exactly 250 of 1,000 seeds.

Not closed here: the structures are declared and checked, but the templates that use them come with the epics that realise the skill graph (ADR-0050), so no real word problem yet takes a structure.

Stages at tree `73a4331e6f6c`, from `meow-checks evidence`:

- format: passed, record 496032691484
- lint: passed, record 67add1402d63
- check: passed, record 9147b60f564c
- test: passed, record 7628691f855e
- build: passed, record 5344d9153c12

## Left alone

The frame library and its checks, which ADR-0130 owns, and which nodes are fluent, which ADR-0060 owns.
