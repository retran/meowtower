---
id: TSK-0566
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0090
closes: [REQ-0114, REQ-0116, REQ-0118, REQ-0120, REQ-0122]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The plan places warm-ups and easy tasks where her answers can't move them

After this task, the plan puts an unscored warm-up after every floor's entry scene and after a pause longer than 5 minutes, draws the random easy tasks in advance, and adds one easy task after three `alt` outcomes, so no easy task tells her she got something wrong.

## Acceptance criteria

1. Given 1,000 seeds, when each plan is read, then the first task after every floor's entry scene is an unscored warm-up (REQ-0114). Closed by: a plan test over 1,000 seeds.
2. Given a pause of 5 minutes 1 second, when she resumes, then the next new task is an unscored warm-up and a task left open still comes first; given a pause of 5 minutes, then no warm-up is added (REQ-0116). Closed by: a unit test with both pauses.
3. Given one seed and two different answer sequences, when each plan is read, then the random easy tasks stand at the same places; given 10,000 seeds, then the rate is within 1/12 plus or minus 0.01 and no two random easy tasks fall within 5 tasks (REQ-0120). Closed by: a unit test with both sequences and a property test over 10,000 seeds.
4. Given three first attempts in a row that end in `alt`, when the next task is chosen, then it is one easy unscored task, and where a random easy task already stands there then one easy task shows (REQ-0118). Closed by: a unit test.
5. Given an easy task inside a room, when the room's length is read, then it is unchanged and the easy task took one of the room's slots; outside a room, between the warm-up, the mental arithmetic and the Guardian, it is added as a place (REQ-0122). Closed by: a unit test of both cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Draw the random easy tasks when the plan of TSK-0565 is built, at each boundary between tasks, with probability 1/12 from the session seed and at most one in any 5 tasks, and keep the draw independent of every answer. Add the pause rule beside the plan's other inserted tasks, and the `alt` run as the one rule that reads an answer. Choice I made, following ADR-0090: outside a room an easy task is added, because the mental arithmetic can't be trimmed and those segments have no slots to give.

## Depends on

- TSK-0565 (blocking): the easy tasks and the warm-ups are drawn into the plan it builds.

The epic realising ADR-0070 picks the easy task's node from nodes she holds fluently. Until it exists the task takes a node from the stand-in table and leaves the choice of node to that epic.

## Evidence

Not yet.

## Left alone

The easy task and the scene that follow an anxiety signal, which TSK-0576 builds from this task's easy-task slot.
