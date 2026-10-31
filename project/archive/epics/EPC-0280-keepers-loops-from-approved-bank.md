---
id: EPC-0280
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0280
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Diary's puzzles «Петельки Смотрителя» come only from a bank the parent approved by hash

Realises exactly ADR-0280: the bank's data and text files with their static checks, the check functions and the five widgets' rules modules, the Diary pages and widgets, the offline preparation run, the parent's approval by hash, the Director of puzzles, the puzzle flow's routes, the puzzle event types the knowledge model never reads, the rest-stop, eye-count and soft-stop rules, the rewards, the balance simulation and the report section.

Until the epics realising ADR-0030, ADR-0070, ADR-0090, ADR-0100, ADR-0130, ADR-0140, ADR-0150, ADR-0180 and ADR-0210 exist, the tasks run on fixtures and recording gateways, and each task names what it leaves to those epics.

## Acceptance criteria

1. A group 2 test runs every approved puzzle's reference solution through its check and passes, and a mutation test that changes one parameter in each pouring and weighing puzzle finds at least one where the reference then fails. Evidence: the group 2 test's report, from TSK-0869 and TSK-0870.
2. A property test for each widget generates random legal move sequences and asserts that the client's and the server's rules modules reach the same state, and that every sequence the check accepts ends in the goal state. Evidence: the property tests' reports, from TSK-0870.
3. A test gives each cutting and arrangement puzzle a second right answer written by hand and the check accepts it. Evidence: the test's report, from TSK-0869.
4. A group 1 check fails a puzzle whose text holds a digit or a numeral outside a placeholder, a rung 1 with a placeholder, a forbidden form, a banned name, a hand-written signature, a rebus with a letter, a missing source of the idea or a placeholder the data file doesn't define, and never fails on a theme's count. Evidence: the group 1 check's fixture report, from TSK-0868.
5. A replayed run of `puzzles:prepare` asserts that every call went on the offline key under `PUZZLE_MODEL`, `CHECK_MODEL`, `JUDGE_MODEL` or `SAFETY_MODEL`, that no blind-solve request holds the answer or a candidate, and that the run stops at its budget. Evidence: the replay test's report, from TSK-0872.
6. A test edits an approved puzzle, and the server doesn't serve it until a new `puzzle_approved` holds its new hash; a puzzle added to `content/` with no approval is never served. Evidence: the test's report, from TSK-0873.
7. A 60-day simulation with puzzle play asserts at most one offer a game day, none before the finale or before the second adventure, never more than 3 open, the rotation rule, the week puzzle within both limits, clue puzzles at least 5 adventure days apart, and no change to any slot, plan or estimate against the same seeds without puzzles. Evidence: the simulation's report, from TSK-0874 and TSK-0876.
8. A static check fails the build when the knowledge projection or ADR-0070's Director registers any `puzzle_*` input type. Evidence: the static check's output, from TSK-0876.
9. Time-projection tests assert that puzzle time counts in the day's active time and the eye count, that the campfire scene ends when a puzzle opens, and that the soft stop on a puzzle plays at the first reply after the soft-stop point with the offers ADR-0280 names; a move test asserts that past 300 moves a reconnect restores the board to within a minute of moves. Evidence: the projection tests' and the move test's reports, from TSK-0877 and TSK-0875.
10. A packet test asserts that no reply before `puzzle_solved` carries the reference solution, the full solution or an untaken rung. Evidence: the packet test's report, from TSK-0875.
11. A rewards test asserts 2 yarn for a solved puzzle and 3 for a puzzle of the week, the same after a rung, a title at the 5th and 10th solve in one theme, and no grant or loss on boxing or leaving a puzzle. Evidence: the rewards test's report, from TSK-0878.
12. A report test on a fixture log shows the section on the VWO readiness screen with each count of REQ-5798, and the screen count stays as REQ-6064 sets. Evidence: the report test's report, from TSK-0880.
13. The parent approves each puzzle on the review screen and judges its clue pace, its newly written text and its solution page. Evidence: the parent's judgement, from TSK-0873.
14. Every requirement ADR-0280 addresses lands in at least one task or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the cost of a replayed preparation run against the $20 budget and the share of blind solves not accepted, which TSK-0872 reports from the recording gateway against ADR-0280's 30 % reversal line, and the yield and spend of puzzles in the 60-day simulation, which TSK-0879 reports.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0868 A puzzle is a language-free data file and a Russian text file, and the build fails one that breaks a static rule
      closes: REQ-5712, REQ-5714, REQ-5738, REQ-5762, REQ-5764, REQ-5766, REQ-5768, REQ-5792
      depends: none
- [ ] T-002 [P] TSK-0869 A puzzle's check accepts every answer that meets its rules, for numbers, sets, arrangements and grid cells
      closes: REQ-5740
      depends: TSK-0868 - the checks read its data schema.
- [ ] T-003 [P] TSK-0870 Each of the five widgets has one pure rules module that the client and the server both run, and the move-sequence check replays moves through it
      closes: REQ-5740
      depends: TSK-0868 - the modules read the data schema and the starting states.
- [ ] T-004 TSK-0871 The Diary shows puzzle pages and the five widgets as play she enters by her own choice, under the names «Петельки Смотрителя» and «головоломка»
      closes: REQ-5700, REQ-5710
      depends: TSK-0870 - the widgets run those rules modules.; TSK-0875 - the pages send to those routes.
