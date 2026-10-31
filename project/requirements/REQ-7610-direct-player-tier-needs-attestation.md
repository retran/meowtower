---
id: REQ-7610
artifact: requirement
topic: gateway
class: functional
status: approved
revised: 2026-10-31
elaborates: RES-4290
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7610

A player-tier role MUST NOT use a direct provider route until the owner states in configuration that zero retention holds for that route.

Anthropic grants zero retention per organisation by contract, and no interface reports it.
