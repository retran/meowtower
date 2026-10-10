---
id: EPC-0340
artifact: epic
status: approved
revised: 2026-10-10
realises: ADR-0340
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent's sandbox runs the unchanged engine on a second database file, reads the player's file read-only and changes her game only through confirmed actions

Realises exactly ADR-0340: the three sandbox files and their roles, the read-only opener, the `profile` mark with its guards, the snapshot and the reset, the sandbox's model calls and their ledger, the parent session on every sandbox route, the frame, the confirmed actions with their events, the command-line sandbox with its mark and the scan that keys on it, and the acceptance test that shows her file unchanged.

Until the epics realising ADR-0020, ADR-0030, ADR-0100, ADR-0180 and ADR-0280 exist, the tasks run on the stand-ins each task names: a stand-in opener, a stand-in gateway function, a fixture puzzle bank and a stand-in `puzzle_approved`. Each task says what it leaves to those epics.

## Acceptance criteria

1. After the PIN login, a script hashes every table of her file, plays a sandbox floor, a batch of 50, a puzzle and a scene with no confirmed action and hashes again, and the hashes match; a second run confirms each of six actions once and finds exactly six new main-file events with `source: "sandbox"` and `profile = 'main'`, and six `sandbox_action_applied` in the sandbox file. Evidence: acceptance test 18's report, from TSK-0977.
2. A test hands the main handle to a sandbox engine context with `profile: 'sandbox'` and gets `SandboxEventRefused` with no row written; a raw insert of a `sandbox` event into her file, and of a `main` event into a sandbox file, fails with `event profile does not match database`. Evidence: the integration tests' report, from TSK-0966 and TSK-0965.
3. A test drops `events_profile_guard` in a copy and starts the server, which exits with `log_guard_missing` naming it, and a migration that drops it is refused before it applies. Evidence: the integration tests' report, from TSK-0965.
4. A test opens her live file with `openReadOnly` while a writer appends, and the file's size, `mtime` and the hash of `schema_migrations` are unchanged; a write on that handle throws. Evidence: the integration test's report, from TSK-0967.
5. A snapshot taken while a writer appends 1,000 events holds a prefix of the log with consistent projections, no row in `parent_pin`, `lockouts` or `devices`, and `profile = 'sandbox'` on every event. Evidence: the integration test's report, from TSK-0968.
6. A reset to each start, the copy with no snapshot included, leaves per-table hashes of her file unchanged, and the month's sandbox spend on the cost line is the same after it. Evidence: the integration tests' report, from TSK-0969 and TSK-0970.
7. Sandbox calls past the cap and play calls in one month in `replay` mode produce no `budget_month_spent`, a play count equal to her file's `llm_log` sum, and every sandbox call's row and event in the sandbox file under the role's own tier. Evidence: the integration test's report, from TSK-0970.
8. A sandbox route with an expired session answers `401 parent_session_expired`, a sandbox adventure of 40 minutes with a request every 5 minutes never expires, and no sandbox route answers on another paired device's cookie. Evidence: the integration tests' report, from TSK-0971.
9. A snapshot asked for with free space below 3 x (her live file plus its `-wal` file) fails as `sandbox_snapshot_failed` with the old files untouched. Evidence: the integration test's report, from TSK-0968.
10. A confirm posted twice with one token returns the same event with 200 and leaves one event in the log; a confirm after a failed append succeeds with the same token; prepare and confirm on the loopback listener answer 404. Evidence: the integration tests' report, from TSK-0973.
11. A template disabled from the sandbox stays unoffered after a server restart and a full recompute, and a restore brings it back. Evidence: the integration test's report, from TSK-0974.
12. Playwright finds `data-mode="sandbox"`, the frame and the label on every sandbox screen on the iPad and computer viewports. Evidence: the Playwright report, from TSK-0972.
13. `./meowtower sandbox batch --count 9` exits 2 with `sandbox_batch_size`, `adventure --from-snapshot` with no snapshot exits 2 with `sandbox_snapshot_missing`, every output has `sandboxRun`, and no command leaves a file in the repository or the volume. Evidence: the command tests' report, from TSK-0975.
14. The group 1 scan fails on a fixture holding a `snap-` identifier and on one holding a value from `personal/player.md`, and passes on an `empty-` fixture. Evidence: the scan's fixture tests, from TSK-0976.
15. A search of the routes finds no calibration route under `/api/parent/sandbox/`, and the import check fails on a planted import of the main handle in `src/server/sandbox/` and in a play handler. Evidence: the route-table test, from TSK-0972, and the check's fixture tests, from TSK-0967.
16. A test builds a context `{ mainDb, profile: 'main' }` inside a sandbox route and appends an event; the event carries the device identifier `sandbox`, and the next nightly run reports exactly one `sandbox_leak_found`. Evidence: the integration test's report, from TSK-0966.
17. The full verify on the family Mac snapshots a synthetic 1 GB file and records a snapshot over 180 seconds as a baseline finding while the verify passes. Evidence: the verify report, from TSK-0968.
18. Playwright finds «Отключено: 1» on the Parent Room's first screen after one confirmed disable and no such line after the restore. Evidence: the Playwright report, from TSK-0974.
19. Every requirement ADR-0340 addresses lands in a closed task, or is deferred under Not covered with its reason. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished: the time a snapshot of a synthetic 1 GB file takes against the 180-second baseline, from TSK-0968, and the count of `sandbox_leak_found` over the nightly runs of the first weeks, which must stay zero while isolation holds. ADR-0340 reverses to a separate sandbox container the first time a sandbox event reaches her file by any path, and TSK-0966's nightly count is where that shows.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets.

