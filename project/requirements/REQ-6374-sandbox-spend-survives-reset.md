---
id: REQ-6374
artifact: requirement
topic: cost
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6374

The sandbox's spend in the current month MUST still count toward its cost-report line and its monthly cap after the parent resets the sandbox.

A reset replaces the sandbox's database, which holds the record of each sandbox call, so a count read only from there would start the month again at every reset. The spend therefore has to be kept where a reset doesn't reach, and outside the player's database, which REQ-6370 keeps unchanged by sandbox use.

Written from RES-4130 on the owner's instruction of 2026-09-28.
