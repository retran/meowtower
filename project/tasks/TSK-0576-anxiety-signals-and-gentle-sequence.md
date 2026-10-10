---
id: TSK-0576
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0350, REQ-0352, REQ-0354]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server detects four anxiety signals, answers each with an easy task and a gentle scene, and lowers the frontier share after a second

After this task, three `alt` outcomes in a row, a rising share of rapid guesses, erasing with hesitation and «мне страшно» or «не хочу» in free text each log `anxiety_signal`, bring an easy task and then a campfire or funny scene, and a second signal in one session caps frontier tasks at 40 % of room slots until the game day changes.

## Acceptance criteria

1. Given a driven log for each of the four signals, when `next` is read, then each logs `anxiety_signal` with its kind `alt_run`, `rapid_guess_rise`, `erase_hesitation` or `free_text`, and the next task is an easy one (REQ-0350, REQ-0354). Closed by: four anxiety tests, one for each signal.
2. Given a signal, when the easy task's boundary closes, then a campfire scene follows after three «Не знаю» and a funny scene from the library follows after every other signal; after three `alt` outcomes the easy task is the one of TSK-0566 and never a second (REQ-0350). Closed by: the same four tests.
3. Given a session with 20 first attempts, when the share of rapid guesses among the last 10 is at least 20 % and at least 15 percentage points above the share among the first 10, then the signal fires, and with 19 first attempts it doesn't. Closed by: a unit test.
4. Given a second signal in one session, when the room slots are drawn, then at most 40 % of them are frontier tasks until the game day changes, and a first signal alone changes no share (REQ-0352). Closed by: a selection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the detector over the answer events and free text, with the thresholds ADR-0090 chose: the share test from the session's 20th first attempt, and erasing with hesitation as 3 or more erasures and a time over twice the template's `fluencyMs` on 2 of the last 3 tasks. Add the gentle sequence as the last timed event in the scheduler of TSK-0569, and pass the 40 % cap to the selection of ADR-0070 as a parameter it reads. The free-text triggers are ADR-0110's hand-written ones; until that epic exists the detector uses a fixed list of the two phrases.

## Depends on

- TSK-0566 (blocking): the easy task is a slot the plan holds.
- TSK-0569 (blocking): the sequence is a timed event in the scheduler.
- TSK-0575 (blocking): the campfire scene after three «Не знаю» is that task's offer.

The epic realising ADR-0070 applies the frontier cap in its selection; until it exists the cap is a value the stand-in order reads and a test checks.

## Evidence

Not yet.

## Left alone

How the report words these signals under «Ограничения», which ADR-0180's epic owns.
