---
id: TSK-0875
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5704, REQ-5708, REQ-5758, REQ-5784, REQ-5786, REQ-5788]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server runs a puzzle's own flow: unlimited answers, a three-rung ladder, one free thread and a box

After this task, the play routes open, move, answer, take a rung, take the free thread, box, unbox and close a puzzle, each idempotent by `clientSeq`, and the server sends no reference solution, full solution or untaken rung before the puzzle is solved.

## Acceptance criteria

1. Given a puzzle, when she answers wrong 5 times and then right, then each answer is a `puzzle_attempt`, the puzzle stays open after each wrong one and solves on the right one, and no third-attempt rule applies to it while an adventure task still allows no third attempt (REQ-5784, REQ-5788). Closed by: an integration test over both flows.
2. Given her second wrong answer on a puzzle, when the familiar offers it, then it offers one free guiding thread for that puzzle's ladder, once for each puzzle, taking it opens the ladder with no spend and the rung is a `free_step`, and the thread never enters her stock (REQ-5786). Closed by: an integration test over the thread ledger.
3. Given the ladder, when it opens for one thread, then `thread_spent` carries `hint_ladder` and the puzzle's id, rungs 2 and 3 then cost nothing, and each rung is a `puzzle_hint` with `ladderOpenedBy` `thread` or `free_step`; every rung is fixed approved text with no model call (REQ-5758). Closed by: an integration test and a recording gateway that finds no call.
4. Given an unsolved or boxed puzzle, when the ledgers are read, then nothing is taken or withheld from experience, star yarn, shards, buttons, threads, quest progress, streak or titles (REQ-5708). Closed by: a ledger diff over a fixture day.
5. Given a boxed puzzle, when she takes it out with fewer than 3 open, then it is open again, and with 3 open the request is refused, so she puts one away before she takes one out (REQ-5704). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the routes, each replaying a move through the widget's rules module (TSK-0870). When the server's replay refuses a move it returns its own state and the widget redraws it. Up to 300 moves a puzzle a game day are logged one by one; past that the whole state travels on the move route, passes the rules module's check, and is written in one `puzzle_move` with `capped: true` at most once a minute, per ADR-0280 and ADR-0460. A failed queue entry leaves the queue when its hash changes. A check that throws is logged `not_judged` and counts neither toward the second miss nor in `puzzle_solved`.

The backpack pocket of ADR-0080 doesn't serve puzzles, because it belongs to rooms and floors.

## Depends on

- TSK-0870 (blocking): the routes replay moves through the rules modules.
- TSK-0873 (blocking): the routes serve only approved content.
- TSK-0876 (blocking): the routes write those event types.

The epics realising ADR-0030, ADR-0080 and ADR-0220 supply the queue, the attempt flow's thread ledger and the ladder's price; this task builds the puzzle's own flow beside them.

## Evidence

Not yet.

## Left alone

The Diary pages that call the routes, which TSK-0871 draws, and the rewards a solved puzzle gives, which TSK-0878 builds.
