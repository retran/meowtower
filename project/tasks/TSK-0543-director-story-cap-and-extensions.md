---
id: TSK-0543
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1042, REQ-1044, REQ-1046]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Story takes at most 10 minutes of an adventure, and an extension adds only rooms chosen by value

After this task, the Director measures story time from the scene events in the log, gives each scene a duration budget from what remains after reserving the shortest forms of the scenes still planned, and an extension adds rooms chosen by value on floors already on the route and never opens a floor.

## Acceptance criteria

1. Given scene events totalling 9 minutes and 5 scenes still planned, when a scene's duration budget is asked, then it is what remains after the reserve for the shortest forms of the planned scenes, and once only the reserve is left every remaining scene takes its shortest form (REQ-1042). Closed by: a unit test.
2. Given a simulated adventure, when its story time is summed, then it never exceeds 10 minutes of active time (REQ-1042). Closed by: the timed simulation's report of TSK-0547 and a unit test over 20 seeded adventures.
3. Given an extension, when its rooms are chosen, then each is chosen by value among the floors already on the route and none is chosen from a new floor (REQ-1044, REQ-1046). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the story budget and the extension planning to `src/engine/director/`. The Director sends each scene order a duration budget, and ADR-0110's scene library gives each scene its shortest form, so the cap is logged but not enforced until that epic exists, and the test uses scenes with two lengths each.

## Depends on

- TSK-0542 (blocking): the planning functions the budget and the extension extend.
- The epic realising ADR-0110 supplies the shortest form of each scene.

## Evidence

Not yet.

## Left alone

The scenes' texts and their shortest forms, which ADR-0110's epic builds, and the extension button and its minutes, which the epic realising ADR-0090 builds.
