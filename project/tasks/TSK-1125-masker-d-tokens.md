---
id: TSK-1125
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0440
closes: [REQ-7204, REQ-7206, REQ-7212]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The masker takes fraction words, ordinals and cardinal-plus-ordinal runs as `d` tokens whose values stay on the Mac

After this task, the masker replaces every fraction word and every ordinal with a `d` token, a round cardinal followed by a lower ordinal with one `d` token for the whole denominator, and the value of each `d` token stays on the Mac.

## Acceptance criteria

1. Given «половина», «треть», «четверть» and every ordinal from «первый» to «тысячный» in every gender and case, when the masker runs, then each becomes a `d` token `d1` to `dk` in text order, and «на третьей полке» is masked too (REQ-7204). Closed by: a unit test over the numerals file's forms.
2. Given «целых», when the masker runs, then it stays a word because it carries no value (REQ-7204). Closed by: a unit test.
3. Given «три двадцать пятых», when the masker runs, then «три» is an `n` token and «двадцать пятых» is one `d` token whose value is 25; given «сто первый», then one `d` token of 101; given «двадцать одна пятая», which forms no compound ordinal, then «двадцать» and «одна» stay `n` tokens and «пятая» a `d` token (REQ-7206). Closed by: a unit test, three fixtures.
4. Given a masked request, when its fields are read, then no `d` token's value and no mapping from `d1` to `dk` back to her words appears in the request, and both stay in the riddle's server state (REQ-7212). Closed by: a schema test of the `ParseRequest` and a log test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the class `n` or `d` to each entry of `content/numerals.ru.json` and the forms of every word above. An ordinal used as a position is masked too, and the graph leaves it unused like irrelevant data, because only the parse can tell a position from a denominator, and an ordinal left unmasked would fail the guard as `mask_incomplete`. A separate `d` class tells the parser a word's role without its value, because «n1 n2 от n3» can't say which token is the denominator. The masker runs the longest form first, so a compound ordinal isn't read as a cardinal and an ordinal.

## Depends on

- TSK-1124 (blocking): both passes share the numerals file and the longest-form-first order.

## Evidence

Not yet.

## Left alone

The guard that refuses an unmasked word and the independent masking test, which TSK-1126 adds, and what the parser does with a `d` token, which TSK-1127 changes.
