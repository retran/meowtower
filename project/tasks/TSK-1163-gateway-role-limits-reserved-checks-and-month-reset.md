---
id: TSK-1163
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-2726, REQ-5048, REQ-6412]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each role has its timeout and token ceiling, a reserved check is never refused and the month's reset spends the daily buckets

After this task, every gateway call carries a `max_tokens` and a timeout from one table, a check whose cost was reserved with its reply runs on that reservation, the daily play-key buckets count as spent from 00:00 UTC on the 1st until the end of that game day, and the offline key's limit is set to $20 plus the month's offline spend. This settles entries 20 to 23 of ADR-0460.

## Acceptance criteria

1. Given each role, when a call is built, then it carries the `max_tokens` and timeout of ADR-0190's Baselines table row for that role: `MASTER_MODEL`, `MASTER_FALLBACK_MODEL` and `FREE_PEN_MODEL` what remains of 12 seconds since the order, with 2,000 tokens; `PLANNER_MODEL` 60 s and 4,000; `LIVE_GEN_MODEL` 30 s and 4,000; `LIVE_CHECK_MODEL` 10 s and 1,000; `EXPLAIN_MODEL` 15 s and 2,000; `SAFETY_MODEL` 5 s and 200; `JUDGE_MODEL` 1500 ms and 200; `PARSE_MODEL` 10 s and 4,000; each offline text role 120 s and 8,000; each art role 300 s (REQ-2726). Closed by: a unit test that reads the table and the built call of every role.
2. Given a bucket that runs out, when a check whose cost was reserved with its Master reply runs, then it is answered, and given a check that holds no reservation, then it is refused with `BudgetExhausted` and no unchecked text is shown (REQ-2726). Closed by: a gateway test with a bucket that runs out.
3. Given a call at 00:30 UTC on the 1st, when the gateway decides, then every daily bucket on the play key counts as spent and the fallbacks run, and the daily buckets of a 31-day month sum to $58.90, below the $60 limit (REQ-5048). Closed by: a gateway test at 00:30 UTC and a sum test over the 31 days.
4. Given an offline run that ends, when the owner sets the offline key's limit, then it is $20 plus what the month's offline runs have spent on that key, and when the next run starts, then the key has no more than that run's budget left (REQ-6412). Closed by: the owner's judgement from the key's settings and usage before each run, because the limit is set in the provider's console, which no test reaches.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the timeout and `max_tokens` rows to ADR-0190's Baselines table as ADR-0460 chose them and make the gateway read them. The worst-case reservation needs `max_tokens` on every call. The dead span of entry 23 falls between about 01:00 and 04:00 local time, when she doesn't play; ADR-0460 reopens entry 23 if `llm_log` shows a play-key call refused in it on any night of the first three months. The values of entry 20 are defaults ADR-0460 reopens when more than 1 % of a role's calls in a month of stage 0.3 end with `finish_reason: "length"`.

## Depends on

Nothing. The epic realising ADR-0100 owns the gateway and its buckets; this task runs on its fixtures.

## Evidence

Not yet.

## Left alone

The buckets' amounts, which ADR-0100 and ADR-0360 set, and the offline run's own budget, which ADR-0360 entry 31 sets.
