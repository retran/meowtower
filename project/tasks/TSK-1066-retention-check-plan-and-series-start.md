---
id: TSK-1066
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6838, REQ-6866, REQ-6888]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A holdable node that first reaches «устойчиво» gets a logged plan that opens its series

After this task, the Director writes `retention_check_planned` when a holdable node first reaches «устойчиво», the projection `retention_series` turns the plan into a due window, and the check's attempt counts as an ordinary review attempt.

## Acceptance criteria

1. Given a holdable node with no open and no confirmed series that first reaches «устойчиво», when the Director next runs, then it logs `retention_check_planned` with `nodeId`, a new `seriesId`, `checkNumber` 1, `anchorDate` as the game day the node reached the state under the versions active, `countFrom` `latest_meeting`, `fromDays` 28, `toDays` 35 and `holdStarts` `now` (REQ-6838). Closed by: a Director test over a fixture log.
2. Given a node that is «устойчиво» with an open series, and one with a confirmed series, when the Director runs, then it writes no plan for either (REQ-6838). Closed by: a Director test.
3. Given a plan and the node's latest meeting before the hold starts, when `retention_series` runs, then the due window is 28 to 35 game days after that meeting, or after the plan's game day with `countFrom: plan_day`, and every retention observation of the node from the plan on counts, natural ones included (REQ-6866). Closed by: a projection test.
4. Given a retention check answered `clean`, when the knowledge model runs, then "on her own", the fluency estimate and the state rules change as for the same attempt shown with the purpose review, `forms` is empty and no new stream is written (REQ-6888). Closed by: a comparison test of the two logs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the schema of `retention_check_planned` to `src/shared/events.ts` with `owner: "ADR-0400"`, the projection `retention_series` and the Director's planner step. The planner writes at its next call after the per-node update of ADR-0060 that produced the state, so the hold starts in the same session. The payload stores the rule and not the dates, because the start point of a plan written with `holdStarts: after_review` doesn't exist yet when the plan is written. The check's `why` field names the plan's `seriesId` and `checkNumber`, which is the audit of the Director RES-4220 asked for.

The schema is a post-MVP trace that ADR-0380's scope guard fails on in the MVP tree, so this task lands in the stage that builds retention checks.

## Depends on

- TSK-1064 (blocking): the series counts the retention observations.
- TSK-1065 (blocking): the planner skips exempt nodes.

The epic realising ADR-0070 supplies the Director's `nextTask` and `planFloor`, and the epic realising ADR-0380 supplies the event-owner table; this task adds its entry where the table exists and the schema's `owner` field beside it.

## Evidence

Not yet.

## Left alone

The hold, which TSK-1067 builds, placement, which TSK-1068 builds, and what the series does after an observation, which TSK-1069 builds.
