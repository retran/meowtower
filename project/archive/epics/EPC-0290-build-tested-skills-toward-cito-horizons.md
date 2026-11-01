---
id: EPC-0290
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0290
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The game builds the skills the Cito M7 and E7 tests measure toward horizons the parent sets, and never shows the player a test

Realises exactly ADR-0290: the Cito facts file and its check, the horizons and the entered results, the Cito block on every node with block readiness, the two value terms, the 308 basic facts with their states and threshold, the Volley with its result, record and replies, its share of the floors, the bare-task share, the 60-day simulation, the home skill scale, the report's sections for blocks, formats, careless errors and facts, the multiplication sign and the bridge's two gates.

Until the epics realising ADR-0050, ADR-0060, ADR-0070, ADR-0080, ADR-0140, ADR-0160, ADR-0180 and ADR-0190 exist, the tasks run on fixture graphs, fixture states and stand-in screens. Each task names what it leaves to those epics. The goal import, the mapping panel and the parent's goal list come after the MVP, so the school-goal term reads a fixture input until then and is 0 in play.

## Acceptance criteria

1. `./meowtower graph check` reports a `citoBlock` on every node and subtype, `null` on every S, stretch and track node and each node's value among its subtypes' values, and a fixture node without the field, with a value of 7, with a block on an S node or with a value no subtype carries fails with `graph_block_invalid`. Evidence: the command's output and the validator's test, from TSK-0887.
2. The facts validator reports 308 facts, each tied to a node and subtype of block 1 or 2, and refuses a fixture fact tied to block 3. Evidence: the validator's output, from TSK-0889.
3. A projection test drives fixture logs through `fact_states`: a fact right and fast on 2 of 3 shows within 14 days is automatic, the same fact 15 days later isn't, a fact shown once is «не знает», and a fact is due the next game day after a wrong or slow answer and after 1, 3, 7, 14 and 14 days after right ones. Evidence: the projection and schedule tests' reports, from TSK-0889.
4. A threshold test sets the fact threshold through the Parent Room, finds a `fact_threshold_set` event, a new threshold version and recomputed states, and refuses 1.4 s; a rapid-guess test finds `mul:7x100` 1 ms faster than the motor correction plus 600 ms a rapid guess and 1 ms slower none. Evidence: the tests' reports, from TSK-0890.
5. A Volley test over 1,000 seeds finds 8 to 10 distinct facts, exactly 3 not automatic whenever at least 3 such facts and 7 automatic facts exist, no time on the screen, 1 star yarn when misses are at most 1 and none when a rapid guess is the second miss, and a record that never falls across good and bad days. Evidence: the tests' reports, from TSK-0891 and TSK-0892.
6. The text gate refuses every line of the Volley pool that holds a forbidden word, and the pool holds at least 20 lines with no line twice in a row over 1,000 draws. Evidence: the content check and the draw test, from TSK-0892.
7. The 60-day simulation holds the corridor, the three-day window, the stretch cap and the honest-difficulty property with both new terms on, gives a ready block no block priority, and holds at least half bare tasks on every node with both formats. Evidence: the group 3 report, from TSK-0895, with the bare share from TSK-0894.
8. A floor test over 30 simulated days of 3 floors and 30 of 4 floors finds Volleys on 2 of every 3 floors, counted across days, while `cito:M7` is active and a fact isn't automatic, 1 of every 2 after an M7 result, and none once every fact of blocks 1 and 2 is automatic; it finds the floor's order entry scene, warm-up, mental arithmetic or a Volley, track tasks, rooms, Guardian and chest. Evidence: the floor test's report, from TSK-0893.
9. The refit test recovers item difficulties within 0.3 logits and each simulated pupil's gain within 25 % on growing pupils, and a lint rule fails any import of `src/parent/scale/` from `src/engine/`. Evidence: the group 3 report and the lint verb's output, from TSK-0896.
10. The schema test finds no horizon, result, goal or Cito field in any player response, the end-to-end scan of the player's screens finds no test word and no horizon date, and the test-word search finds none in `src/templates/` or any player string. Evidence: the schema test, the Playwright scan and the group 1 check, from TSK-0886.
11. A check test serves one page with a changed quotation and one unreachable page, and finds the first entry marked unconfirmed, the second unchanged, the file untouched and one `cito_rule_checked` event. Evidence: the check test's report, from TSK-0884.
12. A report test shows «не подтверждено» beside the text of every `usedBy` key of an unconfirmed entry, the scale labelled as not a Cito score, and the careless-errors line with its count for a week at 11 %. Evidence: the report tests' reports, from TSK-0897, TSK-0896 and TSK-0898.
13. A render test shows «×» by default and «·» after the setting with «:» and the decimal comma unchanged, the parser accepts both signs, a bridge test finds no bridge word on a node below «Понимает» and nothing of the bridge once the switch is off. Evidence: the tests' reports, from TSK-0899.
14. A horizon test finds `cito:M7` on 2027-01-15 and `cito:E7` on 2027-05-15 with no event, a `horizon_set` after a changed date, `cito:E7` active after a reading result for `cito:M7`, and block priority 0 after an E7 result with no later horizon; the moment-identifier check fails on a fixture that names a moment `M7` alone. Evidence: the projection test and the check's test, from TSK-0885 and TSK-0888.
15. A value test finds `school_goal` 0 for an unconfirmed link and for a snapshot goal, 1 for a confirmed parent-entered goal, and a node with a confirmed goal and a fresh lesson mark scoring 1.5 from the larger term and never 2.5. Evidence: the value test's report, from TSK-0888.
16. A readiness test on fixture states finds a block ready at 80 % of members fluent or stable and not at 79 %, and blocks 1 and 2 ready only with 90 % of their facts automatic as well. Evidence: the projection test's report, from TSK-0887.
17. The template schema refuses a fixture template without `format`. Evidence: the schema test's report, from TSK-0894.
18. A report test on a fixture log finds the bare and context figures apart on the node card and in the Cito section, the careless share by week and class, the beyond-school list against the school-group setting, both 10 x 10 maps and each block's weekly shares and readiness, and a printable list holding only facts that aren't automatic, in file order, with no date. Evidence: the report tests' reports, from TSK-0897 and TSK-0898.
19. A form test saves a result with only the moment and the subject and one with every field, `<` and a level on the A to E scale included, and finds the Dutch memo naming the test level and the bare-versus-context split in the Cito panel. Evidence: the form test's report, from TSK-0885.
20. Every requirement ADR-0290 addresses lands in at least one task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure three things before it is finished: the share of blocks 1 and 2's facts that are automatic after 60 simulated days at 2 floors in 3 and at 1 in 2, the share of A and N tasks in the last 14 simulated days against the 45 % line, and the Cito check's time against 60 s. TSK-0895 reports the first two and TSK-0884 the third. ADR-0290's second reversal condition fires if the first falls short of 90 % on a profile that answers within the threshold, and its fifth fires if the second passes 45 %.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-0884 The Cito facts file holds each claim with its quotation, and the check only reports
      closes: REQ-5800, REQ-5802, REQ-5806, REQ-5808
      depends: none
