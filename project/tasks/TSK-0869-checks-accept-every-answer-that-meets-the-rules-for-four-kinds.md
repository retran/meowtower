---
id: TSK-0869
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5740]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A puzzle's check accepts every answer that meets its rules, for numbers, sets, arrangements and grid cells

After this task, `src/shared/puzzles/checks/` holds one check function for each of the answer formats number, set of numbers, arrangement and set of grid cells, each testing an answer against the puzzle's rules and never against the stored reference solution.

## Acceptance criteria

1. Given a cutting or an arrangement puzzle, when a second right answer, written by hand and different from the reference, is checked, then it is accepted (REQ-5740). Closed by: one fixture for each of a cutting puzzle and an arrangement puzzle.
2. Given each shipped puzzle's reference solution, when its check runs, then it passes. Closed by: the group 2 test's report.
3. Given a wrong answer that nearly satisfies the rules, when it is checked, then it is not accepted, and a check that throws logs the answer as `not_judged`. Closed by: a fixture and a unit test with a throwing check.
4. Given a mutation of one parameter in a pouring or a weighing puzzle, when the reference solution runs against the mutated data, then at least one such puzzle's reference fails. Closed by: a mutation test over the fixture bank.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the four check functions with the data schema of TSK-0868. A check takes the puzzle's data and an answer and returns accepted or not accepted. The move-sequence check belongs to TSK-0870 because it replays moves through a widget's rules module.

## Depends on

- TSK-0868 (blocking): the checks read that task's data schema.

## Evidence

Not yet.

## Left alone

The widgets' rules modules, the move-sequence check and the blind solve, which TSK-0870 and TSK-0872 build.
