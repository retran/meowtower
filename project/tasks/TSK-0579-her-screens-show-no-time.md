---
id: TSK-0579
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0300, REQ-0302, REQ-0356, REQ-0358]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Her screens show no timer, no clock, no minute count and no moving or waiting hourglass

After this task, a Playwright walk of every player screen finds no text that reads as a clock, a countdown or a minute count, no hourglass in the task window or on a timed event's screen, no animation on the «Мера» symbol and no `wait` or `progress` pointer, and the lines that announce timed events hold no digit and no time word.

## Acceptance criteria

1. Given every player screen on the tablet and desktop viewports, when the walk finishes, then no text matches a clock, a countdown or a minute count outside the subtree marked `data-task-content`, and a second case with a timetable task and a clock-reading task passes while the same text outside the subtree fails (REQ-0300). Closed by: a Playwright test.
2. Given the line pools for the knot's announcement, an eye exercise, a rest stop, the soft stop and an extension, when the check runs, then no line holds a digit or a word of the time-word list, and a fixture line with «минут» makes it fail (REQ-0302). Closed by: the content check's output and its failing fixture.
3. Given the pool, when the parent reads it, then the parent judges that none hints at a countdown (REQ-0302). Closed by: a person's judgement at stage acceptance, because a hint at a countdown depends on how the sentence feels to her.
4. Given the styles and the assets, when they are searched, then the «Мера» symbol has no animation, no hourglass asset sits in the task window or on a timed event's screen, and no style sets `cursor: wait` or `cursor: progress` (REQ-0356, REQ-0358). Closed by: a Playwright test and a search of the stylesheets.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Playwright walk to `tests/e2e/`, the pool check to the verify step, and the style search to `npm test`. The waiting sign is ADR-0030's story waiting scene; where a screen lacks it, this task adds it from the library. The «Мера» symbol is drawn once from a static asset.

## Depends on

Nothing in this epic; the walk runs on the screens that exist and gains each screen that later tasks add. The epic realising ADR-0160 supplies the time-word list; until it exists the check uses a list this task writes, in Russian, of «минута», «секунда», «час», «таймер», «осталось» and their forms.

## Evidence

Not yet.

## Left alone

Time inside a task, which ADR-0040's renderer marks, and the iPad's own status bar clock, which the game can't draw over; the owner hears of it before stage acceptance.
