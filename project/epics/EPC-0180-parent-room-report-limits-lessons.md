---
id: EPC-0180
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0180
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Parent Room and its report are projections of the event log behind a PIN, with twelve limits, lesson rechecks and labels, and an export on the Mac only

Realises exactly ADR-0180: the report cache and its rebuild, the report's screens, the VWO readiness ladder, the twelve limits, the fluency thresholds for each device type, the lesson marks with their rechecks and labels, the settings and glossary panels and the adventure preview.

Until the epics realising ADR-0040, ADR-0050, ADR-0060, ADR-0070, ADR-0090, ADR-0130 and ADR-0160 exist, the tasks run on fixtures: a log built by the synthetic-log helper, node states and estimates shaped as SPC-0060 states them, a stand-in Director and the strings in `content/i18n/ru.json`. Each task names what it leaves to those epics.

## Acceptance criteria

1. After a simulated adventure ends, `report_cache.lastEventSeq` equals the sequence number of that adventure's last event. Evidence: the integration test's report, from TSK-0708.
2. A Playwright test lists the Parent Room's navigation and finds the report screens this decision places and none for dynamics, home and school or a timeline. Evidence: the Playwright report, from TSK-0723.
3. A property test on random logs changes the answers of assisted attempts, and the skill map, states and ladder stay equal while the «с помощью» figures change. Evidence: the property test's report, from TSK-0709.
4. Unit tests of the ladder at 89 % and 90 % coverage, 79 % and 80 % margin, and 2 and 3 stretch nodes give the steps of REQ-2338 to REQ-2344, and an unverified or cut-off node counts as not covered. Evidence: the unit tests' reports, from TSK-0713.
5. A fixture with 2 sessions shows «мало данных» in all twelve rows, and the same fixture with 3 sessions shows values. Evidence: the unit test's report, from TSK-0717.
6. Every `/api/parent/*` route answers 401 without a parent session, and a scan of the player's screens finds no node identifier, state label, percentage or topic name. Evidence: the integration and Playwright tests' reports, from TSK-0708.
7. A day with 121 minutes of active time shows «долгий день» on the summary, and a day with 120 doesn't. Evidence: the unit test's report, from TSK-0710.
8. Changing one catalogue value without a new entry in `content/thresholds.lock` fails verify. Evidence: the integration test's report, from TSK-0719.
9. In the 30-day simulation, a lesson mark on day 5 gets a full block between days 6 and 8 and another between days 17 and 21, and the node's label matches the rule for its simulated states. Evidence: the simulation test's reports, from TSK-0720 and TSK-0721.
10. At the stage 0.2 acceptance an adult reads report v1 without explanation, and at stage 0.3 the parent answers the three questions of REQ-2302 from it. Evidence: the parent's judgement recorded in TSK-0710; the stage gates themselves belong to the epic realising ADR-0190.
11. A term hint shows no Dutch word for an entry the parent hasn't approved, and shows it after `glossary_entry_approved`. Evidence: the integration test's report, from TSK-0722.
12. A fixture where every stretch node is «Пока не освоено» lists none of them among the gaps, and one with 2 stretch nodes in «Бегло» lists both as the ceiling. Evidence: the unit tests' reports, from TSK-0713.
13. Changing the school group in the settings panel writes one `settings_changed` event and starts a full recompute under the other prior row; changing the age changes the next read of the setting; and a scan of the tracked files finds none of the three values. Evidence: the integration and static tests' reports, from TSK-0722.
14. Every requirement ADR-0180 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding for this epic.

The epic can measure two things before it is finished: the time to rebuild `report_cache` after an adventure against 5 seconds, and a full recompute of a synthetic year of about 150,000 events against 60 seconds, which `tests/perf/` prints for TSK-0708. ADR-0180 moves the report to an incremental projection with a periodic full check if either budget fails on the Mac for a week of play, so TSK-0708 is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0708 The report is a cached projection of the log, rebuilt after each adventure and served only to the parent session
      closes: REQ-2300, REQ-2352, REQ-1426, REQ-2304, REQ-2306, REQ-3814
      depends: none
- [ ] T-002 [P] TSK-0709 The node card shows each task as the player saw it, and assisted attempts reach only the "with help" figures
      closes: REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2328, REQ-2368
      depends: TSK-0708 (blocking) - the part is built in `src/parent/` and served from the cache.
