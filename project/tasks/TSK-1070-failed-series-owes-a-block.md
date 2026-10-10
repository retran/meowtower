---
id: TSK-1070
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6880, REQ-6882]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A series that isn't confirmed owes a full block and starts again on evidence of relearning

After this task, a node whose series ended «удержание не подтвердилось» returns to ordinary scheduling with a full block owed, and a new series starts only when the node is «устойчиво» again after that block.

## Acceptance criteria

1. Given a series that ends not confirmed, when the Director runs, then the node leaves the hold, `retention_series` records a block owed, and ADR-0070's `escalation` term for the node is 1 until a full block forms (REQ-6880). Closed by: a Director test.
2. Given the owed block that leaves the node «устойчиво», when the Director runs, then a new series starts at check number 1; given a block that leaves it below, then no series starts until the node next reaches «устойчиво» (REQ-6882). Closed by: two Director tests.
3. Given a planned node for which the full recompute at an adventure's end, under the same versions, doesn't give «устойчиво», when the recompute runs, then the Director cancels with reason `state_not_confirmed` and a new series starts when a full recompute next gives the state (the failure state `retention_plan_unconfirmed`). Closed by: a Director test over two recompute results.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the block-owed row to `retention_series` and the new-series trigger to the planner. ADR-0060 requires the per-node update and the full recompute to agree under one version, so the third case is a bug the Director reports to the developer and survives by cancelling.

## Depends on

- TSK-1069 (blocking): the series end it reacts to.

The epic realising ADR-0070 supplies the `escalation` term; a stand-in term with the same name carries the test until it lands.

## Evidence

Not yet.

## Left alone

The report's wording for a failed series, which TSK-1073 builds.
