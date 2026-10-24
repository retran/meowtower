---
id: TSK-1180
artifact: task
status: done
revised: 2026-10-24
realises: ADR-0510
closes: [REQ-0984, REQ-7506]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `./meowtower model activate` writes `model_activated` only for a candidate that beats the active version, and the latest event names the model at start

After this task, the catalogue holds `model_activated` v1 with the gate figures, the parent's command sends a candidate file to the server, and the server writes the event only when the candidate has lower held-out log-loss and lower calibration error than the active version. At start the server takes the model version from the latest event, falling back to `content/versions.json` while the log holds none (ADR-0510, REQ-7506, REQ-0984).

## Acceptance criteria

1. Given a payload with `modelVersion`, `previous`, `heldOutAttempts` and both figures, when the event is validated, then it is accepted; given no candidate figures, then it is refused. Closed by: `tests/unit/item-included.test.ts`, and every field has a description in `tests/unit/event-schemas.test.ts`.
2. Given a candidate worse than the active version on log-loss or on calibration, when the command runs, then it prints both figures, writes no event and exits non-zero. Closed by: `tests/integration/model-activate.test.ts` and the reply format of `tools/eval-model.ts`.
3. Given a candidate lower on both, when the command runs, then the event is written with the figures. Closed by: `tests/integration/model-activate.test.ts`, which compares the outcome with the figures of each candidate.
4. Given no active model, when the first version is activated, then the gate is skipped and the event carries no earlier figures. Closed by: `tests/integration/model-activate.test.ts`.
5. Given the active version again, or a file the validator refuses, when the command runs, then it writes no event. Closed by: `tests/integration/model-activate.test.ts`.
6. Given a log, when the evaluation runs, then the held-out days are the last fifth of the play days, rounded up, and each prediction uses only the events before it. Closed by: `tests/unit/model-evaluate.test.ts`.
7. Given a log holding a `model_activated` event for version `v2`, when the server starts, then it uses `v2` as the model version. Closed by: the start-up code in `src/server/main.ts`, read in review; no test starts a server on such a log yet.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the event to `src/shared/events.ts` (the catalogue already lists the name), `POST /model/activate` to the parent listener, `activateModel` in `src/server/model-activate.ts`, `tools/eval-model.ts` and the `model activate` command in `meowtower`. The decision and the figures come from `src/engine/model/evaluate.ts`. Read the latest event in `src/server/main.ts` before the versions are set.

## Depends on

- TSK-0527 (not blocking): the start-up recompute that applies the new version.
- TSK-0518 (blocking): the validator a candidate passes first.

## Evidence

Closed by the tests in tests/unit/item-included.test.ts, tests/unit/event-schemas.test.ts, tests/unit/model-evaluate.test.ts and tests/integration/model-activate.test.ts, and by the stages of the repository run on this branch, whose outcomes are in pull request 20.

Criterion 7 rests on reading `src/server/main.ts`: no test starts a server on a log holding the event. The command's printed reply is formatted by `tools/eval-model.ts report`, which no test runs.

## Left alone

The refit tool that writes candidate files, and who may run the command.
