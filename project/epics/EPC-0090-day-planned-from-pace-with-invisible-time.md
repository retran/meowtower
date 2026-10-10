---
id: EPC-0090
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0090
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server plans each day from her pace, counts time from the event log, and brings timed events at task boundaries with no clock on her screens

Realises exactly ADR-0090: the seeded plan sized to about 60 minutes, the warm-ups and easy tasks placed in advance, the scene around a task, Session 0, the three time projections, the boundary scheduler, eye exercises, rest stops, the soft stop with its extensions, «Закончить на сегодня», the anxiety and avoidance signals, and the rule that her screens show no time.

Until the epics realising ADR-0070, ADR-0110, ADR-0140 and ADR-0160 exist, the tasks fill the plan from the stand-in task table and play scenes from the content library, and each task names what it leaves to those epics.

## Acceptance criteria

1. A plan test over 1,000 seeds asserts a warm-up after every floor's entry scene and room lengths between 3 and 5 that never change after opening. Evidence: the plan test's report, from TSK-0565 and TSK-0566.
2. A forecast test feeds synthetic pace histories and asserts a forecast within 60 minutes, a fourth floor only when it fits, and the 75-second default with no history. Evidence: the forecast test's report, from TSK-0565.
3. An easy-task test runs one seed with two answer sequences and asserts the same random easy tasks at the same places, and over 10,000 seeds a rate within 1/12 plus or minus 0.01, never two within 5 tasks, and one easy task after three `alt` outcomes. Evidence: the test's report, from TSK-0566.
4. A transition test runs one seed with different node choices and asserts the same sequence of transitions. Evidence: the transition test's report, from TSK-0567.
5. Time-projection tests replay synthetic logs and assert what the day's active time includes, that the eye count excludes breaks and resets after a pause longer than 5 minutes, that the soft stop plays at the first boundary at or after the soft-stop point, that each extension adds 20 minutes from the moment she chose it, and that after `finish_today` no extension is offered. Evidence: the tests' reports, from TSK-0564, TSK-0571, TSK-0572 and TSK-0573.
6. A boundary test asserts that no timed event starts while a task is open and that two due events play at two boundaries in the stated order. Evidence: the boundary test's report, from TSK-0569 and TSK-0571.
7. A Playwright test walks every player screen on the tablet and desktop viewports and finds no clock, countdown or minute count, no hourglass in the task window or on a timed event's screen and no animation on the «Мера» symbol, and a search of the styles finds no `cursor: wait` or `cursor: progress`. Evidence: the Playwright report and the search's output, from TSK-0579.
8. The check on the timed-event line pool finds no digit and no time word, and the parent approves the pool at stage acceptance. Evidence: the check's output from TSK-0579 and the parent's judgement recorded there.
9. A Session 0 test asserts the eight steps in order, the name, cloak colour and focus choices with no look choice, and a knowledge projection identical with and without Session 0's events. Evidence: the tests' reports, from TSK-0577 and TSK-0578; the stage 0.2 run times Session 0 at 20 to 25 minutes, judged by a person, from TSK-0577.
10. A schema test finds no daily-maximum field in the parent settings and the eye skip off by default. Evidence: the schema test's report, from TSK-0570.
11. Anxiety tests drive each of the four signals and assert an easy task, then a campfire or funny scene, a logged signal, and after a second signal at most 40 % frontier room slots until the game day changes. Evidence: the anxiety tests' reports, from TSK-0576 and TSK-0575.
12. The stage 0.2 adult session plays an adventure of about 60 minutes. Evidence: the stage acceptance record under ADR-0190 and the forecast test of TSK-0565, which is what the epic can show before that stage.
13. Every requirement ADR-0090 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the forecast's distance from 60 minutes on synthetic pace histories, which TSK-0565's test reports, and the rate of random easy tasks over 10,000 seeds, which TSK-0566's test reports.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0564 The server projects the day's active time, the eye count and the soft-stop point from the event log
      closes: REQ-0318, REQ-0312
      depends: none
- [ ] T-002 [P] TSK-0565 The server plans the day's adventure from a seeded plan sized to about 60 minutes at her pace
      closes: REQ-0100, REQ-0124
      depends: none
- [ ] T-003 [P] TSK-0566 The plan places warm-ups and easy tasks where her answers can't move them
      closes: REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122
      depends: TSK-0565 - the easy tasks and the warm-ups are drawn into its plan.
- [ ] T-004 [P] TSK-0567 A task opens between the System's announcement and its outcome line, transitions ignore the chosen node, and the end of the row names her growth in words
      closes: REQ-0130, REQ-0144, REQ-0146, REQ-0148
      depends: TSK-0565 - the transition cycle is part of its plan.
- [ ] T-005 [P] TSK-0568 The battle model holds no health for the heroine, and an agent reads every Tangle line
      closes: REQ-0126, REQ-0128
      depends: none
- [ ] T-006 [P] TSK-0569 A due eye exercise plays at the next boundary, the four exercises take turns, and two due events play in a fixed order
      closes: REQ-0304, REQ-0308
      depends: TSK-0564 - it reads the eye count that task projects.
- [ ] T-007 [P] TSK-0570 The Parent Room holds the eye-skip switch, no field for a daily maximum and the memo on how to talk about the game
      closes: REQ-0314, REQ-0316, REQ-0324, REQ-0142
      depends: TSK-0569 - the skip control sits on the exercise's packet.
