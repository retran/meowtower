---
id: TSK-0735
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-3000, REQ-3006, REQ-3008]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Verify reads the current stage from the record, and a stage opens only after the one before it is accepted

After this task, verify takes the current stage from the project record and from nothing else, so the groups required at that stage follow the stages' acceptance in the order 0, 0.1, 0.15, 0.2, 0.3 and then one backlog item at a time, and the report prints the order in which the stages were accepted.

## Acceptance criteria

1. Given `verify/stages.json` listing the stages in order with the acceptance task of each, and a record in which stage 0's acceptance task is `done` and stage 0.1's isn't, when verify reads the stage, then the current stage is 0.1 and the groups required from 0.1 are required; given stage 0's task isn't `done`, then the current stage is 0 and the later groups report `not_required_yet` (REQ-3008). Closed by: an integration test over two fixture record trees.
2. Given two backlog items whose acceptance tasks aren't `done`, when verify reads the stage, then only the first in the recorded order is current (REQ-3008). Closed by: an integration test.
3. Given an environment variable, a flag or a file other than the record that names a stage, when verify runs, then the gate ignores it, so the building agent can't set the stage. Closed by: an integration test that sets each.
4. Given the record of accepted stages, when the owner reads the report's order of acceptances, then the iPad spike was accepted before any other stage began and the diagnostic core before the game shell (REQ-3000, REQ-3006). Closed by: the owner's judgement from the order of the stage acceptances, because the order is history that a program can print and only a person can weigh.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the stage function and `verify/stages.json`. The file holds the order of the stages and the identifier of each stage's acceptance task. It never holds the current stage, which is computed from the record: the first stage whose acceptance task isn't `done`, and then the backlog items in the latest recorded order, so two epics without acceptance never both count as current. Only the owner's approval of the pull request that marks a stage's acceptance task `done` moves the stage.

Choice this task makes. ADR-0190 speaks of an epic's review record, and the record layout has no review record. Each stage epic ends in an acceptance task, and its Evidence holds the verify report, the checklist result and the acceptance notes; the task is `done` when the owner approves it. TSK-0738 states what that Evidence holds. A stage that passed verify and waits for acceptance is reported as `acceptance_pending` with no timeout.

The stage epics themselves aren't written yet. Until they are, the file holds the stage names and no task identifiers, and the tests use fixture records.

## Depends on

- TSK-0724 (blocking): the runner calls the stage function to decide what is required.

## Evidence

Not yet.

Criterion 4 rests on the owner's judgement, because REQ-3000, REQ-3006 and REQ-3008 are about the order work actually happened in, which no check can bring about in advance.

## Left alone

The method's own `ready` check, which the plugin owns and which reads task dependencies, and the stage epics, which the owner writes as each stage nears.
