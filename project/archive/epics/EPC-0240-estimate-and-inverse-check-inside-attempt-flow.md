---
id: EPC-0240
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0240
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The estimate and the inverse check are two optional steps inside the attempt flow, and neither tells her which tasks are scored

Realises exactly ADR-0240: the option builder and the draw that decides which items carry an estimate, the estimate step with its single request and late verdict, the labels beside the class and trap, the `estimate` stream, the time rules, the `inverseCheck` flag and its build checks, the check route and its field, the rule that a check leaves the attempt unassisted, the log fields and the `self_check_used` event, the estimate matrix and the weekly line of checks.

Until the epics realising ADR-0030, ADR-0040, ADR-0060, ADR-0070, ADR-0080, ADR-0150, ADR-0180 and ADR-0210 exist, the tasks run on fixture subtypes and the stand-in routes of `src/server/play.ts`, with the plainest controls the client shell draws. Each task names what it leaves to those epics.

## Acceptance criteria

1. A property test on 10,000 seeds for each estimate subtype finds four distinct options at least 0.6 apart in `log10`, the correct one second or third by value, each about half the time; ten times, a tenth and, for multiplication, the sum of operands each nearest a wrong option; and a chi-square test that doesn't reject an even spread of the correct option over the four positions at the 1 % level; it finds no accepted estimate whose correct option equals the exact answer and reports the refused share for each subtype. Evidence: the property test's report, from TSK-0804.
2. The simulation group plays 30 days on each profile and finds, for each estimate subtype over at least 200 scored items, an estimate share between 10 % and 20 %, the same bounds on unscored items, no difference between the two at the 5 % level, never two estimates in one room, and at least 28 scored first attempts in the 60-minute adventure with estimate and check times added. Evidence: the simulation group's report, from TSK-0805.
3. A packet test sends every task kind with and without an estimate and a check and finds no correct index, no option in value order across seeds, no target beyond the printed operand and no estimate verdict in any reply before `AnswerOut`. Evidence: the packet test's report, from TSK-0806 and TSK-0811.
4. A state-machine test finds the answer field hidden and the thread button inactive until she picks, `estimate_missing` on an answer without a pick, `check_late` after the first attempt and `check_limit_reached` on the fourth check. Evidence: the state-machine tests' reports, from TSK-0806 and TSK-0811.
5. A label test finds `magnitude` on 1800 for 180 with a right estimate, `magnitude_unaware` with a wrong one, `estimate_off_exact_ok` on a right answer with a wrong estimate at credit 1, and on a trap match off by 10 both the trap and the label. Evidence: the label test's report, from TSK-0807.
6. A measure test finds that an item with an estimate never makes an attempt `fast` or a rapid guess, and that an attempt with 20 s of `checkMs` is `fast` when its time without the check is under the threshold. Evidence: the measure test's report, from TSK-0809.
7. A build check fails `inverseCheck: true` on a T template, on 3 · 5 + 7, on a division with a remainder, on a multiplication that can draw a zero operand and on a basic fact. Evidence: the build check's report, from TSK-0810.
8. A report fixture shows «мало данных» in a matrix cell of 4 answers and a count in one of 5, and on a week of checks counts a wrong-to-right change as saved, a right-to-wrong change as spoiled and a wrong-to-wrong change as neither. Evidence: the report tests' reports, from TSK-0814 and TSK-0815.
9. A search of the log schemas finds `estimate` on `attempt_submitted`, no `estimate_submitted` type and no `selfCheck` field, an item with an estimate carrying an empty `forms`, and a search of `ru.json` finds the check's match strings passing ADR-0160's forbidden-word list. Evidence: the schema search test's report, from TSK-0813, and the string check's output, from TSK-0811.
10. Every requirement ADR-0240 addresses lands in a closed task. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the refused share of the option builder for each subtype, which TSK-0804's property test reports against the 20 % of ADR-0240's fifth reversal condition, and the estimate share over 30 simulated days, which TSK-0805's simulation reports against the 10 % to 20 % band.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0804 The option builder makes four rounded values of different orders as separate buttons, with the correct one spread over the four positions
      closes: REQ-5312, REQ-5314, REQ-5316
      depends: none
- [ ] T-002 [P] TSK-0805 A catalogue flag and a seeded draw give an estimate to 10 % to 20 % of eligible tasks, one in a room, scored or not alike
      closes: REQ-5300, REQ-5302, REQ-5304
      depends: TSK-0804 - its refusals feed the draw and it can't carry an estimate the builder refuses.
- [ ] T-003 [P] TSK-0813 The estimate is a field of the attempt, each check is a `self_check_used` event, and each fact has one record
      closes: REQ-5356, REQ-5358, REQ-5072
      depends: none
