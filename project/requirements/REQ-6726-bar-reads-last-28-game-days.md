---
id: REQ-6726
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4210
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6726

Each bar MUST read the observations of the last 28 game days.

The addendum asks for 4 weeks, and a shorter window fails the rule of REQ-6714 on model building, which holds 7 to 9 problems a week. A window counted in game days skips the days she didn't play, which a calendar window would count as empty, and reads no clock on the player's screens.

Written from RES-4210 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
