---
id: TSK-0857
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0270
closes: [REQ-5612, REQ-5650, REQ-5654, REQ-5656]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The task window shows a card board with no verdict and labels the step rows with the cards she laid

After this task, the task window of a problem that opens with a plan shows the problem text, the cards in a seeded order and a row where she lays them, accepts «Готово» only with a card laid, moves to `solve` with no word, mark or colour about the plan, and labels the step rows with her cards.

## Acceptance criteria

1. Given a plan problem on the tablet viewport, when the Playwright test lays a plan and presses «Готово», then the window moves to `solve` and shows no mark or verdict word about the plan before the answer (REQ-5650). Closed by: the Playwright test's report.
2. Given the empty row, when the window is read, then «Готово» is inactive, «Не знаю» and «Нельзя узнать» are active, and she can move and take back any card before «Готово» (REQ-5612). Closed by: a Playwright test.
3. Given a plan problem with step input, when the step rows show, then each carries one of her laid cards as its label in her order, decoys included (REQ-5654). Closed by: a Playwright test.
4. Given the step rows, when she adds a row or removes any row, then an added row carries only its number «N)», and rows stop at 6 (REQ-5656). Closed by: a Playwright test with 6 and 7 rows.
5. Given the cards in the plan, when she lays them, then she can lay the needed cards in the order of solving from the first quantity to the question as the last card. Closed by: a Playwright test that lays a fixture plan's engine order.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the card board and the editable step rows in ADR-0150's design system, as ADR-0270 amends ADR-0150, with every string in the per-language file. The checker reads only the values, so a label never changes credit. Rows stop at 6 because T4 has 4 steps and a plan shows at most 5 cards.

## Depends on

- TSK-0856 (blocking): the board reads `PlanView` and sends its submission to that route.

The epic realising ADR-0150 supplies the task window, the muted card style and the step rows.

## Evidence

Not yet.

## Left alone

The two-column scheme after the answer, which TSK-0859 draws, and the look of the board beyond the rules above, which ADR-0150's screens own.
