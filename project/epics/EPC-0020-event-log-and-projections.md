---
id: EPC-0020
artifact: epic
status: approved
revised: 2026-09-27
realises: ADR-0020
checked-at:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The append-only event log is the only truth, and every projection rebuilds from it

This epic realises ADR-0020: the append-only `events` table and its triggers, `appendEvents`, the event schemas and upcasters, the blob store, the language-free parameter check, the projection registry with `derived_meta`, the shadow-table recompute and the export. SPC-0020 states what the finished part does. It uses the names ADR-0200 sets, so ADR-0020's `./tower`, `tower` and `tower-db` are `./meowtower`, `meowtower` and `meowtower-db` here. The epic is complete when every criterion below holds with its evidence.

## Acceptance criteria

1. A test runs `UPDATE events SET type = type` and `DELETE FROM events` against a real database, and both fail with "events are append-only". Evidence: the test's report, from TSK-0200.
2. A test drops one trigger in a copy and starts the server on it, and the server exits naming the trigger. Evidence: the test's report, from TSK-0200.
3. After a simulated 30-day run, a test deletes each projection table in turn, recomputes with the same versions, and finds every row identical to the one before, comparing every column except `computed_at`. Evidence: the rebuild test's report, from TSK-0260.
4. The same run recomputed under a second model version gives identical `inventory`, `progress`, `outcomes`, `threads`, `familiars` and `reward_queue` tables, and `node_snapshots` holds rows under both versions. Evidence: the two-version test's report, from TSK-0270.
5. After the recompute, the row counts and a content hash of `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` equal their values before it. Evidence: the same rebuild test's report, from TSK-0260.
6. Emptying `explain_cache` and rebuilding the report gives a report identical to the one before. Evidence: the cache test's report, from TSK-0280.
7. Every event of the 30-day run validates against its schema, and has a unique ULID, a `seq` one greater than the previous event's, a server time, a device time and a device identifier. Evidence: the log audit's report, from TSK-0200, TSK-0210 and TSK-0220.
8. For every `scratch_snapshot` event, `data/blobs/<sha256>.webp` exists and its SHA-256 equals its name. Evidence: the blob check's report, from TSK-0240.
9. `./meowtower export` writes the five named outputs, DuckDB reads each Parquet file, and the row counts of `events.jsonl` and `events.parquet` equal the count of `events` in the copy. Evidence: the export test's report and the command's output, from TSK-0290.
10. A request to `/api/parent/export/events.jsonl` through `https://<mac-name>.local` gets 404, and the same path on `http://localhost:8080` returns the file. Evidence: both requests' output, from TSK-0290.
11. The static check finds a string-typed field in no template's parameter schema. Evidence: the lint verb's output, from TSK-0230.
12. Every requirement ADR-0020 addresses lands in exactly one closed task. Evidence: `paw check coverage` with no finding.

The epic can measure two things before it is finished. The recompute of TSK-0260 reports how long a full recompute of one simulated year takes, against the 60-second budget in ADR-0190's Baselines table; above 10 minutes, ADR-0020 reverses to checkpointed projections. TSK-0200's guard test tries `VACUUM` and every schema change the migration runner allows against the triggers, and a bypass is ADR-0020's third reversal condition.

Criteria 3, 4 and 7 name a simulated 30-day run, which ADR-0190's simulation produces once the epics realising ADR-0030, ADR-0040, ADR-0060, ADR-0080 and ADR-0140 exist. Until then the tasks run them against a synthetic 30-day log that a test fixture writes through `appendEvents`, and they run again against the simulation when it exists.

## Marks

```text
[ ] not started   [>] in progress   [x] done, with evidence
[~] dropped, with the reason        [+] added after approval, with why
```

A task is marked in the commit that advances it, never in a later pass. A task that can run in parallel with its neighbours carries `[P]` after its number. A task is done when its own acceptance criteria hold and it meets the definition of done ADR-0190 sets, the verify command and the stage's acceptance, which no task here restates or weakens.

## Tasks

- [x] T-001 TSK-0200 The append-only `events` table and `appendEvents` replace the stage-0 write (`migrations/`, `src/engine/events/`, `src/server/stage0.ts`, `src/server/database.ts`, `tests/crash/`)
      evidence: meow-verbs run format lint check test build exit 0, 63 tests; crash test 100 of 100 writes kept (TSK-0200 Evidence)
      closes: REQ-2226, REQ-3800, REQ-2202
      depends: TSK-0030 - it replaces the table that task's storage module and crash test write
- [x] T-002 [P] TSK-0210 Schemas, upcasters and the start-up schema check, with the task and attempt events (`src/shared/events.ts`)
      evidence: meow-verbs exit 0, 132 tests; missing facts refused by name; unknown schema stops start-up (TSK-0210 Evidence)
      closes: REQ-2204, REQ-2206, REQ-2208, REQ-2212, REQ-3804
      depends: TSK-0200 - the schemas validate inside `appendEvents`
