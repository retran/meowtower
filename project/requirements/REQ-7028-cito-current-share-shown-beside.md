---
id: REQ-7028
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7028

Each Cito row MUST show the share of the category's currently tested nodes at a block score of 4 or more, where a node counts as tested when its last unassisted first attempt lies within the 30 days before today, beside its share at the test moment.

The parent sees both what the row compared and where the category stands now.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

- The second agent reviewer suggested showing the outside share and the margin beside the inside share, and asked what a row with no mapped nodes shows. Left to the design step, which lays out the row; a row with no mapped nodes is in no quadrant and shows its reason (REQ-7036).
