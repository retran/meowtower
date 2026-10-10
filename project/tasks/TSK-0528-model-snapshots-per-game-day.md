---
id: TSK-0528
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0904, REQ-0906]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# One snapshot is saved for each game day of play, and a version change keeps the earlier versions' snapshots

After this task, the full recompute at the end of an adventure writes one snapshot of every node estimate and state for that game day, keyed by the game day and the four versions, and a recompute under new versions rewrites every past play day under them and leaves the earlier versions' rows in place.

## Acceptance criteria

1. Given two adventures on one game day and one on the next, when snapshots are read, then there is one row set per game day, the second adventure of the first day overwrites that day's rows, and a game day without play has none (REQ-0906). Closed by: an integration test over three adventures.
2. Given snapshots under rules version 1, when `RULES_VERSION` becomes 2 and the recompute runs, then every past play day has rows under version 2 and the version 1 rows are unchanged, and the recompute deletes only rows of the active versions before it rewrites them (REQ-0904). Closed by: an integration test that compares both row sets.
3. Given the earlier version's code is absent, when a full recompute runs, then it rebuilds the active version's rows alone and the earlier rows stay as they were. Closed by: an integration test.
4. Given `node_snapshots` above 2 million rows, when `./meowtower status` runs, then it reports `snapshot_ceiling` once and no row is deleted. Closed by: a unit test with the ceiling set low.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change `node_snapshots` of `src/engine/projections/knowledge.ts` from its stand-in shape, a row per node and event, to one row per node, game day of play and set of four versions, with the estimate and state fields of `node_estimates`. The game day is the one the epic realising ADR-0090 supplies; `src/shared/game-day.ts` holds its computation. Keep the table registered in the `knowledge` class so the rebuild check covers it.

Earlier-version snapshots are the one derived data the log can't rebuild alone, because rebuilding needs the earlier code and parameter files. The model files are never deleted, and the database snapshots of ADR-0010 hold the table with every other.

## Depends on

- TSK-0527 (blocking): the recompute whose output the snapshot records.

## Evidence

Not yet.

## Left alone

What the report draws from the snapshots, which ADR-0180's epic builds, and any automatic draining of old versions, which ADR-0060 rules out because deleting them destroys the comparison REQ-0904 keeps them for.
