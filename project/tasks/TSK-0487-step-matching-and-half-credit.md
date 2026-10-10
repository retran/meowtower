---
id: TSK-0487
artifact: task
status: draft
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0705, REQ-0707, REQ-0709, REQ-0713, REQ-0774, REQ-0776, REQ-0848]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Entered steps are matched against every valid solution path and classified

After this task, a step-by-step answer is matched against every valid computation graph of its problem, each entered step is labelled, a final answer that is correct with matching steps gets full credit and one with unrecognised steps gets 0.5, an unrecognised step is never an error, and an answer is marked by its result whatever method reached it.

## Acceptance criteria

1. Given a problem with the valid paths 3 · 5 + 3 · 7 and 3 · (5 + 7), when the steps are `3 · 5`, `3 · 7`, `15 + 21`, then they match the first path, and `5 + 7`, `3 · 12` match the second (REQ-0705). Closed by: a unit test with both paths.
2. Given entered steps, when they are matched, then each is labelled a correct step, the right operation with a calculation error, the wrong operation matching a structure trap, or «не классифицирован» (unclassified), and an unrecognised step adds no error to the attempt (REQ-0707, REQ-0709). Closed by: one fixture for each label.
3. Given a correct final answer, when its steps match one valid path then the credit is 1, and when they match none then it is 0.5 (REQ-0774, REQ-0776); and given the same final answer reached by a guess, by the steps or by the draft pad, then the mark is the same (REQ-0848). Closed by: one fixture each.
4. Given a word problem that opened with a model choice, when the attempt is logged, then the chosen model is a `modelChoice` field apart from `answer` (REQ-0713). Closed by: a schema test and an integration test over the attempt event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/tasks/steps.ts` and the `modelChoice` field to the attempt event's next version with its upcast, as ADR-0020's rule for a changed schema states.

## Depends on

- TSK-0486 (blocking): the valid graphs and the structure traps come from the graph module.
- TSK-0482 (blocking): a step's value is compared in `Q`.

## Evidence

Not yet.

## Left alone

How a half credit enters the estimate, which ADR-0060 owns, and the step input screen, which ADR-0150 owns.
