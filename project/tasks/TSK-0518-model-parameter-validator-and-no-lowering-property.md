---
id: TSK-0518
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0986]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A parameter file that could let a right answer lower the estimate never loads

After this task, the model loads a parameter file only after a validator confirms `pGuess + pSlip < 1` and `pLearn < 1 - pSlip / (1 - pGuess)` for every answer form and number of steps in the catalogue, and a property test finds no parameter set that passes the validator and lowers `p` on a right answer.

## Acceptance criteria

1. Given a parameter file whose `pGuess` plus `pSlip` is 1 or more for one template, when the model loads it, then the load fails with `model_params_invalid`, the error names the template and the bound, the server keeps the active version, and the activation command exits with a non-zero status (REQ-0986). Closed by: a unit test and the command's exit status.
2. Given a file whose `pLearnFeedback` breaks `pLearn < 1 - pSlip / (1 - pGuess)` for one template and number of steps, when it loads, then it fails naming that bound (REQ-0986). Closed by: a unit test.
3. Given random parameter sets that pass the validator and every template of the catalogue, when 10,000 cases each apply a right observation to a random `p`, then `p` after the observation is never below `p` after forgetting (REQ-0986). Closed by: a property test in Vitest with fast-check.
4. Given the v1 file, when it loads, then it passes the validator for every template of the catalogue. Closed by: the unit test's report.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the validator to `src/engine/model/params.ts` and call it before any parameter file takes effect. It checks both bounds for every answer form and number of steps the catalogue holds, with both learning rates, because a paragraph can't stop a bad file from loading. Add `fast-check` as a development dependency.

Until the epic realising ADR-0040 has written the catalogue's templates, the validator runs over the fixture templates and over a table of every answer form and step counts 1 to 6; it runs over the real catalogue once that exists.

## Depends on

- TSK-0517 (blocking): the update whose bounds the validator guards.
- The epic realising ADR-0040 supplies the catalogue of templates, with their answer forms and step counts.

## Evidence

Not yet.

## Left alone

The held-out gate that refuses a new parameter file on its predictions, which TSK-0529 builds.
