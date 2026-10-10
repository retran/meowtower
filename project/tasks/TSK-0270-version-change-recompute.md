---
id: TSK-0270
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2230, REQ-2224]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A version change recomputes at start-up, and logged decisions stay fixed under a new model

After this task, `meowtower` runs a full recompute at start-up when the model or threshold version in the content files differs from `derived_meta`, `node_snapshots` keeps rows of earlier model versions beside the new ones, and a check keeps game projections from importing the knowledge model, the Director or the answer check.

## Acceptance criteria

1. Given a database computed under model version A, when `meowtower` starts with content files naming model version B, then it runs a full recompute and every `derived_meta` row names B; and the same holds for a threshold version change. Closed by: `tests/integration/version-change.test.ts`.
2. Given the 30-day log recomputed under a second model version, when the test compares tables, then `inventory`, `progress`, `outcomes`, `threads`, `familiars` and `reward_queue` are identical to those under the first, and `node_snapshots` holds rows under both versions, each row carrying its model, threshold and graph versions. Closed by: the same test, on the synthetic log now and on ADR-0190's simulated run once the game projections exist.
3. Given a module under the game projections that imports the knowledge model, the Director or the answer check, directly or through a module both sides import, when the lint verb runs, then it fails naming the import chain. Closed by: `tests/unit/static-checks.test.ts` with a fixture for each case, the shared helper included.
4. Given unchanged versions, when `meowtower` starts, then it runs no recompute. Closed by: the same integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the start-up comparison of the content files' model and threshold versions with `derived_meta`, which runs TSK-0260's recompute. Give `node_snapshots` its version columns and make the recompute add rows under the new version and keep the old ones. Until ADR-0060's model exists, the test registers a stand-in knowledge projection whose output depends on the model version, so the test can see estimates change and game tables stay. Add the import rule to `tools/static-checks.ts`, following imports transitively, as ADR-0020's premortem requires.

## Depends on

TSK-0260, because the start-up recompute is that task's recompute.

## Evidence

Collected on 2026-09-28 on the Mac. Criteria 1, 3 and 4 hold. Criterion 2 holds only for the game tables that exist today, `items_view`, `attempts_view`, `adventures` and `sessions`, none of which holds an outcome, a reward or a branch yet; see the open findings.

- Verbs: `meow-verbs run format lint check test build` exited 0; 37 test files, 348 Vitest tests and 13 Playwright tests passed. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees are cited from `git write-tree`: `src` `45b56bafeb8dc62aff2dd3d42ac27f551706aee7`, `tests` `67ff98cd3964251711233c288fa294101e2d13fa`, `tools` `175698b97dba844d6d2f352e0adfb1ff75bfd13d`, `content` `a7564c5326383cf58f8b2e8908419b78a9444471`.
- Seen failing first, each break alone and restored: with the start-up comparison skipped, both version-change tests failed; with a change always reported, the unchanged-versions test failed; with the recompute not keeping other versions' rows, the REQ-2224 test failed; with the import rule following no import, its three fixtures failed; with `items_view` folding the model version into a column, the REQ-2224 comparison failed on `items_view`, so the check catches a game table that reads the model.
- Criterion 1, REQ-2230: `tests/integration/version-change.test.ts` computes the synthetic 30-day log under model `A` and starts the real server (`src/server/main.ts`, spawned) with a content file naming model `B`; it printed `startup_recompute: now model B, thresholds t1, graph none` before listening, and every `derived_meta` row, one per registered projection, then names `B`. With only the threshold version changed, from `t1` to `t2`, the same happens.
- Criterion 2, REQ-2224: under a stand-in knowledge model whose values depend on the model version, a recompute under `B` leaves `items_view`, `attempts_view`, `adventures` and `sessions` identical in every column but `computed_at`, and printed `node_snapshots A: 600 rows, mean 0.545; B: 600 rows, mean 0.68`: rows under both versions, each carrying its model, threshold and graph versions.
- Criterion 3: `tests/unit/static-checks.test.ts` fails a game projection importing `src/engine/model/`, one reaching `src/engine/director/` through a helper in `src/engine/util/`, named as the chain `src/engine/projections/rewards.ts -> src/engine/util/shared.ts -> src/engine/director/pick.ts`, one importing `src/engine/states/`, and one importing `src/shared/answer.ts`; it passes a type-only import and a knowledge projection that reads the model. The lint verb now prints `game_projection_imports followed the runtime imports of each game projection…` and finds nothing in this repository.
- Criterion 4: with the versions unchanged, the server printed no `startup_recompute`, and every `derived_meta` row, its `computed_at` included, is as before.

Choices this task made, where SPC-0020 left a gap:

- The versions come from `content/versions.json`, all `none` today, until ADR-0060's model and threshold files and ADR-0050's graph file name their own; `MEOWTOWER_VERSIONS` points a test elsewhere. The server loads them before it opens the database, because a table rebuilt at open records them.
- A start-up recompute that fails leaves the old projections, raises `recompute_failed` and lets the server start, as SPC-0020's failure table has it for any recompute.
- `node_snapshots` is registered now with its version columns and no model, so it stays empty until ADR-0060's model is set with `useKnowledgeModel`; a projection marked `versioned` keeps other versions' rows through a recompute, and the divergence check compares its current versions' rows only, because the other versions' rows are kept on purpose and a fresh derivation can't produce them.
- The start-up comparison reads the model and threshold versions, as SPC-0020 says; a graph version change recomputes nothing yet, and ADR-0050's epic, which gives the graph its version, adds it to the comparison.
- The import rule starts from every module in `src/engine/projections` but the knowledge projections, which are meant to read the model, and the registry, which imports every projection by design; the forbidden targets are `src/engine/model/`, `src/engine/states/`, `src/engine/director/` and `src/shared/answer.ts`, where ADR-0060, ADR-0070 and ADR-0040 put them.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- REQ-2224 guards logged outcomes, rewards and branches, and criterion 2 names `inventory`, `progress`, `outcomes`, `threads`, `familiars` and `reward_queue`, none of which exists yet. The test compares every registered game projection, so each of those tables is checked once its owning epic (ADR-0080's, ADR-0140's) registers it; until then REQ-2224 is shown only for the four tables above, and EPC-0020's criterion 4 with it. The rerun proves something only when the log fills those tables, so it runs on ADR-0190's simulated run; no task in those epics exists yet to name. Not changed: `closes:` and the criterion are frozen.
- Criterion 3 names the knowledge model, the Director and the answer check; the rule also forbids `src/engine/states/`, where ADR-0060 puts the model's state rules, and a fixture now covers it. Not changed: the criterion is frozen.
- The choices above are statements SPC-0020 doesn't make yet. They wait for an amendment to SPC-0020, drafted on its own branch for the owner's approval right after this task's commit.

## Left alone

The knowledge model and what its projections compute, which ADR-0060 defines. The game projections named in criterion 2, which their owning epics register; until then criterion 2 checks the tables that exist and is run again when they do.
