---
id: TSK-0480
artifact: task
status: done
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

Collected on 2026-10-10 on the Mac, at commit 3aa57cd of the branch `tsk-0480-exact-arithmetic`, in pull request #16. Every criterion is met.

- Verbs: `meow-verbs` isn't installed on this Mac, so each command of `.meowpaw/profile.toml` ran by itself and exited 0: `npx prettier --check .`, `npm run lint`, `npx tsc --noEmit`, `npm test` (53 Vitest files with 475 tests, and 59 Playwright tests passed; the two `✘` lines are the response recorder's `test.fail()` self-tests) and `npm run build && docker compose build`.
- Criterion 1, REQ-1204: `tests/unit/math-q.test.ts` adds 0,1 and 0,2 to exactly `3/10`, divides 79 by 10 to `79/10` and multiplies back to 79, and adds 0,1 a thousand times to exactly 100, which the float sum fails.
- Criterion 2, REQ-1202: `tests/unit/math-rng.test.ts` holds the base seed of a fixed session, node and slot, the seed of candidate 7, the first six draws and the hash of the first 1,000 draws. The values come from a separate script that follows the reference C implementation. A state of all zeros draws as the fixed constant does.
- Criterion 3, REQ-1226: `tests/unit/math-format.test.ts` writes `12 500`, `4 003`, `2 400`, `0,5`, `3,5` and `12 345,67` with a no-break space and a comma, reads `·`, `:` and the minus from the language file's `notation.` keys, and finds no point as a decimal sign and no ungrouped number of 4 digits or more in 1,000 seeded numbers.
- Criterion 4, REQ-1202: ESLint's `no-restricted-properties` bans `Math.random` in `src/`; the lint verb reports none, and `tests/unit/lint-math-random.test.ts` makes a fixture that calls it fail.

Choices made here, because the approved records left them open:

- The seed of candidate `k` or of a named stream is the first 128 bits of SHA-256 over the base seed, a zero byte and the label; the base seed's fields are joined with zero bytes so one field can't run into the next.
- The fixed state for all zeros is the four words `0x9e3779b9`, `0x243f6a88`, `0xb7e15162`, `0xdeadbeef`.
- The minus sign of a negative number is U+2212, as the catalogue's solutions write it, and the checker still reads the hyphen (TSK-0482).
- `formatQ` refuses a fraction with no finite decimal; the renderer writes those as fractions.
- The profile is in `content/i18n/ru.json` under `notation.`, which the client doesn't receive because only `ui.` keys go to it.

## Left alone

Rendering a task's text, which TSK-0490 and TSK-0488 build on these functions.
