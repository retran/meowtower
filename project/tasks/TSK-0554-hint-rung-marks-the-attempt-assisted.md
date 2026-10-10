---
id: TSK-0554
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0530]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A bought hint rung marks the attempt as assisted with the deepest rung

After this task, buying a rung before answering logs `hint_shown`, the attempt's `attempt_submitted` carries `assisted: true` and `hintLevel` equal to the deepest rung shown, and a resumed ladder shows the rungs she saw without charging again.

## Acceptance criteria

1. Given an attempt on which the player bought rung 1 and then rung 2, when she answers, then `attempt_submitted` carries `assisted: true` and `hintLevel: 2` (REQ-0530). Closed by: an integration test.
2. Given an attempt with no rung bought, when she answers, then `assisted` is false and `hintLevel` is 0 (REQ-0530). Closed by: an integration test.
3. Given a rung request for a rung past the item's `hintMaxLevel` and one that skips a rung, when each arrives, then the server answers `400 hint_level_beyond_ladder` and `400 hint_level_skipped` and logs and charges nothing. Closed by: an integration test for each.
4. Given a hint request repeated under a new `clientSeq` after a resume, when it arrives, then the same rung returns and nothing is charged; given the task resumed with its ladder open, then the rungs she saw show with no new `hint_shown`. Closed by: an integration test.
5. Given a rung's reply, when it is read, then it carries the rung's level and text and the thread stock after the charge. Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Update the hint route of `src/server/play.ts` to compute `assisted` and `hintLevel` from the flow's events, and fix the item's `hintMaxLevel` when the task is shown, in the `items` row, so later requests read it from there. The price is the ledger's: the first tap on the thread button opens the ladder for 1 thread and each later rung is free, as SPC-0080 states after ADR-0220; the charge goes through TSK-0555's ledger function, and the requirement for the price is REQ-5100, which ADR-0220's epic closes.

The rungs themselves come from the template's graph, which TSK-0551 tests, and the familiar's framing line beside a rung is ADR-0220's.

## Depends on

- TSK-0548 (blocking): the flow whose events the marks derive from.
- TSK-0555 (blocking): the ledger function that charges the opening.

## Evidence

Not yet.

## Left alone

The ladder's length, framing lines and the fluent fact's no-ladder rule, which ADR-0220's epic builds.
