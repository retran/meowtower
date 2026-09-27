---
id: TSK-0320
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2422, REQ-2424, REQ-2426, REQ-2432]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Repeated answers, hints, explanations and second attempts are recorded and charged once, and the SSE stream delivers the explanation

After this task, every state-changing request carries `clientSeq`, a repeat appends nothing and returns the first reply rebuilt from the log, each paid action has a charge key, the explanation is acknowledged at once and arrives on the SSE stream, and a runaway device gets `429`.

## Acceptance criteria

1. Given an answer already recorded, when the same `AnswerIn` arrives again with the same `clientSeq`, then the log gains no event and the reply equals the first (REQ-2432). Closed by: the idempotency test.
2. Given a hint already bought, when the same hint request arrives again with the same `clientSeq`, then one `thread_spent` exists for it and the thread stock drops by one (REQ-2422). Closed by: the idempotency test.
3. Given a second attempt already created, when the request repeats, then the reply carries the same parallel task and the same `itemId` (REQ-2426). Closed by: the idempotency test.
4. Given a paid explanation, when `POST /api/item/:itemId/explain` arrives, then the reply `pending` comes before any explanation text exists, `thread_spent` and `explanation_bought` are logged, and `explanation_ready` arrives on `GET /api/session/:id/events`, or the template explanation after 10 seconds (REQ-2424). Closed by: an integration test with a fake clock, which also reads the same message from `GET /api/session/:id/poll?after=<seq>`.
5. Given one device, when it sends 21 state-changing requests within one second, then the 21st gets `429`. Closed by: an integration test.

## What to do

Add `clientSeq` to every state-changing request body, and set `idem_key` to `<route>:<deviceId>:<clientSeq>` on the events each request logs. On a key already in the log, rebuild the reply from the events that key names. Add a charge key per paid action that ignores `clientSeq`: a hint per item and hint level, an explanation per item, a second attempt per item. Add `POST /api/item/:itemId/hint`, `/explain` and `/second-attempt`, the SSE stream and the poll route, each message carrying the `seq` of the event it reports, and the per-device rate cap, as SPC-0030 states them.

Stand-ins: a fixed starting thread stock in the stand-in adventure until ADR-0080's epic, the hint rungs and parallel twin of each stand-in task, and a stand-in template explanation in the `ru` language file until ADR-0120's epic. The epic's criterion 3 also needs the resume case, which TSK-0360 closes. ADR-0190's definition of done applies.

## Depends on

TSK-0300, because it keys the routes that task opens.

## Evidence

Not yet.

## Left alone

A charge repeated after a resume (TSK-0360), `lease_moved` on the stream (TSK-0350), and hints and threads as game rules, which ADR-0080 defines.