- [ ] T-008 TSK-0571 The soft stop plays at the first boundary after 60 minutes, offers «Ещё один ряд» beside saving, and ends the day through a story scene
      closes: REQ-0320, REQ-0322, REQ-0326, REQ-0340
      depends: TSK-0564 - it reads the soft-stop point.; TSK-0569 - it joins the scheduler as the first event.
- [ ] T-009 [P] TSK-0572 Each «Ещё один ряд» continues the adventure with tasks and moves the soft stop 20 minutes on
      closes: REQ-0328, REQ-0330, REQ-0332
      depends: TSK-0571 - it answers the offer that task plays.
- [ ] T-010 [P] TSK-0573 «Закончить на сегодня» in the Parent Room brings the soft stop at the next boundary with no «Ещё один ряд»
      closes: REQ-0360, REQ-0362, REQ-0364
      depends: TSK-0571 - it brings forward the soft stop that task builds.
- [ ] T-011 [P] TSK-0574 The «Привал» button is always on screen and stays inactive for 10 minutes after a rest stop ends
      closes: REQ-0342, REQ-0344
      depends: none
- [ ] T-012 TSK-0575 Three «Не знаю» in a row bring the familiar's offer of a rest stop and log an avoidance signal
      closes: REQ-0346, REQ-0348
      depends: TSK-0574 - it plays that task's rest stop scene.; TSK-0569 - it is a timed event in the scheduler.; TSK-0566 - the easy task before it is that task's.
- [ ] T-013 TSK-0576 The server detects four anxiety signals, answers each with an easy task and a gentle scene, and lowers the frontier share after a second
      closes: REQ-0350, REQ-0352, REQ-0354
      depends: TSK-0566 - the easy task is a slot the plan holds.; TSK-0569 - the sequence joins the scheduler.; TSK-0575 - the campfire after three «Не знаю» is that task's offer.
- [ ] T-014 [P] TSK-0577 Session 0 runs eight steps in order in 20 to 25 minutes and lets her choose a name, a cloak colour and a focus but no look
      closes: REQ-0132, REQ-0136, REQ-0138, REQ-0140
      depends: none
- [ ] T-015 TSK-0578 Every event of Session 0 carries `session0: true` and the knowledge projection skips it
      closes: REQ-0134
      depends: TSK-0577 - it marks the events that flow appends.
- [ ] T-016 [P] TSK-0579 Her screens show no timer, no clock, no minute count and no moving or waiting hourglass
      closes: REQ-0300, REQ-0302, REQ-0356, REQ-0358
      depends: none

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0564, TSK-0565, TSK-0568, TSK-0574, TSK-0577 and TSK-0579.
- After TSK-0564: TSK-0569.
- After TSK-0565: TSK-0566 and TSK-0567.
- After TSK-0569: TSK-0570.
- After TSK-0564 and TSK-0569: TSK-0571.
- After TSK-0571: TSK-0572 and TSK-0573.
- After TSK-0566, TSK-0569 and TSK-0574: TSK-0575.
- After TSK-0566, TSK-0569 and TSK-0575: TSK-0576.
- After TSK-0577: TSK-0578.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0564 | REQ-0318, REQ-0312 |
| TSK-0565 | REQ-0100, REQ-0124 |
| TSK-0566 | REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122 |
| TSK-0567 | REQ-0130, REQ-0144, REQ-0146, REQ-0148 |
| TSK-0568 | REQ-0126, REQ-0128 |
| TSK-0569 | REQ-0304, REQ-0308 |
| TSK-0570 | REQ-0314, REQ-0316, REQ-0324, REQ-0142 |
| TSK-0571 | REQ-0320, REQ-0322, REQ-0326, REQ-0340 |
| TSK-0572 | REQ-0328, REQ-0330, REQ-0332 |
| TSK-0573 | REQ-0360, REQ-0362, REQ-0364 |
| TSK-0574 | REQ-0342, REQ-0344 |
| TSK-0575 | REQ-0346, REQ-0348 |
| TSK-0576 | REQ-0350, REQ-0352, REQ-0354 |
| TSK-0577 | REQ-0132, REQ-0136, REQ-0138, REQ-0140 |
| TSK-0578 | REQ-0134 |
| TSK-0579 | REQ-0300, REQ-0302, REQ-0356, REQ-0358 |

The smallest set of tasks that would test the decision is TSK-0564, TSK-0565, TSK-0569 and TSK-0571. Together they show whether the plan fits 60 minutes at her pace, whether time comes from the log alone, and whether a timed event waits for a boundary, which are the three things the decision's premortem names.

## Not covered

- No requirement of the 47 is deferred. Two checks close only at stage 0.2 acceptance, because they need a real session: Session 0 at 20 to 25 minutes (criterion 9) and the adult session of about 60 minutes (criterion 12); the tasks above give the tests that come first.
- REQ-0102, REQ-0104, REQ-0306, REQ-0310, REQ-0334, REQ-0336 and REQ-0338: ADR-0090 no longer addresses them, because each was superseded, and the epics realising ADR-0210, ADR-0280, ADR-0290, ADR-0320, ADR-0330, ADR-0360 and ADR-0370 carry their replacements.
