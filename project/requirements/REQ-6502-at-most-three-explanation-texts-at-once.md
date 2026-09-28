---
id: REQ-6502
artifact: requirement
topic: explanations
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-0600
verification: behavioural
supersedes: [REQ-0626]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6502

At any one time, the game MUST keep at most 3 model-written detailed explanation texts that it can show for tasks that share the template, template version, trap, graph shape, familiar and the kind of answer the player gave.

A limit over all time would freeze a group after its third text, so a better prompt or a text the parent hid could never be replaced, and a group that mixed kinds of answer would show a text written for a wrong answer after «Не знаю» (I don't know). A fourth text shown while three others of its group can still be shown fails the requirement.

Imposed by the owner's instruction of 2026-09-28 to fix the remaining issues in the decisions and specifications.
