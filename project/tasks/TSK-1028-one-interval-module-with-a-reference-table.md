---
id: TSK-1028
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6616, REQ-6618, REQ-6620]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One module computes every Wilson, Newcombe and median interval, and a reference table holds it to 0.0005

After this task, `src/parent/intervals.ts` holds the only functions that compute the 80 % Wilson interval, Newcombe's hybrid score interval for a difference and the distribution-free interval for a median, and a figure shows its count and interval or «мало данных», so two screens can't compute one figure two ways.

## Acceptance criteria

1. Given every count from 0 of 1 to 60 of 60, when the module computes the 80 % Wilson interval, then each bound is within 0.0005 of the value in `tests/reference/intervals.json` (REQ-6616). Closed by: a group 2 test that fails with `interval_reference_mismatch`.
2. Given every pair of counts at totals of 5, 10, 12, 20 and 40 on each side, when the module computes Newcombe's interval, then each bound is within 0.0005 of the table; and given 4 to 60 values, then the median interval's ranks j and n + 1 - j equal the table's, with j the largest rank for which a binomial count of n at one half falls below j with chance 0.10 or less (REQ-6618, REQ-6620). Closed by: the same test.
3. Given the figure function with a count below its floor on either side, when it builds a share or a difference, then it returns `too_little_data` with the count and no value; above the floor it returns the right answers, the attempts and the interval (REQ-6616, REQ-6618, REQ-6620). Closed by: a unit test.
4. Given `src/parent/`, when it is searched, then no module other than `src/parent/intervals.ts` imports a statistics library. Closed by: a lint rule and its fixture module.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/intervals.ts`, `tools/reference-intervals.py` and `tests/reference/intervals.json`. The script runs once with `numpy` and `scipy.stats` and its output is committed; the build never runs Python. SciPy has no Newcombe function, so the script builds it from the two Wilson limits: the lower limit is the difference minus the square root of (p1 - l1)^2 + (u2 - p2)^2, and the upper is the difference plus the square root of (u1 - p1)^2 + (p2 - l2)^2.

ADR-0380 names counts up to 1,000 when it describes how the table is computed, and counts up to 60 in its ceilings and its first criterion. I chose 60, because the Newcombe table at 1,000 on each side holds a million pairs and the ceiling says the table grows only with a decision. The totals 100 and 1,000 of the first description are left out for the same reason.

Other tasks import the figure function: the profile of ADR-0390, the trajectory of ADR-0400 and the probe's report of ADR-0430 each read it, and none writes its own.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The floors themselves, which TSK-1029 registers, and the reference table's growth beyond 60, which needs a decision.
