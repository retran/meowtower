---
id: TSK-0280
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-3816]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Emptying the explanation cache loses no fact about play

After this task, a check keeps every projection, the report and the export from reading `explain_cache`, and a test shows that emptying the cache and recomputing leaves every event, projection and report row as it was.

## Acceptance criteria

1. Given a 30-day log with explanations shown and a filled `explain_cache`, when the test empties the cache and runs a full recompute, then every projection, `report_cache` included where it exists, is identical to the one before in every column except `computed_at`, and `events` is unchanged. Closed by: `tests/integration/explain-cache.test.ts`, on the synthetic log now and with ADR-0180's report once it exists.
2. Given code under the projections, the report or the export that names `explain_cache`, when the lint verb runs, then it fails naming the file. Closed by: `tests/unit/static-checks.test.ts` with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the static check that allows `explain_cache` only in the module ADR-0120 gives the explanation request, and the integration test. Create `explain_cache` in a migration only if ADR-0120's epic hasn't yet; its columns are that decision's.

## Depends on

TSK-0260, because the test compares projections before and after a full recompute.

## Evidence

Collected on 2026-09-28 on the Mac. Both criteria hold for the projections that exist today. No report exists yet, so no report row is shown: the test walks the projection registry, and `report_cache` joins it with no edit once ADR-0180 registers it.

- Verbs: `meow-verbs evidence --keep format lint check test build` exited 0 with every verb passed at tree `9586ee6448c7`: format record `0b1583754361`, lint `7897fc9db3b6`, check `2234006bc09f`, test `68d77f323774` (38 test files, 352 Vitest tests, 13 Playwright tests) and build `6a6050107030`, each kept in `project/evidence/`.
- Seen failing first, each break alone and restored: with the check's pattern matching nothing, its fixture test failed; with `items_view` folding the cache's row count into a column, the emptying test failed. That second break passed at first, because the test filled the cache after writing the log, so the projections never saw it full; the test now fills the cache first, as play does.
- Criterion 1, REQ-3816: `tests/integration/explain-cache.test.ts` fills `explain_cache` with 40 variants, writes the synthetic 30-day log from seed 5 with explanations bought and shown, empties the cache and runs a full recompute. It printed `explain_cache: 2158 events with 35 explanations shown; 40 cached variants emptied; items_view, attempts_view, adventures, sessions, node_snapshots and the log unchanged after the recompute`: the SHA-256 of `events` matches, and every projection's rows but `computed_at` are identical.
- Criterion 2: the lint verb's check `explain_cache` fails a projection, the export and a report module that name the table, and passes `src/server/explain/`, a migration and a test; this repository passes it.

Choices this task made, where SPC-0020 and ADR-0120 left a gap:

- ADR-0120 names no module for the explanation request, so the check allows `explain_cache` only in `src/server/explain/`, the module this task names for the explanation request, its drain and its ceiling count, and in migrations and tests; every other file under `src/` and `tools/` that names it fails, a wider net than the projections, the report and the export.
- `migrations/0008_explain_cache.sql` creates the table with ADR-0120's columns, the group, the variant's text, its status `visible`, `hidden` or `retired`, the prompt version, the check results and the reuse failure count, because the test needs it filled and ADR-0120's epic hasn't created it yet.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- Criterion 2 forbids the name in the projections, the report and the export; the check forbids it in every file under `src/` and `tools/` but `src/server/explain/`. Not changed: the criterion is frozen. The net is wider on purpose, so every read of the cache stays in the one module the explanation request owns; a new reader, such as the status report's row count for ADR-0120's 10,000-row ceiling, goes into `src/server/explain/` and is called from there.
- EPC-0020's criterion 6 takes the report's rows from this test; it stays open until ADR-0180's epic registers `report_cache` and runs the test again. That epic has no tasks yet to name.
- REQ-3816 also names the fallback to live generation or a template explanation after the cache is emptied; that belongs to the explanation request, and ADR-0120 hands REQ-3816 back to ADR-0020, so the SPC-0020 amendment below states it where ADR-0120's epic reads it.
- The choices above, the module for the cache, migration 0008 owning the table's schema, and the fallback after emptying, wait for an amendment to SPC-0020, drafted for the owner's approval with this task.

## Left alone

The explanation request, the cache's contents and its drain, which ADR-0120 defines, and the report, which ADR-0180 defines.
