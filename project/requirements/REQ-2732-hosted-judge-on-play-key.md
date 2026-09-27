---
id: REQ-2732
artifact: requirement
topic: cost
class: non-functional
status: approved
revised: 2026-09-27
elaborates: [RES-2700, RES-3910]
verification: static
supersedes: [REQ-2724]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-2732

Every call to a hosted judge model during play MUST go on the play key, so that it counts inside the key's monthly limit.

That limit is the cap that stops a bug the daily caps miss, and a hosted judge billed on another key escapes it. A hosted judge is any model not running on the Mac that answers a judge check, Jev now and the safety model when it answers as the fallback. A judge on the Mac spends nothing from the key.

Written from RES-2700 and RES-3910 on the owner's instruction of 2026-09-27.
