---
id: REQ-7034
artifact: requirement
topic: report
class: functional
status: superseded
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7034

The screen MUST place a Cito row in no quadrant when its category has fewer than 10 tested nodes.

At 5 nodes inside the category the margin of REQ-7030 is about 22 points, more than one answer in a block of 5, so a small category could show only an extreme difference. Verhoudingen maps to 8 nodes and Verbanden to 7 (REQ-7066), so their rows always land in no quadrant, and the reason the screen shows for them (REQ-7036) is the floor.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
