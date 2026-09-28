---
id: REQ-5642
artifact: requirement
topic: resume
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5642

When the player resumes a problem whose plan she submitted but hadn't yet answered, the game MUST restore her plan and her place in the solving phase.

The resume point restores the exact attempt step (REQ-0204), and after a submitted plan that step is the solving phase with her plan in place.

Written from RES-4060 on the owner's instruction of 2026-09-28.

## Open review findings

- The finding asks whether a partly laid plan is restored. Rejected: REQ-0204 and REQ-0208 already restore the attempt step and every draft from the log, which covers a plan she hasn't submitted.
