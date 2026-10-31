---
id: EPC-0070
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0070
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director fills each slot by information value inside a flow corridor, a three-day domain window and spaced review, and guards the measurement against repeats, fatigue and rapid guesses

Realises exactly ADR-0070: the flow corridor and its slot sources, the review and frontier slots with the value formula, the honesty rules, the stretch gate, the obligations and island checks, the day plan and the three-day window, the floor's opening and control facts, the Guardian's ladder, cold start, the volume forecast and its trimming, the story cap and extensions, the rapid-guess test, the fatigue signal, raised mode with its flags, and the 30-day simulation. SPC-0070 states what the finished part does, with the changes of later decisions.

Until the epics realising ADR-0050, ADR-0060, ADR-0090, ADR-0110, ADR-0140 and ADR-0180 exist, the tasks run on fixtures: a fixture graph with the query module's shape, fixture projections of the model, hand-written `floor_outcome` events and a stand-in pace. Each task names what it leaves to those epics.

## Acceptance criteria

1. Replaying the log of any simulated adventure through `planDay`, `planFloor` and `nextTask` gives the same node, subtype and purpose for every slot. Evidence: the integration test's report, from TSK-0534.
2. A property test over random states finds no case where the success share changes which frontier node `nextTask` picks. Evidence: the property test's report, from TSK-0535.
3. In a simulated adventure with a success share held below 0,70 every room slot is review, and above 0,80 every one is frontier; inside the corridor 30 % to 40 % of those slots are review once the adventure has 8 or more of them. Evidence: the unit tests' reports, from TSK-0532.
4. In a 90-day simulation every 3 consecutive adventure days with 3 completed floors each give all 8 domains a floor, and a domain missing for 2 days opens the next route. Evidence: the simulation's report, from TSK-0538 and TSK-0547.
5. Every simulated day gives a stretch node at most 2 tasks and a cut-off node tasks only in an island check, and every day with a candidate holds 1 or 2 island checks. Evidence: the unit tests' reports, from TSK-0536 and TSK-0537.
6. The Guardian's step counts follow `k + 1`, `k + 2` capped at 4, and `k`, with 1 step throughout cold start. Evidence: the unit tests' reports, from TSK-0540 and TSK-0541.
7. The 30-day simulation classifies at least 90 % of nodes into their true state on every profile, and the guessing and bonus-rushing profiles raise estimates by no more than 5 percentage points. Evidence: the simulation's report, from TSK-0547.
8. The timed simulation gives at least 28 graded first attempts at 1,0 times the threshold and at least 25 at 1,5 times, and story never exceeds 10 minutes. Evidence: the timed simulation's report, from TSK-0542, TSK-0543 and TSK-0547.
9. An answer 1 ms faster than its minimum time is a rapid guess and one 1 ms slower isn't, for a sample of templates on each device type, with and without Session 0. Evidence: the unit test's report, from TSK-0544.
10. The fatigue signal fires on a fixture where the closing pair's median is 1,51 times the opening's and not at 1,49, whatever the accuracy of either pair. Evidence: the unit test's report, from TSK-0545.
11. The schema test finds `purpose`, `flowSlot` and `why` in none of the play routes' responses. Evidence: the schema test's report, from TSK-0533.
12. `nextTask` answers within 100 ms at the 95th percentile with a year of log. Evidence: the timing output, from TSK-0547.
13. Every requirement ADR-0070 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure three things before it is finished: the review share inside the corridor over simulated adventures with 8 or more in-corridor slots (TSK-0532), the 95th percentile of `nextTask` against 100 ms (TSK-0547), and the share of nodes the 30-day run classifies correctly against 90 % (TSK-0547). ADR-0070 reverses the flow corridor or the frontier budget if the third falls short after two rounds of weight tuning, and TSK-0547 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0532 The success share of the last 10 graded attempts decides whether a room slot is review or frontier
      closes: REQ-1006, REQ-1008, REQ-1010
      depends: none
- [ ] T-002 [P] TSK-0533 A review task comes from a fluent or stable node the player will probably solve, and looks like any other task
      closes: REQ-1012, REQ-1016, REQ-1018
      depends: TSK-0532 (not blocking) - the corridor decides when a slot is review; either task can land first against a stub.
