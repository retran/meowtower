---
id: TSK-0527
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0900, REQ-0902]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The model runs after each graded attempt, recomputes everything at the end of an adventure and recomputes again when a version changes

After this task, the server runs the knowledge model at three moments: a per-node update after each graded first attempt, a full recompute over the whole log when an adventure ends, and a full recompute at start-up when the model, thresholds, rules or graph version differs from the one the rows record, so a per-node shortcut never leaves a lasting difference.

## Acceptance criteria

1. Given a log, when `node_estimates` and the active-version rows of `node_snapshots` are deleted and a full recompute runs, then the tables' hash equals the hash before the deletion (REQ-0900). Closed by: an integration test that hashes both tables.
2. Given a per-node update after a graded first attempt, when the adventure ends and the full recompute runs, then every row the update wrote equals the row the full recompute writes, and a deliberately wrong update in a fixture is replaced (REQ-0900). Closed by: an integration test over a simulated adventure.
3. Given a rows' recorded versions and a changed `RULES_VERSION`, when the server starts, then a full recompute runs and the count of earlier-version rows in `node_snapshots` is the same before and after it (REQ-0902). Closed by: an integration test for each of the four versions.
4. Given a rule's output that changes with `RULES_VERSION` unchanged, when the golden test runs, then it fails naming the fixture. Closed by: a unit test with one edited rule.
5. Given a synthetic log of 365 play days, when a full recompute runs, then it finishes within 10 seconds, and a per-node update takes at most 50 ms at the 95th percentile, on the family Mac or its stand-in, and a recompute above its budget finishes and shows `recompute_slow` once per version set in `./meowtower status`. Closed by: the timing test's output beside ADR-0190's baselines.
6. Given a recompute that fails, when the report reads the model, then the previous projections stay, `recompute_failed` is raised and the next adventure end and start retry it; given a per-node update that fails, then the Director keeps the node's last estimate and the end-of-adventure recompute replaces it. Closed by: an integration test that injects a failure into each.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Wire the model of TSK-0516 to TSK-0526 into the projection registry the epic realising ADR-0020 built, as a `knowledge` projection, replacing the stand-in `useKnowledgeModel` hook in `src/engine/projections/knowledge.ts` or extending it, whichever keeps that epic's rebuild test green. The model takes the log, the graph, `content/model.vN.json`, the threshold version and the rules version, and does no input or output of its own.

Evaluate forgetting at the server time of the event that triggered the run; for a run no event triggers, such as the one at start-up, evaluate it at the server time of the newest event, so a recompute at a later hour gives the same projection (ADR-0370). Record all four versions on every row with the last event sequence number it counted.

## Depends on

- TSK-0526 (blocking): the full set of rows the run writes, estimates, states, inference and obligations.
- TSK-0521 (blocking): the beta estimates that are part of every row.
- The epic realising ADR-0020 supplies the registry, the version-change recompute and the rebuild check.

## Evidence

Not yet.

## Left alone

The time of the end of an adventure and the game day, which the epic realising ADR-0090 supplies, and the report's «Отчёт обновлён» line, which ADR-0180's epic draws from the recompute's last good time.
