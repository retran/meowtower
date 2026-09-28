---
id: REQ-6002
artifact: requirement
topic: knowledge-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6002

The lint check MUST fail when code of the knowledge model reads a school snapshot event.

A test catches only the paths it runs, and a check over the code keeps a later change from feeding school data into the model unnoticed, as it already does for a game projection that reaches the model.

Written from RES-4100 on the owner's instruction of 2026-09-28.
