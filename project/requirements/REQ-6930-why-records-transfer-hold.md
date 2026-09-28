---
id: REQ-6930
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6930

While the hold of REQ-6924 or REQ-6926 is active on a subtype, the `why` field of every `item_shown` of that subtype MUST include `transfer_hold`.

The owner audits each choice the Director makes through its `why` field, and a missing reason would hide why the player met no word problem on a subtype.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
