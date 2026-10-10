---
id: EPC-0380
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0380
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every figure addendum 2 adds shows its count and interval, and the report draws lines only from fixed contrasts

Realises exactly ADR-0380: the one interval module and its reference table, the floor registry, the fixed list of contrasts with the language and maths lines, the rules for the lines' wording, the report that can't be curated, the exclusion trail, the list of errors that carry no hard word, the PDF snapshot rule, the mapping of the four states, the owner of each new event type, the new `item_shown` fields, the scope guard of the deferred parts, the rule that no request carries a figure, and build check 5 with its rate measurement.

The profile, the weekly breakdown, the transfer report, the probe and the hypotheses are the epics of ADR-0390 to ADR-0450. This epic builds what they share. Until the epics realising ADR-0180, ADR-0430 and ADR-0340 exist, the tasks run on fixture logs and a stand-in probe schedule, and each task names what it leaves to those epics.

## Acceptance criteria

1. The interval test matches `tests/reference/intervals.json` at every count from 0 of 1 to 60 of 60 within 0.0005, and a search finds no other statistics import in `src/parent/`. Evidence: the group 2 test's report and the lint verb's output, from TSK-1028.
2. The floor check fails on a fixture measure registered with no floor, and a property test finds no line, quadrant, profile line or status from any measure one count below its floor. Evidence: the group 1 check's output and the property test's report, from TSK-1029.
3. The contrast check fails when a fixture adds a contrast to `src/parent/contrasts.ts` without a line in `verify/contrasts.json`. Evidence: the group 1 check's output, from TSK-1030.
4. A report test on fixed counts shows the language line at Russian 18 of 20 against Dutch 9 of 20 with Dutch after the words at 11 of 20, and «пока не ясно» with Russian and Dutch after the words at 15 of 20 and Dutch at 12 of 20; the language line at Russian 13 of 20, Dutch 9 of 20 and Dutch after the words 18 of 20, where only the second difference clears; the maths line at 22 of 40, «пока не ясно» at 30 of 40, and neither at 38 of 40. Evidence: the report test's output, from TSK-1031.
5. The string check fails on a fixture `parent.check.*` value holding «урок», «занятия» or a date, and on «на пороге» under a key other than ADR-0220's node label. Evidence: the group 1 check's output, from TSK-1032 and TSK-1037.
6. A route test sends a filter or hide parameter to each `/api/parent/report*` route and gets 400, and the graph map shows every node of the graph. Evidence: the route test's and the Playwright test's reports, from TSK-1033.
7. After the MVP, a report test on a log with 6 excluded attempts, 4 right and 2 wrong, shows "6, 4 right, 2 wrong" in the summary and the 6 struck through on their node cards, sandbox ones marked as such. Evidence: the report test's output, from TSK-1034.
8. The printed PDF holds one section for each report screen and each node, and a test fails the print when one is missing. Evidence: the print test's report, from TSK-1036.
9. A schema test finds `retention_check_planned`, `probe_family_created`, `hypothesis_recorded` and `hypothesis_updated` owned as ADR-0380's table says, and the owner check fails while their owner is a draft. Evidence: the schema test's report and the group 1 output, from TSK-1038.
10. A replay of stored `item_shown` events of every earlier version gives the same projections before and after the new version exists, and a strict-schema test refuses `daysSinceLastExposure` and `firstExposure`. Evidence: the replay test's report, from TSK-1039.
11. The scope guard passes on the MVP tree and fails on each of the five fixture traces ADR-0380 names. Evidence: the guard test's report, from TSK-1040.
12. Check 5 passes on its fixed seeds on the stand-in schedule, records 20 or more observations on all four presentations for every seed with its game days, and `--check5-rates` reports a both-gaps joint rate at or above 0.825. Evidence: the check's report and `artifacts/check5-rates.json`, from TSK-1042 and TSK-1043. The epic realising ADR-0430 runs the same check on the real probe.
13. A test searches every model request schema and finds no field that can carry a report figure, a probe result or a hypothesis. Evidence: the schema walk's report, from TSK-1041.
14. Every requirement ADR-0380 addresses lands in exactly one closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the largest difference between the interval module and the reference table, which TSK-1028's test reports against 0.0005, and the both-gaps student's measured joint rate against 0.825, which TSK-1043's command writes. ADR-0380 reopens check 5's bar if the second falls below that.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 [P] TSK-1028 One module computes every Wilson, Newcombe and median interval, and a reference table holds it to 0.0005
      closes: REQ-6616, REQ-6618, REQ-6620
      depends: none
- [ ] T-002 [P] TSK-1029 Each measure owns a «мало данных» floor, and a figure below it feeds no finding
      closes: REQ-6622, REQ-6624
      depends: TSK-1028 - the figure type and its `too_little_data` state.
- [ ] T-003 [P] TSK-1030 The report draws its own lines only from a list fixed before her data exists
      closes: REQ-6630, REQ-6640
      depends: TSK-1028 - the lines read the intervals.
- [ ] T-004 TSK-1031 The language line and the maths line appear at 95 % and say «пока не ясно» otherwise
      closes: REQ-6602, REQ-6632, REQ-6634, REQ-6638, REQ-6644, REQ-7400
      depends: TSK-1028 - the 95 % intervals.; TSK-1030 - the contrast list the lines belong to.
- [ ] T-005 [P] TSK-1032 Every line the report draws names a check to run and proposes no lesson
      closes: REQ-6604, REQ-6626, REQ-6628
      depends: none
