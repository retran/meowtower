---
id: TSK-1098
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7036, REQ-7038]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every row in no quadrant shows its first reason, and the Cito section says Cito builds no profile for the top and bottom 10 %

After this task, each row the function places in no quadrant carries exactly one reason code in a fixed order, with its Russian string, and the Cito section carries Cito's own rule whenever a result exists.

## Acceptance criteria

1. Given a fixture with one row for each code, when the function returns the rows, then each shows one reason from this list: `category_unmapped`, `signal_other`, `category_small`, `school_unplaced`, `school_target_low`, `school_target_high`, `cito_not_notable`, `home_stale`, `home_untested`, `home_too_few`, `home_split`, `home_speed_only`, `home_no_outside`, `home_even` and `home_one_node` (REQ-7036). Closed by: the unit test with 15 fixtures.
2. Given a row that fits two reasons, such as `school_unplaced` and `home_stale`, when the function picks one, then it picks the earlier in that order, mapping and school reasons before home reasons, because no amount of play changes them (REQ-7036). Closed by: a unit test with three pairs.
3. Given the strings, when the string check of ADR-0160 runs, then every reason has its Russian text under `parent.school.quadrant.none.*` and `home_too_few` shows its tested and mapped counts (REQ-7036). Closed by: the string check's output and a unit test.
4. Given a Cito result recorded and no row, or rows, when the Cito section is built, then it shows «Cito не строит профиль по разделам для 10 % самых сильных и 10 % самых слабых учеников: если строк нет, это правило Cito» (REQ-7038). Closed by: the section's unit test, with and without rows.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the ordered list of reasons to `quadrants.ts` and return the first that holds for every row in no quadrant, so the parent is sent first to what play can't change, and then to what play or time can. Put the strings under `parent.school.quadrant.none.*` in `ru.json`, where ADR-0180's label check and ADR-0160's forbidden-word list already run. A `developing` status and a missing target level both give `school_unplaced`, on purpose.

## Depends on

- TSK-1094 (blocking): it orders that task's home reasons.
- TSK-1095 (blocking): it orders that task's school reasons.
- TSK-1097 (blocking): it orders the floor's reasons.
- TSK-1096 (blocking): it orders the Cito row's reasons, `home_no_outside`, `home_even` and `cito_not_notable`.

## Evidence

Not yet.

## Left alone

The route and the screen that show the reasons, which TSK-1099 builds, and the reason a quadrant's checks give, which TSK-1100 adds.
