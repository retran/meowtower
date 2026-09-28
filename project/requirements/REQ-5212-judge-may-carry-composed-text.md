---
id: REQ-5212
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: static
supersedes: [REQ-2640]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5212

A request to the judge model MUST carry only the cleaned text its question needs, which for a composed riddle is the riddle's text with every number masked as REQ-5202 masks it, and no story memory, outcome events, times, estimates, other answers or other maths result.

The judge model answers safety and similar checks from a fixed set of answers. Her composed riddle is an answer, and its safety check has to read it, so the riddle is the one answer the judge may carry.

Written from RES-4020 on the owner's instruction of 2026-09-28.
