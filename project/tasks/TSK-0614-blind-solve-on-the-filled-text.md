---
id: TSK-0614
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0120
closes: [REQ-0616]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A blind solver reads the filled explanation with the task alone, and its answer must equal the engine's

After this task, check 7 gives `LIVE_CHECK_MODEL` the task text and the filled explanation only, compares its free-form final answer with the engine's through the engine's own answer checker, and a stored variant gets the same solve again with the current task's numbers each time it is shown.

## Acceptance criteria

1. Given a filled explanation whose wording leads to a different answer, when the blind solve runs, then it is rejected (REQ-0616). Closed by: a unit test with a mocked solver that answers wrongly.
2. Given a solver answer `6/10` for an engine answer `3/5`, when they are compared, then the engine's answer checker accepts it, so fractions and other forms compare as her own answers do (REQ-0616). Closed by: a unit test.
3. Given every request to `LIVE_CHECK_MODEL` for explanations, when the bodies are read, then each holds the task text and the explanation and nothing else, no answer and no list of options (REQ-2606's content). Closed by: a test over the recorded requests.
4. Given a stored variant, when it is shown, then one more blind solve runs with the current task's numbers, and a failure keeps the variant stored, records the failure against it and shows the template explanation. Closed by: an integration test with a solver that fails once.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add check 7 to the module of TSK-0612 and the reuse solve at show time. The reuse solve costs about $0.002 and is the price of REQ-0616 holding for the text she sees. The solver states a final answer in free form, which the engine's checker of EPC-0040 parses.

## Depends on

- TSK-0612 (blocking): check 7 is a step of that module and runs on the filled text.

The epic realising ADR-0040 supplies the answer checker for every kind; until it exists this task compares number answers by value with the checker the answer route already uses. The epic realising ADR-0100 owns the `ExplainRequest` and `BlindCheckRequest` classes this task uses.

## Evidence

Not yet.

## Left alone

An explanation whose words name the wrong operation between correct numbers, which the blind solver can't catch and the parent's hide control of TSK-0619 answers.
