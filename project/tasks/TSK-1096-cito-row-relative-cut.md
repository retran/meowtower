---
id: TSK-1096
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7024, REQ-7026, REQ-7028, REQ-7030, REQ-7032]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A Cito row compares its category's tested nodes with the tested nodes outside it

After this task, the quadrant function turns each category entry of the latest Cito result into a row whose school side is the entry's signal and whose home side is the category's block-score share against the share outside it, with the margin of one standard deviation.

## Acceptance criteria

1. Given a category entry with the signal `below_notable` or `below_very_notable`, when the function reads the school side, then it is a relative weakness; given `above_notable` or `above_very_notable`, a relative strength; given `not_notable`, neither and the row shows `cito_not_notable` (REQ-7024). Closed by: a unit test, five fixtures.
2. Given a result whose moment is `cito:M7`, when the function reads the home side, then it uses each node's state at the date of the horizon in force when the result was recorded, or at the recording date when no horizon names the moment (REQ-7026). Closed by: a unit test with a horizon and without one.
3. Given nodes of the category, when the function counts tested nodes, then a node counts as tested only when its last unassisted first attempt lies within the 30 days before that date and its state rests on a block rule, and the outside is the tested nodes of the four domains that the category doesn't map, so M8 and G4 count inside each category that maps them, and T1 to T4 and the Sources track are on neither side (REQ-7032). Closed by: a unit test with M8 and G4 fixtures.
4. Given 10 tested nodes inside, 40 outside and q = 0.7, when the margin is computed, then it is 16.2 percentage points; given the category's share at least the margin above the outside share, then it is a relative strength at home, at least the margin below, a relative weakness, and otherwise neither; given no tested node outside, then neither with `home_no_outside`, and given q at 0 or 1, then neither with `home_even` (REQ-7030). Closed by: a unit test with the five cases.
5. Given a row, when the function returns it, then it holds the category's share at the test moment and its share over the nodes tested in the 30 days before today, each with its counts and ADR-0380's 80 % Wilson interval, and the difference with ADR-0380's 80 % Newcombe interval (REQ-7028). Closed by: a unit test that compares the intervals with the functions of ADR-0380's module.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Cito side to `quadrants.ts` and the fold of categories to `src/parent/school/cito-categories.ts`. A Cito row is one category entry of the latest `external_test_recorded` for its moment that no later result replaces. The margin in percentage points is 100 times the square root of q(1 - q)(1/n_in + 1/n_out), with q the share over all tested nodes of both sides and a block score of 4 or more the cut. The moment identifier carries no day, so the function reads the horizon's date, which is the parent's best estimate of the day the school chose inside Cito's advised period; this is a default ADR-0420 chose.

## Depends on

- TSK-1092 (blocking): the row reads the category entries that form saves.
- TSK-1093 (blocking): the category's nodes come from the mapping file.

The epic realising ADR-0380 supplies the Wilson and Newcombe functions and the epic realising ADR-0290 the horizons; the task uses stand-ins with the same signatures until they exist.

## Evidence

Not yet.

## Left alone

The small-category floor and the one-node guard, which TSK-1097 adds to this task's function, and the reasons shown for a row in no quadrant, which TSK-1098 orders.
