---
id: TSK-0260
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2200, REQ-2242]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The shadow-table full recompute, `./meowtower recompute`, and the rebuild test

After this task, a full recompute rebuilds every registered projection into `<name>__next` while play goes on, catches up and swaps in one short transaction, touches none of the seven tables outside the projections, and runs on `./meowtower recompute`. A rebuild test proves each projection rebuilds identical from the log alone.

## Acceptance criteria

1. Given a 30-day log, when the test deletes each projection table in turn and recomputes with the same versions, then every row equals the row before in every column except `computed_at`. Closed by: `tests/integration/rebuild.test.ts`, run on the synthetic 30-day log now and on ADR-0190's simulated run once it exists.
2. Given the same log, when a recompute runs, then the row counts and a content hash of `blobs`, `explain_cache`, `devices`, `llm_log`, `art_jobs`, `frames` and `bakeoff` equal their values before it. Closed by: the same test.
3. Given a recompute running, when the test appends events during it, then no append waits for the rebuild beyond the swap transaction, and the swapped tables include the appended events. Closed by: the same test, reporting the longest append wait.
4. Given a stored projection that differs from a fresh derivation, when the verify check runs, then it reports `projection_diverged` with the table and the first differing row. Closed by: a test that edits one projection row.
5. Given a recompute that throws partway, when it ends, then the old projections are in place and the parent sees `recompute_failed` with the version and time. Closed by: a failure test and `./meowtower status` output.
6. Given a synthetic log of one year at ADR-0020's estimate of 180,000 events, when a full recompute runs on the Mac, then it finishes within 60 seconds, and a slower run raises `recompute_slow` once. Closed by: the measurement against ADR-0190's Baselines table. Above 10 minutes, ADR-0020 reverses to checkpoints.
7. Given `events` larger than 1 GB, when the check runs, then `log_large` is raised once. Closed by: a unit test with the size threshold injected.
8. Given the stack runs, when the parent runs `./meowtower recompute`, then it prints the tables rebuilt and the time taken. Closed by: the command's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the recompute to the projection registry of TSK-0250: build each registered table into `<name>__next` from `seq` 1 on its own connection, catch up to the head of the log, then apply the remaining events and rename the tables in one transaction, updating `derived_meta`. Rebuild only registered tables. Add the `recompute` subcommand to `./meowtower`, running inside `meowtower`, the `projection_diverged` and `recompute_slow` checks for the verify command, and the `recompute_failed`, `recompute_slow` and `log_large` notices. Add the fixture that writes a synthetic 30-day log and a synthetic year through `appendEvents`, from fixed seeds.

## Depends on

TSK-0250, because the recompute rebuilds the registered projections. TSK-0080, because the three notices reach the parent through the notices that task adds to the Parent Room and `./meowtower status`.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds for the tables that exist on this date, criterion 3 with the one-chunk wait the first open finding names; criterion 1 runs on the synthetic 30-day log until ADR-0190's simulation exists.

