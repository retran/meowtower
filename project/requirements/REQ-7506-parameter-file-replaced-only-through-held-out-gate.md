---
id: REQ-7506
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-29
elaborates: RES-0900
verification: evaluation
supersedes: [REQ-0980]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7506

A new model parameter file MUST replace the active one only when it predicts the next unassisted first attempt on held-out days better, by log-loss and by calibration.

A change of the school-group setting picks another prior row of the active file, which the gate already tested with all its rows, so it passes no gate (ADR-0370 entry 15), while REQ-0980's "model version" also named that change.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