- [ ] T-002 TSK-0885 The parent sets horizons and enters Cito results, and a result moves the active horizon
      closes: REQ-5814, REQ-5816, REQ-5818, REQ-5884, REQ-5886
      depends: TSK-0884 - it opens the Cito panel and its route that this task adds sections to.
- [ ] T-003 [P] TSK-0886 No player route, screen or string shows a test, its date or its name
      closes: REQ-5810, REQ-5812
      depends: none
- [ ] T-004 [P] TSK-0887 Every node and subtype carries a Cito block, and a block is ready at 80 % fluent or stable
      closes: REQ-5820, REQ-5830
      depends: TSK-0889 (not blocking) - the projection reads `fact_states`, and the tests write fixture rows until that task lands.
- [ ] T-005 TSK-0888 The Director's value gains block priority and a school-goal term, and takes the larger of a goal and a lesson mark
      closes: REQ-5822, REQ-5824, REQ-5826
      depends: TSK-0885 - the active horizon comes from the `horizons` projection.; TSK-0887 - `citoBlock` and block readiness come from the graph and `cito_blocks`.
- [ ] T-006 [P] TSK-0889 Each of the 308 basic facts has a state over its last 3 shows
      closes: REQ-5832, REQ-5834, REQ-5836
      depends: none
- [ ] T-007 TSK-0890 The parent changes the fact threshold as a new version, and facts keep their own minimum time and repeat exemption
      closes: REQ-5838, REQ-5840, REQ-5842
      depends: TSK-0889 - the facts, their states and the default threshold that a change replaces.
- [ ] T-008 TSK-0891 The Volley shows 8 to 10 basic facts in one window, picked from the facts that aren't automatic first
      closes: REQ-5844
      depends: TSK-0889 - the fact states, due days and `factId`.
- [ ] T-009 TSK-0892 A Volley with at most one miss gives 1 star yarn, a guess earns nothing, the record never falls and a miss gets a line about the fact
      closes: REQ-5848, REQ-5850, REQ-5852, REQ-5854
      depends: TSK-0891 - the Volley's rows and its packet.; TSK-0890 - the minimum time that separates a rapid guess from a quick answer.
- [ ] T-010 TSK-0893 A Volley takes the place of the mental arithmetic on 2 floors in 3 before M7 and 1 in 2 after, counted across days
      closes: REQ-5858
      depends: TSK-0891 - the Volley the floor places.; TSK-0885 - the active horizon, its date and its result.
- [ ] T-011 [P] TSK-0894 Every template declares bare or context, and at least half of a mixed node's scored tasks are bare
      closes: REQ-5862, REQ-5864
      depends: none
