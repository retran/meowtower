---
id: TSK-1008
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-0204, REQ-0208, REQ-5024, REQ-5026, REQ-5608, REQ-5642, REQ-5644, REQ-5646, REQ-5664, REQ-6422]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A plan has its own route and draft, the band counts problems chosen for a plan, and an untested form stays out of every estimate

After this task, `POST /api/item/:itemId/plan` logs `plan_submitted`, the client's partly laid plan travels as `plan_draft` and a resume restores it, 20 % to 30 % of compound word problems are chosen to open with a plan, and an attempt with a form outside `admittedForms` drops from every estimate, state, probe and block.

## Acceptance criteria

1. Given a plan submitted for an item, when the route is called, then it appends `plan_submitted` with the label and the choice, and a plan that «Нельзя узнать» ends in the plan phase gets no label while a submitted plan keeps its label (REQ-5664). Closed by: a route test.
2. Given a partly laid plan and a resume, when the attempt resumes in `plan`, then the newest `plan_draft` for the item is restored, and a resume after a submitted plan lands in the solving phase with the plan in place (REQ-0204, REQ-0208, REQ-5642). Closed by: a resume test over both points.
3. Given any 30 days of compound word problems T2 to T4, when the choice is read, then 20 % to 30 % are chosen to open with a plan, within one problem; a problem whose template can't build a plan logs `plan_unavailable`, opens with no phase and moves the plan nowhere; and 40 % to 60 % of plan problems take step input (REQ-6422, REQ-5608). Closed by: a simulation test over 30 days.
4. Given an answer after a plan, when estimates and outcomes are computed, then it counts as the answer after no phase does, `item_shown.forms` never holds `plan`, and a plan's label changes no credit, outcome, success share or estimate (REQ-5644, REQ-5646). Closed by: a projection test over matched pairs of attempts.
5. Given an attempt whose `forms` holds a form outside `admittedForms`, when the projections run, then it drops from every estimate, state, probe and block, the fluency and "with help" estimates included, and each new form writes to a stream of its own (REQ-5024, REQ-5026). Closed by: a projection test over one admitted and one untested form.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 11, 12 and 56 to 61. The plan's single home in `plan_submitted` is TSK-0998's change; this task builds on it.

## Depends on

- TSK-0998 (blocking): it moves `planChoice` into `plan_submitted`, which the route here writes.

The epics realising ADR-0270, ADR-0060 and ADR-0210 supply the plan cards, the knowledge model's streams and the `admittedForms` list; until they exist, the tests run on fixture plan templates and a fixture stream list, and the real streams are left to those epics.

## Evidence

Not yet.

## Left alone

The plan cards' interface and the plan label's scoring, which ADR-0270 owns.
