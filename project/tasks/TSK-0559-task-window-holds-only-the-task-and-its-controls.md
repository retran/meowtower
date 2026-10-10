---
id: TSK-0559
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0106, REQ-0110, REQ-0426]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every task opens in a flat window that holds only the task and its controls and never marks an answer right or wrong

After this task, every adventure task opens in the task window, a flat panel separate from System windows, the window holds only the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово», and it never shows «верно», «неверно», «ошибка», a tick or a cross, and the short solution and the second attempt stay inside it.

## Acceptance criteria

1. Given any task kind, when it opens on the tablet viewport, then it is in the task window, a flat panel with no System window around it (REQ-0106). Closed by: a Playwright test over the five task kinds.
2. Given the open window, when its elements are read, then they are the task, the answer field or options, the keypad, «Не знаю», the thread button and «Готово», with no sprite, effect or story text. Closed by: a Playwright test that lists the window's elements.
3. Given the review after each outcome, when the window's text is read, then it holds none of «верно», «неверно», «ошибка», a tick or a cross (REQ-0110). Closed by: a Playwright test over the three outcomes and a search of the language file's task-window strings against the forbidden words.
4. Given the short solution and the second attempt, when they show, then they are inside the same window and the scene doesn't take the screen until the player leaves it (REQ-0426). Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the window in `src/client/` from the flow's states, with the strings in `content/i18n/ru.json`. ADR-0150 draws the window's look and ADR-0160's forbidden-word list checks the strings; this task asserts the content and the words, and the epics of those decisions own the pixels and the list.

A task's form adds its own texts and controls to the window, REQ-5120's list, which the epics realising ADR-0220, ADR-0240 and ADR-0250 add; the list in the first criterion is the base they extend.

## Depends on

- TSK-0548 (blocking): the flow states the window draws.
- TSK-0550 (blocking): the review's content.

## Evidence

Not yet.

## Left alone

The window's look and components, which the epic realising ADR-0150 builds, and the forbidden-word list itself, which ADR-0160's epic owns.
