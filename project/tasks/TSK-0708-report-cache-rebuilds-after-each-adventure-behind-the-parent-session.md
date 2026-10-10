---
id: TSK-0708
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0180
closes: [REQ-2300, REQ-2352, REQ-1426, REQ-2304, REQ-2306, REQ-3814]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report is a cached projection of the log, rebuilt after each adventure and served only to the parent session

After this task, `src/parent/` builds one `ReportModel` from the log's projections, `report_cache` holds it with its `DerivedMeta`, the server rebuilds it when an adventure ends, and `GET /api/parent/report` serves it only to a parent session, so the child's screens never carry a diagnostic.

## Acceptance criteria

1. Given a simulated adventure that ends with `adventure_completed`, `adventure_wrapped_up` or `session_ended`, when the rebuild finishes, then `report_cache.lastEventSeq` equals the sequence number of that adventure's last event; given the Parent Room opens while `lastEventSeq` is behind the log, then the server rebuilds first (REQ-2300). Closed by: an integration test over the three ending events.
2. Given every route under `/api/parent/*`, when it is called with no parent session, then it answers 401; given the player's route schemas, when they are searched, then none has a field for a node state, an estimate, a percentage or a topic name, and a scan of the player's screens finds no node identifier, state label, percentage or topic name (REQ-2352, REQ-1426). Closed by: an integration test over every route, a schema test and a Playwright scan.
3. Given the Parent Room opens before the rebuild, when it renders, then it shows the last report with «Обновлено в HH:MM» and rebuilds (`report_stale`); given a report function throws, then the last good `report_cache` stays, the screen shows «Не удалось обновить отчёт, показан отчёт от …» and the error is logged with the last event sequence number (`report_build_failed`). Closed by: two integration tests.
4. Given every `parent.*` value of the Russian string file, when the label check runs, then it fails on «плохо», «отстаёт» or «невнимательная»; given `ReportModel`, when its type is searched, then it holds no field that orders topics or proposes a date or an exercise (REQ-2306, REQ-2304). Closed by: a unit test with a failing fixture string and a type-level test; the parent judges the rest of the wording, as REQ-2306 says.
5. Given a fixture log with results on two graph layers, when the report is built, then every figure equals the one built from the base layer alone (REQ-3814). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/` with the pure report functions, the `report_cache` table with `DerivedMeta` (model, threshold and graph versions and the last event sequence number), the rebuild triggers and the `GET /api/parent/report` route with `at=` reading the daily snapshots of ADR-0060. The functions read projections and write only `report_cache`; they append no event and call no model, and no module in `src/engine/` imports `src/parent/`. `report_cache` keeps the current version set and the one before it. The rebuild after an adventure takes at most 5 seconds and a full recompute of a year's log about 150,000 events at most 60 seconds, the budgets in ADR-0190's Baselines table; the report of `tests/perf/` prints both.

The labels come from the Russian string file of ADR-0160 under `parent.*` and never from a model. Until the epic realising ADR-0160 exists the strings sit in `content/i18n/ru.json` under `parent.`. The MVP has one graph layer, and a report that mixes layers appears only as a choice the parent makes once a second layer exists.

Until the epic realising ADR-0060 exists, the tests feed the functions a fixture of node states, estimates and history shaped as SPC-0060 states them.

## Depends on

Nothing.

## Evidence

Not yet.

## Left alone

The screens, which the later tasks of this epic add, the PIN lockout and the parent session's expiry, which ADR-0010 and ADR-0030 own, and the export's formats, which ADR-0020 owns.
