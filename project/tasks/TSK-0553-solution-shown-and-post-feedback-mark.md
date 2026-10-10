---
id: TSK-0553
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0080
closes: [REQ-0428]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the player sees a solution, every later task of the same node that game day is marked as coming after feedback

After this task, the server writes `solution_shown` when a short solution shows, and each later task of the same node on the same game day carries `postFeedback: true` on its `attempt_submitted`, so the model can treat a walkthrough as a chance to learn.

## Acceptance criteria

1. Given a short solution that opened by itself after a wrong answer and one the player opened after a right answer, when each shows, then `solution_shown` is logged once for the task in both cases (REQ-0428). Closed by: an integration test for each.
2. Given a `solution_shown` for a node, when a later task of the same node on the same game day is answered, then its `attempt_submitted` carries `postFeedback: true`; given a task of another node, then it doesn't (REQ-0428). Closed by: an integration test.
3. Given a bought rung or a bought explanation on the node, when a later task of the node is answered the same day, then it carries the mark too, because the model reads a walkthrough, an explanation and a hint as feedback alike. Closed by: an integration test for each.
4. Given a leave with «Сохранить и уйти» and a resume on the same game day, when a task of the node is answered, then it carries the mark; given the day's change at 04:00, then the next day's task doesn't (REQ-0428). Closed by: an integration test over the leave and the game-day change.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Compute the mark in the flow of TSK-0548 from the log's events of the node on the game day, not from a counter, so a rebuild gives the same marks. The game day is `src/shared/game-day.ts`'s, which ends at 04:00. The `postFeedback` field of `attempt_submitted` is the one the epic realising ADR-0020 declared; if it is absent from the schema's current version, add it with its upcast.

## Depends on

- TSK-0548 (blocking): the flow that decides when the short solution shows.
- TSK-0550 (not blocking): the review that shows the solution; the mark can be tested on a forced `solution_shown` event.

## Evidence

Not yet.

## Left alone

The model's learning transition that reads the mark, which the epic realising ADR-0060 builds.
