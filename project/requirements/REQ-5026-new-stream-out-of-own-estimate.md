---
id: REQ-5026
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5026

A new form's stream MUST NOT enter the "on her own" estimate until a model version that admits it predicts held-out unassisted first attempts with lower log-loss and lower calibration error than the active version.

An untested stream would move the estimate the parent reads without evidence that it predicts her better. No refit runs during the MVP, so no new stream enters the estimate before the MVP is accepted.

Written from RES-4000 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
