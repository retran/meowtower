---
id: REQ-6500
artifact: requirement
topic: explanations
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-0600
verification: behavioural
supersedes: [REQ-0608]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6500

Every number in a detailed explanation MUST be a number the engine computed or the answer the player entered, never one the language model wrote.

An explanation that addresses her answer (REQ-0604) has to show that answer, and her answer is a number the engine didn't compute. A number the model wrote in place of a placeholder fails the requirement.

Imposed by the owner's instruction of 2026-09-28 to fix the remaining issues in the decisions and specifications.
