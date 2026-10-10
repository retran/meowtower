---
id: EPC-0420
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0420
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The "home and school" screen sorts each goal and each Cito category into one of four quadrants or none, and the MVP's Cito form takes its category list

Realises exactly ADR-0420: the optional category list of the Cito form and its fence from the model, the category mapping file, the home reading of a goal from tested block states, the school reading of a goal against its target, the Cito row's relative cut, the floor scaled to a category's size with its one-node guard, the reason shown for every row in no quadrant, the route that computes the screen at request time, the quadrants' checks and cause lines, the basis of each node's state, the parent's resolution of typed categories, the memo's two new lines, and the acceptance run with the screen's build time.

Only TSK-1092 belongs to the MVP. ADR-0210's scope guard keeps `src/parent/school/quadrants.ts`, `cito_category_resolved` and the resolution panel out of the tree until the MVP ends, so every other task starts after it.

Until the epics realising ADR-0060, ADR-0290, ADR-0310 and ADR-0380 exist, the tasks run on fixtures: rows of `node_snapshots`, fixture snapshots with `school_values`, fixture Cito results and a stand-in for the floor registry. Each task names what it leaves to those epics.

## Acceptance criteria

1. A fixture of a snapshot and a 60-day log gives one quadrant per row that matches a table written by hand, for each quadrant and for each reason code. Evidence: the fixture test's report, from TSK-1104.
2. A node at `block-slow` makes a goal high while `goalTasksTimed` is `false` and puts it under `home_speed_only` while it is `true`, and a Cito row keeps it high both ways. Evidence: the home reading's unit test, from TSK-1094.
3. A goal whose linked node was last checked 31 days before the document date shows `home_stale`, and a node at `probe-fast` shows `home_untested`. Evidence: the home reading's unit test, from TSK-1094.
4. `reached` on target level 2 shows `school_target_low`, `needs_help` on target level 4 shows `school_target_high`, and a `target_moved` pair keeps its quadrant and shows the mark. Evidence: the school reading's unit test, from TSK-1095.
5. A Verbanden category with 6 of 7 nodes tested and a difference past the margin reads, with 5 tested it shows «проверено 5 из 7 узлов за 30 дней до теста», Getallen with 9 tested shows `home_too_few`, and a typed category mapped to 4 nodes shows `category_small`. Evidence: the floor's unit test, from TSK-1097.
6. At 10 nodes inside, 40 outside and q = 0.7 the margin the function computes is 16.2 points, with no outside node the row gives `home_no_outside`, and with q = 1 it gives `home_even`. Evidence: the Cito row's unit test, from TSK-1096.
7. A category with 5 of 6 tested nodes high against 33 of 40 outside is even, with 6 of 6 it shows `home_one_node`, and the same case at 10 tested inside follows the margin alone. Evidence: the guard's unit test, from TSK-1097.
8. A full recompute leaves the screen's JSON byte-identical, and the log holds no event written by the screen's route. Evidence: the route test's report, from TSK-1099.
9. A property test over a 30-day simulated log finds the estimates, snapshots, Director values and every gateway request body byte-identical with and without `categories` on the Cito events, and a deliberate read of `categories` in `src/engine/director/` fails `cito_categories_scope`. Evidence: the property test's report and the lint verb's output, from TSK-1092.
10. In the MVP, the form saves a result with 16 entries, refuses 17, saves a typed category and an `other` signal, and an earlier result with no `categories` still parses. Evidence: the form's tests, from TSK-1092.
11. A resolution of typed words applies to the same words in a later result, and the later of two resolutions of the same words wins. Evidence: the projection test's report, from TSK-1102.
12. Following each check link writes no event and changes no Director input, and the lesson-mark link writes `parent_tag_added` only after the parent submits. Evidence: the screen test's report, from TSK-1100.
13. The screen's build on the family Mac with a year of simulated log stays at p95 1 s or less. Evidence: the build-time measurement's output, from TSK-1104.
14. The parent judges the quadrant headings, the cause lines and the two "measure different things" lines on a synthetic snapshot and Cito result before the feature's acceptance. Evidence: the parent's judgement, recorded in TSK-1104.
15. Every requirement ADR-0420 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the share of fixture rows that land in no quadrant, by reason code, which TSK-1104 reports and which ADR-0420 reverses on at more than half of goal rows, and the screen's build time at p95 against the 1 s baseline, which TSK-1104 measures on the fixture year.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1092 The MVP's Cito form takes an optional list of category entries, and no model call reads it
      closes: REQ-7058, REQ-7060, REQ-7062, REQ-7074
      depends: none
- [ ] T-002 [P] TSK-1093 `content/cito-categories.json` maps the four domains from the research table and holds the LOVS categories unconfirmed
      closes: REQ-7066, REQ-7068
      depends: none
- [ ] T-003 [P] TSK-1094 A goal's home side reads block states of tested nodes at the snapshot's document date
      closes: REQ-7002, REQ-7004, REQ-7006, REQ-7008, REQ-7010, REQ-7014
      depends: none
- [ ] T-004 [P] TSK-1095 A goal's school side reads its status against its target level
      closes: REQ-7016, REQ-7018, REQ-7020, REQ-7022
      depends: none