- [ ] T-003 TSK-0710 The summary screen shows the frontier, the nodes to recheck and a long day
      closes: REQ-2302, REQ-2318, REQ-2320, REQ-2322, REQ-2372, REQ-2376, REQ-2378
      depends: TSK-0708 (blocking) - the part joins the report model.; TSK-0709 (blocking) - the language-cause mark comes from the node card's function.; TSK-0711 (not blocking) - the judgement criterion reads the graph map.; TSK-0713 (not blocking) - the judgement criterion reads the VWO block.
- [ ] T-004 [P] TSK-0711 The graph map rings every frontier node, and word problems are counted by type and steps with modelling errors apart
      closes: REQ-2374, REQ-0834, REQ-0838
      depends: TSK-0708 (blocking) - the part joins the report model.
- [ ] T-005 [P] TSK-0712 The misconceptions screen groups traps across nodes and lists the unrecognised, and the science screen shows no score
      closes: REQ-2324, REQ-2326, REQ-0711, REQ-2362, REQ-2364, REQ-2366
      depends: TSK-0708 (blocking) - the parts join the report model.
- [ ] T-006 [P] TSK-0713 The VWO readiness block counts verified states against thresholds kept as versioned data
      closes: REQ-0824, REQ-0826, REQ-0828, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350
      depends: TSK-0708 (blocking) - the part joins the report model.
- [ ] T-007 [P] TSK-0714 The limits projection computes a result for each session, smoothed over 7 sessions, and measures endurance
      closes: REQ-1300, REQ-1302, REQ-1304, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1346
      depends: TSK-0708 (blocking) - the limits feed the report model.
- [ ] T-008 TSK-0715 The limits for holding steps, speed of the basics, scratchpad, error type and carelessness are computed
      closes: REQ-1318, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330
      depends: TSK-0714 (blocking) - it supplies the result type, the smoothing and the timing rules.
- [ ] T-009 [P] TSK-0718 Fluency thresholds are kept for each device type and start from the catalogue and the motor correction
      closes: REQ-1348, REQ-1350, REQ-1352, REQ-1362, REQ-1364
      depends: none
- [ ] T-010 TSK-0716 The limits for impulsiveness, avoidance, anxiety, flow and help are computed
      closes: REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1344
      depends: TSK-0714 (blocking) - it supplies the result type and the smoothing.; TSK-0718 (blocking) - the fast-answer share reads the fluency threshold.
- [ ] T-011 TSK-0717 The limits screen shows one row for each of the twelve limits, with «мало данных» below three sessions
      closes: REQ-2356, REQ-2358, REQ-2360, REQ-2370, REQ-1308
      depends: TSK-0714 (blocking) - it reads the result type and smoothing.; TSK-0715 (blocking) - five rows are computed there.; TSK-0716 (blocking) - five more rows are computed there.; TSK-0710 (blocking) - the one line for each limit goes onto its summary.
- [ ] T-012 TSK-0719 The motor check repeats monthly, every update is a new threshold version, and only a person changes the catalogue
      closes: REQ-1354, REQ-1356, REQ-1358, REQ-1360
      depends: TSK-0718 (blocking) - it supplies the projection the versions apply to.; TSK-0713 (blocking) - it builds `thresholds.lock` and the check this task extends.
- [ ] T-013 [P] TSK-0720 A lesson mark opens a recheck from day 1 to 3 and another from day 12 to 16
      closes: REQ-1400, REQ-1402, REQ-1404
      depends: TSK-0708 (blocking) - the lessons list and the form sit in the Parent Room.
- [ ] T-014 TSK-0721 Lesson labels compare checked states only, and the dynamics views carry their caveats
      closes: REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424
      depends: TSK-0709 (blocking) - it extends the node card's state history.; TSK-0720 (blocking) - it reads the lesson marks and windows.
- [ ] T-015 [P] TSK-0722 The parent sets the player's three details in the Parent Room, and a Dutch word shows only after approval
      closes: REQ-3710, REQ-3712, REQ-0846
      depends: TSK-0708 (blocking) - the panels sit in the Parent Room.
