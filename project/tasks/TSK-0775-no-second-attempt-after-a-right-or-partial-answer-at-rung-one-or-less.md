---
id: TSK-0775
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5132, REQ-5134]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A first attempt that ends right or almost right with at most rung 1 gets no second attempt

After this task, a first attempt that ends `clean` or `partial` with no hint or with rung 1 alone brings no second attempt, the review runs as ADR-0080 runs it for that outcome, and no task ever brings a third attempt.

## Acceptance criteria

1. Given a first attempt that ends `clean` at hint level 0 and again at level 1, when the state machine runs, then no twin follows and the room moves on after the review (REQ-5134). Closed by: a state-machine test.
2. Given a first attempt that ends `partial` at hint level 0 and again at level 1, when the state machine runs, then no twin follows (REQ-5132). Closed by: the state-machine test.
3. Given a `clean` or `partial` attempt at hint level 2 or 3, when the state machine runs, then it leaves the decision to the twin trigger of REQ-7164 and gives no third attempt after the twin (REQ-5132, REQ-5134). Closed by: the state-machine test with the trigger as a fixture input.
4. Given a hinted `clean` or `partial` first attempt, when the review has run, then ADR-0140's caps hold: 0.5 in the room and floor shares, no streak, no shard, and a second attempt gives 3 experience and no buttons (REQ-5132, REQ-5134). Closed by: a rewards test on fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change state 4 of ADR-0080's attempt flow in the server: `twin_open` no longer follows `clean` or `partial` when the deepest rung shown is 0 or 1. Nothing changes after `alt`, which the trigger of REQ-7164 keeps.

The trigger itself, a twin after `alt` or after rung 2 or 3 whatever the outcome, is REQ-7164's, which ADR-0430 addresses; this task keeps the flow's decision as one function of outcome and deepest rung so that rule joins it without a second edit. A right answer after rung 2 earns 3 experience more than one after rung 1 and less than one with no hint, which ADR-0140's rules already give, so this task changes no reward.

## Depends on

- TSK-0773 (not blocking): the ladder's `hintLevel` the decision reads; either task can land first because this task's tests set the level directly.

The epic realising ADR-0430 supplies the twin trigger for a miss or a deep hint. Until it exists, the stand-in flow gives a twin after `alt` and after rung 2 or 3, which is ADR-0220's own statement of the trigger.

## Evidence

Not yet.

## Left alone

The twin's generation and ladder, which TSK-0774 holds, and the trigger for a miss, which ADR-0430 owns.
