---
id: TSK-1023
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-6234]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A first start-up with no content stops, a floor's first triumph gives a special reward, and the day opens on «В прошлый раз…»

After this task, the server refuses to start when no valid version of a content file exists, a floor's first `triumph` grants its special reward beside her pick of three, and the adventure of the day opens on «В прошлый раз…» from the planner's latest session summary.

## Acceptance criteria

1. Given a first start-up where `content/economy.json` has no valid version, when the server starts, then it refuses with `content_invalid`, naming the file, for the owner. Closed by: a start-up test.
2. Given a floor that reaches `triumph` for the first time, when its chest opens, then it holds her pick of three and the floor's special reward, a sparkling cosmetic named in the floor's entry in `content/economy.json`; given a later `triumph` on that floor, then it adds no special reward; and a content test fails a floor with no special reward. Closed by: a chest test and a content test.
3. Given a planner summary of her last session, when the day's adventure opens, then it runs in the order «В прошлый раз…» with the daily quests beside it once their system has opened, then a choice between two routes, then 3 maths floors or 4 when the forecast leaves time, then a finale that ends on a cliffhanger; given the Master's order for the opening fails, then the library opening takes its place (REQ-6234). Closed by: an adventure-order test with and without a failing order.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change start-up validation in `src/server/lifecycle.ts`, the chest builder and the adventure's scene order. No earlier version exists to keep at a first start-up, and a server with no rules can't run a game. A second copy of an item she owns is no reward, so a later `triumph` adds nothing. The planner's summary is the only record of what happened last time, which is why the opening reads it. I chose the special reward as a sparkling cosmetic per floor because ADR-0140 names no other kind; ADR-0370 gives a reversal condition that the parent's review at stage 0.3 tests.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The Russian names of each floor's special reward, which ADR-0160 and the parent's review own.
