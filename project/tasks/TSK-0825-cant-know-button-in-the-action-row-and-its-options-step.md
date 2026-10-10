---
id: TSK-0825
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0250
closes: [REQ-5402, REQ-5404, REQ-5470]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Нельзя узнать» sits in the action row of every T1 to T4 phase and opens the four options before it submits

After this task, the task window's action row reads «Не знаю», «Нельзя узнать», the thread button and «Готово» on every T1 to T4 problem in every phase, a press opens the four options with «Готово» and «Назад», and the shortcut `KeyY` does the same as a tap.

## Acceptance criteria

1. Given every phase of every T1 to T4 problem on the tablet and the desktop viewports, when the Playwright test opens it, then «Нельзя узнать» shows in the action row with a gap of at least one button's width between it and «Не знаю», whether or not the thread button shows, never on the keypad, and on no other task (REQ-5402). Closed by: the Playwright test's report.
2. Given the button, when its label is read, then it is the string key `ui.task.cantKnow` with the value «Нельзя узнать», and the string differs from the label of «Не знаю» (REQ-5470). Closed by: the string file's pinned-value test.
3. Given the task window, when a tap or `KeyY` presses the button, then the four options open with «Готово» and «Назад», no request is sent and no event is written; «Назад» returns to the problem as it was; «Готово» sends `insufficient` with or without a chosen option (REQ-5404). Closed by: the Playwright test and a network recorder over the same run.
4. Given an answer field, when `KeyY` is pressed in it, then no character enters the field, and `?` still means «Не знаю». Closed by: a Playwright test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the button, the gap and the options step in the task window, using the options the packet already carries (TSK-0824). The action row's order is ADR-0360's amendment of ADR-0250: «Не знаю», «Нельзя узнать», the thread button, «Готово». Add `ui.task.cantKnow` and the key for «Назад» to the Russian string file, with every player-facing string in the per-language file as CLAUDE.md requires.

I chose the key `KeyY` as ADR-0250 does, because `KeyboardEvent.code` `KeyY` is «Н» on the Russian layout, the first letter of «Нельзя».

## Depends on

- TSK-0824 (blocking): the options step reads the options from the packet.
- TSK-0821 (blocking): «Готово» sends the `insufficient` answer that task accepts.

The epic realising ADR-0150 supplies the task window and its action row; the epic realising ADR-0160 supplies the string file and its pinned-value test. This task adds the button and the strings to both.

## Evidence

Not yet.

## Left alone

The button's absence on a Dutch probe letter, which ADR-0430 decides after the MVP, and the tablet layout's final spacing, which the epic realising ADR-0150 owns.
