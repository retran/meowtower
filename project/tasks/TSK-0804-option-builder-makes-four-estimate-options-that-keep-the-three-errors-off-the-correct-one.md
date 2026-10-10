---
id: TSK-0804
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5312, REQ-5314, REQ-5316]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The option builder makes four rounded values of different orders as separate buttons, with the correct one spread over the four positions

After this task, a pure function builds an estimate's four options, the correct one the result rounded to one significant figure, the other three one order apart with varied leading digits, shuffled by the item's seeded stream, so that ten times the result, a tenth of it and, on a multiplication, the sum of its operands each fall on a wrong option, and the builder refuses the estimate where no draw can keep them off.

## Acceptance criteria

1. Given 10,000 seeds for each estimate subtype, when the options are built, then each set has four distinct options at least 0.6 apart in `log10`, the correct one second or third by value, each about half the time (REQ-5312). Closed by: a property test.
2. Given the same 10,000 seeds, when the position of the correct option is counted, then a chi-square test doesn't reject an even spread over the four positions at the 1 % level (REQ-5314). Closed by: the property test.
3. Given every accepted estimate, when ten times the result, a tenth of it and, for a multiplication, the sum of the operands are each matched to the option nearest in `log10`, then each lands on a wrong option (REQ-5316). Closed by: the property test.
4. Given 105 · 2 = 210, whose sum of operands 107 falls on the correct option, and a task whose correct option equals the exact answer, when the builder runs, then it refuses both, the item goes out with no estimate and the room's estimate stays open (REQ-5316). Closed by: unit tests with the two fixtures.
5. Given 38 · 47 = 1786, when an accepted draw is read, then the correct option is 2000 and the draw has the orders of ADR-0240's example, such as 300, 2000, 10,000 and 400,000 (REQ-5312). Closed by: a unit test with a seeded stream.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the builder to `src/shared/` or `src/engine/` as a pure function. The correct option is `r · 10^e`; the other three sit at orders `e + j` for `j` in `{-1, 1, 2}` or `{-2, -1, 1}`, chosen by a seeded coin, so the correct order is never the lowest or the highest, because REQ-5316 needs an option above it for ten times the result and one below it for a tenth. Each distractor is `d · 10^(e + j)` with a leading digit `d` drawn from 1 to 9; four options with the same leading digit would show her the first digit of the exact answer. A draw is accepted when every two options are at least 0.6 apart in `log10`, a factor of 4.

Refuse the estimate after 20 refused draws, a default ADR-0240 chose to keep the builder inside ADR-0190's 50 ms budget for task generation. An option is right when it is the option nearest the correct result in `log10`; a value falls on the option nearest to it. For an unanswerable T2 to T4 problem the correct result is the complete problem's, as ADR-0460 amends ADR-0240; the subtype that makes such problems belongs to ADR-0250's epic, so a fixture stands in.

Shuffle the four options with the item's seeded stream, so the buttons never follow the order of their values, because a number line can't hold both acceptance rules. The item row and `item_shown` keep the four values and the index of the correct one, and the client gets only the four formatted values.

## Depends on

Nothing.

The epic realising ADR-0040 supplies the item builder and the seeded stream; this task adds the builder to the item builder as it stands, and its property tests join verify group 2.

## Evidence

Not yet.

## Left alone

Whether an item carries an estimate, which TSK-0805 holds, and the rank leak that no packet rule can hide, which ADR-0240's third reversal condition watches.
