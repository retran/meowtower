---
id: TSK-0300
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-2416, REQ-2418, REQ-2442]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An answer posted to the server is logged and committed before the reply, which returns the outcome and the correct answer

After this task, a paired device starts a daily session, gets a `room` packet, posts an answer, and gets `AnswerOut` only after the attempt and its verdict are committed to the log. It is the smallest slice of the play API, and TSK-0030's crash test runs against it.

## Acceptance criteria

1. Given a device with a token (paired, or seeded by the test until pairing lands) and a session, when it posts an answer to `POST /api/session/:id/answer`, then the log holds `attempt_submitted` and `verdict` for that `itemId` in one committed transaction before the reply is sent. Closed by: an integration test that reads the log from a second connection as the reply arrives.
2. Given a first attempt, when the reply arrives, then it carries the game outcome, the streak, the grants, the short solution and `feedback.correctAnswer` formatted for display; given a second attempt, it carries the same without the outcome (REQ-2416, REQ-2418). Closed by: an integration test over both attempts of one stand-in task.
3. Given an answer with `dontKnow: true`, when it is logged, then its verdict is `dont_know`; an answer with an empty `raw` and `dontKnow: false` and a wrong answer each get another verdict (REQ-2442). Closed by: an integration test over the three answers.
4. Given 1,000 answers posted in turn, when the server log is read, then the 95th percentile from request received to reply sent is at most 300 ms, and no answer path calls the model gateway. The prediction is well under 300 ms, since the path makes one transaction and no network call. Closed by: the timing test's report.
5. Given this route exists, when TSK-0030's crash test runs against it, then 100 of 100 answers whose reply was sent are in the log. Closed by: the crash test's report, recorded in TSK-0030's evidence.

## What to do

Create `src/shared/api.ts` with the schemas this slice needs, `Room`, `AnswerIn` and `AnswerOut`, as SPC-0030 states them, and the routes `POST /api/session/start` with `daily`, `GET /api/session/:id/next` and `POST /api/session/:id/answer`. Every write goes through `appendEvents`, and this task adds the schema of any event it logs that EPC-0020's tasks haven't, such as `session_started`; the server re-parses `raw` and ignores `parsed`. `battleLine` comes from a pool keyed by outcome in the `ru` language file.

Use the stand-in adventure the epic describes. The stand-in check compares the normalised `raw` with the task's answer: equal gives the outcome `clean`, anything else `alt`, and `dontKnow` gives the verdict `dont_know` with the outcome `alt`. The stand-in grants are zero and the streak counts clean first attempts in a row. The epics realising ADR-0040, ADR-0070 and ADR-0140 replace the check, the sequence and the grants.

This slice has no lease, no `clientSeq` key and no lifecycle guard; TSK-0320, TSK-0330 and TSK-0350 add them. ADR-0190's definition of done applies.

## Depends on

TSK-0210 and TSK-0220, because `item_shown`, `attempt_submitted`, `verdict` and `session_started` need their schemas in the registry. Not the pairing task: until pairing lands, a stand-in device token that a test seeds in `devices` names the device that answers, because pairing waits on the durable-writes task, which closes only against this one. The lease slice and later ones use real pairing.

## Evidence

Not yet.

## Left alone

The strict parse of every packet and the verdict-word check (TSK-0310), idempotency (TSK-0320), and every route beyond the three above.
