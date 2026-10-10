---
id: TSK-1088
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6980]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A 60-day simulation shows each first encounter once and both holds keeping their encounters back

After this task, group 3 of the verify command runs addendum 2's acceptance test 2 over a 60-day simulated log, and it fails when a first encounter is counted twice or a hold lets its encounter go early.

## Acceptance criteria

1. Given the 60-day simulation, when the projection runs, then it gives at most one `firstExposure` per subtype, per subtype-and-format pair and per subtype-and-context pair, and exactly one for each pair shown and not used up by a higher kind at the same show (REQ-6980). Closed by: acceptance test 2's report.
2. Given the same run, then no subtype with templates in both formats shows its context format before its node is fluent by a tested result or 14 game days have passed (REQ-6980). Closed by: the test's report.
3. Given the same run, then no subtype with at least 2 contexts with an accepted frame shows its last unshown context before its node is fluent by a tested result (REQ-6980). Closed by: the test's report.
4. Given the same run, then the half-bare rule holds on every node, `frameRepeat` is reported as a share of shows of each structure under a context hold, and every show of a held subtype has `transfer_hold` in `why` (REQ-6980). Closed by: the test's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add acceptance test 2 to group 3 of ADR-0190's verify command, run on the simulated player the simulation already uses, with fixture frames in at least 2 contexts for each structure and templates in both formats. Report the share of shows marked `frameRepeat` per structure and per 14 game days, because ADR-0410 reverses the context hold when more than 1 in 4 shows of a structure repeat. The run must fit the baselines ADR-0190 sets for the simulation, and `nextTask` and task generation must stay inside their p95 budgets of 100 ms and 50 ms with the holds on.

## Depends on

- TSK-1082 (blocking): it runs both holds and reads `why`.
- TSK-1083 (blocking): it fills side slots under the rule.
- TSK-1085 (blocking): it counts only the encounters the projection marks eligible.

The epic realising ADR-0060 supplies the tested states and the epic realising ADR-0190 the verify command's simulated player; the test runs on fixture states until they exist.

## Evidence

Not yet.

## Left alone

The reversal conditions that need real data, such as the share of subtypes reaching fluent within 14 days, which the owner reads from the log after the MVP.
