---
id: REQ-8702
artifact: requirement
topic: equipment
class: functional
status: approved
revised: 2026-11-15
elaborates: RES-4321
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8702

Each use of a tool perk on a task MUST be logged as a `perk_used` event, and the knowledge model MUST read that attempt as assisted.

A tool such as a number line or an inverse check is help, and the model already keeps attempts with help apart.