## Tasks

- [ ] T-001 TSK-0964 The sandbox keeps its game in a file of its own in the database volume, opened with a role
      closes: REQ-6300, REQ-6302, REQ-6304
      depends: none
- [ ] T-002 [P] TSK-0965 The player's file refuses a sandbox event over any connection, and the server won't start without that refusal
      closes: REQ-6312, REQ-6314, REQ-6316
      depends: TSK-0964 - the guard compares the profile with the `db_role` row it creates.
- [ ] T-003 TSK-0966 Every sandbox event carries its mark, and `appendEvents` refuses a mismatch before the database sees it
      closes: REQ-6310, REQ-6318
      depends: TSK-0965 - the trigger is the second line behind this check, and the leak test needs the column.
- [ ] T-004 [P] TSK-0967 The sandbox reaches the player's file only through a connection that can't write, and no handler holds a module-level handle
      closes: REQ-6306, REQ-6308
      depends: TSK-0964 - the check names the paths and the opener that task adds.
- [ ] T-005 TSK-0968 A sandbox snapshot shows the player's state at one moment and holds no credential
      closes: REQ-6320, REQ-6322
      depends: TSK-0964 - the output file has role `sandbox`.; TSK-0965 - the copied events carry the mark the guard accepts only in a sandbox file.; TSK-0967 - the worker reads her file through `openReadOnly`.
- [ ] T-006 TSK-0969 A reset starts the sandbox from an empty profile or a copy of the player and leaves her file unchanged
      closes: REQ-6324, REQ-6326, REQ-6378
      depends: TSK-0968 - the copy start and the missing-snapshot case call the builder.
- [ ] T-007 [P] TSK-0970 Every sandbox model call lands in the sandbox's file and ledger, and none enters the play key's count
      closes: REQ-6328, REQ-6330, REQ-6336, REQ-6340, REQ-6374
      depends: TSK-0964 - the ledger is one of the files that task names and opens.
- [ ] T-008 TSK-0971 Every sandbox route on the network listener needs the parent's PIN session, renews it and writes nothing to the player's file
      closes: REQ-6342, REQ-6344, REQ-6376
      depends: TSK-0964 - the routes use the sandbox handle.; TSK-0966 - the middleware that sets the flag is mounted on these trees.; TSK-0967 - the play handlers take the engine context.
- [ ] T-009 [P] TSK-0972 Every sandbox screen shows the striped frame and its label, and the sandbox has no calibration
      closes: REQ-6346, REQ-6358
      depends: none - TSK-0971 is not blocking: the frame runs on one stand-in screen until the routes exist.