- [ ] T-004 TSK-0806 The estimate travels with the exact answer in one request, its verdict comes back beside the exact verdict, and the outcome reads the exact answer alone
      closes: REQ-5306, REQ-5308, REQ-5310, REQ-5370
      depends: TSK-0804 - it shows the options the builder makes; TSK-0813 - it writes the `estimate` and `estimateRight` fields.
- [ ] T-005 TSK-0807 The server labels an attempt `magnitude`, `magnitude_unaware` or `estimate_off_exact_ok` beside the class and trap, and never against the exact answer
      closes: REQ-5324, REQ-5326, REQ-5328, REQ-5330, REQ-5332
      depends: TSK-0806 - it reads the pick and `estimateRight`; TSK-0813 - it writes `estimateLabel`.
- [ ] T-006 [P] TSK-0808 The `estimate` stream is a number-sense estimate for each node and subtype with a guess rate of 0.25, and it feeds nothing else
      closes: REQ-5318, REQ-5320, REQ-5322
      depends: TSK-0813 - it reads the `estimate` field.
- [ ] T-007 [P] TSK-0809 An item with an estimate counts for accuracy and no speed measure reads its time, and the check's time is taken off every other attempt
      closes: REQ-5334
      depends: TSK-0813 - it reads `timings.checkMs` and the `estimate` field.
- [ ] T-008 [P] TSK-0810 The `inverseCheck` flag passes the build only on a bare expression of one operation between two printed numbers
      closes: REQ-5336
      depends: none
- [ ] T-009 TSK-0811 The check route compares her check only with the printed operand and the field shows a match or a mismatch with no verdict
      closes: REQ-5338, REQ-5340, REQ-5342, REQ-5344, REQ-5346, REQ-5348
      depends: TSK-0810 - the flag says which templates offer the check; TSK-0813 - the route writes `self_check_used`.
- [ ] T-010 TSK-0812 Checking leaves the attempt unassisted, and the next answer is her first attempt
      closes: REQ-5350, REQ-5352, REQ-5354
      depends: TSK-0811 - it follows the route.
- [ ] T-011 [P] TSK-0814 The node card shows the estimate matrix and «мало данных» under 5 answers a cell
      closes: REQ-5366, REQ-5368
      depends: TSK-0813 - it reads `estimateRight`.
- [ ] T-012 [P] TSK-0815 The summary shows each week the share of checks used and the numbers of answers saved and spoiled
      closes: REQ-5360, REQ-5362, REQ-5364
      depends: TSK-0813 - it reads `self_check_used`.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0804, TSK-0810 and TSK-0813.
- After TSK-0804: TSK-0805.
- After TSK-0813: TSK-0808, TSK-0809, TSK-0814 and TSK-0815.
- After TSK-0804 and TSK-0813: TSK-0806.
- After TSK-0806: TSK-0807.
- After TSK-0810 and TSK-0813: TSK-0811.
- After TSK-0811: TSK-0812.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0804 | REQ-5312, REQ-5314, REQ-5316 |
| TSK-0805 | REQ-5300, REQ-5302, REQ-5304 |
| TSK-0806 | REQ-5306, REQ-5308, REQ-5310, REQ-5370 |
| TSK-0807 | REQ-5324, REQ-5326, REQ-5328, REQ-5330, REQ-5332 |
| TSK-0808 | REQ-5318, REQ-5320, REQ-5322 |
| TSK-0809 | REQ-5334 |
| TSK-0810 | REQ-5336 |
| TSK-0811 | REQ-5338, REQ-5340, REQ-5342, REQ-5344, REQ-5346, REQ-5348 |
| TSK-0812 | REQ-5350, REQ-5352, REQ-5354 |
| TSK-0813 | REQ-5356, REQ-5358, REQ-5072 |
| TSK-0814 | REQ-5366, REQ-5368 |
| TSK-0815 | REQ-5360, REQ-5362, REQ-5364 |

The smallest set of tasks that would test the decision is TSK-0804, TSK-0806, TSK-0809 and TSK-0811. Together they show whether the options leak the answer, whether an estimate verdict can leave the server before the exact answer, whether the estimate and the check leave the speed measures honest, and whether the check can give a free verdict, which are the threats and the premortem the decision names.

## Not covered

- REQ-5072 is addressed by ADR-0210 as well, and both epics close it, ADR-0210's for the registry's one new version and this one for the estimate and the check; the epics realising ADR-0260 and ADR-0270 keep the same rule for the grouping and the plan choice.
- The check on fractions, on longer expressions and on word problems, and the Director's use of the `estimate` stream or the labels to choose tasks: ADR-0240 doesn't settle them and no requirement asks for them.
- A feed of the `estimate` stream into "on her own" or node N4: it waits for the refit after the MVP and ADR-0060's activation rule.
