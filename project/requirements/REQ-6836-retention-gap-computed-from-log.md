---
id: REQ-6836
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6836

Every figure that reads the gap since a node's latest meeting MUST compute that gap from the log when it is read, never from a gap stored at show time.

An answer queued offline on another device can reach the log after a show and change which meeting was latest.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
