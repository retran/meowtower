---
id: REQ-6506
artifact: requirement
topic: platform
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-2500
verification: static
supersedes: [REQ-2542]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6506

A device MUST keep no game data locally except the entries of its event queue that it has not yet sent to the server.

Progress lives on the server, so a lost or reset iPad loses nothing. ADR-0370 entry 45 widens the queue from answers to answers, grouping sets, `looks_set`, `glossary_opened` and `plan_draft`, and REQ-2542's word "answers" no longer covers what the device holds.

Imposed by the owner's instruction of 2026-09-28 to fix the remaining issues in the decisions and specifications.
