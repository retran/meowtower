---
id: TSK-0482
artifact: task
status: done
revised: 2026-10-10
epic: EPC-0040
closes: [REQ-0732, REQ-0742, REQ-0744, REQ-0746, REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756, REQ-0758, REQ-0778]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The checker accepts number answers by value and kind

After this task, `src/shared/answer.ts` holds one pure function for each number answer kind, integer, decimal, fraction, mixed number, equation value and quotient with remainder, and each returns correct, half credit, wrong or `unparsed` for an entry.

## Acceptance criteria

1. Given the integer 12500, when the entry is `12 500` or `012500`, then it is accepted; given `007` for 7, then it is accepted (REQ-0732). Closed by: one fixture each in the acceptance test.
2. Given the decimal 2,5, when the entry is `2,5`, `2.5`, `2,50` or `2,500`, then it is accepted, and given the whole number 3 an entry `3` is accepted without `,0` (REQ-0742). Closed by: one fixture each.
3. Given a fraction task that accepts equivalent fractions with the answer 1/2, when the entry is `2/4` or `3/6` it is accepted, an improper fraction equal to the answer is accepted, and `0,5` is rejected although equal (REQ-0744, REQ-0746). Closed by: one fixture each.
4. Given a fraction task that asks for the simplest form, when the entry is `1/2` then it gets full credit, and `2/4` gets 0.5; given a mixed-number task, when the entry is `2 1/2` it gets full credit under both rules, an equal improper fraction is accepted under the equivalent rule, and under the simplest-form rule an improper fraction or a mixed number whose fractional part isn't reduced gets 0.5 (REQ-0748, REQ-0750, REQ-0752, REQ-0754, REQ-0756). Closed by: one fixture each.
5. Given the dividend 79 and the divisor 10, when the entry is `6 r 19`, then it is rejected although 6 · 10 + 19 = 79, and `7 r 9` is accepted (REQ-0758); given an equation task whose unknown is 3/4, the entry `3/4` or `0,75` is accepted as its value (REQ-0778). Closed by: one fixture each.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the number kinds to `src/shared/answer.ts`, each parsing its entry with `Q` and returning the credit as 1, 0.5 or 0 and the entry's form so the trap classifier can read it. An entry the kind can't parse returns `unparsed` and nothing else. The checker accepts `dont_know` for every kind. TSK-0483 adds the structured kinds to the same module.

## Depends on

- TSK-0480 (blocking): every comparison is by value in `Q`.

## Evidence

Every criterion is checkable by a program; none rests on judgement.

Fixtures in `tests/unit/answer-number.test.ts`, 26 tests:

1. REQ-0732: `12 500`, `12` with a no-break space, `012500` and `007` are correct; `12 501` is wrong; a malformed grouping is unparsed.
2. REQ-0742: `2,5`, `2.5`, `2,50` and `2,500` are correct; `3` and `3,0` are correct for 3; `3,,5` is unparsed.
3. REQ-0744 and REQ-0746: `2/4` and `3/6` are correct for 1/2; `6/4` is correct for 3/2; `0,5` is wrong, as a decimal.
4. REQ-0748 and REQ-0750: `1/2` is full credit and `2/4` is half credit under the simplest-form rule.
5. REQ-0752, REQ-0754 and REQ-0756: `2 1/2` is full credit under both rules; `5/2` is correct under the equivalent rule and half under the simplest; `2 2/4` is half under the simplest rule.
6. REQ-0758: `6 r 19` is wrong for 79 and 10; `7 r 9` is correct.
7. REQ-0778: `3/4` and `0,75` are correct for the value 3/4.
8. `dont_know` gives no credit for every kind, and free text is unparsed.

The fixtures sit in the unit suite, not in an acceptance test, because the epic's acceptance test doesn't exist yet. TSK-0492 gathers them there.

Stages at tree `3a9535302ce6`, from `meow-checks evidence`:

- format: passed, record e64afc8771bd
- lint: passed, record b50646dcb918
- check: passed, record b89f8e945b1b
- test: passed, record e03dca877159
- build: passed, record 9f57f6519ef6

The tests and the module were written together, so the failing run that the implement step asks for didn't happen for this task.

## Left alone

That an unparsed entry doesn't count as an attempt and doesn't stop the clock, which TSK-0492 wires into the play routes, and the keypad that offers the characters, which ADR-0150 owns.
