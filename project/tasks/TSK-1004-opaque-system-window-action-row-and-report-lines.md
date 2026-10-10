---
id: TSK-1004
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0360
closes: [REQ-3122, REQ-3510, REQ-1306, REQ-2312]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The System window's text sits on an opaque fill, the action row keeps the thread button beside «Готово», and the report keeps assisted attempts in the help figures

After this task, `SystemWindow` draws its text on an opaque fill, every T1 to T4 word problem's action row reads «Не знаю», «Нельзя узнать», the thread button, «Готово», the report shows assisted attempts only among its «с помощью» figures, and the post-MVP speed view draws the 8x8 map of the facts from 2 to 9 from `fact_states`.

## Acceptance criteria

1. Given a System message of several lines, when `SystemWindow` renders, then the text's background is opaque and the gradient at `system-alpha` stays on the frame only; the parent judges long text at the stage 0.3 review, because contrast over a picture is a visual call (REQ-3122). Closed by: a component test on the computed background of the text node, and the parent's judgement.
2. Given a solvable and an unanswerable T1 to T4 problem, when the task window renders, then the action row has the same four controls in the same order and the thread button sits beside «Готово» (REQ-3510). Closed by: a component test over both kinds.
3. Given assisted first attempts, including «склонна отказываться от задачи», when the report is built, then they appear only among the «с помощью» figures and the guard still reads assisted attempts first (REQ-2312). Closed by: a report projection test.
4. Given `fact_states`, when the post-MVP speed-of-the-basics view is built, then it holds the 8x8 map of the facts from 2 to 9 from the same data as the two 10 x 10 maps (REQ-1306). Closed by: a projection test that compares the cells with `fact_states`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply ADR-0360 entries 38, 39, 44 and 45. Criterion 4 builds the view's data and a test page only, because the full report is after the MVP.

## Depends on

Nothing in this epic. The epics realising ADR-0150, ADR-0180, ADR-0250 and ADR-0290 supply the components, the report projections and the fact states; until they exist, the tests run on fixture components and fixture fact states, and the real screens are left to those epics.

## Evidence

Not yet.

## Left alone

The rest of the limits screen, which ADR-0180 builds after the MVP.