- Verbs: `meow-verbs run format lint check test build` exited 0; 36 test files, 338 Vitest tests and 13 Playwright tests passed. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees are cited from `git write-tree`: `src` `051a29e283cd1f220a310aa325c245f998602938`, `tests` `daffb1001d4511935ffa522b58d3e952171c5ca7`, `content` `07ba7f7acd3d51532a7b7bf07fbf604c04a230b1`, and the script `meowtower` `57756e237406f66a72f309ecac1952932ada86a4`.
- Seen failing first, each break alone and restored: with the swap skipping its catch-up, the appends test failed; with the swap deleting `devices`, the service-tables test failed; with a failure leaving its shadow tables, the failure test failed; with the divergence check never reporting, the `projection_diverged` test failed; with the fold skipping `item_flagged`, the rebuild test and the divergence test failed.
- Criterion 1, REQ-2200: `tests/integration/rebuild.test.ts` writes the synthetic 30-day log from seed 7 through `appendEvents` and printed `rebuild: 2077 events; items_view 600 rows, attempts_view 600 rows, adventures 10 rows, sessions 30 rows`; each table in turn, dropped and recomputed, equals its rows before in every column but `computed_at`, which records when the rebuild ran and so differs by design, and no `__next` table is left. The test walks every registered projection, so a view registered later is checked the same way.
- Criterion 2, REQ-2242: the row count and a SHA-256 of `blobs` and `devices` are the same after a recompute; `explain_cache`, `llm_log`, `art_jobs`, `frames` and `bakeoff` don't exist yet and are absent before and after; the test names all seven, so it checks each one's rows as soon as the task that adds it runs.
- Criterion 3: appends in a loop during a recompute in chunks of 200 printed `appends during recompute: 11, longest wait 0.19 ms, recompute 10 ms`, and `items_view` after the swap holds every appended task. During the year run of criterion 6, 367 appends ran and the longest waited 1.83 ms: an append waits at most for one chunk, not only for the swap.
- Criterion 4: `checkProjections` finds nothing on a clean database, and after one `attempts_view` row's verdict is edited, it reports `projection_diverged` for `attempts_view` with the first differing row as stored and as derived. The function stands in for the check until the task that builds ADR-0190's `npm run verify` calls it.
- Criterion 5: a recompute that throws on its third chunk leaves every projection as it was and no shadow table, and `notices.json` holds `recompute_failed` with the time and `model none, thresholds none, graph none`; the next good recompute clears it. The Mac's Parent Room page shows «Пересчёт не удался (2026-09-27T21:00:00.000Z, …». A recompute failed on its second chunk into a git worktree's `data/snapshots`, and `./meowtower status` there printed `recompute_failed: the recompute at 2026-09-27T21:46:42.762Z (model none, thresholds none, graph none) failed; the old projections stay.`
- Criterion 6: `node --import tsx tests/perf/recompute-year.ts` printed `recompute-year: 183469 events written in 3.2 s; full recompute of 4 tables in 568 ms against the 60,000 ms budget; 367 appends during it, the longest waiting 1.83 ms`. The figure isn't written into ADR-0190's Baselines table, which holds the budget, not the measurements. With the budget set below the time, `recompute_slow` rose once over two recomputes.
- Criterion 7: with the limit injected at 1,024 bytes, `log_large` rose once over two checks, and not at all under the real 1 GB limit.
- Criterion 8: against a server on scratch ports holding the 30-day log, `./meowtower recompute` printed `Recomputed: items_view, attempts_view, adventures, sessions` and `Up to event 2077, in 10 ms.`

Choices this task made, where SPC-0020 left a gap:

- The build runs on the server's connection in chunks of 500 events, each its own transaction, yielding to the event loop between them. What to do says its own connection, but better-sqlite3 is synchronous, so a second connection in the same thread would hold play up just the same; an append waits at most one chunk. It builds up to the head as it stood at the start, since appends go on, and the swap's transaction catches up the rest.
- A projection's `apply` takes the table to fold into, its own or `<name>__next`, and its `CREATE TABLE` is renamed for the shadow, so each projection keeps one definition for its table and every copy of it.
- `projection_diverged` is the function `checkProjections`, ready for ADR-0190's `npm run verify`, which doesn't exist yet; `recompute_slow` is raised by the recompute itself against the 60-second budget.
- The three notices share `data/snapshots/notices.json` with TSK-0080's, and show in `./meowtower status` and on the Mac's Parent Room page. `log_large` is checked at each session's end, since the log grows only with play and a session's end is already when the server takes its snapshot.
- `./meowtower recompute` asks the server through `POST /recompute` on the Parent Room's listener, as `db-snapshot` does, so it runs inside `meowtower`.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- Criterion 3 says no append waits beyond the swap transaction, and What to do says the build runs on its own connection; the build runs in chunks on the server's connection, so an append can wait for one chunk as well, 1.83 ms at most in the year run. Not changed: the criterion and What to do are frozen.
- REQ-2200 and REQ-2242 are shown for the tables that exist today: four projections, and two of the seven service tables. The knowledge-model views REQ-2200 names and the five other service tables come with later epics, and `tests/integration/rebuild.test.ts` checks each as it arrives; the synthetic log stands for ADR-0190's simulated run until that exists. The evidence for the later tables belongs to the tasks that register them, and the simulated run's to the task that builds ADR-0190's simulation; until then REQ-2200 and REQ-2242 are closed for the tables present on 2026-09-27.
- The choices above are statements SPC-0020 doesn't make yet. They wait for an amendment to SPC-0020, which needs the owner's approval and is named in this task's gate report to the owner.

## Left alone

The start-up recompute on a version change and the versioned `node_snapshots` rows (TSK-0270).
