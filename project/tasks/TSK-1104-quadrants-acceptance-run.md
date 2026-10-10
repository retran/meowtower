---
id: TSK-1104
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The acceptance run shows every quadrant and reason on fixtures, the build time and the parent's judgement of the wording

After this task, one fixture run shows each quadrant and each reason code against a table written by hand, the screen's build time sits at the baseline, and the parent has judged the wording on a synthetic snapshot.

## Acceptance criteria

1. Given a fixture snapshot and a 60-day log, when the function runs, then each row lands in the quadrant or the reason that a table written by hand gives, with at least one row for each of the four quadrants and each of the 15 reason codes. Closed by: the fixture test's report.
2. Given a year of simulated log on the family Mac, when the screen is built 20 times, then the p95 is 1 s or less. Closed by: the build-time measurement's output.
3. Given a synthetic snapshot and Cito result, when the parent reads the quadrant headings, the cause lines and the two "measure different things" lines, then the parent judges each as a check and not a verdict, and none as a fault of the player or of a measure. Closed by: the parent's judgement before the feature's acceptance, because wording read by a parent can't be shown by a program.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the hand-written table and the generated fixture year under `tests/`, as ADR-0310's fixtures are generated, with no real printout. Add the screen's build to ADR-0190's Baselines table, owned by ADR-0420 and chosen: p95 at most 1 s with a year of log, a fifth of ADR-0180's 5 s report rebuild. Record `quadrant_build_slow` as a finding against the baseline when the p95 passes 1 s, without moving the baseline. Report the share of fixture rows in no quadrant by reason code, which ADR-0420 reverses on when it passes half of goal rows over two terms.

## Depends on

- TSK-1100 (blocking): it judges the checks and causes.
- TSK-1101 (blocking): it judges the basis marks.
- TSK-1102 (blocking): it runs resolved and unresolved rows.

## Evidence

Not yet.

## Left alone

The reversal conditions that need real data: a Newcombe interval crossing zero on a third of disagreeing rows, a LOVS-style signal missing from a real Leerling in beeld report, and the next test moment reversing small-category rows. The owner reads these at the yearly review with `./meowtower report home-and-school --as-of <date>`.
