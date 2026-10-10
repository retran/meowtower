---
id: TSK-0909
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5956, REQ-5958, REQ-5960, REQ-5962]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Seven reading traps name every reading mistake, and the error-type limit classes each as conceptual or procedural

After this task, `content/catalogue.yaml` names the seven trap identifiers, the S1 and M2 traps carry two of them, `misread_cell` returns the set of answers its adjacent values give, and the error-type limit classes three traps as conceptual and four as procedural.

## Acceptance criteria

1. Given every track template, when the build runs, then each mistake it detects names one of `misread_cell`, `axis_scale`, `legend_misread`, `scale_conversion`, `time_across_hour`, `wrong_source_part` and `ignored_condition`; given a fixture template that names an eighth, then the build fails (REQ-5956). Closed by: the build check's test.
2. Given `misread_cell` fired on S1 and on I1 in a fixture log, when the misconceptions screen is built, then it shows one row for the pair, and one row for `time_across_hour` fired on M2 and on I3 (REQ-5958). Closed by: a report test.
3. Given a fixture that holds all seven traps, when the error-type limit classes them, then `axis_scale`, `scale_conversion` and `time_across_hour` are conceptual and the other four procedural, with no change to ADR-0180's mapping (REQ-5960, REQ-5962). Closed by: a limit test.
4. Given a table where the read cell has a left and a right neighbour with other values, when `misread_cell`'s `apply()` runs, then it returns both neighbours' answers, and the distinctness test compares each with the correct answer and with every other trap's answer (ADR-0300). Closed by: a trap test.
5. Given a region answer on the neighbour of the correct region, when it is classed, then it is `misread_cell`, and a wrong region that matches no trap is `unclassified` (ADR-0300). Closed by: a classifier test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the seven identifiers to `content/catalogue.yaml` and rename the S1 catalogue trap "neighbouring row or column" to `misread_cell` and the M2 trap "an hour = 100 minutes" to `time_across_hour`, so the misconceptions screen shows one row for each pair. I merged only those two pairs, because RES-4090 compared only the S1 and M2 pairs; P5's "units lost" with `scale_conversion` and G7's "west and east swapped" with `legend_misread` stay as two rows, and the decision leaves them open.

`misread_cell` has more than one wrong answer, one for each adjacent value, so its `apply()` returns a set and the distinctness test of ADR-0040 compares every member. The error-type limit takes each trap's kind with no change to its mapping.

## Depends on

- TSK-0905 (blocking): the template contract the trap's `apply()` sits in.
- TSK-0908 (blocking): the region answer a trap classifies.

## Evidence

Not yet.

## Left alone

The wording of the hint rungs for track tasks, which belongs to the decision on the hint ladder since a track template supplies `hints(p)` like any other. The merge of P5 and G7 traps, which no record settles.
