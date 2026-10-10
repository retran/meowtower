---
id: TSK-0672
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3514, REQ-3516, REQ-3526, REQ-3528, REQ-3530]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every Underside screen shows «Мне страшно» and a lantern, and the Awakening closes with rank E

After this task, every Underside screen renders «Мне страшно» and a lantern the interface layer draws, the Awakening's closing System window shows its line with a rank badge at rank E, and the Parent Room's creepiness setting carries its heading from the language file.

## Acceptance criteria

1. Given each Underside screen, when it renders, then it holds the button «Мне страшно» (REQ-3514). Closed by: a Playwright test over every Underside screen the epic realising ADR-0110 lists.
2. Given an Underside screen whose scene picture is a generated image with no light, when it renders, then a lantern drawn by the interface layer is on screen, outside the scene canvas, and the screen has no state without it (REQ-3516). Closed by: a Playwright test that reads the lantern element's parent and its visibility, and the parent's judgement at stage acceptance that the lantern reads as a light, because only a person can judge that.
3. Given the Awakening's closing System window, when it appears, then it reads «Пробуждение завершено. Добро пожаловать в Башню.» from the language file with a `RankBadge` beside it at rank E (REQ-3528, REQ-3530). Closed by: a Playwright test that reads the line and the badge.
4. Given the Parent Room's creepiness setting, when it renders, then its heading is «Уровень жуткости» from the language file (REQ-3526). Closed by: a Playwright test and a search that the heading isn't a literal in `src/`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the button and the lantern to the Underside layer of `StoryScreen`, outside the scene canvas, so no generated picture leaves the screen without a light. The button's action is ADR-0110's; this task renders it and emits the same event any button emits. The badge takes its rank from the progression state; the rank is E at that point.

## Depends on

- TSK-0671 (blocking): the screen layout the lantern and the button belong to.

The epic realising ADR-0110 decides what «Мне страшно» does and which screens are Underside screens, and the epic realising ADR-0140 holds the rank. Until they land, tests mark a screen as Underside by a flag and the rank is the fixed value E.

## Evidence

Not yet.

## Left alone

What the button does, when dreamcore starts and what the Master says, which ADR-0110 owns.
