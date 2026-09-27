---
id: TSK-0280
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-3816]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Emptying the explanation cache loses no fact about play

After this task, a check keeps every projection, the report and the export from reading `explain_cache`, and a test shows that emptying the cache and recomputing leaves every event, projection and report row as it was.

## Acceptance criteria

1. Given a 30-day log with explanations shown and a filled `explain_cache`, when the test empties the cache and runs a full recompute, then every projection, `report_cache` included where it exists, is identical to the one before in every column except `computed_at`, and `events` is unchanged. Closed by: `tests/integration/explain-cache.test.ts`, on the synthetic log now and with ADR-0180's report once it exists.
2. Given code under the projections, the report or the export that names `explain_cache`, when the lint verb runs, then it fails naming the file. Closed by: `tests/unit/static-checks.test.ts` with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the static check that allows `explain_cache` only in the module ADR-0120 gives the explanation request, and the integration test. Create `explain_cache` in a migration only if ADR-0120's epic hasn't yet; its columns are that decision's.

## Depends on

TSK-0260, because the test compares projections before and after a full recompute.

## Evidence

Not yet.

## Left alone

The explanation request, the cache's contents and its drain, which ADR-0120 defines, and the report, which ADR-0180 defines.
