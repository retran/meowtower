---
id: TSK-0484
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0702, REQ-0704, REQ-0726, REQ-0728, REQ-0730]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A wrong answer is classified by its trap, and a choice task's wrong options are its traps' answers

After this task, a wrong answer gets the id of the trap whose computed answer it equals, or `computational` when it is one digit off, two digits swapped or a neighbouring times-table fact, or `unclassified`, and a choice task's wrong options are its traps' answers filled up by near forms of the correct answer.

## Acceptance criteria

1. Given a task with traps `A` and `B`, when the entry equals trap `A`'s answer by value, then the class is `A` (REQ-0726). Closed by: a unit test with both traps.
2. Given a wrong answer that matches no trap and differs from the correct one by one digit, by a swap of two digits or as a neighbouring times-table fact, when it is classified, then the class is «вычислительная» (computational), and any other unmatched answer is «не классифицирована» (unclassified) (REQ-0728, REQ-0730). Closed by: one fixture each.
3. Given a choice task whose traps give 3 distinct wrong answers, when its options are built, then they are those 3 and the correct one; and given traps that give only 1, when options are built to 4, then each added option has the answer kind and the number of digits or the denominator of the correct answer (REQ-0702, REQ-0704). Closed by: a unit test and a property test over 1,000 seeds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `classify(entry, task)` and `buildOptions(task, count)`. Both are pure and read only the task's traps and its correct answer.

## Depends on

- TSK-0481 (blocking): the traps come from the template contract.
- TSK-0482 (blocking): the entry's value and form come from the number kinds.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Fixtures and a property test in `tests/unit/traps-classify.test.ts`, nine tests:

1. REQ-0726: the entry 14 is classified as the trap `add` and 3 as `skip`.
2. REQ-0728: 13 (one digit off) and 21 (the digits of 12 swapped) are computational.
3. REQ-0730: 48 and 35 are neighbouring times-table facts of 6 × 7, so they are computational; 99 is unclassified.
4. REQ-0702: a four-option choice task has the correct answer and its three distinct trap answers.
5. REQ-0704: missing options are two-digit for a two-digit answer, and fraction fillers share the answer's denominator.
6. The property test over 1,000 seeds: every four-option task has four distinct options, and each filler has the answer's digit count.

Stages at tree `0442115e1563`, from `meow-checks evidence`:

- format: passed, record f889cb52025e
- lint: passed, record 06f408c1e039
- check: passed, record 427b0192e013
- test: passed, record 23fc3d17118b
- build: passed, record 385143b2fb8b

The test stage failed once on a timing test in `scene-resume.spec.ts`, which passed on the re-run. The record cites the passing run.

## Left alone

The report's counts of classes, which ADR-0180 owns, and how a class enters the estimate, which ADR-0060 owns.
