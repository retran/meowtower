---
id: REQ-6838
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6838

When a node that can be held first reaches «устойчиво» (stable), the Director MUST log a planned retention check for it and hold the node from that moment, the plan naming the node, a series, check number 1, the game day the node reached «устойчиво» as the anchor date, and a due window of 28 to 35 game days after the node's latest meeting.

The plan written when the Director acts fixes the series' anchor, which a recompute of the stable state under a new version would otherwise move. Taking the anchor as the game day the node reached «устойчиво» under the rules active at the plan is a default I chose, because the research names an anchor date without defining it.

## Open review findings

The anchor date as the game day the node reached «устойчиво» is a default I chose; a person approving this record should confirm it or send it back to research.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
