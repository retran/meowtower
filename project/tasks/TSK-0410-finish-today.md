---
id: TSK-0410
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2444]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# «Закончить на сегодня» brings a stop offer with no extension for the rest of the game day

After this task, the parent's `POST /api/parent/finish-today` logs `finish_today`, the next boundary returns `stop_offer` with `canExtend: false`, and `extend` gets `409 day_finished` until the game day ends at 04:00.

## Acceptance criteria

1. Given a session mid-task, when the parent calls `POST /api/parent/finish-today`, then `GET /api/session/:id/next` returns the task's review first and `stop_offer` with `canExtend: false` at the next boundary, after the answer with its review or after a scene. Closed by: the finish-today test.
2. Given `finish_today` on a game day, when `extend` arrives at any time before 04:00, then it gets `409 day_finished`, and the client shows the stop offer without «Ещё один ряд»; after 04:00 `extend` is no longer refused for that reason (REQ-2444). Closed by: the finish-today test with a fake clock and a Playwright test of the stop screen.

## What to do

Add the finish-today route behind the parent session, `stop_offer` at the next boundary, `POST /api/session/:id/extend` with its `409 day_finished`, and the stop screen without «Ещё один ряд», as SPC-0030 states them, and the schema of `finish_today` if EPC-0020's tasks haven't added it. Until ADR-0090's epic adds the soft stop, `stop_offer` comes only from this route, `extend` outside a finished day logs `extension` and changes nothing else, and accepting the offer sends the pause with `leave`. ADR-0190's definition of done applies.

## Depends on

TSK-0390, because the parent session guards the route. TSK-0330, because the offer comes through `next` at its boundaries. TSK-0400, because the refusal lasts until the game day that task's boundary function ends.

## Evidence

Not yet.

## Left alone

The soft stop at 60 minutes and extensions of 20 minutes, which ADR-0090 defines.