- [ ] T-006 [P] TSK-1033 The report offers no setting, filter or mode that hides a node or a figure
      closes: REQ-6606
      depends: none
- [ ] T-007 [P] TSK-1034 The summary counts excluded attempts as right and wrong, and each node card strikes them through
      closes: REQ-6610, REQ-6612
      depends: none
- [ ] T-008 [P] TSK-1035 The summary lists nodes with errors that carry no hard word, beside the language-cause list
      closes: REQ-6614
      depends: none
- [ ] T-009 [P] TSK-1036 The PDF snapshot prints every report screen and every node card, or nothing
      closes: REQ-6608
      depends: none
- [ ] T-010 [P] TSK-1037 Three states have node labels, the fourth has none, and «на пороге» names one label only
      closes: REQ-6648, REQ-6650
      depends: none
- [ ] T-011 [P] TSK-1038 The four new event types each have one owning decision, and the owner check fails while it is a draft
      closes: REQ-6646, REQ-6652, REQ-6690
      depends: none
- [ ] T-012 [P] TSK-1039 `item_shown` records two new purposes and the probe's presentation, and stored events stay readable
      closes: REQ-6654, REQ-6656, REQ-6658, REQ-6660
      depends: none
- [ ] T-013 [P] TSK-1040 The scope guard fails on every deferred part of addendum 2, and a probe template names its family
      closes: REQ-6664, REQ-6682, REQ-6684
      depends: none
- [ ] T-014 [P] TSK-1041 No model request can carry a report figure, a probe result or a hypothesis
      closes: REQ-6686, REQ-6688
      depends: none
- [ ] T-015 TSK-1042 Check 5 plays four students whose accuracy follows the presentation, and counts both lines on one seed
      closes: REQ-6666, REQ-7402
      depends: TSK-1031 - the line functions the check reads.
- [ ] T-016 TSK-1043 Check 5 holds the single-gap and no-gap bars, a phase limit, and a rate the report's own code measures
      closes: REQ-6670, REQ-6674
      depends: TSK-1042 - the students, the seed reading and the both-gaps bar.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-1028, TSK-1032, TSK-1033, TSK-1034, TSK-1035, TSK-1036, TSK-1037, TSK-1038, TSK-1039, TSK-1040 and TSK-1041.
- After TSK-1028: TSK-1029 and TSK-1030.
- After TSK-1028 and TSK-1030: TSK-1031.
- After TSK-1031: TSK-1042.
- After TSK-1042: TSK-1043.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-1028 | REQ-6616, REQ-6618, REQ-6620 |
| TSK-1029 | REQ-6622, REQ-6624 |
| TSK-1030 | REQ-6630, REQ-6640 |
| TSK-1031 | REQ-6602, REQ-6632, REQ-6634, REQ-6638, REQ-6644, REQ-7400 |
| TSK-1032 | REQ-6604, REQ-6626, REQ-6628 |
| TSK-1033 | REQ-6606 |
| TSK-1034 | REQ-6610, REQ-6612 |
| TSK-1035 | REQ-6614 |
| TSK-1036 | REQ-6608 |
| TSK-1037 | REQ-6648, REQ-6650 |
| TSK-1038 | REQ-6646, REQ-6652, REQ-6690 |
| TSK-1039 | REQ-6654, REQ-6656, REQ-6658, REQ-6660 |
| TSK-1040 | REQ-6664, REQ-6682, REQ-6684 |
| TSK-1041 | REQ-6686, REQ-6688 |
| TSK-1042 | REQ-6666, REQ-7402 |
| TSK-1043 | REQ-6670, REQ-6674 |

The smallest set of tasks that would test the decision is TSK-1028, TSK-1031, TSK-1039, TSK-1042 and TSK-1043. Together they show whether the interval module matches an independent computation, whether the lines appear on the counts the decision fixes, whether stored events replay unchanged, and whether check 5 separates the four students on its fixed seeds, which are the three things the decision's premortem names: a bar built on the wrong language rule, a `probe` field stored beside MVP events without a version, and an exclusion that sweeps a week of her work.

## Not covered

- REQ-6600: the report breaking her maths results into parts and showing the boundary of what she does on her own, because the parts are the profile, the weekly breakdown and the retention list that the epics realising ADR-0390 and ADR-0400 build, and the parent judges the whole. Rewording `project/vision.md` is the owner's edit.
- REQ-6642: the profile screen's line that about 1 in 5 of its 80 % intervals misses, because only a screen can show the line, and the profile screen is built by the epic realising ADR-0390, whose screen task renders the string `parent.profile.miss_rate` and tests that it is there; ADR-0390 cites the requirement without addressing it, so the line is checked there and closed nowhere.
- REQ-6676: the parts of addendum 2 that shape the log, because its four parts are built by the epics realising ADR-0400 (`itemId`), ADR-0410 (context tags, the hold on first encounters and `first_exposures`), ADR-0420 (the optional `categories` field) and ADR-0450 (the hypothesis events and form); the owner judges the whole at the stage 0.3 acceptance, and TSK-1040 proves the other side, that nothing else of addendum 2 is in the MVP.
- Check 5 on the real probe: it needs the Director and the probe of ADR-0430; TSK-1042 and TSK-1043 build the check and run it on a stand-in schedule until then.
- The owner's rewording of the goal in `project/vision.md` and amendment of `CLAUDE.md`: they are the owner's edits and no task of this epic makes them.
