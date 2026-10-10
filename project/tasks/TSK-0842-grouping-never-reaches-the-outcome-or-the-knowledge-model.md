---
id: TSK-0842
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5510, REQ-5538, REQ-5540]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The grouping score never reaches the outcome, and no model version reads a grouping attempt during the MVP

After this task, a property test finds the outcome, the streak, the estimates, the node states, blocks, probes and the graded count unchanged when grouping scores and links change, and no model version in the MVP lists `grouping` in its `admittedForms`.

## Acceptance criteria

1. Given random logs of grouping attempts, when only the links and scores are changed, then the outcome, the streak, `node_estimates`, `node_snapshots`, blocks, probes and the graded count are unchanged (REQ-5510, REQ-5538). Closed by: the property test's report.
2. Given an attempt whose `item_shown.forms` holds `grouping`, when the knowledge model runs, then the attempt is dropped from the "on her own", fluency and "with help" estimates, blocks, probes and states, and the solution it shows still writes `solution_shown` and marks later tasks of the host node `postFeedback`. Closed by: a model test over a fixture log.
3. Given the active model version in the MVP, when its `admittedForms` is read, then it is empty of `grouping`, and a test that tries to activate a version that admits it fails (REQ-5540). Closed by: a model test and a static check of the version file.
4. Given a grouping task and an ordinary task with the same verdict, when the outcome is computed, then both are equal, and no code path passes the score to the outcome function. Closed by: the model test and the module's import graph.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0210's rule for a form outside `admittedForms` to `grouping`, extended to the fluency and "with help" estimates, as ADR-0260 amends ADR-0060. The game still scores the task as any scored task, with an outcome, a badge, the streak, the shard and the room and floor shares, so a grouping task isn't visibly worth less than its neighbours.

## Depends on

- TSK-0839 (blocking): the property test varies the events this task's route writes.

The epic realising ADR-0060 supplies the estimator and its activation rule, and the epic realising ADR-0210 supplies `admittedForms`. The refit tool that could admit `grouping` comes after the MVP.

## Evidence

Not yet.

## Left alone

The rational calculation stream, which TSK-0843 builds, and the reward, which TSK-0844 builds.
