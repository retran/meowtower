---
id: REQ-7022
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7022

When a goal row's status comes from a pair of snapshots marked as a change in the target, the row MUST carry that mark on the "home and school" screen.

A status that moved with its target says nothing about the player (REQ-6034), and the quadrant alone would hide that. The row keeps its quadrant because the target guard of REQ-7016 and REQ-7018 already judges the status against the target the snapshot shows, and the mark tells the parent that target is new.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
