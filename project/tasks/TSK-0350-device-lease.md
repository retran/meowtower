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

## Cover

- Checks: tests/integration/lease.test.ts, tests/e2e/lease.spec.ts
- Failing run: project/evidence/a14ba87c4554.txt
- Landed in: 978ffc1
- Judgement: none

## Open review findings

An agent reviewed this record; a person has not. None is fixed, because each one changes the approved acceptance criteria and only the person who approved the task can change those.

1. REQ-0220 has no criterion showing a displaced device's `next`, hint or `pause` refused with `409 lease_moved` and nothing logged; "What to do" should name `next` beside "every state-changing route".
2. Criterion 1 checks the sentence only, not that the play controls are gone and the button to continue is shown; it also has the view-only device send "its next answer", which the screen should not allow. `tests/e2e/lease.spec.ts` posts the late answer from outside the screen.
3. No criterion says the heartbeat keeps the lease; a lease that runs out 45 seconds after the tap passes all four. `tests/integration/lease.test.ts` has the test.
4. Criterion 3 covers a stopped heartbeat only, not the change of device within 45 seconds that SPC-0030 gives its own path: the old session's pause with `lease_expired` first, then `device_lease_taken`.
5. Criterion 2 does not say what is open or which sessions count. `tests/e2e/lease.spec.ts` counts the first session only and never opens the second context's play screen.
6. Criterion 4 leaves out SPC-0030's second late-answer case, where the lease has expired and no device holds it; neither Left alone nor TSK-0380 owns it.
7. Preference: criteria 2 and 4 name no requirement, though both files their evidence under REQ-0220.
8. Preference: the tap-only lease, the 15-second heartbeat and the 45-second expiry are stated without reasons or a citation of ADR-0030.
9. Preference: criterion 3 does not name the projections it compares.

## Evidence

Not yet.

## Left alone

What the resume returns (TSK-0360), and how the knowledge model weighs `attempt_late`, which ADR-0060 defines.
