---
id: TSK-0350
artifact: task
status: done
revised: 2026-09-29
epic: EPC-0030
closes: [REQ-0202, REQ-0220, REQ-0222]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One device holds the adventure through a lease, and the displaced device turns view-only

After this task, a device takes the lease only on a tap, so two open devices don't take it back and forth (ADR-0030). It keeps the lease by a heartbeat every 15 seconds, and loses it to another device's tap or to 45 seconds of silence. The device it leaves turns view-only, and none of its answers is lost.

## Acceptance criteria

1. Given two browser contexts on one adventure, when the second taps to continue, then the first shows «Приключение продолжено в другом месте» within 5 seconds, its play controls are gone, and the button to continue here is shown (REQ-0220, REQ-0222). An answer already queued on the first device, sent from outside the screen, gets `409 lease_moved`. Closed by: a Playwright test.
2. Given a displaced device, when it sends `next`, a hint request or `pause`, then each gets `409 lease_moved` and the log gains no event (REQ-0220). Closed by: an integration test that counts the events before and after.
3. Given both contexts have paired and one has tapped, when neither is tapped again for 10 minutes on a fake clock, then the log holds exactly one `device_lease_taken` on the adventure (REQ-0220). Closed by: a Playwright test.
4. Given the holder stops its heartbeat, when 45 seconds pass, then the server logs `adventure_paused` with `lease_expired` and `session_ended` as device `server`, and the `adventures` projection equals the one a `leave` at the same step gives (REQ-0202). Given the holder sends a heartbeat every 15 seconds for 90 seconds, then it logs no expiry. Closed by: integration tests that compare the two `adventures` projections and count the events.
5. Given another device taps within 45 seconds, when the lease moves, then the old session's `adventure_paused` and `session_ended`, both `lease_expired` and as device `server`, come before the new session's `device_lease_taken` (REQ-0202). Closed by: an integration test over the event order.
6. Given a device that lost the lease to another device with an answer to send, when the item has no attempt yet, then the answer is logged as the attempt and gets `409 lease_moved`; when the item has one, the answer is logged as `attempt_late` with no verdict and no grants, and gets `409 lease_moved` (REQ-0220). Given the lease only expired and no device holds it, then the same two cases get their reply with `200` (REQ-2434). Closed by: integration tests over the four cases.

## What to do

Take the lease in `POST /api/session/start` and log `device_lease_taken`; `POST /api/adventure/resume` takes it when TSK-0360 adds that route. Add `POST /api/session/:id/heartbeat`, the 45-second expiry, the `409 lease_moved` check on `next` and on every state-changing route, the `lease_moved` message on the old device's stream, and the late-answer rule, as SPC-0030 states them. Add the schema of `attempt_late`, and `lease_expired` as a reason of `adventure_paused` and `session_ended`. On the client, send the heartbeat every 15 seconds, and replace the play screen with the view-only screen and its button to continue here on `lease_moved` or a `409 lease_moved` reply. ADR-0190's definition of done applies.

## Depends on

TSK-0320, because `lease_moved` travels on its SSE stream. TSK-0340, because the view-only screen replaces its play screen.

## Cover

- Checks: tests/integration/lease.test.ts, tests/e2e/lease.spec.ts
- Failing run: project/evidence/a14ba87c4554.txt
- Landed in: 978ffc1
- Judgement: none

## Evidence

Collected on 2026-09-29 on the Mac. Every criterion is met.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree b66cc28d4ed8, records format 3d41ebd9d638, lint 324b876fed6f, check 593473c56e0e, test 770367ba68cb and build 98a85cd26cf3, kept as project/evidence/<record>.txt. Vitest 379 tests and Playwright 27 tests passed.
- Criterion 1, REQ-0220 and REQ-0222: `tests/e2e/lease.spec.ts` shows the sentence within 5 seconds, no answer field, the button to continue here, and `409 lease_moved` for an answer sent from the page.
- Criterion 2, REQ-0220: `tests/integration/lease.test.ts` counts no new event after a displaced `next`, hint and pause.
- Criterion 3, REQ-0220: `tests/e2e/lease.spec.ts` counts one `device_lease_taken` after 10 minutes on a fake clock.
- Criteria 4 and 5, REQ-0202: `tests/integration/lease.test.ts` compares the `adventures` rows after an expiry and a leave, checks the heartbeat keeps the lease over 90 seconds, and checks the old session's pause and end come before `device_lease_taken`.
- Criterion 6, REQ-0220 and REQ-2434: `tests/integration/lease.test.ts` covers the attempt and `attempt_late` cases, for a moved lease with `409` and for an expired one with `200`.
- Changes the task forced: the two Playwright workers took the lease from each other on the shared server, so `playwright.config.ts` runs one worker; and the recorder in `tests/e2e/fixtures.ts` checks only the headers of an event stream, whose body never ends.
- Not done: `POST /api/adventure/resume` does not exist, so it takes no lease; TSK-0360 adds it.

## Left alone

What the resume returns (TSK-0360), and how the knowledge model weighs `attempt_late`, which ADR-0060 defines.
