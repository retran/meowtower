---
id: TSK-0586
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2704, REQ-2706, REQ-2716]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Live explanations stop at $0.3 and 20 a game day, and a spent thread still gets one from the cache or a template

After this task, the day's spend on `EXPLAIN_MODEL` and its blind check stops at $0.3, the game generates at most 20 live explanations a game day, and when either runs out a thread spent on an explanation still produces one.

## Acceptance criteria

1. Given a game day with explanations that reach $0.3, when the next is requested, then the gateway refuses it with `BudgetExhausted` (REQ-2704). Closed by: a unit test with a mocked price.
2. Given 20 live explanations in one game day, when the 21st is requested, then no live call is made (REQ-2706). Closed by: a unit test.
3. Given either limit reached, when she spends a thread on an explanation, then she gets one from the cache or the template, and no error reaches her screens (REQ-2716). Closed by: an integration test over the explanation route.
4. Given the game day changes at 04:00, when the next explanation is requested, then the day's count and spend are zero. Closed by: a test with a fake clock.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the explanation bucket and the count to the engine of TSK-0585, both reset by the game day index of `gameDayOf` and never by an hour. Return `BudgetExhausted` to the caller and add the fall back to the explanation cache or a template at the explanation route. Choice I made: until ADR-0120's epic supplies the template, the fall back uses a fixture template with the engine's solution steps, so the route has something to return.

## Depends on

- TSK-0585 (blocking): the bucket is a use of that task's reservation.
- TSK-0581 (blocking): the explanation request class it counts is that task's.

The epic realising ADR-0120 writes the cache and the template, and this task leaves both to it.

## Evidence

Not yet.

## Left alone

How the cost line shows in the Parent Room, which ADR-0180's epic owns.
