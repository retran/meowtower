---
id: TSK-0481
artifact: task
status: draft
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1202, REQ-1206, REQ-1208, REQ-1210, REQ-1216, REQ-0830]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The template contract and the seeded generator with its fallback

After this task, a template is a module that returns parameters, an answer, traps and a computation graph for a seed, and `generate` draws candidate `k` from `hash(baseSeed, k)` until one passes `valid()`, the distinctness test and the caller's reject predicate, or takes the fallback, so the same template, version and seed rebuild the same task.

## Acceptance criteria

1. Given a fixture template and one effective seed, when the task is built twice, then the parameters, answer and traps are equal, and the effective seed `base/k` or `base/f<i>` rebuilds the task from the template alone with no history (REQ-1202). Closed by: a unit test, and the golden test of TSK-0493 over 20 seeds.
2. Given a template whose `valid()` rejects every candidate, when `generate` runs, then it stops at 1,000 candidates, takes the first fallback entry the predicate accepts, or the first entry when it accepts none, and reports `generation_fallback` (REQ-1208). Closed by: a unit test.
3. Given a template with a constraint such as 2 carries, divisibility by 7 or an irreducible fraction, when 10,000 seeds are generated, then every task meets it (REQ-1206); and given a template whose trap answer equals the correct answer or another trap's by value, when its candidate is tested, then the candidate is rejected whatever the spelling of the two (REQ-1210). Closed by: a property test and a distinctness test with `2/4` against `1/2`.
4. Given a reject predicate that carries the answer of the previous task, when the next task is generated, then its answer differs from it and its seed differs from the previous seed (REQ-0830). Closed by: a unit test.
5. Given the repository, when the lint verb runs, then no file under `src/math`, `src/templates`, `src/render` or `src/shared/answer.ts` imports the model gateway or a network module, and a fixture that does makes the rule fail (REQ-1216). Closed by: the lint verb's output and the rule's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/tasks/template.ts` with the contract of RES-1200 and ADR-0040's four changes: no `level` and no `weight`, an `equation` answer of kind `number` or `fraction`, a `fallback` list of at least 5 parameter sets each checked by `valid()` and trap distinctness, and an `inputClass`. Add `generate`, the effective seed and the failure states `generation_fallback`, `generation_error` and `twin_unavailable` as typed results. Add the `no-restricted-imports` rule. One fixture template of the stand-in tasks proves the contract; the real templates come with the epics that realise ADR-0050 and the knowledge model.

## Depends on

- TSK-0480 (blocking): it supplies `Q`, the seed and the format the generator uses.

## Evidence

Not yet.

## Left alone

Which node, subtype and purpose a slot gets, and the no-repeat window behind the reject predicate, which ADR-0070 owns.
