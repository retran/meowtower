---
id: REQ-6936
artifact: requirement
topic: event-log
class: functional
status: superseded
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6936

Every `firstExposure` MUST be computed from the event log alone, taking the context from what the log recorded when the shown frame was accepted.

A fact the log already holds stays out of event payloads, so a corrected computation gives every past value again.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
