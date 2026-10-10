---
id: TSK-1158
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Pocket-thread and twin events carry what the ledger needs, and a puzzle's state and save route follow the settled rules

After this task, `pocket_thread_given` and `twin_unavailable` carry the fields the ledger reads, a puzzle past the 300-move cap sends its whole state to be checked, a failed queue entry leaves when its data changes, and a save for a puzzle ends no play. The task closes no requirement the decision addresses; the entries it settles (19 and 48 to 51) cite none that ADR-0460 addresses.

## Acceptance criteria

1. Given a pocket thread given in a room, outside any room and on a floor, when `pocket_thread_given` is logged, then it carries `itemId`, `roomId` (null outside a room) and `floorId`, and `twin_unavailable` carries the `itemId` of the original task; given a second thread in the same room, then the ledger's limit of one a room refuses it. Closed by: an integration test over the three places.
2. Given a puzzle past 300 moves, when the client sends the widget's whole state, then it goes on the route that carries single moves at most once a minute and with every answer and close, and the server logs a valid state as a `capped` `puzzle_move`, refuses an invalid one with `puzzle_move_refused`, and a reconnect restores the last accepted state. Closed by: a route test over a valid state, an impossible board and a reconnect.
3. Given a failed entry of `content/puzzles/queue.json` whose hash differs from its puzzle's current hash, when `puzzles:prepare` runs, then the entry is removed before anything else. Closed by: a unit test over a changed and an unchanged hash.
4. Given `POST /api/session/:id/save` with the reason `puzzle`, when it is accepted, then it logs `save_accepted`, closes that one puzzle, returns the puzzle branch and ends no play; given the reason `adventure`, then the reply is SPC-0090's. Closed by: a route test over both reasons.
5. Given a puzzle opened from the Diary before the day's finale after a same-day `save_accepted`, when it opens, then the offer to save the adventure shows with «Ещё один ряд» beside it, and accepting logs `save_accepted` with the reason `adventure`. Closed by: a Playwright test over the Diary path.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 19 and 48 to 51 of ADR-0460 as written, with the payloads added to ADR-0020's catalogue under the owners ADR-0460's Consequences name. The client's cadence of one state a minute is ADR-0280's own for a capped state; this task uses it unchanged.

## Depends on

Nothing. The epics realising ADR-0080 and ADR-0280 own the ledger and the puzzles; this task runs on their fixtures.

## Evidence

Not yet.

## Left alone

The puzzle rules module, which ADR-0280 owns, and the Russian wording of the offer, which ADR-0160 owns.