- [x] T-003 [P] TSK-0230 A static check keeps every template's parameters language-free (`tools/static-checks.ts`)
      evidence: meow-verbs exit 0; params_language read 0 templates; fixtures fail on free and nested strings (TSK-0230 Evidence)
      closes: REQ-3808
      depends: none - it reads template files and fixtures, not the log
- [x] T-004 [P] TSK-0220 Schemas for the story, economy, break, parent, safety and model-call events (`src/shared/events.ts`)
      evidence: meow-verbs exit 0, 229 tests; 31 schemas refuse missing facts; registry names only catalogue types (TSK-0220 Evidence)
      closes: REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222
      depends: TSK-0210 - it adds types to the registry and versioning rule that task makes
- [x] T-005 [P] TSK-0240 The write-once blob store logs each draft-pad image by its hash (`data/blobs/`, table `blobs`)
      evidence: meow-verbs exit 0, 253 tests; file synced before event; blob_changed reported; triggers guarded (TSK-0240 Evidence)
      closes: REQ-2210
      depends: TSK-0210 - `scratch_snapshot` needs its schema in the registry
- [ ] T-006 TSK-0250 The projection registry, `derived_meta`, the flat `items_view` and `attempts_view`, corrections, and the start-up rebuild of a missing table
      closes: REQ-3802, REQ-2232, REQ-2228
      depends: TSK-0210 and TSK-0220 - the flat projections fold the task, attempt and parent-action events those tasks define
- [ ] T-007 [P] TSK-0260 The shadow-table full recompute, `./meowtower recompute`, and the rebuild test
      closes: REQ-2200, REQ-2242
      depends: TSK-0250 - it rebuilds the registered projections; TSK-0080 - `recompute_failed`, `recompute_slow` and `log_large` reach the parent as that task's notices
- [ ] T-008 [P] TSK-0290 `./meowtower export` and the loopback-only export routes
      closes: REQ-2234, REQ-2236, REQ-2238, REQ-2240
      depends: TSK-0250 - `attempts` and `items` are the flat projections; TSK-0060 - the loopback listener must exist
- [ ] T-009 [P] TSK-0270 A version change recomputes at start-up, and logged decisions stay fixed under a new model
      closes: REQ-2230, REQ-2224
      depends: TSK-0260 - the start-up recompute is that task's recompute
- [ ] T-010 [P] TSK-0280 Emptying the explanation cache loses no fact about play
      closes: REQ-3816
      depends: TSK-0260 - the test compares projections before and after a recompute

These tasks can run in parallel once their dependencies are done:

- From the start: TSK-0200 and TSK-0230.
- After TSK-0210: TSK-0220 and TSK-0240.
- After TSK-0250: TSK-0260 and TSK-0290.
- After TSK-0260: TSK-0270 and TSK-0280.

## Coverage

Every one of the 27 requirements ADR-0020 addresses lands in exactly one task above, and none is deferred.

| Task | Requirements |
| --- | --- |
| TSK-0200 | REQ-2202, REQ-2226, REQ-3800 |
| TSK-0210 | REQ-2204, REQ-2206, REQ-2208, REQ-2212, REQ-3804 |
| TSK-0220 | REQ-2214, REQ-2216, REQ-2218, REQ-2220, REQ-2222 |
| TSK-0230 | REQ-3808 |
| TSK-0240 | REQ-2210 |
| TSK-0250 | REQ-2228, REQ-2232, REQ-3802 |
| TSK-0260 | REQ-2200, REQ-2242 |
| TSK-0270 | REQ-2224, REQ-2230 |
| TSK-0280 | REQ-3816 |
| TSK-0290 | REQ-2234, REQ-2236, REQ-2238, REQ-2240 |

The smallest set of tasks that would test the decision is TSK-0200, TSK-0250 and TSK-0260. Together they show whether the database refuses every change to the log, whether projections written in the same transaction as the log rebuild identical from it, and whether a full recompute of a simulated year fits the 60-second budget, which covers ADR-0020's first and third reversal conditions.

## Not covered

- The routes that write play events, idempotency per request and the resume point's contents, because ADR-0030 defines them; this epic only offers `appendEvents` and `idem_key`.
- Each event type's payload beyond the facts the requirements name, because the owning decision in ADR-0020's Event catalogue defines it; TSK-0210 and TSK-0220 write the fields the requirements require.
- The knowledge projections' contents and the model, because ADR-0060 defines them; TSK-0270 fixes only how `node_snapshots` stores rows under several versions.
- The report and the Parent Room page that links the export, because ADR-0180 defines them.
- The contents, growth and ceiling of `llm_log`, because ADR-0100 defines them.
- Erasing a fact from the log, because no decision makes it.
- Choosing a graph version at recompute, which RES-2200 leaves open; the recompute uses the graph version in the content files.
- Defending the triggers against root inside the Docker virtual machine, because ADR-0020 accepts that risk.
