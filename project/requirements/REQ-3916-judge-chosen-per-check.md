---
id: REQ-3916
artifact: requirement
topic: judge
class: functional
status: draft
revised: 2026-09-27
elaborates: RES-3910
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3916

Among the models on the Mac that pass a judge check's agreement test (REQ-1688) and latency test (REQ-3914), the one with the highest agreement with the reference model MUST answer the check; models within one percentage point of each other tie, and a tie goes to the model that answers the most checks, then to the smaller model.

No published figure measures any candidate on the game's checks in Russian, so only each check's own results show which model suits it. Each extra model adds its resident memory, its cache slots and a threshold set, hence the tie-break. A check given to a model at 91 % agreement while another passing model reached 95 % breaks this. One model may answer every check, or the yes-or-no safety and shaming checks and the creepiness, signal and sorting checks may go to different models.

Written from RES-3910 on the owner's instruction of 2026-09-27.
