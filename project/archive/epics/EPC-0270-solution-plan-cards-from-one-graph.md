---
id: EPC-0270
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0270
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A compound word problem opens with a plan, a model choice or neither, and the plan's cards come from one valid graph

Realises exactly ADR-0270: the plan builder with its quantity ids and decoys, the card wordings in a per-language file, the five-label grader, the counters that choose the opening phase and the input form, the plan route and its event, the card board and the labelled step rows, the label's isolation from every measure, the two-column scheme after the answer, and the report's crosses.

Until the epics realising ADR-0040, ADR-0070, ADR-0080, ADR-0150 and ADR-0180 exist, the tasks run on fixture templates and fixture screens, and each task names what it leaves to those epics.

## Acceptance criteria

1. A simulation of 30-day play with the ten profiles of ADR-0190, twins, riddles and at most one forced `plan_unavailable` slot in every 8 compound problems finds, in every run of 8 or more consecutive compound problems, the plan share, the model share, the plan step-input share and the T1 model share inside their bands, and no problem with both a model choice and a plan. Evidence: the simulation's report, from TSK-0855.
2. A property test over 10,000 seeds of every word problem template finds, in every plan, 3 to 5 cards, 1 decoy on T2 and T4 and 1 or 2 on T3, the needed cards equal to one valid graph's steps with the question last, no decoy that is a step of any valid graph, no two card texts alike and no given's number in a `stated` decoy's text. Evidence: the property tests' reports, from TSK-0852 and TSK-0853.
3. A brute-force test lays every ordered subset of every generated plan's cards for 1,000 seeds and finds exactly one card set graded `correct`, both orders of every fork graded `correct`, and each label matching an independent reference grader. Evidence: the brute-force test's report, from TSK-0854.
4. A payload test serialises 1,000 `PlanView`s and finds no kind, `needed` flag, dependency or graph id, and a test over seeds finds needed cards in every display position. Evidence: the payload test's report, from TSK-0856.
5. A log test submits a plan, stops, resumes on the other device and finds `solve` with the same laid cards, and a resent submission writes one event. Evidence: the log test's report, from TSK-0856.
6. A Playwright test on the tablet viewport lays a plan, finds no mark or verdict word before the answer, finds the step rows labelled with her cards, adds and removes rows up to 6, and finds the two columns in the knot's scheme with no tick or cross. Evidence: the Playwright report, from TSK-0857 and TSK-0859.
7. A measurement test runs the same answers through a plan problem and a no-phase problem and finds equal credit, outcome, success share, holding-steps value and estimate for every label. Evidence: the measurement test's report, from TSK-0858.
8. A report fixture with one plan of each label and a model problem of each result finds the planning-error count, the two crosses, the plan cross split by step count and a wrong answer after a `correct` plan counted as a calculation error. Evidence: the report test's report, from TSK-0860.
9. A mutation test removes one card wording and one quantity id in turn, and the build fails each time with `plan_template_incomplete`. Evidence: the mutation test's report, from TSK-0853.
10. Every requirement ADR-0270 addresses lands in at least one task or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of `plan_unavailable` slots in the simulation, which TSK-0855 reports against ADR-0270's 1 % line on fixture templates, and the number of cards of each plan, which the property test of TSK-0852 counts.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0852 The plan builder takes the needed cards from one valid graph and the decoys from quantities outside every valid graph
      closes: REQ-5614, REQ-5616, REQ-5618, REQ-5620, REQ-5622
      depends: none
- [ ] T-002 TSK-0853 Each card's wording sits in `content/plans.ru.json`, written by the template author, with no model call
      closes: REQ-5660, REQ-5662
      depends: TSK-0852 - the wordings are keyed by its quantity ids.
- [ ] T-003 [P] TSK-0854 The server grades a plan into one of five labels, and the exact-permutation rule of `order` answers stays as it is
      closes: REQ-5624, REQ-5626, REQ-5628, REQ-5630, REQ-5632, REQ-5634, REQ-5672
      depends: TSK-0852 - the grader reads its plan, kinds and dependencies.
- [ ] T-004 [P] TSK-0855 The item builder gives every first-shown word problem its opening phase and input form from fixed counters
      closes: REQ-5600, REQ-5602, REQ-5604, REQ-5608, REQ-5610, REQ-5648, REQ-5670
      depends: TSK-0852 - `plan_unavailable` comes from the plan builder.
- [ ] T-005 TSK-0856 The server logs the laid plan as `plan_submitted` before she answers, restores it on resume and sends only the strict view
      closes: REQ-5638, REQ-5640, REQ-5642, REQ-5658
      depends: TSK-0854 - the label and faults come from the grader.; TSK-0855 - the opening phase comes from the counter.
- [ ] T-006 TSK-0857 The task window shows a card board with no verdict and labels the step rows with the cards she laid
      closes: REQ-5612, REQ-5650, REQ-5654, REQ-5656
      depends: TSK-0856 - the board reads `PlanView` and sends to its route.
- [ ] T-007 [P] TSK-0858 The answer after a plan counts as the answer after no phase, and the label feeds no credit, outcome or estimate
      closes: REQ-5644, REQ-5646
      depends: TSK-0856 - the test reads `plan_submitted`.
- [ ] T-008 [P] TSK-0859 After the answer, the knot's scheme shows her cards beside the engine's cards with no tick or cross
      closes: REQ-5652
      depends: TSK-0856 - the columns read `plan_submitted`.
- [ ] T-009 [P] TSK-0860 The word-problem matrix becomes three counts and two crosses sharing the answer axis
      closes: REQ-5664, REQ-5666, REQ-5668
      depends: TSK-0854 - the labels come from the grader.; TSK-0856 - the report reads `plan_submitted`.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0852.
- After TSK-0852: TSK-0853, TSK-0854 and TSK-0855.
- After TSK-0854 and TSK-0855: TSK-0856.
- After TSK-0856: TSK-0857, TSK-0858 and TSK-0859.
- After TSK-0854 and TSK-0856: TSK-0860.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0852 | REQ-5614, REQ-5616, REQ-5618, REQ-5620, REQ-5622 |
| TSK-0853 | REQ-5660, REQ-5662 |
| TSK-0854 | REQ-5624, REQ-5626, REQ-5628, REQ-5630, REQ-5632, REQ-5634, REQ-5672 |
| TSK-0855 | REQ-5600, REQ-5602, REQ-5604, REQ-5608, REQ-5610, REQ-5648, REQ-5670 |
| TSK-0856 | REQ-5638, REQ-5640, REQ-5642, REQ-5658 |
| TSK-0857 | REQ-5612, REQ-5650, REQ-5654, REQ-5656 |
| TSK-0858 | REQ-5644, REQ-5646 |
| TSK-0859 | REQ-5652 |
| TSK-0860 | REQ-5664, REQ-5666, REQ-5668 |

The smallest set of tasks that would test the decision is TSK-0852, TSK-0854, TSK-0855 and TSK-0858. Together they show whether a plan has exactly one right card set, whether the grader gives the five labels by dependency and not by exact order, whether the cycle holds its bands, and whether the label leaves every measure untouched, which are the failures the decision's premortem and its first reversal condition name.

## Not covered

- Nothing is deferred. Every requirement the decision addresses lands in a task above.
- Outside the epic, by the decision's own text: what «Нельзя узнать» does to an attempt, which the epic realising ADR-0250 builds; the hint ladder's rung texts, which ADR-0220 owns; the split of the four faults in the report; and how a wrong answer after a faulty plan counts in the error counts.