- [ ] T-003 TSK-0534 A frontier slot takes the candidate node of highest value, and the play routes ask the Director for every room slot
      closes: REQ-1002
      depends: TSK-0532 (blocking) - the slot source.; TSK-0533 (blocking) - the review slot the route calls.
- [ ] T-004 [P] TSK-0535 The Director never picks a task to make the player fail or to balance the success share
      closes: REQ-1020, REQ-1022
      depends: TSK-0534 (blocking) - the value formula and the frontier choice the tests exercise.
- [ ] T-005 [P] TSK-0536 A stretch node is admitted only by tested results and gets at most 2 tasks in an adventure day
      closes: REQ-0820, REQ-1004
      depends: TSK-0534 (blocking) - the candidate set the gate extends.
- [ ] T-006 [P] TSK-0537 The Director acts on each obligation the model writes: escalation, owed probes, cut-off nodes and island checks
      closes: REQ-0956, REQ-0966, REQ-0970, REQ-0972, REQ-0974
      depends: TSK-0534 (blocking) - the candidate set and the `escalation` term the obligations feed.
- [ ] T-007 [P] TSK-0538 Each maths domain gets its floor in any three consecutive adventure days, counting only floors the player completed
      closes: REQ-1024, REQ-1054
      depends: TSK-0534 (blocking) - the node values that break ties between domains.
- [ ] T-008 TSK-0539 A floor opens with a warm-up and two mental arithmetic tasks, and an adventure holds control facts at its start and its end
      closes: REQ-0832, REQ-1038
      depends: TSK-0538 (blocking) - the route whose floors this task fills.; TSK-0534 (blocking) - the value ranking mental arithmetic uses.
- [ ] T-009 [P] TSK-0540 The Guardian's first task of a day has one step more than the largest fluent word-problem node, and the ladder follows the outcomes
      closes: REQ-1028, REQ-1030, REQ-1032
      depends: TSK-0541 (not blocking) - the cold-start flag; either task can land first with a constant.
- [ ] T-010 [P] TSK-0541 Cold start probes each domain's chain from the typical group down and reviews the first nodes while estimates are few
      closes: REQ-1034, REQ-1036
      depends: TSK-0534 (blocking) - the candidate set and review slot that cold start changes.
- [ ] T-011 TSK-0542 The plan fits the adventure before the soft stop by trimming in a fixed order, and never plans fewer than 28 graded first attempts
      closes: REQ-1040, REQ-1048, REQ-1050, REQ-1052
      depends: TSK-0539 (blocking) - the floor's parts that the trim removes.
- [ ] T-012 TSK-0543 Story takes at most 10 minutes of an adventure, and an extension adds only rooms chosen by value
      closes: REQ-1042, REQ-1044, REQ-1046
      depends: TSK-0542 (blocking) - the planning functions the budget and the extension extend.
- [ ] T-013 [P] TSK-0544 An answer faster than its template's minimum time is a rapid guess and stays out of every estimate and block
      closes: REQ-1114, REQ-1118, REQ-1120, REQ-1122
      depends: TSK-0534 (blocking) - the slot function that places the replacement task.
- [ ] T-014 [P] TSK-0545 The fatigue signal fires from answer time alone, offers a rest stop and halves the weight of later attempts
      closes: REQ-1104, REQ-1106, REQ-1108, REQ-1110
      depends: TSK-0539 (blocking) - the control facts the points are made of.
- [ ] T-015 TSK-0546 Too many rapid guesses or too much help raises a flag for the parent and puts the next session in raised mode
      closes: REQ-1102, REQ-1124, REQ-1126, REQ-1128, REQ-1130
      depends: TSK-0532 (blocking) - the corridor whose review rule raised mode changes.; TSK-0544 (blocking) - the rapid-guess mark the 15 % test counts.
- [ ] T-016 TSK-0547 A 30-day simulation classifies at least 90 % of the nodes into their true state and shows guessing buys no gain
      closes: REQ-1056, REQ-1132
      depends: TSK-0534 (blocking) - the frontier choice.; TSK-0537 (blocking) - obligations and island checks.; TSK-0538 (blocking) - the day plan.; TSK-0542 (blocking) - the plan targets.; TSK-0544 (blocking) - the rapid-guess rule.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0532 and TSK-0533.
