---
id: TSK-0855
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5600, REQ-5602, REQ-5604, REQ-5608, REQ-5610, REQ-5648, REQ-5670]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The item builder gives every first-shown word problem its opening phase and input form from fixed counters

After this task, the projection `word_problem_cycle` counts first-shown T2 to T4 word problems from `item_shown.openingPhase`, the phase is slot `n mod 8` of the cycle none, model, none, none, plan, none, model, the input is step-by-step when `n` is even, and a second counter gives every fourth T1 problem a model choice.

## Acceptance criteria

1. Given a simulation of 30-day play with the ten profiles of ADR-0190, twins, riddles and at most one forced `plan_unavailable` slot in every 8 compound problems, when the shares are counted, then in every run of 8 or more consecutive compound problems the plan share, the model share, the plan step-input share and the T1 model share are inside their bands (REQ-5608, REQ-5610, REQ-5670). Closed by: the simulation's report.
2. Given the same runs, when each problem is read, then none has both a model choice and a plan, and no T1 problem has a plan (REQ-5600, REQ-5602). Closed by: the simulation's report.
3. Given a Guardian's problem, a room's problem and an unanswerable problem, when the phase is chosen, then each follows the same cycle (REQ-5604). Closed by: a unit test.
4. Given a plan that can't be built, when the generator returns `plan_unavailable`, then the problem logs it, opens with no phase and the plan moves nowhere, per ADR-0360. Closed by: a unit test and a simulation fixture with forced unavailability.
5. Given `item_shown` and `attempt_submitted` of a word problem, when they are read, then each carries `openingPhase` as `none`, `model` or `plan`, an older event reads as `none`, and a second attempt and a composed riddle don't advance the counter (REQ-5648). Closed by: a schema test and a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection and the two counters, `word_problem_cycle` and `word_problem_cycle_t1` per ADR-0370, to the item builder and the optional field to the events inside ADR-0210's one version 2 (ADR-0360). A fixed cycle holds the bands in every 30-day window, which a seeded random draw can't. The verify report names a template once when its share of `plan_unavailable` passes 1 % over 30 days, and again only when the share rises, per ADR-0460.

## Depends on

- TSK-0852 (blocking): `plan_unavailable` comes from the plan builder.

The epics realising ADR-0040, ADR-0070 and ADR-0190 supply the item builder, the Guardian and room paths and the simulation harness; the counters run on fixture problems until they land.

## Evidence

Not yet.

## Left alone

The plan's grading and flow, which TSK-0854 and TSK-0856 build, and the model choice's own build, which ADR-0040's epic owns.
