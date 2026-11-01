---
id: EPC-0250
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0250
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every T1 to T4 word problem offers «Нельзя узнать» and looks the same whether or not it can be solved

Realises exactly ADR-0250: the subtypes in the skill graph, the answer kind and its three verdicts, the extra-data graphs and the class `used_extra_data`, the unanswerable problem built from a complete problem, the four options and the one packet for both kinds, the button and its options step, the Director's random draw behind a state gate, the refusal guard, the twin, the separate streams, the limits that don't count the new answer, and the report's counts and note.

Until the epics realising ADR-0040, ADR-0050, ADR-0060, ADR-0070, ADR-0130 and ADR-0180 exist, the tasks run on fixture templates, a fixture state table and fixture frames, and each task names what it leaves to those epics.

## Acceptance criteria

1. A packet test draws 1,000 seeds for each tier and answer form and finds the same `ItemViewOut` and `InputSpec` fields, the same phases, 4 options each, `allowInsufficient: true` on both kinds and the same step count as the complete graph. Evidence: the packet test's report, from TSK-0824.
2. A composition test over 1,000 seeds per tier finds every kind of option within 5 percentage points between the two kinds with the asked quantity in every set, and a template test over 10,000 seeds finds every withheld value uncomputable from the stated givens, among the options, and no option naming a stated quantity. Evidence: the two tests' reports, from TSK-0824 and TSK-0823.
3. A property test over 10,000 seeds finds no surplus problem where an extra-data graph's answer equals the correct answer or a trap's answer, and a checker fixture for each row of the verdict table gets that row's verdict, credit, class and outcome. Evidence: the property test's and the checker fixtures' reports, from TSK-0822 and TSK-0821.
4. A Playwright test on the tablet and desktop viewports finds «Нельзя узнать» in every phase of every T1 to T4 problem with the gap before it, never on the keypad and nowhere else; `KeyY` opens the options and «Назад» returns with no event written. Evidence: the Playwright report, from TSK-0825.
5. A simulation of 2,000 slots gives surplus at 8 % to 12 % of T1 to T3 slots and unanswerable at 3.5 % to 6.5 % of T1 to T4 slots, no lag-1 correlation beyond ±0.05, and 1.5 % to 3.5 % unanswerable with the guard raised. Evidence: the simulation's report, from TSK-0826 and TSK-0827.
6. A guard test replays logs: 2 presses in 20 never raise it, 3 do, 19 solvable attempts never do, and a clear needs 2 or fewer presses in the 20 attempts after the raise. Evidence: the guard test's report, from TSK-0827.
7. A twin test over 1,000 unanswerable first attempts gets both kinds of twin, each between 40 % and 60 %. Evidence: the twin test's report, from TSK-0828.
8. Projection tests find that «Нельзя узнать» breaks a run of «Не знаю», adds nothing to the help limit or the help share, and never counts towards the holding-steps limit on an unanswerable problem. Evidence: the projection tests' reports, from TSK-0830.
9. A model test finds that a `form: new` subtype moves no T node estimate and no state until the active model version admits it, and that after admission the node's weights sum to 1. Evidence: the model test's report, from TSK-0829.
10. A graph test finds no `T4.surplus`, `S3.missing` with its meaning, `requires` gating `G6.blocks` and `S3.missing` at fluent, and the new T subtypes named `*.surplus` and `*.insufficient`. Evidence: the graph test's report, from TSK-0820.
11. A bridge test finds no Dutch keyword on any item whose `forms` holds `missing`. Evidence: the keyword test's report, from TSK-0823; the selector's skip stays with the epic realising ADR-0210.
12. The parent reads the report's note beside the unanswerable streams at stage acceptance and judges whether it says the estimates stay unchecked for months. Evidence: the parent's judgement, from TSK-0831.
13. The report query compares `false_insufficient` on T4 with T1 to T3, and in the model-choice phase with the other phases; a rate twice the others is a finding against the premortem. Evidence: the query's output over a fixture log, from TSK-0831. The reading after four weeks of real play waits for that play.
14. Every requirement ADR-0250 addresses lands in at least one task or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the packet comparison over 1,000 seeds, which TSK-0824 runs on fixture templates, and the share of unanswerable and surplus slots in the 2,000-slot simulation, which TSK-0826 runs on a fixture state table.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0820 The skill graph names the surplus and unanswerable subtypes and gates them by the node's own state
      closes: REQ-5436, REQ-5442, REQ-5444
      depends: none
- [ ] T-002 [P] TSK-0821 The checker accepts «Нельзя узнать» with or without a chosen option and records three verdicts apart from «Не знаю»
      closes: REQ-5416, REQ-5418, REQ-5420, REQ-5422, REQ-5426, REQ-5428
      depends: none
