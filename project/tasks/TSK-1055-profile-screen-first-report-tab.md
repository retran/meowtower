---
id: TSK-1055
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6700, REQ-6710, REQ-6712, REQ-6786, REQ-6792]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The profile screen comes first among the report tabs and shows no number outside a bar

After this task, the Parent Room's report has a screen «Профиль» as its first tab, with the eight bars in one neutral colour, their previous windows as thin bars and the screen's fixed notes, and the build fails when the screen shows a total or a bar without its count or interval.

## Acceptance criteria

1. Given the report tabs after the MVP, when the Parent Room is opened, then «Профиль» is the first tab and the nine screens of report v1 are still there (REQ-6700). Closed by: a Playwright test that lists the tabs.
2. Given a fixture log of 60 played game days, when the screen is rendered, then every bar that shows a value shows its count and its interval, no number appears outside a bar's element and the screen's notes, all eight bars use one fill colour, and the screen shows the line `parent.profile.miss_rate` (REQ-6712, REQ-6792). Closed by: a Playwright test. A fixture that adds a total, or a bar value without its interval, makes the same test fail.
3. Given the screen, when the parent reads the colour of the bars, then it reads as neutral and not as a verdict on the player (REQ-6710). Closed by: judgement, the parent looks at the screen at the stage's acceptance, because the design system picks the colour and only a person can tell whether it reads as a verdict.
4. Given the screen's two fixed notes, when the parent reads the first, then it says that each bar counts tasks the Director chose at her level, that a bar read against its own earlier window says more than two bars read against each other, and that pooled streams and tasks of different difficulty make the stated miss rate approximate (REQ-6786). Closed by: judgement, the parent reads it at the stage's acceptance, because the wording has to be plain to her and a test can't check that; and a test that the note's key is on the screen.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the screen to the Parent Room's report tabs, first in the order, and draw each bar as a bar with its previous window as a second thin bar, using the neutral bar colour token and the thin-bar variant that ADR-0150's design system supplies. Render the notes from `parent.profile.*`: the Director note of REQ-6786, the slow-bar notes of TSK-1052, the note of TSK-1053 and the line `parent.profile.miss_rate` that ADR-0380 owns and says that about 1 in 5 of the 80 % intervals shown misses its true value.

The profile adds no notification: a change line appears only on the screen the parent opens.

## Depends on

- TSK-1048 (blocking): the change line the screen draws.
- TSK-1054 (blocking): the counting lines and the list each bar links to.

The epic realising ADR-0150 supplies the colour token; until then use one token of the existing style sheet and swap it later. The epic realising ADR-0380 supplies the string `parent.profile.miss_rate`.

## Evidence

Not yet.

## Left alone

Spacing, layout and the exact colour, which ADR-0150's design system owns.
