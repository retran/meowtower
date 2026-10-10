---
id: TSK-0650
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2000, REQ-2002, REQ-2004, REQ-2020, REQ-2022, REQ-2024, REQ-2028, REQ-2030, REQ-2032, REQ-2036, REQ-2038, REQ-2182]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Experience comes from effort, never falls, and the MVP shows no stats, paths or rank change

After this task, `src/game/progression.ts` gives experience for effort whatever the verdict, computes the level from the curve in `economy.json`, grants nothing at a level-up, and the MVP holds rank E and D as fixed values with no stats, no paths and no nine-floor gap.

## Acceptance criteria

1. Given a first attempt, a second attempt, a scene, a floor in any state, a daily quest and a completed adventure, when experience is granted, then the amounts are 5, 3, 10, 20, 50 and 60, a first attempt gives 5 whether its verdict is right, wrong or «Не знаю», and an adventure played as RES-2000 describes gives between 500 and 650 (REQ-2000, REQ-2004). Closed by: a unit test of the amounts and a test that plays one adventure with all «Не знаю» and one with all correct and compares the experience.
2. Given the curve `min(150 + 20 * (L - 1), 600)` as the cost of leaving level L, when the levels are summed, then levels 1 to 22 cost 7,920 and level 4 begins at 510 experience, and a level-up grants no buttons, no threads, no stat points and no other reward (REQ-2028). Closed by: a unit test of the sums and a test that reads the grants at a level-up.
3. Given any generated log, when experience, level, rank, owned items, currencies, friendship and pages are read after each event, then none falls except by a purchase or a forge the player chose, which spend currency and add an item; a mistake, an answer or a missed day subtracts nothing (REQ-2002). Closed by: a property test over 1,000 generated logs.
4. Given the content files, when the content check runs, then the heroine holds rank E from Session 0 and Mirra rank D as fixed values, `canon.ru.md` names no month for any rank, and `economy.json` lists nine floor-worlds, eight in the element ring with a material each and the Observatory outside it giving the moon mote (REQ-2020, REQ-2036, REQ-2038, REQ-2182). Closed by: a unit test of the values and the check's fixture test on a canon that names a month.
5. Given the answer, profile and play replies, when their schemas are read, then they hold no stat and no path field, the language file holds no key for either, and no task, selection or scoring module imports a stat module; if stats arrive later, the Master receives each only as low, medium or high relative to the others (REQ-2022, REQ-2024, REQ-2030, REQ-2032). Closed by: a unit test of the schemas and the keys, and the dependency check's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/progression.ts` and read every amount from `economy.json`. Read the formula as the cost of leaving L, because that reading gives RES-2000's own figures. Add the dependency check to `tools/static-checks.ts`. The level-up ceremony of light and motion is drawn by the epic realising ADR-0150 and ADR-0320.

## Depends on

- TSK-0644 (blocking): the amounts, the curve and the nine floors are content.

## Evidence

Not yet.

## Left alone

Rank changes, stats, paths and rank months, which come after the MVP with the campaign's season milestones, and the daily quests' experience, which TSK-0651 grants through this function.
