---
id: TSK-0440
artifact: task
status: approved
revised: 2026-09-29
epic: EPC-0010
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The stage 0 write routes answer 404

After this task, the server no longer mounts `POST /api/stage0/write` or `GET /api/stage0/write/:id`, and the version 0 `attempt_submitted` events they wrote stay readable. ADR-0360 entry 3 settled SPC-0010's open finding this way, because a write route that bypasses the play API puts events in her log that no play rule checked. It closes no requirement of its own: the entry settles a conflict between ADR-0010 and ADR-0190, not a requirement.

## Acceptance criteria

1. Given the server, when a paired device calls `POST /api/stage0/write` or `GET /api/stage0/write/:id`, then each answers 404; and without a device token each still answers 401, because the device check runs before routing. Closed by: a route test, and `tests/unit/pairing.test.ts`, which keeps both routes in its list of routes that answer 401 without a token.
2. Given a fixture database whose version 0 `attempt_submitted` events were appended through `appendEvents`, as the routes wrote them, when the server starts and the projections rebuild, then `eventByIdemKey` reads each one back unchanged and the rebuild succeeds. Closed by: an integration test on that fixture.
3. Given the crash test, when its first `describe`, which writes through the stage 0 route, is deleted, then its answer-route `describe` still kills the process after each reply 100 times and finds the answer in `events` 100 times out of 100. Closed by: the crash test's report, which stays the evidence for REQ-2508 and ADR-0010's first reversal condition.
4. Given `tests/unit/stage0.test.ts` deleted, when the test verb runs, then TSK-0295's `tests/integration/log-write-failure.test.ts` still proves the 503 `log_write_failed` reply on a play route. Closed by: the test verb's output, and a line in TSK-0200's Evidence saying its criterion 8 is now proved by that test, because the route criterion 8 names no longer exists.

## What to do

Remove `mountStage0` from `src/server/app.ts`, delete `src/server/stage0.ts` and `tests/unit/stage0.test.ts`, delete the crash test's stage 0 `describe`, and add the route test, the fixture test and the line in TSK-0200's Evidence. The variant of the crash test that restarts the Docker virtual machine, which the owner runs from the stage 0 checklist, writes through the play API's answer route, because after this task no other write route remains.

## Depends on

TSK-0030, because its crash test writes through these routes.

## Evidence

Not yet.

## Left alone

The play API's answer route, because EPC-0030 builds it and this task only removes routes.
