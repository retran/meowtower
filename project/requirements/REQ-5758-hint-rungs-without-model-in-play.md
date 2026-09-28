---
id: REQ-5758
artifact: requirement
topic: threads
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
supersedes: [REQ-0534]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5758

Every hint rung MUST reach the player with no call to a language model during play, either built from the task's template or taken from the approved puzzle bank.

A hint is shown before the answer, so a model's mistake there would lead the player wrong. A puzzle has no template to build rungs from.

Written from RES-4070 on the owner's instruction of 2026-09-28.
