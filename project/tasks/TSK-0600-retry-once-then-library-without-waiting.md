---
id: TSK-0600
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1614, REQ-1618, REQ-1620, REQ-1622, REQ-1624]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A failed reply is retried once and then replaced from the library, and no consequence of an answer waits for a model

After this task, the consequence of an answer shows from the pool and the ready branch with no model call on its path, a rejected reply gets one retry and then a library scene, a reply 12 seconds late is replaced by a pool line, and the p95 wait after free text stays at 6 seconds or less.

## Acceptance criteria

1. Given a gateway stub that never answers, when a simulated adventure plays, then every consequence of an answer shows with no wait, every scene comes from the library or the pools, and no unchecked text shows (REQ-1614). Closed by: the simulation's report.
2. Given a reply that fails a check, when the order is retried once and fails again, then a library scene shows (REQ-1618). Closed by: a unit test with a mocked service that fails twice.
3. Given every floor, when the content test runs, then the library holds at least 3 branch pairs and 3 Guardian ending triples before stage 0.4, and 20 pairs and 10 triples from stage 0.4, and the build fails for a floor that falls short (REQ-1620). Closed by: the content test and a fixture floor with two pairs.
4. Given an order with no checked reply after 12 seconds, when the time passes, then a line from the fallback pool shows, the scene goes on and the late reply is dropped (REQ-1624). Closed by: a test with a fake clock.
5. Given free text sent in play, when `free_text` to `scene_shown` is measured over 100 simulated replies at the budget's split, then the 95th percentile is at most 6 seconds, with a reaction line first as ADR-0320 amends it (REQ-1622). Closed by: the latency test's report; the first two weeks of `llm_log` repeat it in play.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the scene queue that drafts 2 to 3 scenes and both room branches ahead while she solves tasks, the retry, the library at `content/scenes.ru.json` and `content/branches.ru.json`, and the 12-second timer. The 6 seconds split as 100 ms for local steps, 4,400 ms for the Master, 1,000 ms for the reply checks run in parallel and 500 ms of slack, a split ADR-0110 chose. `fallback_rate_high` reports once to the owner when over 25 % of an adventure's scenes come from the library. Every library scene has a shortest form, played when ADR-0070's 10 minutes of story are spent.

## Depends on

- TSK-0599 (blocking): a reply is retried when its checks fail.

The epic realising ADR-0100 supplies the fallback model and `BudgetExhausted`; the epic realising ADR-0070 gives each order its duration budget. Until then the queue takes a fixed budget from a constant.

## Evidence

Not yet.

## Left alone

REQ-2714 and REQ-2726, which TSK-0590 of the gateway's epic closes through the same queue, and the content of the library, which the owner writes.
