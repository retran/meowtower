---
id: REQ-6322
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6322

The sandbox's database MUST hold no credential copied from the player's database, where the credentials are the PIN hash, the PIN lockout records and the device tokens and their hashes.

A sandbox snapshot starts from her file, which holds all of these, and a second file with the parent's credentials in it is a second place to steal them from.

Written from RES-4130 on the owner's instruction of 2026-09-28.
