---
id: TSK-0877
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5722, REQ-5724, REQ-5725, REQ-5726, REQ-5728, REQ-5730, REQ-5731]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A puzzle opens from a rest stop, its minutes count towards the eyes and the soft stop, and the soft stop waits for a boundary

After this task, opening a puzzle at a rest stop ends the campfire scene with `rest_stop_ended` reason `puzzle_opened`, closing it returns her to the adventure's next step, puzzle minutes count in the day's active time and the eye count, and the soft stop on a puzzle plays at the first boundary with «Отложить головоломку» beside «Ещё один ряд».

## Acceptance criteria

1. Given an open puzzle and a rest stop, when she opens the puzzle, then the campfire scene ends with `rest_stop_ended` reason `puzzle_opened`, and when she closes it she returns to the adventure's next step after the rest stop (REQ-5722, REQ-5724, REQ-5725). Closed by: an integration test and a Playwright test.
2. Given a day with puzzle play, when the time projections run, then puzzle time counts in the day's active time, the 20-minute eye count excludes only eye exercises and the campfire scene, and a puzzle opened from a rest stop counts towards the next eye exercise (REQ-5726, REQ-5728). Closed by: the time projection tests.
3. Given the day's active time reaches the soft-stop point on a puzzle after the finale, when she is mid-move, then nothing plays, and at the next boundary, the moment after the server's reply to an answer or a hint, the soft stop plays with «Отложить головоломку» beside «Ещё один ряд» (REQ-5730, REQ-5731). Closed by: a time test and a Playwright test.
4. Given a puzzle opened at a rest stop before the finale, when the soft-stop point comes, then the soft stop plays at the first reply with the offer to save the adventure beside «Ещё один ряд», and accepting closes the puzzle and saves the adventure. Closed by: a time test.
5. Given «Отложить головоломку», when she presses it, then it closes that puzzle without boxing it and writes `save_accepted` reason `puzzle`, and the puzzle branch stays reachable; after «Закончить на сегодня» the adventure closes and the soft stop plays at the first boundary of each puzzle she opens with no «Ещё один ряд» (ADR-0360, ADR-0460). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the rest stop, the eye count and the soft stop as ADR-0280 amends ADR-0090 and ADR-0360 revises. «Ещё один ряд» moves the soft-stop point 20 minutes on, as ADR-0090 sets. A boundary is never in the middle of a move, and every moment outside a widget move is a boundary for the eye exercise, because the exercise lasts 35 seconds and returns her to the same board. I chose the next step after the rest stop as the return point, as ADR-0280 does.

## Depends on

- TSK-0875 (blocking): the flow's replies are the boundaries.
- TSK-0876 (blocking): the reasons are fields of those event types.

The epic realising ADR-0090 supplies the day's active time, the soft stop and the rest stop; this task changes their rules for puzzles. The save route for `puzzle` returns the branch and ends no play, per ADR-0460.

## Evidence

Not yet.

## Left alone

The wording of the soft stop's offer, which ADR-0160's content owns, and the absence of a daily maximum, which no task here changes.
