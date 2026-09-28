---
id: REQ-6150
artifact: requirement
topic: master
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6150

After the player sends free text, the 95th percentile of the time until the first character of a reply line shows MUST be at most 2 seconds.

The first line is a prepared reaction; the Master's reply still follows within the 6-second budget and shows only after all of it passes its checks.

Written from RES-4110 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
