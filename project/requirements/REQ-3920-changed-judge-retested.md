---
id: REQ-3920
artifact: requirement
topic: judge
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-3910
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3920

When the model file a judge on the Mac serves has a different hash from the one a check passed on, the server MUST NOT send that judge the check until the check's agreement test (REQ-1688) and latency test (REQ-3914) have passed on the file it serves.

Each threshold was set on one model file and holds for no other, whether the check reads the player's text or a Master reply. This holds at start-up and while the server runs, and only the checks whose hash differs are held back.

Written from RES-3910 on the owner's instruction of 2026-09-27.
