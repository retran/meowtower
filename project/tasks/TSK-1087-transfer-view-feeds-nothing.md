---
id: TSK-1087
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0410
closes: [REQ-6964, REQ-6966]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The transfer view feeds no estimate, state, probe or block, and a first encounter still counts in «сама»

After this task, a first-encounter attempt counts in the «сама» estimate as an ordinary task of its node, and no code that computes an estimate, a state, a probe or a block reads `first_exposures`.

## Acceptance criteria

1. Given a first-encounter attempt, when the node's «сама» estimate is computed, then the attempt counts as an ordinary task, and the estimate equals the one computed with the projection removed (REQ-6964). Closed by: a unit test over a fixture log.
2. Given random logs, when a property test computes `node_estimates`, `node_snapshots`, probes and blocks with and without the `first_exposures` table, then they are byte-identical (REQ-6966). Closed by: the property test.
3. Given a file under `src/engine/model/` or `src/engine/states/` that imports `first_exposures`, when lint runs, then `model_reads_no_transfer` fails and names the file (REQ-6966). Closed by: the rule's fixture test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the lint check `model_reads_no_transfer` and the property test. The holds read the used sets and the node's tested state and nothing else, and the report reads the rows; no other consumer exists. First-encounter attempts need no special case in the model, because they already count once as ordinary tasks, so the task only proves that nothing special was added.

## Depends on

- TSK-1084 (blocking): the check and the property test need the projection.

The epic realising ADR-0060 supplies `node_estimates` and `node_snapshots`; the property test runs on fixtures of both until it exists.

## Evidence

Not yet.

## Left alone

The report, which reads the rows and is TSK-1089's, and the holds' reads of tested state, which TSK-1080 and TSK-1081 already restrict to used sets and states.
