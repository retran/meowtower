---
id: TSK-0655
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-2126, REQ-2170, REQ-2172, REQ-2176]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Thread Forge opens on day 6 of play with six recipes of three rows each

After this task, `src/game/forge.ts` holds the six recipes of the MVP, each with a row of star-steel shards, a row of star yarn and a row of one floor material at its tier's amounts, and the forge opens on the sixth day of play.

## Acceptance criteria

1. Given every recipe in `economy.json`, when the schema reads it, then it has exactly three rows, shards, yarn and one floor material (REQ-2170). Closed by: a unit test with a recipe of two rows that fails.
2. Given the first recipe, an accessory, an outfit and a focus, when the amounts are read, then they are 5 shards, 2 yarn and 2 material; 25, 6 and 3; 80, 20 and 5; and 160, 40 and 6 (REQ-2172). Closed by: a unit test of the table.
3. Given the MVP content, when the content check runs, then it ships the six recipes «Шарф Туманной Погоды», «Очки Второго Взгляда», «Капюшон с Ушками Путаницы», «Сапожки Точного Шага», «Фонарь Терпеливого Света» and «Гримуар Чистых Страниц», each as an id whose words are in `recipes.ru.json` (REQ-2176). Closed by: a unit test of the six ids and a search that no name is written into `economy.json`.
4. Given a player on day 5 and on day 6 of play, when the forge is asked, then it is closed on day 5 and open with the first recipe on day 6, which is no later than the seventh day (REQ-2126). Closed by: a unit test with both days.
5. Given enough currency, when the player forges a recipe, then `forge_crafted` is written once, the three rows are spent, the item is added and nothing else changes (REQ-2170). Closed by: an integration test over one forge.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/forge.ts` and the recipes to `economy.json`. Name each recipe by an id and keep the words of REQ-2176 in `recipes.ru.json`. The forge opens with the first recipe on day 6 of play, as ADR-0330 amends it. The amounts are starting values that two weeks of stage 0.3 play check, and a change to them is a content change.

## Depends on

- TSK-0644 (blocking): the recipes are content.
- TSK-0653 (blocking): the items a recipe makes are catalogue items of its schema.
- TSK-0651 (not blocking): the day of play it supplies opens the forge; tests pass a fixture day number.

## Evidence

Not yet.

## Left alone

The forge screen, which the epic realising ADR-0150 builds, and the recipes' pictures, which ADR-0170 owns.
