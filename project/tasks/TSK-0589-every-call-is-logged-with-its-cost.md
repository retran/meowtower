---
id: TSK-0589
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2700]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every call to a model service is recorded with its cost

After this task, each call the gateway makes, the judge's included, writes a row to `llm_log` and appends an `llm_call` event that points to it, and the bodies of requests and replies leave the table after 90 days.

## Acceptance criteria

1. Given a simulated adventure with a mocked OpenRouter, when it finishes, then the number of `llm_log` rows equals the number of calls, each holding the role, model, provider, tier, key, tokens, cost, latency, outcome, request and response, and each has an `llm_call` event pointing to it (REQ-2700). Closed by: an integration test.
2. Given a judge call that fails over to `SAFETY_MODEL`, when the log is read, then both calls have a row. Closed by: a unit test.
3. Given the first week of play, when each day's sum of `llm_log` costs is compared with the usage `GET /api/v1/key` reports for the play key, then they differ by 5 % or less. Closed by: the owner's judgement of the two numbers at the end of the first week, because the key's usage lives in the account and the comparison needs real play.
4. Given a request body older than 90 days, when the nightly job runs, then the body is deleted and the metadata row stays, and a Master row's cached canon block is stored once by its hash. Closed by: a unit test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `llm_log` as a service table outside the projections, the `llm_call` event if EPC-0020's schemas lack it, the body store keyed by hash, the nightly deletion, and a one-time report to the owner when the body store passes 1 GB, a ceiling ADR-0100 chose. A call to a local judge writes a row with provider `local`, cost 0 and no key, when ADR-0350's epic adds the local route.

## Depends on

- TSK-0580 (blocking): every call goes through that gateway.

## Evidence

Not yet.

## Left alone

The cost line in the report, which ADR-0180's epic draws, and the sandbox's own log file, which ADR-0340's epic holds.
