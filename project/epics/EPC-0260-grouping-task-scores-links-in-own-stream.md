---
id: EPC-0260
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0260
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A grouping task takes one room slot a floor, and the server scores her links apart from her answer

Realises exactly ADR-0260: the `grouping` declaration and its build checks, six grouping templates, the pure scoring function, the grouping route and its event, the packet that sends no plan before the answer, the task window's links and marks, the outcome and model isolation, the `grouping_stream` projection, the short loop's reward and its animation, the weekly yarn table and notice, the Director's room slot and the report's block.

Until the epics realising ADR-0040, ADR-0050, ADR-0060, ADR-0070, ADR-0090 and ADR-0180 exist, the tasks run on fixture templates, a fixture node table and fixture states, and each task names what it leaves to those epics.

## Acceptance criteria

1. A property test over random submitted sets and every grouping template's plans finds `none` exactly for the empty set, `optimal` exactly for a set equal to one plan and `valid` for every other set, and the same log replayed gives the same scores. Evidence: the property test's report, from TSK-0838.
2. The build check fails a fixture template for each case of `grouping_template_invalid` and passes every shipped template with every plan replayed over 1,000 seeds. Evidence: the build check's report, from TSK-0836 and TSK-0837.
3. A property test over random logs changes grouping scores and links and finds the outcome, the streak, `node_estimates`, `node_snapshots`, blocks, probes and the graded count unchanged. Evidence: the property test's report, from TSK-0842.
4. A replay test finds `reward_granted` with source `short_loop` on exactly the `clean` unassisted `optimal` first attempts, with the same result when every time field is replaced by a random value. Evidence: the replay test's report, from TSK-0844.
5. The packet test finds no optimal plan and no score in `ItemViewOut`, the grouping reply or any packet before the first answer, and finds the plan in `AnswerOut`'s short solution. Evidence: the packet test's report, from TSK-0840.
6. A resume test draws links, leaves, resumes on another device and finds the same links and mark with no thread spent. Evidence: the resume test's report, from TSK-0839.
7. A schema check finds links and scores in `grouping_submitted` only, an answer sent before its grouping request refused with `grouping_out_of_order` and then accepted after it, and dropping `grouping_stream` and replaying the log gives the same rows. Evidence: the schema check's and the recompute test's reports, from TSK-0839 and TSK-0843.
8. A 90-day simulation finds at most 1 grouping task a floor, none in mental arithmetic, none on a host node below «Понимает» or outside the floor's domain, `flowSlot: grouping` on every one, and no adventure below its graded minimum because of one. Evidence: the simulation's report, from TSK-0847.
9. A Playwright test on the tablet viewport measures a touch zone of at least 56 px around every tappable number and finds no mark on any loop before or after the answer. Evidence: the Playwright report, from TSK-0841.
10. The report test finds no distributive-law row, a count and no share below 5 attempts, and assisted groupings only among the «с помощью» figures. Evidence: the report test's report, from TSK-0848.
11. A notice test feeds weekly yarn of 61, 62, 63, 50 and 61, 62 and finds `yarn_weeks_high` raised exactly twice. Evidence: the notice test's report, from TSK-0846.
12. A route test sends 41 link changes on one attempt and finds exactly one event with `capped: true` and 40 events in all, and no event for a closed attempt or a position outside the expression. Evidence: the route test's report, from TSK-0839.
13. A diff check finds the recipe amounts in `content/economy.json` equal to REQ-2172's, and fails when they change without a record opened under REQ-5536. Evidence: the diff check's output, from TSK-0846.
14. At the stage 0.3 acceptance the parent reads the block and its sentence and accepts the wording, and `./meowtower yarn-weeks` prints a figure per source for every week of stage 0.3. Evidence: the parent's judgement, from TSK-0848, and the command's output, from TSK-0846.
15. Every requirement ADR-0260 addresses lands in at least one task or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the 90-day simulation's count of floors that log `no_grouping_candidate`, which TSK-0847 reports on a fixture state table, and the weekly yarn that `./meowtower yarn-weeks` prints over the simulated log, which TSK-0846 reports against the 60 yarn line.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0836 A grouping template declares its host node, technique, admissible links and optimal plans, and the build fails one that breaks a rule
      closes: REQ-5512, REQ-5514, REQ-5516, REQ-5518, REQ-5524, REQ-5588
      depends: none
- [ ] T-002 TSK-0837 Six grouping templates, two for each technique a template can declare, show an expression with a convenient grouping
      closes: REQ-5500
      depends: TSK-0836 - the declaration and the build checks the templates pass.
- [ ] T-003 [P] TSK-0838 One pure function scores a submitted set of links as `optimal`, `valid` or `none` without a language model
      closes: REQ-5504, REQ-5506, REQ-5522
      depends: none
- [ ] T-004 TSK-0839 The server logs each set of links as `grouping_submitted`, restores it on resume and holds the one grouping each attempt submits
      closes: REQ-5566, REQ-5568, REQ-5570, REQ-5572
      depends: TSK-0838 - the server scores each set with that function.
