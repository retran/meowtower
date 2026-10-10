---
id: TSK-0794
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0230
closes: [REQ-5208, REQ-5210, REQ-5214, REQ-5216]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `PARSE_MODEL` is fixed to a zero-retention player-tier endpoint, every parse call is logged, and it spends only from the parse bucket

After this task, `PARSE_MODEL` is fixed in code on the player tier with `zdr: true` and the player-tier provider list, the server refuses to start when it has no zero-retention endpoint at a listed provider, every parse call writes a row to `llm_log`, and every call spends from the parse bucket of $0.1 a game day on the play key and from no other.

## Acceptance criteria

1. Given a configuration whose parse model has no zero-retention endpoint at a provider on the player-tier list, when the server starts, then it refuses to start and names the model (REQ-5210). Closed by: a start-up test.
2. Given a recorded parse call, when its request options are read, then they hold `zdr: true` and a provider from the player-tier list, and the model id defaults to the one `LIVE_CHECK_MODEL` is configured with (REQ-5208). Closed by: a recorded test.
3. Given three parse calls, when `llm_log` is read, then it holds one row for each with the role, the request's body hash and the `llm_call` event id (REQ-5214). Closed by: a gateway test.
4. Given a day of parse calls, when the buckets are read, then every call is charged to the parse bucket, none to the adventure's or the explanations', and the call's `max_tokens` is 4,000 with a 10-second timeout (REQ-5216). Closed by: a gateway test.
5. Given a bucket that can't reserve two worst-case parses of about $0.017 each, when the Director plans, then it offers a card riddle (REQ-5216). Closed by: a gateway test with a bucket at $0.03.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Fix `PARSE_MODEL` as the sixteenth role in the gateway on the player tier, with the model id defaulting to `LIVE_CHECK_MODEL`'s because that model already sits on the player tier with a zero-retention endpoint. Check it at start-up like every player-tier model. The parse timeout is 10 seconds, which REQ-5288 imposes, and I took ADR-0230's `max_tokens` of 4,000, a cap at ten times the reply of about 400 tokens RES-4020 assumed.

The worst-case reservation follows: 3,100 input tokens at $0.75 a million and 4,000 output tokens at $3.75 a million come to about $0.017, so the bucket reserves about five parses. A change to `max_tokens` or the prices changes the bucket's arithmetic. `.env` gains `PARSE_MODEL` and `PARSE_BUDGET_USD_PER_DAY`.

## Depends on

Nothing.

The epic realising ADR-0210 supplies the role table, the parse bucket and the budget-sum check; this task fixes the role's endpoint and records, and runs on a stand-in bucket until it lands.

## Evidence

Not yet.

## Left alone

The bucket's sum check against $60, which the epic realising ADR-0210 holds, and the parse prompt's wording, which belongs to the specification.
