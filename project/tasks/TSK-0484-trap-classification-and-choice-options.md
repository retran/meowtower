---
id: TSK-0484
artifact: task
status: approved
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

Not yet.

## Left alone

The report's counts of classes, which ADR-0180 owns, and how a class enters the estimate, which ADR-0060 owns.
