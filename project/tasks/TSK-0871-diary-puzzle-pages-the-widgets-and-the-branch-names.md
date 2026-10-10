---
id: TSK-0871
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5700, REQ-5710]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Diary shows puzzle pages and the five widgets as play she enters by her own choice, under the names «Петельки Смотрителя» and «головоломка»

After this task, the Diary draws a puzzle page with its widget, one quiet mark on the Diary's icon on a day a puzzle is offered, the box «Коробка головоломок» and the branch under its name, and no step of the adventure, the story or a quest waits on a puzzle.

## Acceptance criteria

1. Given an offered puzzle, when the player opens the Diary, then the page shows its statement and widget, and a Playwright test finds that no adventure screen, quest or story step is blocked while the puzzle stays unopened (REQ-5700). Closed by: the Playwright test's report.
2. Given a day a puzzle is offered, when the Diary's icon is read, then it shows one quiet mark until she opens the Diary and nothing else announces the puzzle. Closed by: a Playwright test.
3. Given every Russian text the player or the parent sees that names the branch or one puzzle, when the string check runs, then they say «Петельки Смотрителя» and «головоломка» and no other name (REQ-5710). Closed by: the string check's output over the player strings and the parent strings.
4. Given the tablet viewport, when the Playwright test drives each widget by touch, then each move applies at once through the shared rules module. Closed by: a Playwright test over the five widgets.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the pages, the box and the widgets in ADR-0150's design system with every string in ADR-0160's files. Identifiers she never sees, such as the puzzle event types, keep their names. A widget applies each move through its rules module and sends it through ADR-0030's queue as `puzzle_move` (TSK-0875).

## Depends on

- TSK-0870 (blocking): the widgets run those rules modules.
- TSK-0875 (blocking): the pages send their moves and answers to those routes.

The epic realising ADR-0150 supplies the Diary and the design system; the epic realising ADR-0210 supplies the taskless screens and the schedule of new systems that unlocks the branch.

## Evidence

Not yet.

## Left alone

The branch's English and Dutch names, which wait for those languages, and the Parent Room's review screen, which TSK-0873 builds.