- [ ] T-012 TSK-0895 A 60-day simulation holds the corridor with both new terms on, and a node ahead of school opens on its prerequisites
      closes: REQ-5828, REQ-5872
      depends: TSK-0888 - the two terms the run switches on.; TSK-0893 - the Volley is part of every simulated day.; TSK-0894 - the bare share is asserted in the same run.
- [ ] T-013 [P] TSK-0896 The home skill scale is a view that changes no estimate, says it is not a Cito score and refits on pupils who grow
      closes: REQ-5876, REQ-5878, REQ-5880
      depends: TSK-0884 (not blocking) - the `cito_rules` marks that its label reads; the tests write fixture entries.
- [ ] T-014 TSK-0897 The report shows each block's readiness by week, the formats apart, the work ahead of school and the Cito entries with their marks
      closes: REQ-5804, REQ-5866, REQ-5874, REQ-5890, REQ-6064
      depends: TSK-0884 - the marks and `usedBy` keys.; TSK-0887 - block readiness.; TSK-0889 - the facts' states for the shares.; TSK-0894 - `format` on `item_shown`.; TSK-0896 - the scale's reply the section shows.; TSK-0885 (not blocking) - the entered results it lists.
- [ ] T-015 TSK-0898 The report shows careless errors on familiar material, two 10 x 10 fact maps and a printable list of slow facts
      closes: REQ-5868, REQ-5870, REQ-5888, REQ-5892
      depends: TSK-0889 - the fact states the maps and the list read.
- [ ] T-016 [P] TSK-0899 The parent sets the multiplication sign, and a bridge word shows only at «Понимает» and while the bridge is on
      closes: REQ-5894, REQ-5896, REQ-5898
      depends: none

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0884, TSK-0886, TSK-0889, TSK-0894, TSK-0896 and TSK-0899.
- After TSK-0884: TSK-0885.
- After TSK-0889: TSK-0887, TSK-0890, TSK-0891 and TSK-0898.
- After TSK-0885 and TSK-0887: TSK-0888.
- After TSK-0889 and TSK-0890 with TSK-0891: TSK-0892.
- After TSK-0885 and TSK-0891: TSK-0893.
- After TSK-0888, TSK-0893 and TSK-0894: TSK-0895.
- After TSK-0884, TSK-0887, TSK-0889, TSK-0894 and TSK-0896: TSK-0897.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0884 | REQ-5800, REQ-5802, REQ-5806, REQ-5808 |
| TSK-0885 | REQ-5814, REQ-5816, REQ-5818, REQ-5884, REQ-5886 |
| TSK-0886 | REQ-5810, REQ-5812 |
| TSK-0887 | REQ-5820, REQ-5830 |
| TSK-0888 | REQ-5822, REQ-5824, REQ-5826 |
| TSK-0889 | REQ-5832, REQ-5834, REQ-5836 |
| TSK-0890 | REQ-5838, REQ-5840, REQ-5842 |
| TSK-0891 | REQ-5844 |
| TSK-0892 | REQ-5848, REQ-5850, REQ-5852, REQ-5854 |
| TSK-0893 | REQ-5858 |
| TSK-0894 | REQ-5862, REQ-5864 |
| TSK-0895 | REQ-5828, REQ-5872 |
| TSK-0896 | REQ-5876, REQ-5878, REQ-5880 |
| TSK-0897 | REQ-5804, REQ-5866, REQ-5874, REQ-5890, REQ-6064 |
| TSK-0898 | REQ-5868, REQ-5870, REQ-5888, REQ-5892 |
| TSK-0899 | REQ-5894, REQ-5896, REQ-5898 |

The smallest set of tasks that would test the decision is TSK-0887, TSK-0888, TSK-0889, TSK-0893 and TSK-0895. Together they show whether blocks come out ready by the owner's rule, whether block priority keeps the corridor, the window and the cap, and whether the Volley's share can keep facts automatic, which are the two causes the decision's premortem names.

## Not covered

- Every requirement ADR-0290 addresses lands in a task above; none is deferred.
- The goal import with its 200-goal cap and its replace rule, and the schema and writing of `school_goals_imported`: ADR-0290 specifies them and SPC-0290 places them after the MVP, because ADR-0210's scope guard keeps school code out of the tree until the MVP ends. No requirement ADR-0290 addresses asks for the import itself, so it becomes a task added to this epic when that stage opens, marked `[+]` with its reason. The mapping of an entered goal belongs to REQ-6054 and the epic realising ADR-0310, whose mapping panel adds the schema of `school_goal_mapped` when it first writes the event. TSK-0888 builds the term, which takes confirmed links as an input, so `school_goal` is 0 in the MVP and proven on fixture inputs.
- The review schedule's requirement REQ-7510, the amended Volley pick of REQ-6424, the floor order of REQ-7148 and the results form's field list of REQ-7058, which ADR-0460, ADR-0360, ADR-0430 and ADR-0420 address. The tasks build the behaviour the specification SPC-0290 states for them, and those decisions' epics own the requirements.
