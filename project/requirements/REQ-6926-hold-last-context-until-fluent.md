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

## Open review findings

The fixes made after the second agent review, here and in REQ-6910, REQ-6914, REQ-6928, REQ-6930, REQ-6936, REQ-6946, REQ-6954, REQ-6956 and REQ-6982, haven't been reviewed again, because the method bounds review at two rounds. Two of them are defaults the requirements step chose: a first encounter in any slot REQ-6954 lists is ineligible, and a frame REQ-6956 keeps out of a slot is treated like a held frame by the repeat rule.
