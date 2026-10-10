---
id: TSK-0612
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0600, REQ-0610, REQ-0612, REQ-0614]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A model's explanation text passes code checks for its schema, placeholders, length, numbers and step order before it is shown

After this task, `src/engine/checks/` holds the shared check module with the type `CheckedText` and the first five checks of an explanation, which run in code on the Mac, so a model reply that cites a step the engine lacks, runs past 8 sentences, holds a number or names the steps out of order never reaches her.

## Acceptance criteria

1. Given a reply that doesn't match the JSON schema or names a placeholder the graph lacks, when the checks run, then it is rejected at the first check (REQ-0612). Closed by: a unit test with both replies.
2. Given a reply of 9 sentences by the module's sentence splitter, when the checks run, then it is rejected, and a reply of 8 passes (REQ-0610). Closed by: a unit test with both.
3. Given a reply holding a digit, «половина», «пара» or «дюжина», when the checks run, then each is rejected, matched by lemma against `content/numerals.ru.json` (REQ-0600's numbers come only from the engine). Closed by: a unit test with one reply for each.
4. Given a reply whose `{sN.value}` placeholders first appear out of the graph's order, or that omits one step's value or the answer, when the checks run, then it is rejected, and a reply naming every step's value in order with `{answer}` last passes (REQ-0600, REQ-0614). Closed by: a unit test with both orders.
5. Given the type system, when code outside the module builds a `CheckedText`, then `tsc` refuses it. Closed by: `npx tsc --noEmit` on a fixture file that must fail.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the module, the sentence splitter, the lemma matcher over the numeral lexicon, and the placeholder grammar: `{sN.a}`, `{sN.b}` and `{sN.value}` for step N, `{answer}`, `{given}` and `{trap.value}`. The model's reply is a strict JSON array of familiar lines with no speaker field. A placeholder fill happens only after every check. The module's output type is the one ADR-0110's reply checks also use.

## Depends on

Nothing in this epic. The epic realising ADR-0040 supplies the solution graph with each step's operation, operands and result; until it exists the checks run on fixture graphs written for this task. The epic realising ADR-0160 supplies the forbidden-word checker, which TSK-0613 uses.

## Evidence

Not yet.

## Left alone

The safety check, the blind solve and the forbidden-word check, which TSK-0613 and TSK-0614 add as later steps of this module.
