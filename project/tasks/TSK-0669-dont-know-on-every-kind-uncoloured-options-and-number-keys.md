---
id: TSK-0669
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-0722, REQ-3212, REQ-3238]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Не знаю» is on every task kind, a choice keeps its colours after an answer, and keys 1 to 4 select an option

After this task, every answer kind shows «Не знаю» in the action row, no option is coloured right or wrong after a multiple-choice answer, and the keys 1 to 4 select the matching option and leave «Готово» to submit.

## Acceptance criteria

1. Given one task of every answer kind, integer, decimal, fraction, mixed number, quotient with remainder, time, point, choice, model choice, grid and order, when each is opened, then each shows «Не знаю» in the action row, and the choice, model-choice and grid tasks show no keypad (REQ-0722). Closed by: a Playwright test that opens each kind and finds the button.
2. Given a multiple-choice task, when an answer is submitted, then no option changes colour and none gets a tick or a cross, and the computed colours of the options are the same before and after (REQ-3212). Closed by: a Playwright test that reads the options' computed colours.
3. Given a multiple-choice task with a physical keyboard, when the keys 1, 2, 3 and 4 are pressed, then the matching option is selected, a key beyond the option count does nothing, and «Готово» still has to be pressed to submit, as a tap does (REQ-3238). Closed by: a Playwright test that presses each key.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Give `ChoiceGrid` key handling for 1 to 4 and take its selection state from the same function as a tap. The kind list is the answer kinds of ADR-0040; test every kind the epic realising it ships and add each new kind to the test's list as it lands. Keep the option colours from the tokens and add no state colour after an answer.

## Depends on

- TSK-0660 (blocking): `ChoiceGrid`, `TaskWindow` and the action row are ported components.

The epic realising ADR-0250 inserts «Нельзя узнать» into the same row and extends the test's phase list; the epic realising ADR-0430 excludes a Dutch probe letter from it.

## Evidence

Not yet.

## Left alone

The structured kinds' fields, which TSK-0668 builds, and the keys 1 to 3 of `StoryInput`, which ADR-0330 amends into starter insertion and its epic builds.