- [ ] T-005 [P] TSK-0840 The server sends no plan and no score before the first attempt ends, and the short solution shows the plan beside the direct calculation
      closes: REQ-5562, REQ-5578
      depends: TSK-0836 - the plans come from the declaration.; TSK-0839 - the packet test covers the route's reply.
- [ ] T-006 TSK-0841 The task window lets her link two numbers or mark one, with a 56 px touch zone, and shows no verdict on any loop
      closes: REQ-5502, REQ-5560, REQ-5564
      depends: TSK-0839 - the controls send their sets to that route.; TSK-0840 - the view carries the numbers and signs with positions.
- [ ] T-007 [P] TSK-0842 The grouping score never reaches the outcome, and no model version reads a grouping attempt during the MVP
      closes: REQ-5510, REQ-5538, REQ-5540
      depends: TSK-0839 - the property test varies the events that route writes.
- [ ] T-008 [P] TSK-0843 The `grouping_stream` projection holds one row per grouping attempt and marks assisted attempts apart
      closes: REQ-5542, REQ-5544, REQ-5574, REQ-5576
      depends: TSK-0839 - the projection reads `grouping_submitted`.
- [ ] T-009 [P] TSK-0844 The short loop pays 1 star yarn for an `optimal` grouping on a `clean` unassisted first attempt and reads no time
      closes: REQ-5526, REQ-5532
      depends: TSK-0839 - the rule reads the score from the last `grouping_submitted`.
- [ ] T-010 TSK-0845 The scene plays the short loop's spell and the System line after the task window closes
      closes: REQ-5528, REQ-5530
      depends: TSK-0844 - the grant starts the effect.
- [ ] T-011 TSK-0846 `./meowtower yarn-weeks` prints star yarn per source for each week, and two high weeks in a row raise one notice
      closes: REQ-5534, REQ-5536, REQ-5590
      depends: TSK-0844 - `short_loop` is a source only once it is granted.
- [ ] T-012 [P] TSK-0847 The Director offers at most one grouping task a floor, in a room slot, behind four gates and counted apart
      closes: REQ-5546, REQ-5548, REQ-5550, REQ-5552, REQ-5554, REQ-5556, REQ-5558
      depends: TSK-0836 - the Director reads the host node from the declaration.
- [ ] T-013 TSK-0848 The Summary screen shows «Видит удобные приёмы» per technique and names what the figure counts
      closes: REQ-5508, REQ-5520, REQ-5580, REQ-5582, REQ-5584, REQ-5586
      depends: TSK-0843 - the block reads the stream's rows.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0836 and TSK-0838.
- After TSK-0836: TSK-0837 and TSK-0847.
- After TSK-0838: TSK-0839.
- After TSK-0839: TSK-0842, TSK-0843 and TSK-0844.
- After TSK-0836 and TSK-0839: TSK-0840.
- After TSK-0839 and TSK-0840: TSK-0841.
- After TSK-0844: TSK-0845 and TSK-0846.
- After TSK-0843: TSK-0848.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0836 | REQ-5512, REQ-5514, REQ-5516, REQ-5518, REQ-5524, REQ-5588 |
| TSK-0837 | REQ-5500 |
| TSK-0838 | REQ-5504, REQ-5506, REQ-5522 |
| TSK-0839 | REQ-5566, REQ-5568, REQ-5570, REQ-5572 |
| TSK-0840 | REQ-5562, REQ-5578 |
| TSK-0841 | REQ-5502, REQ-5560, REQ-5564 |
| TSK-0842 | REQ-5510, REQ-5538, REQ-5540 |
| TSK-0843 | REQ-5542, REQ-5544, REQ-5574, REQ-5576 |
| TSK-0844 | REQ-5526, REQ-5532 |
| TSK-0845 | REQ-5528, REQ-5530 |
| TSK-0846 | REQ-5534, REQ-5536, REQ-5590 |
| TSK-0847 | REQ-5546, REQ-5548, REQ-5550, REQ-5552, REQ-5554, REQ-5556, REQ-5558 |
| TSK-0848 | REQ-5508, REQ-5520, REQ-5580, REQ-5582, REQ-5584, REQ-5586 |

The smallest set of tasks that would test the decision is TSK-0836, TSK-0838, TSK-0842, TSK-0847 and TSK-0846. Together they show whether a template that breaks a rule fails the build, whether the score is a pure function that never reaches the outcome or the model, whether a grouping task ever reaches a floor, and whether the reward moves the economy, which are the three failures the decision's premortem names and the reversal condition that watches the yarn.

## Not covered

- Nothing is deferred. Every requirement the decision addresses lands in a task above.
- Outside the epic, by the decision's own text: the volley that replaces mental arithmetic on 2 floors of 3, the art of `spell.short_loop`, the rung texts of the hint ladder, and expressions that mix operations or a distributive-law item.
