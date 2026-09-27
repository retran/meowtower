---
id: TSK-0270
artifact: task
status: approved
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

Not yet.

## Left alone

The knowledge model and what its projections compute, which ADR-0060 defines. The game projections named in criterion 2, which their owning epics register; until then criterion 2 checks the tables that exist and is run again when they do.
