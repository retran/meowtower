---
id: TSK-0901
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5904, REQ-5906, REQ-5908, REQ-5910]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Track nodes keep an estimate and a state from unassisted first attempts on track tasks alone

After this task, the knowledge model holds a row for each track node and subtype with the same estimate and state rules as a maths node, the row reads only track first attempts, and no track attempt reaches a maths estimate or the «сама» estimate.

## Acceptance criteria

1. Given a fixture log with full blocks of graded unassisted first attempts on I1 and I2, when the model is folded, then each node has a row in `node_estimates` with a BKT estimate, a fluency estimate and a state from `block-low` to `stable`, and the report's labels for it (REQ-5904). Closed by: a model test over the fixture log.
2. Given a log that holds rapid guesses, excluded tasks, ungraded tasks and assisted attempts on a track task beside valid first attempts, when the row is folded, then it equals the row from the valid attempts alone (REQ-5906). Closed by: a model test that compares the two logs.
3. Given random logs, when the answers of the track attempts change, then every maths node's estimate and state stays equal; when the maths attempts change, then every track row stays equal (REQ-5908). Closed by: a property test.
4. Given a log with track attempts and one without, when the «сама» estimate of the graph is read, then it is equal in both (REQ-5910). Closed by: a model test.
5. Given a track subtype, when its prior is set, then it is the 1S prior of the active group row, 0.25 or 0.40; given a region answer on a source with 12 tappable regions, then `pGuess` is 1/12; given any track node, then it takes no probe, no inference and no obligation row (ADR-0300). Closed by: three unit tests.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the model keep a row in `node_estimates` for each track node and each of its subtypes, under every exclusion the model already applies. Make each track template declare its fluency threshold per device type in `content/catalogue.yaml`: 60 s for `find` and `compare` and 90 s for `calculate` and `combine`, until ADR-0180's adult calibration sets them. I chose these starting values, as ADR-0300 did, because reading a source adds about a minute to a task and a maths threshold would label every good block «понимает, нужна скорость».

A track node's state comes from full blocks alone, so it is never inferred and the gate on I5 can't open by inference. Track rows are a stream of their own under the rule on new forms, so none joins «сама» during the MVP. A golden fixture adds a track log, so `RULES_VERSION` moves with the change.

## Depends on

- TSK-0900 (blocking): the track nodes and subtypes the rows belong to.

The epic realising ADR-0060 supplies the model and its state rules; until it exists the task runs on the fold's fixtures and that epic adopts the rows.

## Evidence

Not yet.

## Left alone

The Director's choice of the track node, which TSK-0903 builds. After the MVP, a track row also skips an attempt whose `forms` holds `nl_probe`, which ADR-0430 adds.
