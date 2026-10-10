---
id: TSK-1054
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6782, REQ-6784]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Each bar states what it counts and links to the observations behind it

After this task, each bar carries one counting line from the Russian string file that says what its figure counts, and `GET /api/parent/profile/:bar/observations` lists the observations the bar read so the parent can redo the count by hand.

## Acceptance criteria

1. Given a bar at 42 right of 50 bare tasks on mastered nodes, when its counting line is read, then it says what the figure counts and carries no word of judgement, for example «верно 42 из 50 голых примеров на освоенных узлах» (REQ-6782). Closed by: judgement, the parent reads the eight lines at the stage's acceptance, because whether a Russian line judges is a matter of wording a program can't decide; and the check of ADR-0180 that rejects «плохо», «отстаёт» and «невнимательная» in every `parent.*` value.
2. Given a bar with 120 observations in the current window, when the route is asked for pages 1 to 4, then pages 1 and 2 hold 50 rows each, page 3 holds 20 and page 4 is empty, each row shows whether the observation counted as right, and each task is drawn from its `item_shown` shown view as the node card draws it (REQ-6784). Closed by: a route test.
3. Given a bar that reads 42 of 50, when its list is read for the same window, then the list holds 50 rows of which 42 are marked right (REQ-6784). Closed by: a route test over each of the eight bars.
4. Given an unknown bar or a window other than `current` or `previous`, when the route is called, then it answers `400`, and a request without the parent session answers `401` (REQ-6784). Closed by: a route test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the route under the parent routes and the counting-line keys under `parent.profile.*` in the Russian string file of ADR-0160. The row of each bar is my choice, because ADR-0390 says a bar links to its observations and a bar whose observation isn't one task needs a row the parent can recount from: the task, her answer, the correct answer and, for conceptual understanding, the stream; for basic facts the fact, its state at the window's last event and each task that showed it; for model building the problem with its model choice, steps and, while the plan check holds, its plan and label; for transfer and retention the task and the verdict; for language and format the side and presentation it counted for.

## Depends on

- TSK-1049 (blocking): the basic facts rows.
- TSK-1050 (blocking): the accuracy and understanding rows.
- TSK-1051 (blocking): the model building rows.
- TSK-1052 (blocking): the patterns, transfer and retention rows.
- TSK-1053 (blocking): the language and format rows.

The epic realising ADR-0180 supplies the parent session and the node card's task view.

## Evidence

Not yet.

## Left alone

The layout of the lists, which ADR-0150's design system and the screens' specification own.
