---
id: REQ-7324
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7324

Every measure a condition names MUST come from a fixed, versioned list of home measures: the profile dimensions, a node's or a subtype's share of unassisted first attempts, and a probe presentation's share.

A school value in a condition would convert a school measure into a home one, which the approved rules forbid, and the school's data stays an external check. The list is versioned so a condition means the same thing each time it is recomputed. Default chosen by the requirements step: a change to the list is a change of the rules version, so REQ-7340 and REQ-7348 cover it.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
