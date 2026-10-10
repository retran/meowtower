---
id: TSK-1072
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6894, REQ-6896]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Nodes that are already stable get a check at ship time, and a recompute never undoes a plan

After this task, every holdable «устойчиво» node with no series gets a plan when the check ships or when a recompute under a new version makes it stable, and a recompute that moves a held node out of the state leaves its plan and hold standing.

## Acceptance criteria

1. Given 30 holdable nodes that are «устойчиво» with no series when the check ships, when the Director runs, then each gets a plan whose window is 28 to 35 game days after its latest meeting, and a node whose window has already passed gets a plan from the plan's game day to 7 game days after it with `countFrom: plan_day` (REQ-6894). Closed by: a Director test over a fixture log.
2. Given a recompute under a new threshold version that makes a node stable, when the Director runs, then it plans the node as above; given a node waiting for a restart rule after a failed or cancelled series, then the recompute plans nothing for it (REQ-6894). Closed by: two Director tests.
3. Given a held node that a recompute under a new version moves out of «устойчиво», when the Director runs, then its plan and hold stand and the report shows the node's current state beside the series (REQ-6896). Closed by: a Director test and a report test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the ship-time and recompute planning to the planner. The check's facts don't depend on a version, so a recompute changes none of its observations. With 30 such nodes and the cap of 3 a day, the first checks drain over about 10 adventure days and some arrive late; the late mark of TSK-1068 shows that, and the late-share reversal condition of ADR-0400 leaves these plans out.

## Depends on

- TSK-1066 (blocking): the plan and the series.

## Evidence

Not yet.

## Left alone

The restart rules after a failed or cancelled series, which TSK-1070 and TSK-1071 build and this rule respects.
