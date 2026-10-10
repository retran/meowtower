---
id: TSK-0860
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5664, REQ-5666, REQ-5668]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The word-problem matrix becomes three counts and two crosses sharing the answer axis

After this task, the report's matrix shows model by answer on problems that opened with a model choice and plan by answer on problems that opened with a plan, counts a plan scored anything but `correct` as a planning error apart from modelling and calculation errors, and counts a wrong answer after a `correct` plan as a calculation error.

## Acceptance criteria

1. Given a report fixture with one plan of each label and a model problem of each result, when the report is built, then the planning-error count, the model cross and the plan cross share the answer axis (REQ-5664, REQ-5666). Closed by: the report fixture test.
2. Given a wrong answer after a `correct` plan, when it is counted, then it is a calculation error; given a wrong answer after a faulty plan, then it counts in its cell of the plan cross and in no error count (REQ-5668). Closed by: two fixtures.
3. Given plans at several step counts, when the plan cross is built, then it is split by the problem's number of steps. Closed by: a fixture with T2 and T4 plans.
4. Given a plan that «Нельзя узнать» ended, when the planning-error count is computed, then it counts in no planning-error count, per ADR-0460; a plan that «Не знаю» ended with an empty row is `missing_step` and counts. Closed by: two fixtures.
5. Given the report, when it reads attempts, then only unassisted first attempts are counted. Closed by: a fixture with an assisted plan.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the matrix of ADR-0180 as ADR-0270 amends it. A wrong answer after a faulty plan is counted in the cell and in no error count, because RES-4060 decided only the case after a `correct` plan. The log keeps every fault, so a later report can split the four faults.

## Depends on

- TSK-0854 (blocking): the labels come from that function.
- TSK-0856 (blocking): the report reads `plan_submitted`.

The epic realising ADR-0180 supplies the matrix and the report's period handling. The epic realising ADR-0250 builds the «Нельзя узнать» answer; until it exists a fixture event stands in for the fourth criterion.

## Evidence

Not yet.

## Left alone

The split of the four faults in the report, which REQ-5664 counts together.
