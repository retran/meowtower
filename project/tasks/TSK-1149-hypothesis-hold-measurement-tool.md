---
id: TSK-1149
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `tools/hypothesis-hold.ts` measures the false-label rate for each hold

After this task, `tools/hypothesis-hold.ts` runs the rule functions on synthetic logs of 180 play days and reports, for each H from 7 to 56 in steps of 7, the share of 200 hypotheses that show a label other than «мало данных» on any day, and verify either records the shortest H that passes or reports `hold_uncalibrated`. The task closes no requirement: it measures what TSK-1144 and TSK-1145 build.

## Acceptance criteria

1. Given the tool, when it runs with its fixed seeds, then it prints the false-label rate and the number of hypotheses for each of the 8 values of H, and two runs print the same numbers. Closed by: the tool's output and a repeat-run test.
2. Given the generator, when it is read, then half its hypotheses compare `probe.ru` minus `probe.nl` with 20 points at true shares of 75 % and 55 %, and half compare `probe.bare` with 70 at a true share of 70 %, each with one condition a side at the same number, the worst case ADR-0450 chose. Closed by: a unit test over the generator's hypotheses.
3. Given a synthetic log with no H up to 56 that passes the bar, when verify runs, then it reports `hold_uncalibrated` and the computed label, its UI and the `hypothesis_days` projection stay out of the build; given an H that passes, then verify records it in `content/thresholds.json` under `hypothesis.holdDays`. Closed by: two verify fixture tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Put the tool in the simulation group of ADR-0190's verify. It runs before any screen of the label is built, because it needs only the rule functions. The probe volume is 3 to 5 tasks a day until each of the three presentations holds 20 observations or 28 days pass, then 1 to 2 a day, as ADR-0450's sketch assumes; the probe's planned volume from ADR-0430 replaces it when that epic exists. Print the false-label rate for each H and leave the pass bar as a parameter, because REQ-7504 moves the bar to the upper limit of a 95 % Wilson interval over 2,000 hypotheses read once, and the epic realising ADR-0460 sets it.

## Depends on

- TSK-1144 (blocking): the tool runs the rule functions.

## Evidence

Not yet.

## Left alone

The bar itself and the count of 2,000 hypotheses, which the epic realising ADR-0460 sets through REQ-7504, and what replaces the hold when no H passes, which ADR-0450 sends back to research.