- [ ] T-003 TSK-0822 A surplus template declares extra-data graphs, and an answer that uses the unused number is classed `used_extra_data`
      closes: REQ-5430, REQ-5432
      depends: TSK-0820 - it extends the subtype names the graph holds.; TSK-0821 - the class joins the verdict function and its order.
- [ ] T-004 [P] TSK-0823 An unanswerable problem is a complete problem with one given withheld, so its steps, hints and step count come from the complete graph
      closes: REQ-5408, REQ-5410, REQ-5466
      depends: TSK-0820 - the template names the subtype the graph holds.
- [ ] T-005 TSK-0824 Every T1 to T4 problem sends four "what's missing" options in its packet, built by one rule for both kinds
      closes: REQ-5406, REQ-5414, REQ-5472
      depends: TSK-0823 - the builder reads the withheld given and the complete graph.
- [ ] T-006 TSK-0825 «Нельзя узнать» sits in the action row of every T1 to T4 phase and opens the four options before it submits
      closes: REQ-5402, REQ-5404, REQ-5470
      depends: TSK-0824 - the options step reads the packet's options.; TSK-0821 - «Готово» sends the answer kind that task accepts.
- [ ] T-007 [P] TSK-0826 The Director draws a surplus or unanswerable subtype per slot from a seeded stream, behind a state gate
      closes: REQ-5434, REQ-5438, REQ-5440, REQ-5446, REQ-5448
      depends: TSK-0820 - the subtype names and the `requires` field.
- [ ] T-008 TSK-0827 A refusal guard reads 20 solvable first attempts, halves the unanswerable share once and clears itself
      closes: REQ-5438
      depends: TSK-0821 - the guard counts `false_insufficient`.; TSK-0826 - the Director's draw reads `p`, which the guard halves.
- [ ] T-009 [P] TSK-0828 The twin after an unanswerable first attempt is unanswerable or ordinary with equal odds
      closes: REQ-5166
      depends: TSK-0823 - the twin uses the same withholding step.
- [ ] T-010 [P] TSK-0829 Surplus and unanswerable subtypes write streams of their own and move no estimate until a model version admits them
      closes: REQ-5028, REQ-5424, REQ-5450, REQ-5452
      depends: TSK-0820 - `form: new` and the weights come from the graph file.
- [ ] T-011 [P] TSK-0830 «Нельзя узнать» breaks a run of «Не знаю» and adds nothing to the help limit or the help share
      closes: REQ-5458, REQ-5460
      depends: TSK-0821 - the verdicts come from that checker.
- [ ] T-012 TSK-0831 The report shows four separate counts, the refusal observation and a note that the unanswerable estimates stay unchecked
      closes: REQ-5462, REQ-5464
      depends: TSK-0821 - the counts read the new verdicts and classes.; TSK-0827 - the observation reads the guard's events.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0820 and TSK-0821.
- After TSK-0820: TSK-0823, TSK-0826 and TSK-0829.
- After TSK-0820 and TSK-0821: TSK-0822.
- After TSK-0821: TSK-0830.
- After TSK-0823: TSK-0824 and TSK-0828.
- After TSK-0821 and TSK-0824: TSK-0825.
- After TSK-0821 and TSK-0826: TSK-0827.
- After TSK-0821 and TSK-0827: TSK-0831.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0820 | REQ-5436, REQ-5442, REQ-5444 |
| TSK-0821 | REQ-5416, REQ-5418, REQ-5420, REQ-5422, REQ-5426, REQ-5428 |
| TSK-0822 | REQ-5430, REQ-5432 |
| TSK-0823 | REQ-5408, REQ-5410, REQ-5466 |
| TSK-0824 | REQ-5406, REQ-5414, REQ-5472 |
| TSK-0825 | REQ-5402, REQ-5404, REQ-5470 |
| TSK-0826 | REQ-5434, REQ-5438, REQ-5440, REQ-5446, REQ-5448 |
| TSK-0827 | REQ-5438 |
| TSK-0828 | REQ-5166 |
| TSK-0829 | REQ-5028, REQ-5424, REQ-5450, REQ-5452 |
| TSK-0830 | REQ-5458, REQ-5460 |
| TSK-0831 | REQ-5462, REQ-5464 |

The smallest set of tasks that would test the decision is TSK-0821, TSK-0823, TSK-0824, TSK-0826 and TSK-0831. Together they show whether the two kinds of problem look the same until she answers, whether the verdicts match the table, whether the draw gives the shares at random, and whether `false_insufficient` clusters on T4 or in the model choice, which are the two causes the decision's premortem names.

## Not covered

- Nothing is deferred. Every requirement the decision addresses lands in a task above.
- Outside the epic, by the decision's own text: the Dutch bridge's selector skip, which the epic realising ADR-0210 builds, and the button's absence on a Dutch probe letter, which ADR-0430 decides after the MVP.
