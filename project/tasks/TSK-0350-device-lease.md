---
id: TSK-0350
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0202, REQ-0220, REQ-0222]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One device holds the adventure through a lease, and the displaced device turns view-only

After this task, a device takes the lease only on a tap, keeps it by a heartbeat, loses it to another device's tap or to 45 seconds of silence, and the device it leaves turns view-only while none of its answers is lost.

## Acceptance criteria

1. Given two browser contexts on one adventure, when the second taps to continue, then the first shows «Приключение продолжено в другом месте» within 5 seconds and its next answer gets `409 lease_moved` (REQ-0220, REQ-0222). Closed by: a Playwright test.
2. Given two open contexts, when neither is tapped for 10 minutes, then the log holds no `device_lease_taken` beyond the first. Closed by: the same Playwright test with a fake clock.
3. Given the holder stops its heartbeat, when 45 seconds pass, then the server logs `adventure_paused` with `lease_expired` and `session_ended` as device `server`, and the adventure's state equals the one a `leave` at the same step gives (REQ-0202). Closed by: an integration test that compares the two projections.
4. Given a device that lost the lease with an answer to send, when the item has no attempt yet, then the answer is logged as the attempt and the new holder's next packet carries its outcome; when the item has one, the answer is logged as `attempt_late` with no verdict and no grants. Closed by: an integration test over both cases.

## What to do

Take the lease in `POST /api/session/start` and `POST /api/adventure/resume` and log `device_lease_taken`. Add `POST /api/session/:id/heartbeat`, the 45-second expiry, the `409 lease_moved` check on every state-changing route, the `lease_moved` message on the old device's stream, and the late-answer rule, as SPC-0030 states them. Add the schema of `attempt_late` if EPC-0020's tasks haven't. On the client, send the heartbeat every 15 seconds, and replace the play screen with the view-only screen and its button to continue here on `lease_moved` or a `409 lease_moved` reply. ADR-0190's definition of done applies.

## Depends on

TSK-0320, because `lease_moved` travels on its SSE stream. TSK-0340, because the view-only screen replaces its play screen.

## Evidence

Not yet.

## Left alone

What the resume returns (TSK-0360), and how the knowledge model weighs `attempt_late`, which ADR-0060 defines.
