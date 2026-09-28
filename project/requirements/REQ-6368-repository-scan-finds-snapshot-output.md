---
id: REQ-6368
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6368

The repository's scan for personal data MUST fail when a tracked file holds output of a sandbox run on a snapshot of the player's state, recognised both by the mark REQ-6372 puts in that output and by the personal values the scan already looks for.

The repository is public, and personal data committed in a fixture or a recording is the first threat the agent's workflow guards against. Default chosen by the requirements step: the scan keys on both, because the mark alone misses an edited copy and the personal values alone miss the names she gave.

Written from RES-4130 on the owner's instruction of 2026-09-28.
