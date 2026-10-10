---
id: TSK-0591
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-1686, REQ-1688, REQ-1690]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The judge model takes only checks with fixed answers, only after a passing test-set record, and falls back to the safety model

After this task, a `JudgeRequest` goes only to the judge route, the server refuses to start when `JUDGE_CHECKS` names a check without a passing record for the configured judge, and an error or a timeout of 1500 ms sends the same question to `SAFETY_MODEL`.

## Acceptance criteria

1. Given a `JudgeRequest` typed as Noul, Choice or Score, when it is sent, then it reaches the judge route, and a request to write text, solve a task or judge a picture is refused as a class the judge doesn't take (REQ-1686). Closed by: a unit test with each request.
2. Given `JUDGE_CHECKS` that names a check with no passing test-set record for the configured judge in the `bakeoff` table, when the server starts, then it refuses and names the check (REQ-1688). Closed by: an integration test with and without the record.
3. Given a judge that errs or passes 1500 ms, when the same question is sent, then it reaches `SAFETY_MODEL` with the same text, and `judge_fell_back` is logged (REQ-1690). Closed by: a unit test with a mocked judge that times out.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `JudgeRequest` class and its route, the `JUDGE_CHECKS` start-up check, and the fall back with a timeout of 1500 ms, which ADR-0100 chose as three times the 500 ms latency RES-1600 cites. A local judge, a check's own route and an answer REQ-3912 refuses are added by the epic realising ADR-0350, which changes the route this task builds and the condition of the fall back.

## Depends on

- TSK-0580 (blocking): the route is one of that gateway's roles.
- TSK-0589 (blocking): the fall back logs both calls.

- TSK-0594 (not blocking): the `bakeoff` table's test-set records come from its bake-off; criterion 2 runs on fixture records until it has run.

## Evidence

Not yet.

## Left alone

Which checks move to the judge, which the bake-off at stage 0 decides, and the local judges of ADR-0350.