- [ ] T-010 [P] TSK-0974 A disabled template stays disabled after a restart and a rebuild, and every older parent event reads as before
      closes: REQ-6354, REQ-6356
      depends: none
- [ ] T-011 TSK-0973 A confirmed action applies after a second press and enters the player's log as exactly one event
      closes: REQ-6350, REQ-6352, REQ-6364
      depends: TSK-0966 - the pointer is written under the mark and flag rules.; TSK-0971 - both routes sit under the parent session.; TSK-0974 - it appends the event types that task defines.
- [ ] T-012 TSK-0975 `./meowtower sandbox` runs an item, a batch or an adventure, prints JSON with a mark and writes no file
      closes: REQ-6360, REQ-6362, REQ-6366, REQ-6372
      depends: TSK-0964 - the run's file has role `sandbox`.; TSK-0968 - `adventure --from-snapshot` reads the snapshot.; TSK-0971 - the routes use the sandbox's engine context.
- [ ] T-013 TSK-0976 The repository scan fails on a tracked file that holds output of a run on a snapshot of the player's state
      closes: REQ-6368
      depends: TSK-0975 - the scan keys on the mark that task puts in every output.
- [ ] T-014 TSK-0977 Acceptance test 18 shows the sandbox changes the player's file only through the six confirmed actions
      closes: REQ-6348, REQ-6370
      depends: TSK-0968 - the scenario may start from a copy.; TSK-0971 - it plays under the sandbox's routes.; TSK-0973 - the second run confirms through its routes.; TSK-0974 - the disable, restore and exclusion events exist.

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0964, TSK-0972 and TSK-0974.
- After TSK-0964: TSK-0965, TSK-0967 and TSK-0970.
- After TSK-0965: TSK-0966.
- After TSK-0964, TSK-0965 and TSK-0967: TSK-0968.
- After TSK-0968: TSK-0969 and TSK-0975, the latter also after TSK-0964 and TSK-0971.
- After TSK-0964, TSK-0966 and TSK-0967: TSK-0971.
- After TSK-0966, TSK-0971 and TSK-0974: TSK-0973.
- After TSK-0975: TSK-0976.
- After TSK-0968, TSK-0971, TSK-0973 and TSK-0974: TSK-0977.

## Coverage

| Task | Requirements |
| --- | --- |
| TSK-0964 | REQ-6300, REQ-6302, REQ-6304 |
| TSK-0965 | REQ-6312, REQ-6314, REQ-6316 |
| TSK-0966 | REQ-6310, REQ-6318 |
| TSK-0967 | REQ-6306, REQ-6308 |
| TSK-0968 | REQ-6320, REQ-6322 |
| TSK-0969 | REQ-6324, REQ-6326, REQ-6378 |
| TSK-0970 | REQ-6328, REQ-6330, REQ-6336, REQ-6340, REQ-6374 |
| TSK-0971 | REQ-6342, REQ-6344, REQ-6376 |
| TSK-0972 | REQ-6346, REQ-6358 |
| TSK-0973 | REQ-6350, REQ-6352, REQ-6364 |
| TSK-0974 | REQ-6354, REQ-6356 |
| TSK-0975 | REQ-6360, REQ-6362, REQ-6366, REQ-6372 |
| TSK-0976 | REQ-6368 |
| TSK-0977 | REQ-6348, REQ-6370 |

The smallest set of tasks that would test the decision is TSK-0965, TSK-0966, TSK-0967, TSK-0973 and TSK-0977, with the tasks they depend on. Together they show whether her file refuses a sandbox event by every path, whether the sandbox can write to her file only through the six confirmed actions, and whether her tables hash the same after a scenario, which are the three things ADR-0340's strongest objection and premortem name.

## Not covered

Nothing. The 37 requirements ADR-0340 addresses each land in one task. ADR-0340's reversal conditions on a separate container, a snapshot over 180 seconds, a tracked file holding snapshot output and a ledger that drifts from the offline key's usage are measures taken after the work, not tasks, and the first of them is read from TSK-0966's nightly count.
