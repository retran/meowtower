---
id: REQ-5144
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5144

A knowledge model version that reads the depth of help MUST NOT replace the first version unless it predicts the next unassisted first attempt with lower log-loss and lower calibration error on held-out days, the activation gate of the knowledge model's decision.

Whether the depth of help improves that prediction is unknown until play data exists.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
