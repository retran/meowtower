---
id: TSK-1051
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6752, REQ-6754, REQ-6762, REQ-6764]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The model building bar counts a Guardian problem's modelling phase, and plan labels enter only after a check

After this task, the model building bar counts one observation for each Guardian problem with a modelling phase, shows how many steps each problem had, and takes plan labels into its success only while the plans logged so far show they measure something.

## Acceptance criteria

1. Given a Guardian problem answered unassisted in its modelling phase with a right model choice and right entered steps, when the bar is built, then it is one success; given a problem with no model choice, no step input and no readable plan, and one assisted during its modelling phase, then neither enters the bar (REQ-6752). Closed by: a fixture log with the three problems.
2. Given problems of 2, 3 and 3 steps, when the bar is built, then it shows how many problems had each number of steps (REQ-6754). Closed by: a unit test.
3. Given a log with 9 `correct` plans, 1 of them followed by a wrong answer, and 12 faulty plans, 6 of them followed by a wrong answer, when the bar is built, then no plan label is in the bar and the count of plans in the window shows under it; given a tenth `correct` plan followed by a right answer, then the labels enter the bar (REQ-6762, REQ-6764). Closed by: two fixture logs.
4. Given a log where the rates later reverse, when the bar is built again, then the labels leave the bar (REQ-6762). Closed by: a third fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/model-building.ts`. Run the plan check at each computation over every `plan_submitted` in the log, with thresholds of at least 10 `correct` plans, at least 10 faulty plans, and wrong answers following `correct` plans less often than faulty ones. The label changes no credit, outcome, success share, holding-steps value or skill estimate (REQ-5644 stays as approved).

## Depends on

- TSK-1045 (blocking): a Guardian problem whose `forms` names `plan` is routed to this bar.
- TSK-1046 (blocking): the windows.
- TSK-1047 (blocking): the bar builder.

The epic realising ADR-0270 supplies `plan_submitted` and its label, and the epic realising ADR-0040 the Guardian problems; fixtures stand in.

## Evidence

Not yet.

## Left alone

The Director's note and step-count wording on the screen, which TSK-1054 and TSK-1055 own.
