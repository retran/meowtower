---
id: REQ-6412
artifact: requirement
topic: cost
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-2700
verification: judgement
verifier: person
supersedes: [REQ-2730]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6412

When an offline run starts, the key it spends from MUST have no more of its spending limit left than that run's budget.

The offline key also pays the sandbox and resets each month, so a limit equal to the run's budget can be partly spent before the run starts; what caps the run is what remains of the limit. The owner judges from the key's settings and usage before each run.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
