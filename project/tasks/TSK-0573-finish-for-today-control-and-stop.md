---
id: TSK-0573
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0360, REQ-0362, REQ-0364]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Закончить на сегодня» in the Parent Room brings the soft stop at the next boundary with no «Ещё один ряд»

After this task, the Parent Room offers «Закончить на сегодня» behind the PIN, using it logs `finish_today`, the soft stop plays at the next boundary with `canExtend: false`, and the adventure stays closed until the game day changes.

## Acceptance criteria

1. Given a parent session, when the Parent Room's stand-in page is opened, then it holds the «Закончить на сегодня» control, and without a parent session the route answers `401` and logs nothing (REQ-0360). Closed by: a Playwright test and the route's integration test.
2. Given `finish_today` during a task, when the answer's review closes, then the next packet is `stop_offer`, and not before (REQ-0362). Closed by: an integration test with a task open.
3. Given `finish_today` earlier on the same game day, when the soft stop plays, then it carries `canExtend: false` and the client shows no «Ещё один ряд» (REQ-0364). Closed by: an integration test and a Playwright test of the stop screen.
4. Given a game day that has changed at 04:00, when the adventure is opened, then it is no longer closed by `finish_today`. Closed by: a test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

TSK-0410 already built the `POST /api/parent/finish-today` route, the refusal of `extend` and the stop screen without the extension button. This task adds the control to the Parent Room's stand-in page behind the PIN, and routes the stop through the scheduler of TSK-0569 so `finish_today` plays the soft stop at the next boundary, whatever the day's active time. The control is the parent's way to end a long day, so it needs no number from her.

## Depends on

- TSK-0571 (blocking): it builds the soft stop that `finish_today` brings forward.

The epic realising ADR-0180 draws the Parent Room's page; this control moves there when that epic lands.

## Evidence

Not yet.

## Left alone

Puzzles that stay open after `finish_today`, which ADR-0280's epic holds.
