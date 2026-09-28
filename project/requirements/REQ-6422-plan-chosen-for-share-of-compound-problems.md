---
id: REQ-6422
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
supersedes: [REQ-5606]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6422

Between 20% and 30% of the compound word problems (tiers T2 to T4) the player gets in any 30 days, or within one problem of that range, MUST be chosen to open with a plan, whether or not their template could build one.

A problem whose template can't build a plan opens with no phase. Moving its plan to a later problem crowds two plans into a short window, and dropping it lets a window fall below the band, so the band counts the choice, and the log records each plan that couldn't be built.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