- [ ] T-005 TSK-1096 A Cito row compares its category's tested nodes with the tested nodes outside it
      closes: REQ-7024, REQ-7026, REQ-7028, REQ-7030, REQ-7032
      depends: TSK-1092 - the row reads the category entries that form saves.; TSK-1093 - the category's nodes come from the mapping file.
- [ ] T-006 TSK-1097 A small category reads on a floor scaled to its size and passes a one-node guard
      closes: REQ-7404
      depends: TSK-1096 - the guard recomputes that task's margin.
- [ ] T-007 TSK-1098 Every row in no quadrant shows its first reason, and the Cito section says Cito builds no profile for the top and bottom 10 %
      closes: REQ-7036, REQ-7038
      depends: TSK-1094 - it orders that task's home reasons.; TSK-1095 - it orders that task's school reasons.; TSK-1096 - it orders the Cito row's reasons.; TSK-1097 - it orders the floor's reasons.
- [ ] T-008 TSK-1099 The route computes the screen at request time from the log and writes nothing
      closes: REQ-7000, REQ-7012, REQ-7052, REQ-7072
      depends: TSK-1098 - it returns each row's quadrant or reason.
- [ ] T-009 [P] TSK-1100 Each quadrant shows its checks, and the two disagreeing quadrants name their causes on both sides
      closes: REQ-7040, REQ-7042, REQ-7044, REQ-7046, REQ-7048, REQ-7050
      depends: TSK-1099 - it extends the screen the route returns.
- [ ] T-010 [P] TSK-1101 Each row names the basis of each node's state and carries «одна проверка» when a node rests on one block
      closes: REQ-7054, REQ-7056
      depends: TSK-1099 - it extends the screen the route returns.
- [ ] T-011 [P] TSK-1102 After the MVP, the parent maps a typed category or an `other` signal and the screen reads the resolution
      closes: REQ-7064, REQ-7076
      depends: TSK-1093 - a resolution maps to the file's keys.; TSK-1098 - the unresolved row's reasons come from that task.
- [ ] T-012 [P] TSK-1103 The Dutch memo lists the category analysis and the test conditions among what the parent can ask the school for
      closes: REQ-7070
      depends: none
- [ ] T-013 TSK-1104 The acceptance run shows every quadrant and reason on fixtures, the build time and the parent's judgement of the wording
      closes: none - it verifies what the other tasks build
      depends: TSK-1100 - it judges the checks and causes.; TSK-1101 - it judges the basis marks.; TSK-1102 - it runs resolved and unresolved rows.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1092, TSK-1093, TSK-1094, TSK-1095 and TSK-1103.
- After TSK-1092 and TSK-1093: TSK-1096.
- After TSK-1096: TSK-1097.
- After TSK-1094, TSK-1095 and TSK-1097: TSK-1098.
- After TSK-1098: TSK-1099 and, with TSK-1093, TSK-1102.
- After TSK-1099: TSK-1100 and TSK-1101.
- After TSK-1100, TSK-1101 and TSK-1102: TSK-1104.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1092 | REQ-7058, REQ-7060, REQ-7062, REQ-7074 |
| TSK-1093 | REQ-7066, REQ-7068 |
| TSK-1094 | REQ-7002, REQ-7004, REQ-7006, REQ-7008, REQ-7010, REQ-7014 |
| TSK-1095 | REQ-7016, REQ-7018, REQ-7020, REQ-7022 |
| TSK-1096 | REQ-7024, REQ-7026, REQ-7028, REQ-7030, REQ-7032 |
| TSK-1097 | REQ-7404 |
| TSK-1098 | REQ-7036, REQ-7038 |
| TSK-1099 | REQ-7000, REQ-7012, REQ-7052, REQ-7072 |
| TSK-1100 | REQ-7040, REQ-7042, REQ-7044, REQ-7046, REQ-7048, REQ-7050 |
| TSK-1101 | REQ-7054, REQ-7056 |
| TSK-1102 | REQ-7064, REQ-7076 |
| TSK-1103 | REQ-7070 |
| TSK-1104 | none |

The smallest set of tasks that would test the decision is TSK-1094, TSK-1096, TSK-1097, TSK-1098 and TSK-1104. Together they show whether each side is cut on its own measure, whether a small category reads only when its difference holds without one node, and whether every row that supports no cut says why, which are the failures the decision's premortem names.

## Not covered

No requirement ADR-0420 addresses is deferred. The decision leaves these things to other records or to a person, and no task here builds them:

- The report's counts, intervals, general «мало данных» floor, the four states and addendum 2's MVP scope, which ADR-0380 owns.
- The retention check, the trajectory and the Dutch probe, which the decisions from RES-4220 and RES-4250 own; TSK-1100 hides their links until those decisions' epics exist.
- The owner's confirmation of the four LOVS node lists and the owner's answer to whether the vendor times its goal tasks: both are a person's acts recorded in content files, and until they happen LOVS rows read `category_unmapped` and goal rows assume untimed tasks.
- Whether Leerling in beeld's category analysis keeps the LOVS form of signals, which the first real printout settles.
