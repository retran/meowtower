---
id: TSK-0778
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5110, REQ-5112]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A basic fact's ladder is exactly one strategy rung with the engine's numbers, and no other first rung holds a number

After this task, a template that declares `kind: "basic_fact"` has a ladder of exactly one rung, which gives a strategy through a known fact with numbers the engine computed, and the first rung of every other template holds no digit.

## Acceptance criteria

1. Given every basic-fact template over 1,000 seeds that offers a ladder, when `hints(p)` is read, then it returns exactly one rung and the rung holds a strategy through a known fact such as «7 · 8 — это 7 · 7 и ещё 7» (7 x 8 is 7 x 7 and 7 more) (REQ-5110). Closed by: the template test over 1,000 seeds.
2. Given every template that isn't a basic fact over 1,000 seeds, when rung 1 is read, then it holds no digit (REQ-5112). Closed by: the same template test.
3. Given a basic fact's strategy rung, when its numbers are traced, then each comes from the engine's graph and none is the task's answer (REQ-5112). Closed by: the structural check of TSK-0780 on a fixture template.
4. Given a template module with no `kind` declaration, when it is built, then the build fails, so code can always tell a strategy rung apart (REQ-5110). Closed by: a build check with a fixture module.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `kind` declaration to the template module's contract, with `basic_fact` as one value, and make the build require it. A basic fact has one real step (REQ-5106), so its ladder is the strategy rung. The strategy rung may carry numbers the engine computed and is the only first rung that may; rungs 1 and 2 still never state the answer as a result, which TSK-0780 checks for every template.

Rework the stage 0.1 fact templates first, because the ladder ships with the fact measurement of ADR-0210's stage 0.15.

## Depends on

- TSK-0777 (blocking): the ladder's contract of one rung for each real step, which this task specialises.

## Evidence

Not yet.

## Left alone

A fluent fact's treatment before the answer, which TSK-0779 holds.
