---
id: TSK-0480
artifact: task
status: draft
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-1204, REQ-1226]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Exact arithmetic, a seeded generator source and Russian number formatting

After this task, `src/math` holds `Q`, a rational type on `bigint` that computes every sum, difference, product and quotient exactly, the xoshiro128** source with the seed hash, and `formatQ`, so no later module needs a float, a `Math.random` or a hand-written number format.

## Acceptance criteria

1. Given the decimals 0,1 and 0,2 as rationals, when they are added, then the sum is exactly `3/10` and `formatQ` writes it as `0,3`; given 79 and 10, when divided, then the quotient is `79/10` and no rounding appears at any step (REQ-1204). Closed by: a unit test.
2. Given the seed text of a session, a node and a slot, when the base seed is hashed twice, then both give the same 128 bits, a state of all zeros is replaced by the fixed constant, and the first 1,000 draws of a fixed seed equal the values in the test (REQ-1202's source). Closed by: a unit test with golden values.
3. Given a `Q`, when `formatQ` writes it for `ru`, then the decimal sign is a comma, every number of 4 digits or more is grouped with a no-break space, and `12500` reads `12 500` and `0,5` reads `0,5`; the multiplication sign is `·` and the division sign is `:` (REQ-1226). Closed by: a unit test, and a regular expression over 1,000 formatted numbers that finds no `.` as a decimal point and no ungrouped number of 4 or more digits.
4. Given the repository, when the lint verb runs, then `Math.random` is reported nowhere under `src/`, and a fixture that calls it makes the rule fail. Closed by: the lint verb's output and the rule's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Create `src/math/q.ts`, `src/math/rng.ts` and `src/math/format.ts`, and ESLint's `no-restricted-properties` rule for `Math.random` in `src/`, as ADR-0040 and RES-1200 state them. `formatQ` reads the decimal sign, the group separator and the operation signs from the notation profile in the language file, which ADR-0160 owns; until its epic exists the profile sits in `content/i18n/ru.json` under `notation.`.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

Rendering a task's text, which TSK-0490 and TSK-0488 build on these functions.
