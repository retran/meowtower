---
id: TSK-0767
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0210
closes: [REQ-5050, REQ-5052]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A sandbox call charges the offline key under a $20 monthly bucket, and never the play key

After this task, the gateway marks a call from the parent's sandbox or the agent's command-line sandbox as a sandbox call, charges it to the offline key under a sandbox bucket of $20 a month counted from 00:00 UTC on the 1st, and writes its `llm_log` row to the sandbox's own file.

## Acceptance criteria

1. Given sandbox calls made in play mode, when each is routed, then every one is charged to the offline key and none to the play key, and the main `llm_log` holds no row for them (REQ-5050). Closed by: a gateway test in play mode.
2. Given a sandbox bucket at $20 of spend in a month, when another sandbox call arrives, then the gateway makes no call, a feature falls back, and the parent sees one `sandbox_budget_spent` notice at most that month (REQ-5052). Closed by: a gateway test and a notice test.
3. Given the first second of the next month in UTC, when the bucket is read, then it is empty again (REQ-5052). Closed by: a gateway test with a fixed clock.
4. Given a play role called on the offline key outside verify mode, when the call isn't marked as a sandbox call, then the gateway refuses it; given a call from a sandbox route with the mark, then it passes (REQ-5050). Closed by: a gateway test with both calls.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add a second exception to the gateway's rule that a play role never runs on the offline key outside verify mode: a call marked as a sandbox call, which only the sandbox's own routes can make. The call runs under the same role as in play and passes the same tier and egress guard; the gateway charges it to the offline key under the sandbox bucket.

I chose $20 for the bucket because it pays for about 13 whole test adventures at the $1.5 adventure cap, which is more than a parent tests in a month, and it stays below the $25 bake-off budget (ADR-0210). Write the rows to the sandbox's own file, so the game's monthly count of the play key never sees them. Add the sandbox bucket to the Baselines table of ADR-0190.

## Depends on

- TSK-0764 (blocking): the gateway's role table and the offline key's rules.

The epic realising ADR-0340 supplies the sandbox's routes and its own file; this task tests with a stand-in route that makes a marked call.

## Evidence

Not yet.

## Left alone

The sandbox's routes, snapshot, reset and frame, which ADR-0340 owns, and the owner's act of setting the offline key's limit before each run so that what remains equals the run's budget and of setting it back to the sandbox's $20 after, as ADR-0360 words it, which no code performs.
