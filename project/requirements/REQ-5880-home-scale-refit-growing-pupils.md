---
id: REQ-5880
artifact: requirement
topic: knowledge-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5880

On simulated pupils whose ability grows during the simulation, the refit of the home scale's item difficulties MUST recover the true item difficulties with a root mean square error of at most 0.3 logits and each pupil's true ability gain within 25 %.

With one player, a refit can absorb her growth into the item difficulties and draw a flat line that still converges, so the test checks that the growth survives the refit. The two tolerances are defaults chosen while writing this requirement. The addendum's acceptance test 13 runs this check.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
