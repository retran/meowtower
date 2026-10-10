---
id: EPC-0400
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0400
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A stable node gets a logged retention check held back from every path, and the report shows help by depth

Realises exactly ADR-0400, in the three increments it names: the task on every walkthrough event in the MVP, then the weekly breakdown, the trajectory and the retention observations, then the planned check, the hold and the series. Each increment works without the next, so the first task can land with the MVP and the last tasks land in the stage that builds retention checks.

Until the epics realising ADR-0060, ADR-0070 and ADR-0180 exist, the tasks run on fixture logs and a stand-in for the Director's candidate lists and for the report's screens. Each task names what it leaves to those epics.

## Acceptance criteria

1. A schema test finds `itemId` required on `solution_shown` and `hint_shown` from their first payload version, and a log built by the attempt flow has it on every such event. Evidence: the schema and integration tests' report, from TSK-1060.
2. A report test over fixture logs puts each first attempt in exactly one bin, including `clean` after rung 1 with `hintMaxLevel` 1 in «с опорой» and «Не знаю» after a hint in «требует обучения», and leaves out a rapid guess, an excluded task, a second attempt, a mental arithmetic task, a control fact, a Volley row and a task with a new form. Evidence: the report test's output, from TSK-1061.
3. A trajectory test builds a node with 2, 1 and 3 unassisted first attempts in three weeks and finds that the third week's share pools all three weeks and names them, that 4 attempts over 4 weeks show «мало данных», and that the mean depth scores a wrong first attempt 4. Evidence: the trajectory test's report, from TSK-1062.
4. Acceptance test 1 passes as REQ-6898 sets it: the plan due 28 to 35 game days after the latest meeting at the first «устойчиво», no held node on any covered path before its check, no observation after a lesson mark inside the interval, a lesson mark cancelling the plan, series observations unchanged by a recompute under a new threshold version, and fixtures ending at 2 of 2, 0 of 2, 1 of 3, 2 of 4 and 3 of 4 each reaching their result. Evidence: the acceptance test's report, from TSK-1074, with TSK-1064, TSK-1066, TSK-1069 and TSK-1071 supplying the parts.
5. A simulation over 90 simulated days finds that no `item_shown` or `compose_shown` names a held node before its check on any path and that `held_node_refused` never fires. Evidence: the simulation's report, from TSK-1074 and TSK-1067.
6. The same simulation finds at most 3 checks an adventure day, none after a fatigue signal, each check in the first room slot of its domain floor, and no plan for an exempt node. Evidence: the simulation's report, from TSK-1074, TSK-1068 and TSK-1065.
7. Fixture tests cover what REQ-6898 leaves out: a void check replanned under the same number, a hinted check counted wrong, the next-day review shown before the next hold, a third void cancelling with `void_limit`, a plan at ship time with the 7-day window and the replan after a lesson's second recheck. Evidence: the fixture tests' report, from TSK-1074, TSK-1069, TSK-1071 and TSK-1072.
8. The parent reads the dynamics screen with a planned, a confirmed, a failed and a cancelled series, and confirms that the 2 of 2 warning sits beside the list at the size of the list's own text. Evidence: the parent's judgement at the acceptance of the stage, recorded from TSK-1073, because wording that says a thing plainly is a reading and not a count.
9. Every requirement ADR-0400 addresses lands in exactly one closed task. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of the 30 ship-time plans that the 3-a-day cap leaves late, which the stand-in run of TSK-1074 reports against ADR-0400's reversal condition of a third, and the number of `held_node_refused` events over the 90 simulated days, which must be zero.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1060 Every short solution and every hint rung names its task
      closes: REQ-6890, REQ-6892
      depends: none
- [ ] T-002 [P] TSK-1061 A projection puts each counted first attempt into exactly one weekly bin
      closes: REQ-6796, REQ-6802, REQ-6804, REQ-6806, REQ-6808, REQ-6810, REQ-6812
      depends: TSK-1060 (not blocking) - the bins don't read the walkthrough events, so this task can land first.
- [ ] T-003 TSK-1062 The trajectory draws one point per node and week, with its share, its depth of help and its marks
      closes: REQ-6816, REQ-6820, REQ-6822, REQ-6824
      depends: TSK-1061 - the counted set and the bins.; TSK-1060 - the marks include walkthroughs by task.
- [ ] T-004 [P] TSK-1063 The dynamics screen shows each node's weekly counts, and the node card splits them by subtype
      closes: REQ-6800, REQ-6814
      depends: TSK-1061 - the bins.
- [ ] T-005 [P] TSK-1064 The projection `retention_observations` finds every attempt that tests a node after a gap
      closes: REQ-6826, REQ-6828, REQ-6830, REQ-6832, REQ-6834, REQ-6836, REQ-6874
      depends: none
- [ ] T-006 [P] TSK-1065 Nodes the hold would break are exempt, and the report says why
      closes: REQ-6848, REQ-6850
      depends: none
