---
id: REQ-6352
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6352

Each confirmation of a confirmed action MUST enter the player's log as exactly one event, without the sandbox mark and naming the sandbox as its source.

One confirmation is one confirming press and its request, so a repeated press on it or a retried request for it adds no event, while a later confirmation of the same change, such as disabling a template again after restoring it, adds its own. The source lets the parent and the report tell a sandbox change from a Parent Room one.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
