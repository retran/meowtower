---
id: REQ-5240
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5240

When the player corrects a riddle, the log MUST mark the attempt as corrected and keep both her first and her corrected text.

The parent (REQ-5294) and the share of rejected paraphrases (REQ-5296) need both texts, and a misparse can't be traced without the first one.

Written from RES-4020 on the owner's instruction of 2026-09-28.