- [ ] T-007 TSK-1066 A holdable node that first reaches «устойчиво» gets a logged plan that opens its series
      closes: REQ-6838, REQ-6866, REQ-6888
      depends: TSK-1064 - the series counts the retention observations.; TSK-1065 - the planner skips exempt nodes.
- [ ] T-008 TSK-1067 A held node reaches no path until its check, because one predicate refuses it
      closes: REQ-6840, REQ-6842, REQ-6844, REQ-6846
      depends: TSK-1066 - the plan says which nodes are held.
- [ ] T-009 TSK-1068 A due check takes the first slot of its floor, at most three a day, and a late one says so
      closes: REQ-6856, REQ-6858, REQ-6860, REQ-6862, REQ-6864
      depends: TSK-1066 - the plan and its window.; TSK-1067 - placing uses the hold and the predicate's exception.
- [ ] T-010 TSK-1069 A series ends at 2 of 2 or 3 of 4, and the Director plans the next check by the last result
      closes: REQ-6868, REQ-6870, REQ-6872, REQ-6876, REQ-6878
      depends: TSK-1066 - the plan and the series.; TSK-1068 - the review owed takes the placement rule's slot.
- [ ] T-011 TSK-1070 A series that isn't confirmed owes a full block and starts again on evidence of relearning
      closes: REQ-6880, REQ-6882
      depends: TSK-1069 - the series end it reacts to.
- [ ] T-012 [P] TSK-1071 A lesson mark cancels the plan and a new series follows the lesson's second recheck
      closes: REQ-6852, REQ-6854
      depends: TSK-1066 - the plan the mark cancels.
- [ ] T-013 [P] TSK-1072 Nodes that are already stable get a check at ship time, and a recompute never undoes a plan
      closes: REQ-6894, REQ-6896
      depends: TSK-1066 - the plan and the series.
- [ ] T-014 TSK-1073 The retention list shows each node's series and every observation, with its warning beside it
      closes: REQ-6884, REQ-6886
      depends: TSK-1069 - the decided results the list shows.; TSK-1071 (not blocking) - a fixture event stands in for the cancel.
- [ ] T-015 TSK-1074 Acceptance test 1 and a 90-day run show that no held node is met before its check
      closes: REQ-6898
      depends: TSK-1066 - the plan.; TSK-1067 - the hold.; TSK-1068 - placement and caps.; TSK-1069 - the series.; TSK-1070 - the failed series.; TSK-1071 - the lesson cancel.; TSK-1072 - ship time and recompute.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1060, TSK-1061, TSK-1064 and TSK-1065.
- After TSK-1061: TSK-1063; after TSK-1061 and TSK-1060: TSK-1062.
- After TSK-1064 and TSK-1065: TSK-1066.
- After TSK-1066: TSK-1067, TSK-1071 and TSK-1072.
- After TSK-1066 and TSK-1067: TSK-1068.
- After TSK-1066 and TSK-1068: TSK-1069.
- After TSK-1069: TSK-1070 and TSK-1073.
- After TSK-1066 to TSK-1072: TSK-1074.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1060 | REQ-6890, REQ-6892 |
| TSK-1061 | REQ-6796, REQ-6802, REQ-6804, REQ-6806, REQ-6808, REQ-6810, REQ-6812 |
| TSK-1062 | REQ-6816, REQ-6820, REQ-6822, REQ-6824 |
| TSK-1063 | REQ-6800, REQ-6814 |
| TSK-1064 | REQ-6826, REQ-6828, REQ-6830, REQ-6832, REQ-6834, REQ-6836, REQ-6874 |
| TSK-1065 | REQ-6848, REQ-6850 |
| TSK-1066 | REQ-6838, REQ-6866, REQ-6888 |
| TSK-1067 | REQ-6840, REQ-6842, REQ-6844, REQ-6846 |
| TSK-1068 | REQ-6856, REQ-6858, REQ-6860, REQ-6862, REQ-6864 |
| TSK-1069 | REQ-6868, REQ-6870, REQ-6872, REQ-6876, REQ-6878 |
| TSK-1070 | REQ-6880, REQ-6882 |
| TSK-1071 | REQ-6852, REQ-6854 |
| TSK-1072 | REQ-6894, REQ-6896 |
| TSK-1073 | REQ-6884, REQ-6886 |
| TSK-1074 | REQ-6898 |

The smallest set of tasks that would test the decision is TSK-1060, TSK-1064, TSK-1066, TSK-1067 and TSK-1074. Together they show whether every walkthrough names its task, whether a gap is measured from the log, whether the plan is logged once, and whether a held node never meets the player before its check, which are the three things the decision's premortem names: the hold that covers every path, the warning that reads as certainty, and a plan written twice at ship time.

## Not covered

- No requirement ADR-0400 addresses is deferred.
- The layout of the dynamics screen and the node card: ADR-0150's design system and the screens' specification own it.
- Retention of the exempt nodes: ADR-0290's fact states cover basic facts, and nothing covers T1 to T4.
- The reversal conditions on the first 20 checks, the `no_review_candidate` share, late checks and void checks: they need weeks of real play, so the owner reads them at the stage's acceptance and this epic builds no check for them.
