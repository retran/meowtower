---
id: REQ-5448
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: [RES-4040, RES-0800]
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5448

The Director MUST NOT choose the stretch subtypes `G6.blocks` and `S3.missing` until the ordinary subtypes of the same node are «Бегло» (fluent) or «Устойчиво» (stable).

A stretch subtype builds on the ordinary form of its own node, so a failure on it before that form is fluent says nothing about the stretch. RES-0800 states the rule in prose and no approved requirement carried it.

Written from RES-4040 on the owner's instruction of 2026-09-28.
