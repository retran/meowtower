---
id: REQ-5062
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5062

The server MUST NOT write an event of a type that lacks an owning decision or a payload schema.

A stored event never changes (REQ-2226), so a payload written with no schema can't be read reliably by a projection later, and a type with no owner has nobody to say what it means. The addendum's 42 new event types have neither yet.

Written from RES-4000 on the owner's instruction of 2026-09-28.
