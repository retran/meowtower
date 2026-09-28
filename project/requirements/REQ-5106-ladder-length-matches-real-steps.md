---
id: REQ-5106
artifact: requirement
topic: threads
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: judgement
verifier: person
supersedes: [REQ-0532]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5106

The hint ladder of every task that offers one before the answer MUST have one rung for each real step of its template, up to three rungs, with no rung written only to make up the count.

A rung invented to reach three tells the player nothing new and costs her time. A real step is a step of the template's computation graph. Each rung gives its step without that step's result, so the last rung of a ladder with three real steps still stops before the last calculation, as REQ-0542 asks of the third rung. REQ-5164 covers a template with more than three real steps. A fluent basic fact offers no ladder before the answer and falls outside this rule. The parent judges whether a rung is a real step.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
