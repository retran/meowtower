---
id: REQ-5672
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5672

The engine MUST grade a plan only by its five labels, never by the exact-permutation rule REQ-0772 sets for order answers.

A plan leaves cards out, admits two right orders in a fork and grades into five labels, so the exact-permutation rule would reject right plans. Every other order answer still falls under REQ-0772.

Written from RES-4060 on the owner's instruction of 2026-09-28.
