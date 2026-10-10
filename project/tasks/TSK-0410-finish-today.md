---
id: TSK-0410
artifact: task
status: done
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

Collected on 2026-10-10 on the Mac, at commit d730d97 of the branch `tsk-0410-finish-today`, in pull request #7. Both criteria are met; the stop screen's Playwright test hands the client the packet and doesn't finish a real day, for the reason below.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (48 Vitest files with 432 tests, and 43 Playwright tests passed, 1 skipped; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1, REQ-2444: `tests/integration/finish-today.test.ts` logs `finish_today` through the parent route with a parent session. Mid-task, `next` returns the open task, and after its answer `stop_offer` with `canExtend: false`, again on a repeat. With a scene open it returns the scene first and the offer after the choice. Without a parent session the route gets `401 parent_session_missing` and logs nothing.
- Criterion 2, REQ-2444: with fake timers `extend` gets `409 day_finished` at 10:00 and at 03:59 the next calendar day, and at 04:00 it is accepted, logs `extension` and `next` returns a task again. Outside a finished day `extend` logs `extension` and nothing else. `tests/e2e/stop-offer.spec.ts` hands the client the offer: with `canExtend: false` the screen has no «Ещё один ряд» and «Сохранить и уйти» sends the pause with `leave`; with `canExtend: true` the button asks the server, and a `409 day_finished` leaves the screen without it.

Choices made here, because the approved records left them open:

- The stop screen's Playwright test serves the packet from the test, because a real `finish_today` closes the shared e2e server's game day for every later test; the server rule has the fake-clock tests above.
- `finish_today` has an empty payload, and the game day it closes is the one its time falls on in the zone of the session asking, as TSK-0400's `gameDayOf` computes it.
- `extend` logs `extension` with 20 minutes, the length SPC-0090 gives an extension, until ADR-0090's epic adds the soft stop.
- No `soft_stop` event is logged for this offer, because it has no active time to carry.

## Left alone

The soft stop at 60 minutes and extensions of 20 minutes, which ADR-0090 defines.
