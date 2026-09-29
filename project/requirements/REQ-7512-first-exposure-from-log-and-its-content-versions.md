---
id: REQ-7512
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-29
elaborates: RES-4230
verification: behavioural
supersedes: [REQ-6936]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7512

Every `firstExposure` MUST be computed from the event log and the content files at the versions its events record, taking the context from what the log recorded when the shown frame or probe pair was accepted.

A fact the log already holds stays out of event payloads, so a corrected computation gives every past value again. The expected result needs the model file and the graph version, which the log names by version and doesn't hold, so "the event log alone" can't compute it.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
