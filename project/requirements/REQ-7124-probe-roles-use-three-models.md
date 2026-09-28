---
id: REQ-7124
artifact: requirement
topic: measurement
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4250
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7124

An offline run that writes Dutch probe texts MUST refuse to start unless the writing role, the blind-solve role and the language-check role are set to three different models.

A checker running on the writer's own model shares the writer's blind spots, so its pass would say little.

Written from RES-4250 on the owner's instruction of 2026-09-28 to process addendum 2.
