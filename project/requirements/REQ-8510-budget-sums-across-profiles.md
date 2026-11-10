---
id: REQ-8510
artifact: requirement
topic: accounts
class: non-functional
status: withdrawn
revised: 2026-11-08
elaborates: RES-4319
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8510

Withdrawn by ADR-3340 and replaced by REQ-8514: each account has a budget of its own, and the owner decided on 2026-11-09 that one sum over all accounts is not the rule.

The model spend of all profiles MUST sum to no more than the play-key limit of the month.

One key serves the household, and a cap per profile alone could add up to more than the key allows.
