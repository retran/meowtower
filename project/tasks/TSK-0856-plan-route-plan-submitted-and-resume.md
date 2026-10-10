---
id: TSK-0856
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5638, REQ-5640, REQ-5642, REQ-5658]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server logs the laid plan as `plan_submitted` before she answers, restores it on resume and sends only the strict view

After this task, `POST /api/item/:itemId/plan` writes `plan_submitted` with the laid sequence, the shown cards, the graph id, the label, the faults, the help and the control that ended it; a resume restores the `solve` phase with her plan; and `PlanView` carries only each card's opaque id and text.

## Acceptance criteria

1. Given a plan submitted with «Готово», when the log is read, then `plan_submitted` holds `laid`, `shown`, `graphId`, `planChoice`, `faults`, `assisted`, `hintLevel` and `endedBy`, and it is written before any answer (REQ-5638, REQ-5640). Closed by: a log test.
2. Given a plan submitted, when she stops and resumes on the other device, then the phase is `solve` with the same laid cards, and a resent submission with the same `clientSeq` writes one event (REQ-5642). Closed by: a log test.
3. Given a partly laid plan, when the client sends it through `POST /api/item/:itemId/plan/draft` at most every 10 seconds and at once on leaving, then a resume in `plan` restores it, per ADR-0360 and ADR-0370. Closed by: a resume test.
4. Given a rung bought during the plan phase, when the plan and the attempt are logged, then both are `assisted`, and the rung stays visible in `solve` at no further cost (REQ-5658). Closed by: an integration test.
5. Given «Не знаю» or «Нельзя узнать» pressed in `plan`, when the plan is logged, then `endedBy` names the button, «Не знаю» gives the label `gradePlan` returns, and «Нельзя узнать» writes no label, per ADR-0460. Given 1,000 `PlanView`s, then none holds a kind, a `needed` flag, a dependency or a graph id. Closed by: an integration test and a payload test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the route, the draft route, `plan_submitted` and `PlanView` under a `.strict()` schema, as ADR-0270 amends ADR-0030 and ADR-0020, and the phases `plan` then `solve` to ADR-0080's `open` state. A submission that names an unknown card or one card twice, or no card with `endedBy: ready`, gets 400 with `plan_rejected` and writes nothing. The cards' display order comes from the task's seeded stream, so the needed cards fall in every display position.

## Depends on

- TSK-0854 (blocking): the label and faults come from that function.
- TSK-0855 (blocking): the opening phase and `plan_unavailable` come from that counter.

The epics realising ADR-0030 and ADR-0080 supply the routes' conventions, the resume point and the attempt flow.

## Evidence

Not yet.

## Left alone

The card board and step rows, which TSK-0857 draws, and what the label feeds, which TSK-0858 and TSK-0860 settle.
