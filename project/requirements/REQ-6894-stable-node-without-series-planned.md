---
id: REQ-6894
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6894

When a node that can be held is «устойчиво» (stable) with no series, because the retention check has just shipped or a recompute under a new version made it stable, the Director MUST plan its check at its next run and hold the node from that plan's logging, due 28 to 35 game days after the node's latest meeting, or, when that window has already passed, from the plan's game day to 7 game days after it.

The nodes the MVP made stable, and a node a new version made stable, deserve the same check as a node that reached the state later, without first dropping and regaining it. A window of 7 game days keeps the length of the owner's window, so a late check is late by the same rule.

## Open review findings

A second reviewer suggested splitting the plan, the fallback window and the hold start; I kept them in one record, because they are one planning act. The 7-day fallback window is a default I chose, because RES-4220 conclusion 18 says only "from the ship date".

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
