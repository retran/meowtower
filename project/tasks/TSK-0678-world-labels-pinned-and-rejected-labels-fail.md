---
id: TSK-0678
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0160
closes: [REQ-3310, REQ-3312, REQ-3322]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The interface uses the world's labels, and a label that brings back the test, the clock or the streak fails the build

After this task, `ru.json` holds the world's labels of REQ-3310 under pinned keys, no `ui.*` value equals a rejected label of REQ-3312, and the guiding thread button reads «Путеводная нить · N» with N filled by code.

## Acceptance criteria

1. Given the labels REQ-3310 lists, when the label test reads their keys, then each value equals the required text exactly, among them «Схема узла», «Как легла нить», «Твоё заклинание», «Готово», «Не знаю», «Распутан начисто», «Почти чисто», «Узел ослаблен», «Принято», «Привал», «Сохранить и уйти», «Ещё один ряд» and «Дней в Башне» (REQ-3310). Closed by: a unit test with one assertion for each label.
2. Given every `ui.*` value, when it is compared with the rejected labels of REQ-3312 after trimming and folding case, then none is equal, and a fixture value «Серия» or «Осталось 5 минут» makes the check fail; the check also fails on a time phrase of the form «через N минут» in any `ui.*` value (REQ-3312). Closed by: the check's unit test and the lint verb's output on `ru.json`.
3. Given a player with no guiding threads left, when the task window renders the thread button, then it reads «Путеводная нить · 0», the number comes from the thread count field the server sends, and no string holding «нити закончились», «нитей не осталось» or «нет нитей» is on the screen (REQ-3322). Closed by: a Playwright test at a thread count of 0 and of 3.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Pin the keys of the labels in a test file `tests/unit/labels.test.ts`. Rewrite the stand-in values that break REQ-3312, for example `ui.play.answer` reads «Твой ответ» and must read «Твоё заклинание». Add the rejected-label check to `tools/static-checks.ts` with the labels read from `content/shaming.ru.json`, so the list lives in one file; until TSK-0680 exists, the check reads a short list kept in the test's fixture file and TSK-0680 moves it. The thread button takes `n` as a placeholder of `ui.task.thread` and never builds the number into the text.

## Depends on

- TSK-0676 (blocking): the labels are keys of the typed file, and a placeholder's type comes from the generated union.
- TSK-0680 (not blocking): the rejected labels move into `shaming.ru.json` there; this task runs on a fixture list until then.

The task window and its thread button are drawn by the epic realising ADR-0150. Until that epic exists, the criterion 3 test renders the stand-in play screen of the epic realising ADR-0030, which already carries the thread count.

## Evidence

Not yet.

## Left alone

The label «Нельзя узнать», which `ui.task.cantKnow` pins in the epic realising ADR-0250, and the word «Привал» as a time label, which the epic realising ADR-0090 builds.
