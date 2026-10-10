---
id: TSK-0870
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5740]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each of the five widgets has one pure rules module that the client and the server both run, and the move-sequence check replays moves through it

After this task, `src/shared/puzzles/widgets/` holds a rules module for «Весы Базара», «Кувшины», «Таблица рыцарей и лжецов», «Клетчатое поле» and «Спички», and the check of the answer format "sequence of moves" accepts any sequence that reaches the goal state.

## Acceptance criteria

1. Given random legal move sequences for each widget, when the client's and the server's rules modules apply them, then they reach the same state (REQ-5740). Closed by: a property test for each widget.
2. Given a sequence the move-sequence check accepts, when the widget replays it, then it ends in the goal state, and a different right sequence from the reference is accepted too. Closed by: a property test and one hand-written second answer for the jugs.
3. Given an illegal move, when the rules module applies it, then it refuses it and returns the state unchanged. Closed by: a unit test for each widget.
4. Given a figure, when it is drawn from the data, then the grid, the scales, the jugs, the table and the matchsticks are drawn by code and a figure can't disagree with the numbers. Closed by: a snapshot test that renders each figure from the same data file twice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the five rules modules and the move-sequence check. The modules are pure, so the client applies each move at once to answer within ADR-0150's 100 ms and the server replays it. Drawing the widgets in the Diary page is TSK-0871. Widgets give no information by sound, as REQ-6124 sets for every puzzle.

## Depends on

- TSK-0868 (blocking): the modules read the data schema and the starting states.

The epic realising ADR-0150 supplies the design system the figures use; this task draws the figures from code and leaves their look to that epic.

## Evidence

Not yet.

## Left alone

The Diary page and the touch controls, which TSK-0871 builds, and the answer formats that TSK-0869 checks.
