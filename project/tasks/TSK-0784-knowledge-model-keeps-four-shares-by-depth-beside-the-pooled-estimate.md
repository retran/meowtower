---
id: TSK-0784
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5136, REQ-5138, REQ-5140, REQ-5142, REQ-5144]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The knowledge model keeps four shares of right answers by depth of help beside the pooled "with help" estimate

After this task, `node_estimates` holds for each node and subtype the share of right answers after rung 1, after rung 2, after rung 3 and on the second attempt, each a beta estimate that weights an attempt by `2^(-age in days / 30)`, the pooled "with help" estimate stays as ADR-0060 defines it, and model v1 reads the depth only in these shares.

## Acceptance criteria

1. Given assisted attempts at each depth, when the shares are read, then the four shares move and the pooled estimate, `pKnow` and fluency move as ADR-0060 says (REQ-5136, REQ-5140). Closed by: a model test over a fixed log.
2. Given every attempt's weight at age 30 days, when the shares are read, then each share gives each attempt half its weight (REQ-5138). Closed by: the model test.
3. Given the shares' observations, when they are added up, then they equal the pooled estimate's observations, because each share starts at `α = β = 1` with the pooled estimate's score and weight (REQ-5138, REQ-5140). Closed by: the model test.
4. Given a search of model v1's code, when it looks for a read of the depth of help, then it finds the shares only (REQ-5142). Closed by: a static test that lists the reads of `hintLevel` in `src/engine/projections/knowledge.ts`.
5. Given a candidate model version that reads the depth in an estimate, when ADR-0060's activation rule runs without lower log-loss and lower calibration error on held-out days, then the version isn't activated (REQ-5144). Closed by: the activation rule's test with a fixture version.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add four beta shares to the `node_estimates` projection for each node and subtype. A first attempt counts at its deepest rung, `hintLevel`; a second attempt counts in the fourth share whatever hint it used. I chose the pooled estimate's score and weight, as ADR-0220 states, so the four shares' observations add up to the pooled estimate's. The pooled estimate stays, because the report's «решает с подсказкой» (solves with a hint) and «почти готово» (nearly ready) read it.

The activation gate of ADR-0060 already is the test REQ-5144 names; this task adds the fixture and the assertion that a version reading depth goes through it.

## Depends on

- TSK-0772 (blocking): `hintMaxLevel` and `hintLevel` in the attempt payload the shares read.

The epic realising ADR-0060 supplies the knowledge model and its activation rule; this task adds the shares to it in `src/engine/projections/knowledge.ts`.

## Evidence

Not yet.

## Left alone

A model version that reads the depth, which waits for play data and the refit after the MVP, and the report's wording of the shares.
