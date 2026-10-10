---
id: TSK-0886
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5810, REQ-5812]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# No player route, screen or string shows a test, its date or its name

After this task, no response on a player route can carry a horizon, a result, a goal or a Cito field, the forbidden-word list refuses the words that name a test, and a check over the templates and the player strings fails on the names of Cito's products.

## Acceptance criteria

1. Given every response schema of the play routes, when the schema test walks them, then none holds a field named for a horizon, a result, a goal or Cito, and a fixture schema that adds one fails the test (REQ-5812). Closed by: the schema test.
2. Given the forbidden-word list, when it is read, then it holds «тест», «контрольная», «экзамен», «Cito» and «Цито», and the gate's matcher refuses a fixture line that holds each of them and accepts a line that holds «проверка» (REQ-5812). Closed by: a unit test of the list and the matcher.
3. Given `src/templates/` and every player string, when group 1 runs, then it fails on a fixture that holds "Cito", "LVS" or "Leerling in beeld" as a whole word in any letter case, and passes on the tree without it (REQ-5810). Closed by: the check's test with a failing and a passing fixture.
4. Given a played day with the default horizons, when a Playwright test scans every screen the player sees, then it finds none of the five words and neither 2027-01-15 nor 2027-05-15 (REQ-5812). Closed by: the Playwright test.
5. Given the layouts of the game's tasks, when the parent reviews them at the stage's acceptance, then none imitates a Cito item (REQ-5810). Closed by: the parent's judgement, because a program can't tell a layout that imitates a Cito item.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five words to the forbidden-word list that the text gate reads, and the group 1 check on `src/templates/` and the player strings; the matcher compares whole words and ignores letter case. «проверка» stays allowed, because the game already uses it for other things. The epic realising ADR-0160 supplies the text gate and the string files; until it exists, the test calls the list's matcher directly and the check reads `content/i18n/`.

Add the schema test over the response schemas in `src/shared/api.ts`. It reads the schemas, not a sample of replies, so a field added later fails it before any reply holds a value.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The check on the Dutch probe's folders and the probe's event schemas, which come with ADR-0430 after the MVP. The parent-only schemas that hold results and horizons, which the check leaves out on purpose.
