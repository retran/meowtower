---
id: REQ-6858
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6858

The Director MUST choose a retention check's subtype by the seed among the node's subtypes of weight 0.2 or more, or among all its subtypes when none reaches 0.2, and its task from a free-input template where that subtype has one.

A choice template can be guessed one time in four, and a seeded choice keeps the Director's honesty rule, which never lets the success share pick a task.

## Open review findings

A second reviewer asked for the reason for the weight cut of 0.2; RES-4220 decides it without one, so it stays open for research. Falling back to all subtypes when none reaches 0.2 is a default I chose.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
