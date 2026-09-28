---
id: REQ-7054
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7054

Each row on the "home and school" screen MUST say, for each of its nodes, a goal's linked nodes or a Cito category's tested nodes, whether the state the row compared rests on its last full block alone or on the two checks of «устойчиво» (stable).

Every state except «устойчиво» rests on one block of 5 answers, and a state from one block changes class about one block in four with no change in her (REQ-7056), so the parent needs to see which states are that fragile.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
