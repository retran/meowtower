---
id: TSK-0807
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5324, REQ-5326, REQ-5328, REQ-5330, REQ-5332]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server labels an attempt `magnitude`, `magnitude_unaware` or `estimate_off_exact_ok` beside the class and trap, and never against the exact answer

After this task, `estimateLabel(correct, answer, estimateRight)` gives one label from the pair of estimate and exact answer, written as `estimateLabel` on the `verdict` event beside the class and the trap, and a right exact answer labelled `estimate_off_exact_ok` keeps credit 1 in every measure.

## Acceptance criteria

1. Given the exact answer 1800 for the correct result 180 and a right estimate, when the label is computed, then it is `magnitude`; given a wrong estimate, then `magnitude_unaware` (REQ-5324, REQ-5326). Closed by: a label test on fixtures.
2. Given a right exact answer at credit 1 and a wrong estimate, when the label is computed, then it is `estimate_off_exact_ok` and the attempt counts as right in every measure and never as a mistake (REQ-5328, REQ-5332). Closed by: the label test and a measure test.
3. Given a wrong answer that matches trap A6a and is off by a factor of 10, when its verdict is read, then it carries the trap and `magnitude`, and a wrong answer with the class «не классифицирована» (unclassified) keeps that class and gains the label (REQ-5330). Closed by: the label test.
4. Given the error-type screen's inputs, when it is built, then it counts `class` alone and its shares don't change with the labels (REQ-5330). Closed by: a report test.
5. Given an answer off by a factor `10^k` for a whole `k` other than 0, when the factor is checked, then the comparison is made in `Q` and not in floats (REQ-5324, REQ-5326). Closed by: a unit test at 0,18 against 1,8.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `estimateLabel` as a pure function in ADR-0040's item builder and write its result as `estimateLabel` on `verdict` after the first attempt. The table: a wrong exact answer whose value equals the correct result times `10^k` gives `magnitude` with a right estimate and `magnitude_unaware` with a wrong one; credit 1 with a wrong estimate gives `estimate_off_exact_ok`; anything else gives none.

The label sits beside the class and trap and never replaces either. I took ADR-0240's mapping of both labels to none of ADR-0180's four error classes, over the addendum's readings of `magnitude` as procedural and `magnitude_unaware` as conceptual, because a label already sits beside a class that says the same or more, and counting both would inflate one class.

## Depends on

- TSK-0806 (blocking): the pick and `estimateRight` the label reads.
- TSK-0813 (blocking): the `estimateLabel` field on `verdict`.

The epic realising ADR-0040 supplies the checker's class and trap; this task adds the label beside them.

## Evidence

Not yet.

## Left alone

The class and trap assignment, which ADR-0040 owns, and RES-2550's `errorClass` type, which stays as it is.
