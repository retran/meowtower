---
id: TSK-1202
artifact: task
status: done
revised: 2026-10-24
realises: ADR-0520
closes: [REQ-1232]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The checker has a set kind, an ordered-pair kind and a distance for a number placed on a line

After this task, `src/shared/answer.ts` checks a selected set, a pair of numbers and a number placed on a line within a distance, so the templates of the maths nodes can use the forms the programmes set (ADR-0520).

## Acceptance criteria

1. Given a set of correct options, when the exact set is entered in any order, then the credit is 1; when one option is missing or one wrong option is added, then it is 0.5; otherwise it is 0, and an empty entry, a repeated option or an unknown option is unparsed. Closed by: `tests/unit/answer-set-pair.test.ts`.
2. Given a pair of numbers, when both are right in order, then the credit is 1; when one is right, then it is 0.5; when none is, then it is 0; a swapped pair earns nothing for the swap. Closed by: `tests/unit/answer-set-pair.test.ts`.
3. Given a target and a distance, when a number is entered, then it is right at the target and at the edge of the distance and wrong beyond it, and with a distance of zero only the exact value is right; a grid point takes the same distance on each coordinate. Closed by: `tests/unit/answer-set-pair.test.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `setAnswer`, `pairAnswer`, `lineAnswer` and the `within` argument of `pointAnswer` to `src/shared/answer.ts`, and list the kinds in SPC-0040.

## Depends on

Nothing.

## Evidence

Closed by the tests in tests/unit/answer-set-pair.test.ts, and by the stages of the repository run on this branch.

The answer fields of the client for a multi-select and a two-field answer are not built; they come with the first templates that use the kinds, and need `ui.*` strings.

## Left alone

The client's answer fields, and the templates that use the kinds.
