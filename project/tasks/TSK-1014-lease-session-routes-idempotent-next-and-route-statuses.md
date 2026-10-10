---
id: TSK-1014
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-0204, REQ-0220, REQ-0222, REQ-0226, REQ-2432, REQ-2438]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A moved lease, a resumed adventure and a repeated `next` each have one answer a route test can assert

After this task, `409 lease_moved` applies only while another device holds the lease, the session routes name what they return, `next` is idempotent, and each check and estimate state has a status of its own.

## Acceptance criteria

1. Given a device whose lease expired with no other holder, when it sends an answer, then the server records the attempt, or `attempt_late`, and replies with its `AnswerOut` holding the outcome and the grants, the device takes no lease, and its next `next` gets `409 session_ended`; given another device holding the lease, then the answer gets `409 lease_moved` (REQ-0220, REQ-0222, REQ-2438). Closed by: two route tests.
2. Given `POST /api/session/start`, when a session starts, then it replies `{ sessionId, adventureId }` with `adventureId` null for a Session 0; given `POST /api/adventure/resume`, then it opens a new session, logs `session_started` and `device_lease_taken` and returns the new `sessionId` in `ResumeOut`; and `POST /api/session/:id/resume` answers 404 (REQ-0204, REQ-0226). Closed by: route tests.
3. Given `GET /api/session/:id/next` called three times while its packet is open, when the log is read, then it holds one `item_shown`, each call returns the same packet, a device that isn't the lease holder gets `409 lease_moved`, and each call counts towards the rate limit (REQ-2432, REQ-0220). Closed by: a route test.
4. Given a self-check with no estimate, the fourth check, a check after the item's window and an unparseable `checkRaw`, when each is sent, then the replies are `422 estimate_missing`, `409 check_limit_reached`, `409 check_late` and `422 check_unparsed`, and the last logs nothing and counts no check. Closed by: four route tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `src/server/play.ts`; the routes are at `/api/session/start`, `/api/adventure/resume`, `/api/session/:id/next` and `/api/session/:id/answer`. The message «Приключение продолжено в другом месте» would be false where no other device holds the lease, and REQ-2438 asks for the outcome and the grants together, which is why the late answer gets its `AnswerOut`. A repeated `next` logs a new packet's events only after the client acted on the previous one, so it needs no `clientSeq`. Remove the resume route from `src/shared/api.ts` as well, because a session that has ended has nothing to resume and the adventure route covers it.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The client's button to continue on `session_ended`, which the interface decision ADR-0150 owns.
