---
id: TSK-1002
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-0314, REQ-0316, REQ-0342, REQ-0344, REQ-0346, REQ-0350, REQ-1106, REQ-6430, REQ-6432]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The rest stop is offered after three «Не знаю» and on fatigue, ends at her tap, and an eye exercise ends by her hand unless the parent switched skipping on

After this task, three «Не знаю» in a row bring an easy task and then the campfire as the rest stop's offer, a fatigue offer comes at most once in 10 minutes from the last offer, the campfire ends at her tap or after 5 minutes, and an eye exercise lasts at least 30 seconds, ends by «Готово» when it takes her eyes off the screen, and offers «Пропустить» only when the parent switched it on.

## Acceptance criteria

1. Given three «Не знаю» in a row, when the next task is chosen, then it is an easy one and the offer of a rest stop plays after it as the campfire scene; given an anxiety signal of another kind, then a funny scene from the library plays instead (REQ-0346, REQ-0350). Closed by: a unit test over both signals.
2. Given a declined offer, when the «Привал» button is read, then it waits for nothing, and after a rest stop that ran it waits 10 minutes counted from the stop's end; the button is on screen throughout play (REQ-0342, REQ-0344). Closed by: a component test with a fake clock.
3. Given a fatigue signal, when it fires twice within 10 minutes of the last offer, taken or declined, then one offer is made, while the offer after three «Не знаю» comes on every such run (REQ-1106, REQ-0346). Closed by: a unit test over the offer timer.
4. Given a campfire, when she taps at 20 seconds, then it ends, and with no tap it ends at 5 minutes; every `rest_stop_ended` of a shop, forge or other screen without tasks carries the reason `screen_opened` with the screen's name (REQ-0342). Closed by: a time-projection test and a log test.
5. Given the parent's skip setting off, when an eye exercise plays, then no skip control is drawn and the exercise lasts at least 30 seconds, at most 40 when it keeps her eyes on the screen; given it on, then «Пропустить» ends it from the first second (REQ-0314, REQ-0316, REQ-6430). Closed by: a component test for both settings.
6. Given an exercise that takes her eyes off the screen and an idle pause, when the pause ends, then the exercise is still open and ends only at «Готово» or «Пропустить» (REQ-6432). Closed by: a component test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 26, 27, 29, 30 and 78: the timed events of ADR-0090, the offer interval, the campfire's end, the `screen_opened` reason and the eye exercise's two rules. The exercise's Russian wording stays the owner's content under ADR-0160.

## Depends on

- TSK-1001 (not blocking): it changes the soft stop beside this task, and either can land first.

The epics realising ADR-0090 and ADR-0320 supply the rest stop, the gentle sequence and the exercise; until they exist, the tests run on fixture scenes and a fixture exercise, and the real scenes are left to those epics.

## Evidence

Not yet.

## Left alone

The soft stop and the puzzle boundary, which TSK-1001 changes, and the exercises' content, which ADR-0320 owns.
