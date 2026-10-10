---
id: TSK-0529
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0984]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A new parameter file replaces the active one only when it predicts held-out attempts better on both log-loss and calibration

After this task, `./meowtower model activate` replays the log with a candidate and with the active version through `tools/eval-model.ts`, predicts each unassisted first attempt of the last 20 % of play days, and writes `model_activated` only when the candidate is lower on log-loss and on expected calibration error.

## Acceptance criteria

1. Given a candidate worse than the active version on held-out log-loss, when `./meowtower model activate` runs, then it refuses, prints both log-loss and both calibration figures, writes no `model_activated` and exits with a non-zero status; given one worse on calibration only, then the same. Closed by: a unit test and the command's output on two fixtures.
2. Given a candidate lower on both whose prior row for another school group differs from the active file's, when the command runs, then it writes `model_activated`, the next start recomputes under the new version, and the estimates take the other row's priors from that recompute and from no earlier moment (REQ-0984). Closed by: an integration test that reads the estimates before and after.
3. Given model v1, when it is activated with no predecessor, then the gate is skipped. Closed by: a unit test.
4. Given a change of the school-group setting, when the model version changes, then no gate runs and no `model_activated` is written. Closed by: a unit test that appends a `settings_changed` event.
5. Given a log, when the evaluation runs, then the held-out days are the last 20 % of play days and each prediction uses only the events before it, with log-loss and expected calibration error over 10 equal-width bins. Closed by: a unit test against a hand-computed log-loss.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `tools/eval-model.ts` and the `model activate` command beside the commands the epic realising ADR-0010 built. The share of 20 % is a choice ADR-0060 records. The refit tool `tools/fit-model.ts` doesn't exist during the MVP, so a candidate file is written by hand.

ADR-0060 names this tool among its new work, and REQ-0980, which it served, is superseded by REQ-7506, which ADR-0460 addresses. This task builds the command, the replay and the two measures; the epic realising ADR-0460 closes REQ-7506 and settles the comparison's detail, so the two tasks meet in the same tool and neither restates the other.

## Depends on

- TSK-0527 (blocking): the recompute the tool replays with a candidate, and `model_activated` handling.
- TSK-0518 (blocking): the validator a candidate passes before it is compared.

## Evidence

Not yet.

## Left alone

The refit of the parameters, which the draft defers until after the MVP, and the admission of new forms and of a depth-of-help reading through the same gate, which ADR-0210's and ADR-0220's epics use.
