---
id: REQ-7220
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7220

When the player's text puts a colon between two tokens, the parse MUST read it as a division unless the words «в отношении» (in the ratio) or «на … приходится» (for … there are) mark a ratio.

ADR-0040's notation writes `:` for division and the addendum writes a ratio as `3 : 2`, so the author of the parse prompt needs one rule for the shared sign.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
