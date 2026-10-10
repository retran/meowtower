---
id: TSK-0250
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-3802, REQ-2232, REQ-2228]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The projection registry, `derived_meta`, the flat views, corrections, and the start-up rebuild of a missing table

After this task, projections are registered functions that `appendEvents` applies in the log's own transaction, each records its versions, last `seq` and time in `derived_meta`, the first two projections `items_view` and `attempts_view` apply corrections as new events, and `meowtower` rebuilds any missing projection table at start-up before it accepts a play request.

## Acceptance criteria

1. Given events appended through `appendEvents`, when the test reads `derived_meta`, then each projection's row holds the model, threshold and graph versions from the content files, the `seq` of the last event appended and a UTC time. Closed by: `tests/unit/projections.test.ts`.
2. Given an `item_shown` and its attempt events, when they are appended, then `items_view` holds one row per task shown and `attempts_view` one row per attempt, in the same transaction as the events. Closed by: the same test, which makes a projection throw and finds neither the events nor the rows.
3. Given an `item_excluded` or `item_flagged` event for a task, when it is appended, then that task's rows in `attempts_view` and `items_view` show it excluded or flagged, and the original `item_shown` and `verdict` events are byte-for-byte unchanged. Closed by: the same test.
4. Given `items_view` has been dropped, when `meowtower` starts, then it rebuilds the table from the log before the first play request is accepted, and the rebuilt rows equal the rows before the drop in every column except `computed_at`. Closed by: a start-up test that sends a request during start-up and finds it waiting or refused until the rebuild ends.
5. Given a projection module, when a test calls it twice on the same events and content files with the clock and random source replaced, then both results are equal, and the lint verb finds no import of a clock, random or network module in `src/engine/projections/`. Closed by: the same test and the lint verb's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection registry, the `derived_meta` table, and the hook in `appendEvents` that applies each new event to every registered projection inside its transaction. Add `items_view` and `attempts_view` with the columns of RES-2550's `AttemptView` that the events of TSK-0210 and TSK-0220 supply, plus `excluded` and `flagged`. Add the start-up step that finds a registered table missing and rebuilds it by replaying the log, after the schema check of TSK-0210 and before the listeners accept play. This task applies `item_flagged`, ADR-0020's own type, and `item_excluded`, ADR-0180's, to its two views; the epic realising ADR-0180 applies `parent_tag_removed` to the projection `parent_tags` it registers.

## Depends on

TSK-0210 and TSK-0220, because the flat views fold the task, attempt and parent-action events those tasks define.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 26 test files, 270 Vitest tests and 2 Playwright tests passed. The crash test still keeps 100 of 100 writes and 100 of 100 answers.
- Seen failing first: `tests/unit/projections.test.ts` couldn't load before `src/engine/projections/` existed. `tests/unit/projection-rebuild.test.ts` failed on its first run because the server exited at start-up with `This database connection is busy executing a query`: the replay iterated the log while writing rows. The replay now reads the log in pages of 1,000 events, and the test passes.
- Criterion 1, REQ-3802: `derived_meta` has one row per registered projection with the model, threshold and graph versions, `last_seq` equal to the last appended event's `seq`, and a UTC `computed_at`. The model, threshold and graph files don't exist yet, so each version is recorded as `none` (`VERSIONS` in `src/engine/projections/registry.ts`) until the epics realising ADR-0060, ADR-0140 and ADR-0050 supply them.
- Criterion 2: `items_view` holds one row per task shown and `attempts_view` one row per attempt; with a registered projection that throws, `appendEvents` writes neither the events nor any row, because the folds run inside the log's transaction.
- Criterion 3, REQ-2228: `item_flagged` and `item_excluded` set `flagged` and `excluded` on the task's rows in both views, and the task's `item_shown`, `attempt_submitted` and `verdict` payloads read the same before and after.
- Criterion 4, REQ-2232: with `items_view` dropped from a log of 50 tasks and one exclusion, the real start (`main.ts`) refused connections while it rebuilt, then listened with `items_view` holding the same rows in every column but `computed_at`.
- Criterion 5: two databases folding the same events give equal rows apart from `computed_at`; the lint check `projection_purity` finds no `Date.now`, `new Date(`, `Math.random`, `performance.now`, `fetch(` or network module in `src/engine/projections/`, and names a fixture that reads the clock. The fold time comes from `appendEvents` as an argument.
- Changed on the way: Playwright's server takes its snapshots in `/tmp`, because a pending migration on its leftover database tried to snapshot into `/data/snapshots`, which exists only in the container.

## Left alone

The full recompute and the shadow tables (TSK-0260). The game and knowledge projections, which the epics realising ADR-0030, ADR-0060, ADR-0140 and ADR-0180 register in this registry.
