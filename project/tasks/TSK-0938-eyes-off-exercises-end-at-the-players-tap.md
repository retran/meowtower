---
id: TSK-0938
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0320
closes: [REQ-6136, REQ-6138]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An eye exercise that takes the eyes off the screen ends at the player's tap, with no number and no countdown

After this task, looking far out of the window and covering the eyes with the palms keep «Готово» inactive for the first 30 seconds with no countdown, end only at the player's tap or the parent's «Пропустить», and the familiar's line tells the length in a measure the player keeps without help.

## Acceptance criteria

1. Given the clock mocked, when each of the two eyes-off exercises opens, then «Готово» is inactive at 29 seconds and active at 30, no digit or countdown shows, the exercise is still open at 60 seconds, and a tap logs `eye_exercise_ended` with `endedBy: done` and `activeMs` (REQ-6136). Closed by: a Playwright test for each exercise.
2. Given the familiar's pool for the two exercises, when the check of ADR-0160 runs, then no line holds a digit or a time word, and a fixture line with «30 секунд» fails; given a line such as «Закрой глаза ладошками и дыши медленно-медленно, как спящий кот», then it passes (REQ-6138). Closed by: the check's test with both fixtures.
3. Given the lines, when the parent reads them at stage acceptance, then each names a measure the player keeps without help, such as slow breaths, and no count (REQ-6138). Closed by: the parent's judgement, because only a person can tell whether a measure is one the player keeps.
4. Given an eyes-off exercise the player doesn't end, when 120 seconds have passed since it began, then the adventure pauses by ADR-0030's idle pause, no `eye_exercise_ended` is logged, the exercise stays open, and after the resume it ends at the player's tap on «Готово» or the parent's «Пропустить» (ADR-0320, ADR-0360). Closed by: a Playwright test with the clock mocked.
5. Given blinking and the figure eight, when each runs, then it lasts 35 seconds, ends by itself with `endedBy: timer` and shows its card closing as its end; and given «Пропустить» switched on, then a tap at 1 second ends each of the four with `endedBy: skip` (ADR-0320). Closed by: a Playwright test for the four exercises.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the two eyes-off exercises end at the tap. The client starts ADR-0030's 90-second idle clock only when «Готово» turns active, so an exercise the player never ends pauses the adventure 120 seconds after it began. I chose this reading of the two requirements on eye breaks together, as ADR-0320 did: during the first 30 seconds the player is doing the exercise, not doing nothing. The button turns active as an instant change of state with no sound event.

Add `eye_exercise_ended` with `kind`, `endedBy` and `activeMs`, the time the exercise was open while the adventure wasn't paused. ADR-0090's eye count and the day's active time read the exercise's length from it, because the length is no longer fixed. Write the eyes-off lines to `content/lines.ru.json`.

## Depends on

Nothing. The epic realising ADR-0090 supplies when an exercise is due, the order of the four and the parent's «Пропустить» switch, and the epic realising ADR-0030, which is done, the idle clock.

## Evidence

Not yet.

## Left alone

Whether the player rests during an eyes-off exercise. Nothing on the screen can tell, and the reversal condition on quick taps is the only watch.
