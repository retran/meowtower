---
id: TSK-1068
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6856, REQ-6858, REQ-6860, REQ-6862, REQ-6864]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A due check takes the first slot of its floor, at most three a day, and a late one says so

After this task, the Director places each due retention check in the first room slot of its node's domain floor, draws its subtype by the seed, never places more than 3 in an adventure day or one after a fatigue signal, and marks a check placed late.

## Acceptance criteria

1. Given two checks due on one floor with the earlier window ending first, when the floor is planned, then the earlier check takes the first slot and the other the slot after it, a check still unplaced after its window's end goes there too, and on a day with no floor of the domain the check waits (REQ-6856). Closed by: a Director test.
2. Given a Sources track node with a due check, when the day's two track tasks are chosen, then the check takes the first of them (REQ-6856). Closed by: a Director test.
3. Given a node with subtypes of weight 0.9, 0.5 and 0.1, when the check's subtype is drawn over 1,000 seeds, then only the first two appear; given no subtype at 0.2 or more, then the draw runs over the subtypes she has been shown; and the task comes from a free-input template where the subtype has one, with an empty `forms` list (REQ-6858). Closed by: a seeded draw test.
4. Given 4 checks due on one day and a fatigue signal after the second, when the day is planned, then 3 at most are placed and none after the signal (REQ-6860, REQ-6862). Closed by: a Director test.
5. Given a check placed 36 game days after the meeting its window counts from, when the report is built, then it is marked «с опозданием» and still counts in its series (REQ-6864). Closed by: a report test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the placement rule to the Director's floor planner. The check takes whatever slot type the corridor gives, review or frontier, and records it in `flowSlot` as usual. The due date alone chooses the check, so no success share decides whether a check comes (ADR-0070's honesty rule). For a Sources track node I chose the first of the day's two track tasks on its host floor, because a track node has no domain floor. When more than 9 checks are past their window's end, write one warning to the server's operational log, and write it again only after the count has fallen to 9 or below and risen past it.

## Depends on

- TSK-1066 (blocking): the plan and its window.
- TSK-1067 (blocking): placing a check uses the hold's `isHeld` and the predicate's `retention_check` exception.

The epic realising ADR-0070 builds the floor planner; the rule is written against its `planFloor` interface and tested on a stand-in planner until it lands.

## Evidence

Not yet.

## Left alone

The review owed after a wrong observation, which TSK-1069 places with this task's slot rule.
