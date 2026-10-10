---
id: TSK-0970
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6328, REQ-6330, REQ-6336, REQ-6340, REQ-6374]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every sandbox model call lands in the sandbox's file and ledger, and none enters the play key's count

After this task, the gateway writes a sandbox call's `llm_log` row and `llm_call` event to the handle it is given, reserves and settles the call in `sandbox-spend.sqlite`, and the cost report shows a «Песочница» line against the $20 cap, so a reset keeps the month's count and no sandbox call reaches the play key's count.

## Acceptance criteria

1. Given sandbox calls from the Parent Room and from the command line in `replay` mode, when the logs are read, then every call's `llm_log` row and `llm_call` event are in `sandbox.sqlite` and none is in her file (REQ-6328). Closed by: an integration test.
2. Given a sandbox call of each role, when it is sent, then the role's own privacy tier, egress guard and schema apply, from an empty profile and from a copy alike (REQ-6330). Closed by: an integration test that asserts the egress guard's decision for each role is the same as in play.
3. Given sandbox calls past the $20 cap and play calls in the same month, when the play key's monthly count is read, then it equals the sum of her file's `llm_log` and no `budget_month_spent` appears (REQ-6336). Closed by: an integration test in `replay` mode.
4. Given a month of sandbox calls from both entries, when the cost report is read, then a line «Песочница» shows the month's spend from `sandbox-spend.sqlite` against $20, the command line's calls included (REQ-6340). Closed by: a component test of the report and an integration test of the figure.
5. Given a month's sandbox spend, when the parent resets the sandbox, then the cost line shows the same spend after the reset (REQ-6374). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Give the gateway's call path a database handle and a sandbox mark as arguments, and write its row and event to that handle. Add `sandbox-spend.sqlite` with one row per settled sandbox call, written by the gateway only, and make the gateway reserve each call against the sandbox bucket from the month's sum there plus the reservations in flight. Make the play key's monthly count read her file's `llm_log` only. Add the cost line. Delete ledger rows older than 13 months in a nightly job, keeping the current month and the same month a year earlier. The riddle parser run in the sandbox spends from the sandbox bucket and never from the play key's parse bucket.

## Depends on

- TSK-0964 (blocking): the ledger file is one of the three that task names and opens.

The epic realising ADR-0100 supplies the gateway, its roles, tiers and the play key's count, and the epic realising ADR-0210 supplies the $20 bucket and the offline key. Until those epics exist the task runs on a stand-in gateway function that takes a handle and a mark and settles against the ledger; the real routes and the offline key's limit stay with them.

## Evidence

Not yet.

## Left alone

The offline key's limit around each run and `sandbox_models_unavailable` before the gateway exists, which ADR-0210 owns.
