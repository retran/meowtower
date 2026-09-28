---
id: REQ-6302
artifact: requirement
topic: data-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6302

The sandbox's database MUST live in the same container storage as the player's live database, and never in the folder shared between the Mac and the container.

The server writes the sandbox's database the same way as the live one, and nothing shows that way of writing is safe on the folder shared with the Mac.

Written from RES-4130 on the owner's instruction of 2026-09-28.
