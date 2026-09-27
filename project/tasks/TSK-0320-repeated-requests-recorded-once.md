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

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 30 test files, 291 Vitest tests and 2 Playwright tests passed. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees they ran on are cited from `git write-tree` instead: `src` `bb7a6c856dc4da7e04debe8a4edb546371a37acb`, `tests` `ca4adcd016f5de38a11c8da5eda79db537db8140`, `content` `165b85e2d6761f9046c36824ce6ffd38bba4e222`.
- Seen failing first, each by breaking one mechanism in a scratch copy and restoring it: with `requestEvents` returning nothing, both REQ-2432 tests failed; with only the charge checks removed, the new-`clientSeq` cases failed on their own: the REQ-2422, REQ-2426 and repeated-explanation tests; with the explain route awaiting the text, the REQ-2424 test failed; with the cap raised to 1,000, both rate tests failed.
- Criterion 1, REQ-2432: `tests/integration/repeats.test.ts` sends one answer twice with `clientSeq: 1`; the log gains nothing and the replies are equal, and a repeat after a later answer raised the streak still returns the first reply's streak.
- Criterion 2, REQ-2422: the same hint with the same `clientSeq`, and again with a new one, logs one `hint_shown` and one `thread_spent`, and the stock drops from 5 to 4; a rung that skips one gets `400 hint_level_skipped`, and a hint with no thread left gets `409 no_threads`.
- Criterion 3, REQ-2426: the second-attempt request, repeated with the same and with a new `clientSeq`, returns an equal `room` packet with the same `itemId`, and the log holds one `item_shown` with `attemptNo: 2`; before the first attempt is answered it gets `409 attempt_open`.
- Criterion 4, REQ-2424: with fake timers the explain route replies `{"status":"pending","threads":4}` while the poll route holds no message; `thread_spent` and `explanation_bought` are the last two events; at 9,999 ms the poll is still empty, and at 10,000 ms `explanation_ready` with `source: "template"` and the `seq` of `explanation_bought` is on the poll route and, as the same message, on `GET /api/session/:id/events`. With a written explanation it arrives at once with `source: "model"`.
- Repeated explanation, the fourth action EPC-0030's criterion 3 names: in `tests/integration/repeats.test.ts` the explain request sent twice with `clientSeq: 2` and again with `clientSeq: 3` leaves one `thread_spent` and one `explanation_bought` for the item, every reply is `{"status":"pending","threads":4}`, and the poll route holds one `explanation_ready`.
- Criterion 5: 20 session starts in one second get `200` and the 21st gets `429`; one second later a request gets `200` again. A mixed burst of a start, 3 hints and 16 answers gets `200` throughout, and the 21st request, a second attempt, gets `429`, so the cap counts a device's routes together; with the cap raised to 1,000 that test failed.
- The packet recorder now also buys hints and explanations, takes second attempts and polls: `recorder: 1530 packets, 0 forbidden fields, 0 early answers`, every reply `200`.

Choices this task made, where SPC-0030 left a gap:

- ADR-0020's `events` table makes `idem_key` a `UNIQUE` column, so no two events can share a key; a request's first event carries its key and each later event the key and `#1`, `#2` and so on.
- The charge keys are checked against the log rather than stored, because the request key already takes each event's `idem_key`; each route reads and appends with no `await` between, so on Node's single thread no request slips between the check and the write.
- A hint request names the rung it buys (`HintIn`: `level` and `clientSeq`), so a repeat can't buy the next rung by mistake; a rung already paid for is shown again free.
- A second attempt needs the first attempt answered, following ADR-0080's flow.
- `explanation_bought` v1 holds `itemId` and `attemptNo`; ADR-0080 names the event and this task gave it its schema.
- The stream's messages live in memory per session, because `explanation_ready` carries the explanation's text and ADR-0120 keeps that text out of the log, so the log can't rebuild the message; the poll route answers until the server restarts, and after that the resume packet (TSK-0360) brings a client back.
- The stand-in starts each session with 5 threads; its twins, hint rungs and template explanations are in `content/i18n/ru.json`.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- No acceptance criterion names the repeated explanation, though EPC-0030's criterion 3 does. Not added: this task is approved and its criteria are frozen. The Evidence above reports the repeated explanation's result, which is what the epic's criterion cites.
- SPC-0030 disagrees with two choices above: its route table says the hint route "Buys the next hint level", where `HintIn` names the rung and a paid rung returns free, and its "Repeated requests and charges" says every event of a request carries the key itself, which the `UNIQUE` column forbids. The contracts later tasks build on are also only here: the `explanation_bought` v1 schema, `409 attempt_open`, `400 hint_level_skipped`, `409 no_threads`, and messages kept in memory. Not fixed here: SPC-0030 is approved, and changing it is an amendment that waits for approval as a change of its own. No amendment record exists yet, so until one does, TSK-0350 and TSK-0360 read these contracts here.
- The criteria say "the idempotency test" instead of `tests/integration/repeats.test.ts`, and criterion 2 names only the same `clientSeq`. Not changed: the criteria are frozen; the Evidence names the file and reports the new-`clientSeq` case.

## Left alone

A charge repeated after a resume (TSK-0360), `lease_moved` on the stream (TSK-0350), and hints and threads as game rules, which ADR-0080 defines.