- After TSK-0532 and TSK-0533: TSK-0534.
- After TSK-0534: TSK-0535, TSK-0536, TSK-0537, TSK-0538, TSK-0541 and TSK-0544, and TSK-0540 beside TSK-0541.
- After TSK-0534 and TSK-0538: TSK-0539.
- After TSK-0539: TSK-0542 and TSK-0545, then TSK-0543.
- After TSK-0532 and TSK-0544: TSK-0546.
- After TSK-0534, TSK-0537, TSK-0538, TSK-0542 and TSK-0544: TSK-0547.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0532 | REQ-1006, REQ-1008, REQ-1010 |
| TSK-0533 | REQ-1012, REQ-1016, REQ-1018 |
| TSK-0534 | REQ-1002 |
| TSK-0535 | REQ-1020, REQ-1022 |
| TSK-0536 | REQ-0820, REQ-1004 |
| TSK-0537 | REQ-0956, REQ-0966, REQ-0970, REQ-0972, REQ-0974 |
| TSK-0538 | REQ-1024, REQ-1054 |
| TSK-0539 | REQ-0832, REQ-1038 |
| TSK-0540 | REQ-1028, REQ-1030, REQ-1032 |
| TSK-0541 | REQ-1034, REQ-1036 |
| TSK-0542 | REQ-1040, REQ-1048, REQ-1050, REQ-1052 |
| TSK-0543 | REQ-1042, REQ-1044, REQ-1046 |
| TSK-0544 | REQ-1114, REQ-1118, REQ-1120, REQ-1122 |
| TSK-0545 | REQ-1104, REQ-1106, REQ-1108, REQ-1110 |
| TSK-0546 | REQ-1102, REQ-1124, REQ-1126, REQ-1128, REQ-1130 |
| TSK-0547 | REQ-1056, REQ-1132 |

The smallest set of tasks that would test the decision is TSK-0532, TSK-0534, TSK-0535, TSK-0538 and TSK-0547. Together they show whether the corridor splits slots as ADR-0070 says, whether a frontier choice is made for its information alone, whether every domain gets its floor in three days, and whether 30 days of daily play classify 90 % of the nodes, which are the claims the decision's first reversal condition and premortem rest on.

## Not covered

- The block owed after a probe of 0 out of 2 (REQ-0958), the stretch block's completion within 7 days (REQ-0822) and the stale-node priority (REQ-0978), which later decisions superseded with REQ-6406, REQ-6404 and REQ-6844: the epics realising ADR-0360 and ADR-0400. ADR-0070's sixth criterion, that the block completes in the same session, waits for that epic.
- The repeat window and the reject predicate (REQ-1100, superseded by REQ-5842), and the minimum time of basic and control facts (REQ-1116, superseded by REQ-5840): ADR-0290's epic, which also adds the Volley and the `block_priority` term.
- The knowledge model, the states and the obligations the Director reads: the epic realising ADR-0060. The rapid-guess mark's effect on the estimates is its observation function; TSK-0544 writes the mark.
- The adventure's time, the soft stop, rest stops, the game day and the anxiety signal (REQ-0352): the epic realising ADR-0090. Leaving and resuming: the epic realising ADR-0030.
- The lesson marks, their recheck windows, the thresholds, the motor calibration versions and how the report draws the flags and exposure counts: the epic realising ADR-0180.
- The spell outcomes, rewards and floor completion: ADR-0140's epic. The scene texts and their shortest forms: ADR-0110's. Which science question fills a slot: ADR-0130's.
- The simulation's other targets, such as the success share range and model versions not scoring lower (REQ-2908 to REQ-2922), and the verify command that runs it: ADR-0190's epic.
- The Ascent, its anchor forms and their stop list, which the draft defers until after the MVP.
- Later decisions' additions to the Director: the form draw and refusal guard of ADR-0250, the estimate draw of ADR-0240, the grouping slot of ADR-0260, the two routes of ADR-0330, the retention hold of ADR-0400, the transfer holds of ADR-0410 and the Dutch letters of ADR-0430, each built by its own epic on the functions this epic builds.
