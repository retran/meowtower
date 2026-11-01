---
id: REQ-8252
artifact: requirement
topic: story
class: functional
status: approved
revised: 2026-11-01
elaborates: RES-4314
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8252

The scenario MUST reach the Master in its system prompt, and the game MUST NOT run the graph itself.

The Master reports where it is and what it changed through tool calls, so the parent's report and the Director can read them.
