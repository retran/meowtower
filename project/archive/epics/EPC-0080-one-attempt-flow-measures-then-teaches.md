---
id: EPC-0080
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0080
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One attempt flow measures first and then teaches, with a guiding-thread ledger the server owns

Realises exactly ADR-0080: the server-owned state machine of one attempt flow for every task, the review after each outcome, the second attempt on a parallel task, the short solution and rungs from one graph, the `postFeedback` mark, the assisted mark of a bought rung, the thread ledger with its cap, buttons, grants, spending and pocket, the balance check of a typical day, the task window's content and the yarn ball. SPC-0080 states what the finished part does, with the changes of later decisions.

The routes for a hint, an explanation and a second attempt already exist from the epic realising ADR-0030, with a stand-in task table, a stand-in twin and a fixed starting stock. This epic replaces those stand-ins one at a time. Until the epics realising ADR-0040, ADR-0140 and ADR-0150 exist, the tasks run on fixture templates, stand-in grants and the existing client components. Each task names what it leaves to them.

## Acceptance criteria

1. A state-machine test drives each of four cases, `clean`, `partial`, `alt` from a wrong answer and `alt` from «Не знаю», and asserts the states and window contents of SPC-0080's table, with no twin after `clean` or `partial` at most rung 1 and no third attempt after any twin. Evidence: the state-machine tests' report, from TSK-0548.
2. A packet test sends every task kind, warm-up, mental arithmetic, room task, easy task and Guardian, and asserts that no packet before the first answer carries the correct answer, a solution step or a rung the player didn't buy, and that the flow's states are the same for scored and unscored tasks. Evidence: the packet test's report, from TSK-0549 and TSK-0548.
3. A template test runs every template over 1,000 seeds and asserts that every number in a rung and in the short solution is among the graph's computed values and that each seed gives a parallel task with the same difficulty features and different numbers. Evidence: the template tests' reports, from TSK-0551 and TSK-0552.
4. A ledger property test applies random sequences of grants, spends, pocket draws and resumes and asserts that the stock never exceeds 30 or falls below 0, each thread above 30 adds exactly 2 buttons, a pocket gives at most one thread in each room and a repeated `clientSeq` never charges twice. Evidence: the property test's report, from TSK-0555 and TSK-0556.
5. A Playwright test on the tablet viewport shows the short solution without a tap after `alt` and `partial`, the thread button with its count in every state, and the button inactive with no change of text at stock 0 after the pocket's thread. Evidence: the Playwright tests' reports, from TSK-0550, TSK-0556 and TSK-0559.
6. The balance check, on a typical day of 28 tasks at a clean share near 0,7, reports a thread yield between 8 and 10. Evidence: the check's output, from TSK-0558.
7. A search of the play routes' schemas finds no route or flag for a measurement mode, and a search of the shop's content data finds no item that grants threads. Evidence: the search tests' reports, from TSK-0548 and TSK-0555.
8. A read of CAN-0030 finds the pocket's limit stated as REQ-0516 words it. Evidence: judgement of a reader of the canon, from TSK-0556, because whether the wording says it is a reading.
9. Every requirement ADR-0080 addresses lands in at least one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the thread yield of a typical day against 8 to 10, and the share of `twin_unavailable` among `alt` outcomes over the generator's fixture templates against ADR-0080's reversal condition of 1 %, both from TSK-0552 and TSK-0558. The assisted share of first attempts that ADR-0080 watches, 30 % over 7 adventures, can't be measured before real play.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0548 Every adventure task runs one attempt flow that the server owns, and the game has no measurement mode
      closes: REQ-0400
      depends: none
- [ ] T-002 TSK-0549 No packet carries the correct answer or a solution step before the first attempt, and the window shows the answer after every attempt
      closes: REQ-0430, REQ-0432
      depends: TSK-0548 (blocking) - the flow's states that say when the answer may be sent.
- [ ] T-003 TSK-0550 After an answer the window shows a review that depends on the outcome, titled «Схема узла»
      closes: REQ-0112, REQ-0402, REQ-0404, REQ-0406, REQ-0408
      depends: TSK-0548 (blocking) - the flow states the review reads.; TSK-0551 (not blocking) - the short solution's steps come from the graph; this task can show the stand-in solution until it lands.
- [ ] T-004 [P] TSK-0551 The short solution and every hint rung show only numbers the engine computed
      closes: REQ-0410, REQ-0412, REQ-0536
      depends: TSK-0548 (not blocking) - the flow decides when each text is served; the template test doesn't need it.
- [ ] T-005 TSK-0552 The second attempt runs on a parallel task, is logged as assisted, and earns base experience and no bonus
      closes: REQ-0420, REQ-0422, REQ-0424
      depends: TSK-0548 (blocking) - the flow states `twin_open` and `twin_review`.
- [ ] T-006 TSK-0553 After the player sees a solution, every later task of the same node that game day is marked as coming after feedback
      closes: REQ-0428
      depends: TSK-0548 (blocking) - the flow that decides when the short solution shows.; TSK-0550 (not blocking) - the review that shows the solution; the mark can be tested on a forced event.
- [ ] T-007 [P] TSK-0555 The guiding-thread stock is a projection of the log, never above 30, and a surplus thread turns silently into 2 buttons
      closes: REQ-0518, REQ-0520, REQ-0522, REQ-0524
      depends: none
