---
id: TSK-0838
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5504, REQ-5506, REQ-5522]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One pure function scores a submitted set of links as `optimal`, `valid` or `none` without a language model

After this task, `scoreGrouping(submitted, optimalPlans)` in `src/engine/grouping/` returns `none` for an empty set, `optimal` when the set equals one plan exactly and `valid` for every other non-empty set, reads no time and calls no language model.

## Acceptance criteria

1. Given random submitted sets and every shipped template's plans, when the property test runs, then the score is `none` exactly for the empty set, `optimal` exactly for a set equal to one plan and `valid` otherwise (REQ-5504, REQ-5522). Closed by: the property test's report.
2. Given `38 + 47 + 62 + 53`, when only `38` and `62` are linked, then the score is `valid`, and a mark on a number counts as a submitted link (REQ-5522). Closed by: two unit tests.
3. Given the same log replayed twice, when the scores are recomputed, then they are equal, and the function's module imports neither the model gateway nor a clock (REQ-5506). Closed by: a replay test and the existing `no-restricted-imports` lint rule's output.
4. Given an answer of «Не знаю» with links submitted, when the server scores the attempt, then the grouping is scored all the same. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `scoreGrouping` as a pure function in `src/engine/grouping/` and its test. Compare sets as unordered pairs and a mark as a single position. The function takes the plans as data, so it needs no template contract to run its tests.

## Depends on

- TSK-0836 (not blocking): the plans' shape comes from its declaration, and this task's tests use fixture plans until it lands.

## Evidence

Not yet.

## Left alone

Where the score is stored, which TSK-0839 builds, and what reads it, which TSK-0842, TSK-0843 and TSK-0844 decide.
