---
id: REQ-7302
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7302

When the parent changes a hypothesis, the game MUST log a `hypothesis_updated` event that holds the whole new text, criteria and links, the kind of change, one of `wording`, `criteria`, `links`, `closed` or `reopened`, with `criteria` whenever the change touches the criteria, and the reason she gives, if any.

An event that held only the changed field would make the reader rebuild each version from a chain of events, and the kind of change decides whether the judging window reopens (REQ-7312, REQ-7316). Past wording stays in the earlier events, which the log never changes.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