- [ ] T-016 TSK-0723 The parent prepares, previews and approves the next adventure, and the player gets it with no live model call
      closes: REQ-0105, REQ-0107
      depends: TSK-0708 (blocking) - the screen and routes sit behind the parent session.; TSK-0709 (blocking) - the navigation test lists the node card.; TSK-0710 (blocking) - it lists the summary.; TSK-0711 (blocking) - it lists the graph map.; TSK-0712 (blocking) - it lists the misconceptions and science screens.; TSK-0713 (blocking) - it lists the VWO readiness screen.; TSK-0717 (blocking) - it lists the limits screen.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0708 and TSK-0718.
- After TSK-0708: TSK-0709, TSK-0711, TSK-0712, TSK-0713, TSK-0714, TSK-0720 and TSK-0722.
- After TSK-0709: TSK-0710.
- After TSK-0714: TSK-0715.
- After TSK-0714 and TSK-0718: TSK-0716.
- After TSK-0718 and TSK-0713: TSK-0719.
- After TSK-0709 and TSK-0720: TSK-0721.
- After TSK-0714, TSK-0715, TSK-0716 and TSK-0710: TSK-0717.
- After TSK-0709, TSK-0710, TSK-0711, TSK-0712, TSK-0713 and TSK-0717: TSK-0723.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0708 | REQ-2300, REQ-2352, REQ-1426, REQ-2304, REQ-2306, REQ-3814 |
| TSK-0709 | REQ-2310, REQ-2312, REQ-2314, REQ-2316, REQ-2328, REQ-2368 |
| TSK-0710 | REQ-2302, REQ-2318, REQ-2320, REQ-2322, REQ-2372, REQ-2376, REQ-2378 |
| TSK-0711 | REQ-2374, REQ-0834, REQ-0838 |
| TSK-0712 | REQ-2324, REQ-2326, REQ-0711, REQ-2362, REQ-2364, REQ-2366 |
| TSK-0713 | REQ-0824, REQ-0826, REQ-0828, REQ-2330, REQ-2332, REQ-2334, REQ-2336, REQ-2338, REQ-2340, REQ-2342, REQ-2344, REQ-2346, REQ-2348, REQ-2350 |
| TSK-0714 | REQ-1300, REQ-1302, REQ-1304, REQ-1310, REQ-1312, REQ-1314, REQ-1316, REQ-1346 |
| TSK-0715 | REQ-1318, REQ-1322, REQ-1324, REQ-1326, REQ-1328, REQ-1330 |
| TSK-0716 | REQ-1332, REQ-1334, REQ-1336, REQ-1338, REQ-1340, REQ-1344 |
| TSK-0717 | REQ-2356, REQ-2358, REQ-2360, REQ-2370, REQ-1308 |
| TSK-0718 | REQ-1348, REQ-1350, REQ-1352, REQ-1362, REQ-1364 |
| TSK-0719 | REQ-1354, REQ-1356, REQ-1358, REQ-1360 |
| TSK-0720 | REQ-1400, REQ-1402, REQ-1404 |
| TSK-0721 | REQ-1406, REQ-1408, REQ-1410, REQ-1412, REQ-1416, REQ-1418, REQ-1420, REQ-1422, REQ-1424 |
| TSK-0722 | REQ-3710, REQ-3712, REQ-0846 |
| TSK-0723 | REQ-0105, REQ-0107 |

The smallest set of tasks that would test the decision is TSK-0708, TSK-0709, TSK-0713, TSK-0717 and TSK-0720. Together they show whether the report rebuilds from the log in time and stays behind the PIN, whether assisted attempts stay out of the skill map, whether the ladder counts verified states only, whether too little data shows as such, and whether a lesson mark gets its two rechecks and its label, which are the failures the premortem names: a parent who stops reading, a crowded frontier and a ladder read as a verdict.

## Not covered

- REQ-1306: the full limits screen with its views of the twelve limits comes after the MVP, and adds views over the same `LimitsResult`, so TSK-0714 to TSK-0716 build the measures it will read.
- REQ-2354: the PDF snapshot of the report comes after the MVP, as the print stylesheet of the full report screens.
- The test mode «Проверка игры» with its separate database file: ADR-0180's twelfth criterion was superseded, because REQ-3518 was replaced by REQ-6348, which ADR-0340, ADR-0370 and ADR-0460 address.
- The panels this decision only places, such as the switch «Закончить на сегодня», the review queues, the bake-off screen and the alarm notice, and the Data export tab, which ADR-0020 states: each belongs to the decision that defines it.
- The screens that later decisions add to report v1, such as the sources screen, the profile and the hypotheses: their own epics build them.
