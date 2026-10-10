---
id: TSK-0840
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5562, REQ-5578]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server sends no plan and no score before the first attempt ends, and the short solution shows the plan beside the direct calculation

After this task, `ItemViewOut` of a grouping task carries the expression's numbers and signs with their positions and nothing else about the grouping, and `AnswerOut`'s short solution shows the first optimal plan beside the direct calculation whatever she linked.

## Acceptance criteria

1. Given 1,000 grouping tasks, when the packet test serialises `ItemViewOut`, the grouping reply and every packet before the first answer, then none holds an optimal plan or a score of the links (REQ-5562). Closed by: the packet test's report.
2. Given a grouping task answered with no links, with a `valid` set and with an `optimal` set, when the short solution is read, then each shows the template's first optimal plan beside the direct calculation (REQ-5578). Closed by: three integration tests over `AnswerOut`.
3. Given the hint ladder of a grouping task, when its rungs are built, then they follow the template's computation graph in written order and no rung before the first attempt ends names a plan, per ADR-0360. Closed by: a unit test over 100 seeds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add grouping tasks to ADR-0080's packet test, keep the plans in the `items` row and in `item_shown`, and add the plan to `AnswerOut`'s short solution. The grouping route's reply carries no score, as TSK-0839 builds.

## Depends on

- TSK-0836 (blocking): the plans come from the declaration.
- TSK-0839 (blocking): the packet test covers the route's reply.

The epic realising ADR-0080 supplies the packet test and the short solution's shape; the epic realising ADR-0220 supplies the hint ladder's framing, and the rungs here follow the graph until it lands.

## Evidence

Not yet.

## Left alone

How the short solution is drawn, which the task window's screens own, and the rung texts, which ADR-0220 owns.
