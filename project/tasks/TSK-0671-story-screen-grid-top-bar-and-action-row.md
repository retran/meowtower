---
id: TSK-0671
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-3500, REQ-3502, REQ-3504, REQ-3506, REQ-3510]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every story screen is one grid with the story in the centre, a scene column with no button, and a top bar that always leaves

After this task, a story screen is one CSS grid of a top bar, a 380 px scene column on the left and the story column in the centre with the log above the input line, and the top bar always holds «Привал», «Сохранить и уйти» and the way into settings.

## Acceptance criteria

1. Given a story screen at 1180 by 820 and at 1440 by 900, when the layout is read, then the grid holds the top bar, a scene column 380 px wide on the left and the story column as the centre, with the log above the input line, and on a computer the grid is centred at CSS pixel sizes with no scaling transform (REQ-3500). Closed by: a Playwright test that reads the rectangles and the computed `transform`.
2. Given the scene column, when it is read, then it holds one PixiJS canvas and no interactive element, no button, link or focusable node (REQ-3502). Closed by: a Playwright test that queries the column for focusable elements.
3. Given every story screen, when the top bar is read, then it holds «Привал», «Сохранить и уйти» and the settings paw, and the paw is at least 56 px on a coarse pointer (REQ-3504, REQ-3506). Closed by: a Playwright test over each story screen with `(pointer: coarse)` emulated.
4. Given an open task window, when the action row is read, then «Не знаю», the thread button and «Готово» sit side by side in that order and the thread button is next to «Готово» (REQ-3510). Closed by: a Playwright test that reads the row's order and gaps.
5. Given the iPad viewport, when every control of a story screen is measured, then each has a hit area of at least 56 px (REQ-3504). Closed by: a Playwright test that measures every control.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build one `StoryScreen` layout component that every story screen uses, with the task window, System windows and ceremonies as layers over a scrim. Keep the scene column's canvas under the scene code and give it no event handler. The thread button renders once guiding threads have opened, as ADR-0330 amends it; before then the row holds «Не знаю» and «Готово». The parent judges the centre of the screen at stage acceptance, which TSK-0675 collects.

## Depends on

- TSK-0660 (blocking): the grid is built from ported components and tokens.
- TSK-0661 (blocking): the grid reads the root's theme and text size.

The epic realising ADR-0170 supplies the scene's pictures; until it lands, the canvas draws a placeholder.

## Evidence

Not yet.

## Left alone

What «Привал» does, which the epic realising ADR-0090 builds, and the leave flow behind «Сохранить и уйти», which the epic realising ADR-0030 built.
