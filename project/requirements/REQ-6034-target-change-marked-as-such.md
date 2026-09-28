---
id: REQ-6034
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6034

The view of changes between snapshots MUST mark as a change in the target both a change of target and any change of status between the same two consecutive snapshots as that change of target.

The vendor can move the target each month by its own rule, so a status that changes with it says nothing about the player. Default chosen by the requirements step: the window is one pair of consecutive snapshots, because that is the smallest step the view shows.

Written from RES-4100 on the owner's instruction of 2026-09-28.
