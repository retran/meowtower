---
id: REQ-5072
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5072

The event log MUST record each estimate, grouping, plan choice and self-check in one place only.

Two records of one fact can disagree after a bug or a retry, and every projection would then have to pick one. Default chosen by the requirements step: the design step picks between an event type of its own and a field of the attempt.

Written from RES-4000 on the owner's instruction of 2026-09-28.