- [ ] T-005 TSK-0872 `npm run puzzles:prepare` passes each puzzle through five steps on the offline key and stops at its own budget
      closes: REQ-5742, REQ-5744, REQ-5746, REQ-5748, REQ-5750
      depends: TSK-0868 - the run reads the schemas and code checks.; TSK-0869 - it needs the four answer formats' checks.; TSK-0870 - it needs the move-sequence check.
- [ ] T-006 TSK-0873 The parent approves each puzzle by hash on one screen, and the game serves only the content she approved
      closes: REQ-5716, REQ-5736, REQ-5752, REQ-5754, REQ-5756, REQ-5760, REQ-5770
      depends: TSK-0872 - the queue holds that run's candidates.; TSK-0876 - it writes `puzzle_approved` and `puzzle_rejected`.
- [ ] T-007 [P] TSK-0876 Every puzzle action is an event type of its own, and the knowledge model and the Director read none of them
      closes: REQ-5706, REQ-5732, REQ-5734
      depends: none
- [ ] T-008 TSK-0874 The Director of puzzles offers at most one new puzzle a game day, after a finale, and never more than three are open
      closes: REQ-5702, REQ-5704, REQ-5718, REQ-5720, REQ-5790, REQ-5794, REQ-5795
      depends: TSK-0873 - it offers only approved puzzles.; TSK-0876 - it writes `puzzle_offered`.
- [ ] T-009 TSK-0875 The server runs a puzzle's own flow: unlimited answers, a three-rung ladder, one free thread and a box
      closes: REQ-5704, REQ-5708, REQ-5758, REQ-5784, REQ-5786, REQ-5788
      depends: TSK-0870 - the routes replay moves through the rules modules.; TSK-0873 - the routes serve only approved content.; TSK-0876 - the routes write those event types.
- [ ] T-010 TSK-0877 A puzzle opens from a rest stop, its minutes count towards the eyes and the soft stop, and the soft stop waits for a boundary
      closes: REQ-5722, REQ-5724, REQ-5725, REQ-5726, REQ-5728, REQ-5730, REQ-5731
      depends: TSK-0875 - the flow's replies are the boundaries.; TSK-0876 - the reasons are fields of those event types.
- [ ] T-011 [P] TSK-0878 A solved puzzle gives its Diary page, a mark, 2 or 3 star yarn and a title for each series of five, the same after a hint
      closes: REQ-5772, REQ-5774, REQ-5776, REQ-5778, REQ-5780
      depends: TSK-0875 - `puzzle_solved` is written by that flow.
- [ ] T-012 TSK-0879 The economy's balance simulation counts the star yarn puzzles give and the guiding threads they spend
      closes: REQ-5782
      depends: TSK-0874 - the simulation needs the offer rules.; TSK-0878 - the yield comes from the rewards.
- [ ] T-013 [P] TSK-0880 The VWO readiness screen shows «Нестандартное мышление» as a reserve, with the puzzle counts, and report v1 keeps nine screens
      closes: REQ-5796, REQ-5798, REQ-6064
      depends: TSK-0876 - the section reads those event types.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0868 and TSK-0876.
- After TSK-0876: TSK-0880.
- After TSK-0868: TSK-0869 and TSK-0870.
- After TSK-0868, TSK-0869 and TSK-0870: TSK-0872.
- After TSK-0872 and TSK-0876: TSK-0873.
- After TSK-0873 and TSK-0876: TSK-0874.
- After TSK-0870, TSK-0873 and TSK-0876: TSK-0875.
- After TSK-0875: TSK-0871, TSK-0877 and TSK-0878.
- After TSK-0874 and TSK-0878: TSK-0879.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0868 | REQ-5712, REQ-5714, REQ-5738, REQ-5762, REQ-5764, REQ-5766, REQ-5768, REQ-5792 |
| TSK-0869 | REQ-5740 |
| TSK-0870 | REQ-5740 |
| TSK-0871 | REQ-5700, REQ-5710 |
| TSK-0872 | REQ-5742, REQ-5744, REQ-5746, REQ-5748, REQ-5750 |
| TSK-0873 | REQ-5716, REQ-5736, REQ-5752, REQ-5754, REQ-5756, REQ-5760, REQ-5770 |
| TSK-0874 | REQ-5702, REQ-5704, REQ-5718, REQ-5720, REQ-5790, REQ-5794, REQ-5795 |
| TSK-0875 | REQ-5704, REQ-5708, REQ-5758, REQ-5784, REQ-5786, REQ-5788 |
| TSK-0876 | REQ-5706, REQ-5732, REQ-5734 |
| TSK-0877 | REQ-5722, REQ-5724, REQ-5725, REQ-5726, REQ-5728, REQ-5730, REQ-5731 |
| TSK-0878 | REQ-5772, REQ-5774, REQ-5776, REQ-5778, REQ-5780 |
| TSK-0879 | REQ-5782 |
| TSK-0880 | REQ-5796, REQ-5798, REQ-6064 |

The smallest set of tasks that would test the decision is TSK-0868, TSK-0869, TSK-0872, TSK-0873 and TSK-0876. Together they show whether a faulty or unsolvable puzzle fails before it reaches the parent, whether an edited puzzle stops being served, and whether the knowledge model stays blind to the Diary, which are the guards the decision's strongest objection and its premortem name.

## Not covered

- Nothing is deferred. Every requirement the decision addresses lands in a task above.
- Outside the epic, by the decision's own text: puzzles in English and Dutch, difficulty 5, any rule that grows the branch from the report's counts, the sandbox's turn-off of a puzzle (ADR-0340), and a shared count of running clues across the Master's scenes and the puzzles.
