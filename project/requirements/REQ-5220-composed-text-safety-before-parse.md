---
id: REQ-5220
artifact: requirement
topic: safety
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5220

Before any parse request leaves the Mac, the player's composed text MUST pass the same local triggers as story free text on the raw text, and then the judge's safety check on the cleaned, masked text.

Her composed text reaches a model like her story text, so the story field's safety guarantees have to hold for it too, and masking it for the judge keeps her digits on the Mac.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
