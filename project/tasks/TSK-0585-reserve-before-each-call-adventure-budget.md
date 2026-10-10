---
id: TSK-0585
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2702]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each call reserves its worst-case cost first, and an adventure's spend stops at $1.5

After this task, the gateway reserves the model's listed prices applied to the input tokens and to `max_tokens` before each call, refuses a call whose reservation would pass a limit, settles at the cost OpenRouter reports, and stops an adventure's Master, planner, live frame, blind check and judge spending at $1.5.

## Acceptance criteria

1. Given 20 concurrent Master calls fired at a nearly spent adventure bucket, when all settle, then the settled spend is at or under $1.5 (REQ-2702). Closed by: a concurrency test with a mocked OpenRouter.
2. Given a reply whose `usage` reports a cost below the reservation, when it settles, then the bucket holds the reported cost and the reservation is released. Closed by: a unit test.
3. Given a Master reply and the checks it needs, when they are reserved, then they are reserved together, and the budget never pays for a reply it can't afford to check; a check reserved with its reply is never refused with `BudgetExhausted` (ADR-0460). Closed by: a unit test.
4. Given a refused reservation, when the caller reads the result, then it is a typed `BudgetExhausted` it can fall back on. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the reservation, the settlement and the adventure bucket to the gateway of TSK-0580, with the cost read from the response's `usage` field and recorded by TSK-0589's log. The play buckets count from 00:00 UTC on the 1st for the month and to the end of the game day for the daily ones, as ADR-0460 states. Report once to the owner when an adventure's Master calls read less than half their input from the cache.

## Depends on

- TSK-0580 (blocking): the reservation sits in that gateway.
- TSK-0589 (blocking): settlement writes the cost to the log that task builds.

## Evidence

Not yet.

## Left alone

The explanation, month, art, bake-off and live-art buckets, which TSK-0586, TSK-0587 and TSK-0588 add on this engine.
