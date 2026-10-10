---
id: TSK-0841
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5502, REQ-5560, REQ-5564]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The task window lets her link two numbers or mark one, with a 56 px touch zone, and shows no verdict on any loop

After this task, the task window of a grouping task draws a loop between two tapped numbers, marks a long-pressed number to round, lets her answer with no links at no cost in guiding threads, and colours, ticks or labels no link before or after the answer.

## Acceptance criteria

1. Given a grouping task on the tablet viewport, when a Playwright test measures every tappable number, then each touch zone is at least 56 px in both directions around its 24 px glyphs (REQ-5560). Closed by: the Playwright test's report.
2. Given two taps on two numbers, when the loop is drawn, then a request with the whole set goes through the queue, a long press marks one number, and a tap on a linked or marked number removes that link or mark. Closed by: a Playwright test and a network recorder over the same run.
3. Given any set of links, when the window renders before and after the answer, then no loop, number or button carries a colour, tick, cross or word that says optimal, valid or wrong (REQ-5564). Closed by: a Playwright test that compares computed styles and text across the three kinds of set.
4. Given a grouping task, when she presses «Готово» with no links, then the answer is accepted, no thread is spent and the thread count is unchanged (REQ-5502). Closed by: an integration test over the thread ledger.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the controls in the task window of ADR-0150 using the tappable numbers REQ-5120 admits. Each number takes part in at most one link or one mark, because every optimal plan is a set of disjoint pairs or one mark. The controls behave the same way on every grouping task, so they reveal nothing about its plans. The client sends each change through TSK-0839's route.

## Depends on

- TSK-0839 (blocking): the controls send their sets to that route.
- TSK-0840 (blocking): the view carries the numbers and signs with positions.

The epic realising ADR-0150 supplies the task window and its design system.

## Evidence

Not yet.

## Left alone

The loop's final art and the spell animation, which ADR-0150's design step and ADR-0170's art pipeline own.
