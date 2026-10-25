---
id: ADR-0520
artifact: adr
status: done
revised: 2026-10-24
addresses: [REQ-1232]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0520. The answer contract gains a set kind, an ordered-pair kind and an acceptance distance for a point on a line

## Decision

I propose that `AnswerSpec` of SPC-0040 gets two kinds and one rule. The `set` kind asks the player to select every option that fits, and credits 1 for the exact set, 0.5 for the correct options with one option missing or one wrong option added, and 0 otherwise. The `pair` kind asks for two numbers in order, such as the number before and the number after, and credits 1 for both right and 0.5 for one right. A `point` answer on a number line gets an optional `within` distance, so "ongeveer" tasks accept a placement inside the distance the template states and mark a farther one wrong. Works once accepted: the templates of domain N, and of the other domains, can use the forms RES-4281 found in the Dutch and Russian programmes. Doesn't work yet: the kinds are not built, and no template uses them.

## Why

RES-4281 found that the Dutch concretisation sets "waar ligt 598 ongeveer op de getallenlijn", and that both programmes ask the child to give several numbers at once. The existing kinds can't take a selected set or a pair, and a point answer today is exact. Without the kinds, a template of those forms is written as several single questions, which changes what it measures. Every other form RES-4281 lists is already an integer, a choice or an order.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | No contract change | The set, pair and approximate forms of the programmes have no template |
| Several single-answer tasks in place of a pair or a set | No new kind | A pair becomes two tasks and a set becomes four yes-or-no tasks, so the credit and the time measured differ |
| `set`, `pair` and `within` (this) | Each form is one task with one credit | Chosen |

## What it costs

Two kinds in the checker, in the answer fields of the client and in the verification run, and a rule for partial credit that the parent must be able to read in the report.

## What would reverse it

- The partial credit of the set kind is shown to reward guessing, by the simulation of ADR-0190, in which case the kind keeps credit 1 for the exact set and 0 otherwise.

## Consequences

- `src/shared/answer.ts` gains `setAnswer`, `pairAnswer` and the `within` rule, with their tests.
- SPC-0040's list of answer kinds gains `set` and `pair`.
- The answer fields of the client gain a multi-select and a two-field form, which need `ui.*` strings.

## How I will know it was realised

1. A fixture task of each new kind is checked with credit 1, 0.5 and 0 as stated, and a point placed within and beyond the distance is marked right and wrong.

## What this does not settle

- Which templates use the new kinds, which each domain's research record names.
