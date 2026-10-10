---
id: TSK-0539
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-0832, REQ-1038]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A floor opens with a warm-up and two mental arithmetic tasks, and an adventure holds control facts at its start and its end

After this task, `planFloor` gives each floor its scene, an ungraded warm-up, 2 mental arithmetic tasks and then rooms of 3 to 5 tasks, an adventure holds 2 control facts at its start and 2 at its end, and a stable node enters mental arithmetic at most once in any 7 consecutive days.

## Acceptance criteria

1. Given a planned adventure, when its tasks are listed, then the first 2 and the last 2 graded tasks are control facts, and each extension adds 2 more (REQ-1038). Closed by: a unit test over an adventure with and without an extension.
2. Given a node in «Устойчиво», when mental arithmetic is filled on 7 consecutive days, then the node appears in it at most once in any 7 of them (REQ-0832). Closed by: a unit test over 30 days.
3. Given a floor, when it is planned, then it holds a scene, an ungraded warm-up, 2 mental arithmetic tasks and rooms of 3 to 5 tasks, in that order. Closed by: a unit test.
4. Given the mental arithmetic slots, when nodes are chosen, then they are chosen by value among the mental subtypes near the floor's domain. Closed by: a unit test over a fixture projection.
5. Given 30 floors, when the Guardian's tasks are counted, then a Guardian task comes on about one floor in three, between 8 and 12 of 30. Closed by: a unit test over 30 seeded floors.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `planFloor` to `src/engine/director/`. A Guardian task is a word problem of the T nodes (RES-3900), and its step counts are TSK-0540's. The control facts are the ones RES-1300 defines, and the fatigue signal of TSK-0545 compares their times.

ADR-0290 replaces the 2 mental arithmetic tasks by one Volley on some floors and ADR-0300 adds 2 track tasks after them; both extend the opening this task builds.

## Depends on

- TSK-0538 (blocking): the route whose floors this task fills.
- TSK-0534 (blocking): the value ranking the mental arithmetic uses.

## Evidence

Not yet.

## Left alone

The Volley, the track tasks and the Dutch letters on a floor, which ADR-0290's, ADR-0300's and ADR-0430's epics place, and the scene texts, which ADR-0110 builds.
