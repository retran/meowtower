---
id: TSK-1001
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-0320, REQ-0340, REQ-0362, REQ-0364, REQ-2444, REQ-5004, REQ-5012, REQ-5016, REQ-5728, REQ-5730, REQ-5731]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The soft stop plays at a puzzle's first boundary, a put-away closes that one puzzle, and the save route ends the day through a story scene

After this task, a due soft stop on a puzzle plays at the first moment outside a widget move with the offer to save the adventure or put the puzzle away, the puzzle branch stays reachable after «Закончить на сегодня» and after a put-away, and `POST /api/session/:id/save` logs `save_accepted` and returns the closing scene.

## Acceptance criteria

1. Given a day's active time that reaches the soft-stop point while she is on a puzzle opened at a rest stop, when a boundary comes, then the soft stop plays at the puzzle's next boundary, never inside a widget move, offering to save the adventure, and accepting closes the puzzle and saves the adventure (REQ-0320, REQ-5728). Closed by: a time-projection test with a fake clock.
2. Given the same time after the day's finale, when she is on a puzzle, then the soft stop plays at the next boundary and offers to put the puzzle away beside «Ещё один ряд» (REQ-5730, REQ-5731). Closed by: a time-projection test.
3. Given `finish_today` or a put-away, when she opens a puzzle, then `open` is accepted, the soft stop plays again at that puzzle's first boundary, and «Ещё один ряд» is offered only when no `finish_today` came that game day (REQ-0362, REQ-0364, REQ-2444, REQ-5012). Closed by: a time-projection test over both orders of events.
4. Given an accepted save, when she returns on the same game day, then the adventure reopens and the soft stop plays at the entry scene with «Ещё один ряд», and the game starts no second new adventure that day (REQ-0340, REQ-5004). Closed by: a route test over the save and a second `next` call.
5. Given a due eye exercise, when she is on a puzzle, then it plays at the first moment outside a widget move, and on every other screen without tasks it plays at once, with that time counted toward the next one (REQ-5016). Closed by: a time-projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `POST /api/session/:id/save` with `{ reason: "adventure" | "puzzle", clientSeq }`, change the soft-stop projection and the puzzle boundary as the amended ADR-0090, ADR-0210 and ADR-0280 lines say (ADR-0360 entries 22 to 25 and 28), and keep the day's play to one new adventure. The game has no daily maximum: nothing here closes a branch for the rest of the day.

## Depends on

- TSK-1002 (not blocking): it changes the rest stop's events beside this task, and either can land first.

The epics realising ADR-0090 and ADR-0280 supply the day plan, the soft stop and the puzzle branch; until they exist, the tests run on a fixture day plan and a fixture puzzle that reports its widget moves, and the real puzzle is left to that epic.

## Evidence

Not yet.

## Left alone

The rest stop's button and offers, which TSK-1002 changes, and the puzzles themselves, which ADR-0280 owns.
