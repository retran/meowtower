---
id: TSK-0715
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-1318, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The limits for holding steps, speed of the basics, scratchpad, error type and carelessness are computed

After this task, `LimitsResult` holds five more limits: the largest number of steps she held, the median time of correct answers on the basic facts, accuracy with and without a scratchpad, the shares of four error classes, and the carelessness count.

## Acceptance criteria

1. Given two right counted attempts on 3-step problems within 30 days and one on 4-step problems, when the limit is computed, then it is 3; given a k with only 1 counted attempt, then the value is empty; given a partial answer, a rapid guess or an excluded task, then none counts as right or as counted (REQ-1318). Closed by: a unit test with each case.
2. Given correct answers on A1, A3, A4, A6a and on other nodes, when the speed limit is computed, then it is the median of the correct answers on those four nodes only (REQ-1322). Closed by: a unit test.
3. Given an attempt on a task that offers a scratchpad, when it is logged, then the attempt records whether she opened one and which kind; given the attempts of a node, then the limit shows its accuracy with one opened and without (REQ-1324, REQ-1326). Closed by: an integration test over the play routes and a unit test over the limit.
4. Given mistakes of class `conceptual`, `procedural`, `fact`, `slip` and `unclassified`, when the limit is computed, then it reports four shares with `fact` and `slip` together as computational, and a mistake the task's traps and steps don't settle is unclassified (REQ-1328). Closed by: a unit test.
5. Given a wrong answer one digit or one transposition away from the correct one on a node that was «бегло» before that attempt, when the limit is computed, then it counts as careless; given the same answer on a node in another state, or a different kind of error on a fluent node, then it doesn't (REQ-1330). Closed by: a unit test that computes the state from the events before the attempt.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five functions to `LimitsResult`. The error classes come from each attempt's `class` alone, so this task makes no classification of its own. `scratchKind` is recorded by the answer route of ADR-0030, and the attempt event gains it through the upcast ADR-0020's rule requires.

Choice this task takes from ADR-0180: `fact` and `slip` report together as computational, because REQ-1328 names four classes and both are errors of calculation.

## Depends on

- TSK-0714 (blocking): it supplies the result type, the smoothing and the timing rules these limits use.

## Evidence

Not yet.

## Left alone

The remaining limits, which TSK-0716 builds, and the 8x8 heat map of the basics, which comes after the MVP with the full limits views.
