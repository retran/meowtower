---
id: REQ-6926
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6926

When a subtype has at least 2 contexts with an accepted frame of its structure, the game MUST NOT show the last of those contexts not yet shown on that subtype until the subtype's node is «бегло» (fluent) or higher by a tested result, a probe or a full block and never an inferred state.

The frame rule shows never-shown frames first, so without this hold every context is spent while the player is still learning the subtype. The hold has no time cap, so a subtype that never becomes fluent never meets its last context.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
Imposed by the owner's addendum 2 of 2026-09-28.
