---
id: TSK-0760
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5016, REQ-5022]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Time on the screens without tasks counts for the eyes, and the clock check skips a task's own content

After this task, time on a screen without tasks counts in the day's active time and in the 20-minute eye count whenever she spends it, a due eye exercise plays at once on those screens, a due soft stop waits for her return to the adventure, and the screen check fails on a display of her own time while it passes a timetable or a clock face inside a task.

## Acceptance criteria

1. Given time spent on a screen without tasks during an adventure and again after the finale, when the time projection reads the log, then both spans count in the active time and in the eye count, a puzzle opened at a rest stop included (REQ-5016). Closed by: a time-projection test.
2. Given a rest stop that ended because she opened a puzzle, when the campfire scene itself is read, then ADR-0090's rule that rest stops don't count for the eyes still holds for the campfire and the puzzle's time counts (REQ-5016). Closed by: the time-projection test.
3. Given an eye exercise due while she is in the shop, when the boundary is reached, then the exercise plays at once; given a soft stop due there, then it waits and plays when she returns to the adventure (REQ-5016). Closed by: a state-machine test. On a puzzle the boundary is a moment outside a widget move, and a due soft stop plays at it, as ADR-0360 amends ADR-0210 and ADR-0280 decides.
4. Given one timetable task from the Sources track and one clock-reading task rendered with their content inside `data-task-content`, when the screen check runs, then it passes; given the same text placed outside that subtree, then it fails (REQ-5022). Closed by: a second Playwright case beside the existing screen check.
5. Given a display of her own current or elapsed time anywhere outside a task's content, when the screen check runs, then it fails (REQ-5022). Closed by: the same Playwright case with a fixture element.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the time projection of ADR-0090 so a screen without tasks counts in active time and in the eye count at any moment, and stops excluding the span after the finale. Every moment on those screens is a boundary, so a due eye exercise plays there at once, as ADR-0090 already does after the finale. A due soft stop waits on a screen without tasks other than a puzzle until she returns to the adventure; I chose this in ADR-0210 because the soft stop offers to save the adventure, which means nothing in the shop. On a puzzle the soft stop plays at the puzzle's boundary, which ADR-0280's epic defines, so this task leaves the puzzle case to it.

Have the task renderer of ADR-0040 mark the subtree of a task's content `data-task-content`, and make the screen check of ADR-0090 skip every element inside it. The check keeps failing on any text matching a clock, a countdown or a minute count everywhere else.

An adventure day for the three-day rule becomes a game day on which a task or a scene of that adventure was shown, as ADR-0210 amends SPC-0030. I chose this over "active time in the adventure", because a visit to the shop during an unfinished adventure moves it no step and would otherwise use up one of its three days.

## Depends on

- TSK-0759 (not blocking): the screens it opens are the ones this task counts; either task can land first, because this task's tests use a stand-in screen.

The epic realising ADR-0090 supplies the time projection and the screen check this task changes; if it isn't built when this task starts, this task changes the existing projection in `src/engine/projections/` and the check in `tests/`.

## Evidence

Not yet.

## Left alone

The eye exercise's own length and wording, and the content of any task, which ADR-0090 and ADR-0040 own.
