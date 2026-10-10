---
id: TSK-0667
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0150
closes: [REQ-0712, REQ-0720, REQ-0724, REQ-3204, REQ-3206, REQ-3208, REQ-3210]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The maths keypad holds its keys in fixed cells on the right, and «Готово» and «Не знаю» sit apart from it

After this task, the task window's keypad holds the keys REQ-0712 lists, each at least 64 by 64 px in the same cell for every task, the action row holds «Не знаю», the thread button and «Готово», and a physical keyboard types the same entries.

## Acceptance criteria

1. Given the keypad, when its keys are listed, then it holds the digits 0 to 9, the decimal comma, «дробь», «целая часть», «остаток», «:» for time, minus and erase and nothing else (REQ-0712). Closed by: a unit test of the component's key list and a Playwright test that reads the rendered keys.
2. Given a fraction task and then a time task on the 1180 by 820 iPad viewport, when each key's rectangle is read, then every key is at least 64 by 64 px, the keypad sits in the right half of the screen, each key keeps the same cell in both tasks, and a key the task doesn't use leaves its cell empty (REQ-3204, REQ-3206, REQ-3208). Closed by: a Playwright test that compares the rectangles of the two tasks.
3. Given the task window, when its controls are read, then «Готово» and «Не знаю» are buttons in the action row, away from the digit keys, and neither is a key of the keypad; the row's order is «Не знаю», the thread button, «Готово», with the thread button beside «Готово» (REQ-0720, REQ-0724). Closed by: a Playwright test that reads the row and the keypad's keys and the distance between «Не знаю» and the nearest digit key.
4. Given a physical keyboard, when the entry field has focus, then typed digits, the comma, minus, "/" and ":" enter as the keypad's keys would, Enter presses «Готово» and "?" presses «Не знаю» (REQ-3210). Closed by: a Playwright test that types each key.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the keypad and the answer field's keyboard mapping into `TaskWindow`, as the divergences list says. Give the keys fixed cells in a CSS grid and let a task's `InputSpec` from ADR-0040 hide a key by emptying its cell. The action row's order follows ADR-0360, with «Нельзя узнать» inserted after «Не знаю» by the epic realising ADR-0250. A slip onto «Не знаю» ends a first attempt that can't be taken back, which is why it sits away from the digits.

## Depends on

- TSK-0660 (blocking): the ported `TaskWindow`.

The epic realising ADR-0040 supplies `InputSpec` and the answer kinds; until it lands, tests build the field from fixture specs.

## Evidence

Not yet.

## Left alone

The fraction, mixed-number, unit and point fields and the soft mark, which TSK-0668 builds on this keypad, and «Нельзя узнать» itself.