- [ ] T-008 TSK-0554 A bought hint rung marks the attempt as assisted with the deepest rung
      closes: REQ-0530
      depends: TSK-0548 (blocking) - the flow whose events the marks derive from.; TSK-0555 (blocking) - the ledger function that charges the opening.
- [ ] T-009 TSK-0556 An explanation costs 1 thread, the short solution nothing, and an empty stock gets one pocket thread in each room
      closes: REQ-0514, REQ-0516, REQ-0528, REQ-0544, REQ-0550, REQ-0552
      depends: TSK-0555 (blocking) - the ledger and the `pocket_thread_given` event.; TSK-0548 (blocking) - the flow whose attempt the explanation is sold in.
- [ ] T-010 [P] TSK-0557 Each source grants its own number of threads: a quest 1, a clean row 1, a big row 0, a find 1 or 2, a familiar 2
      closes: REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510
      depends: TSK-0555 (blocking) - the ledger every grant goes through.
- [ ] T-011 TSK-0558 A typical day of play yields between 8 and 10 guiding threads
      closes: REQ-0512
      depends: TSK-0557 (blocking) - the grant sources the check counts.
- [ ] T-012 TSK-0559 Every task opens in a flat window that holds only the task and its controls and never marks an answer right or wrong
      closes: REQ-0106, REQ-0110, REQ-0426
      depends: TSK-0548 (blocking) - the flow states the window draws.; TSK-0550 (blocking) - the review's content.
- [ ] T-013 [P] TSK-0560 The game screen shows the guiding-thread stock as a ball of yarn with the current number
      closes: REQ-0546
      depends: TSK-0555 (blocking) - the ledger whose stock the packets carry.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0548, TSK-0551 and TSK-0555.
- After TSK-0548: TSK-0549, TSK-0550, TSK-0552 and TSK-0553.
- After TSK-0555: TSK-0557 and TSK-0560.
- After TSK-0548 and TSK-0555: TSK-0554 and TSK-0556.
- After TSK-0557: TSK-0558.
- After TSK-0548 and TSK-0550: TSK-0559.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0548 | REQ-0400 |
| TSK-0549 | REQ-0430, REQ-0432 |
| TSK-0550 | REQ-0112, REQ-0402, REQ-0404, REQ-0406, REQ-0408 |
| TSK-0551 | REQ-0410, REQ-0412, REQ-0536 |
| TSK-0552 | REQ-0420, REQ-0422, REQ-0424 |
| TSK-0553 | REQ-0428 |
| TSK-0554 | REQ-0530 |
| TSK-0555 | REQ-0518, REQ-0520, REQ-0522, REQ-0524 |
| TSK-0556 | REQ-0514, REQ-0516, REQ-0528, REQ-0544, REQ-0550, REQ-0552 |
| TSK-0557 | REQ-0502, REQ-0504, REQ-0506, REQ-0508, REQ-0510 |
| TSK-0558 | REQ-0512 |
| TSK-0559 | REQ-0106, REQ-0110, REQ-0426 |
| TSK-0560 | REQ-0546 |

The smallest set of tasks that would test the decision is TSK-0548, TSK-0549, TSK-0551 and TSK-0555. Together they show whether every task runs the one flow, whether the answer stays on the server until the first attempt, whether every number the player reads came from the graph, and whether the stock obeys its ledger rules, which are the failures the decision's premortem names.

## Not covered

- The hint ladder's length, the rule that no rung states the answer, the fluent fact's strategy line, the framing lines and their approval, the price of opening the ladder and the twin's trigger after a rung: ADR-0220's epic, which replaced REQ-0414, REQ-0418, REQ-0526, REQ-0532, REQ-0538 and REQ-0108 with REQ-5100 to REQ-5164. ADR-0360's epic sets what rungs 2 and 3 hold, through REQ-6408 and REQ-6410.
- The estimate step and the inverse check: ADR-0240's epic. The «Нельзя узнать» options: ADR-0250's. The plan phase: ADR-0270's. A drawn source's regions: ADR-0300's.
- The flows of a riddle, a Diary puzzle, a Volley fact and a Dutch probe letter: the epics realising ADR-0230, ADR-0280, ADR-0290 and ADR-0430.
- The morning grant, the first-contact rule that keeps guiding threads undrawn until they open, and the opening itself: ADR-0330's epic, which replaced REQ-0500 and REQ-0548 with REQ-6248 and REQ-6250.
- What a first attempt's outcome gives in the game, the spell, streak, clean rows, bonuses and chests, and whether an assisted attempt still counts towards the streak: ADR-0140's epic.
- How the estimate uses unassisted, assisted and `postFeedback` attempts, and what a rapid guess is: the epics realising ADR-0060 and ADR-0070.
- How tasks, solution graphs, parallel tasks and answer checking are built: ADR-0040's epic. The detailed explanation's text and model: ADR-0120's.
- The task window's look, the yarn ball and the badges: ADR-0150's epic and ADR-0170's; the strings and the forbidden-word list: ADR-0160's.
- How the adventure places tasks, warm-ups and easy tasks, and the System's announcement before a task: ADR-0090's epic.
- The report's before and after accuracies and the help-seeking flag: ADR-0180's and ADR-0070's epics.
- Tasks that hide the answer, which the draft defers to Ascents after the MVP (RES-0400).
