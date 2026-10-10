---
id: TSK-1124
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7202, REQ-7208]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The masker takes decimals, slash fractions, mixed numbers and multiplicative words as `n` tokens

After this task, the masker replaces every number the player writes with a token `n1` to `nm` in text order, a decimal, a slash fraction and a mixed number in digits each as one token, and keeps the preposition of a multiplicative word.

## Acceptance criteria

1. Given the text «2 1/2 литра, 3/4 и 2,5», when the masker runs, then it gives three tokens, «2 1/2», «3/4» and «2,5» each as one `n` token, the longest form first, and a decimal written with a point is one token too (REQ-7202). Closed by: a unit test, one fixture for each form.
2. Given the words of REQ-7202's set, every cardinal numeral with compound ones such as «сорок восемь», every collective numeral from «двое» to «десятеро», «полтора», «десяток», «дюжина», «сотня», «пара» and the multiplicative words from «вдвое» to «вдесятеро», each in every case form, when the masker runs, then none is left in the text (REQ-7202). Closed by: a unit test over the numerals file's forms.
3. Given «вдвое», when the masker runs, then it gives «в n1 раза» and the token's span maps back to her word; given «пополам», then «на n1 части» with n1 = 2; given «пара», then an `n` token of value 2 (REQ-7208). Closed by: a unit test, three fixtures.
4. Given the mapping from tokens to her words and to their values in `Q`, then it stays in the riddle's server state and the log, and no request class has a field for it. Closed by: a schema test of the `ParseRequest`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Widen the masker's step 3 from "digit runs and the Russian number words" to the rule above, reading each word from `content/numerals.ru.json` with the forms in every gender and case. A mixed number in digits is a whole number, a space and a slash fraction, and a digit run split at a comma would give the parser two tokens that it can't join, because it may name no number. Her digits are part of her answer and stay on the Mac, and a model that never sees a number can't compute one. ADR-0460 settles that the masker and the reply check bind from the MVP, so build this with the MVP's composing and not after it.

## Depends on

Nothing within this epic. The epic realising ADR-0230 supplies the five-step text pipeline whose step 3 this changes.

## Evidence

Not yet.

## Left alone

Fraction words, ordinals and compound denominators, which TSK-1125 masks as `d` tokens, and the guard that refuses a missed word, which TSK-1126 adds.
