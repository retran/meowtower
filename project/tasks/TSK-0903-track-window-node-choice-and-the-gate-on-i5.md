---
id: TSK-0903
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5914, REQ-5920]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The track window brings a host floor forward, the Director picks the node by rule, and I5 waits for two nodes at «понимает»

After this task, the Director keeps the player within 3 adventure days of a completed floor with a track task, picks the node and subtype of the day's 2 track tasks by a fixed order, and offers no I5 task until two of I1 to I4 are at «понимает» or above.

## Acceptance criteria

1. Given every profile that completes at least one floor a day, when a 30-day simulation runs, then every 3 consecutive adventure days hold at least one completed floor with a track task (REQ-5914). Closed by: the simulation's report.
2. Given the last 2 adventure days with no completed floor that carried a track task, when `planDay` builds the route, then a host floor comes first, from the host domain whose last completed floor is oldest; given the domain window also has due domains, then a due domain that is also a host domain takes the place, and otherwise the host floor goes first and the due domains follow (REQ-5914). Closed by: a day-plan test with each of the three cases.
3. Given a profile that abandons its first floor every day, when 30 days run, then `track_window_missed` is logged for each window it misses and the next route puts a host floor first (REQ-5914). Closed by: the simulation's log.
4. Given tracks with an open block of 1 to 4 graded observations in the last 7 days, nodes in «не проверено» and nodes with a `nextReview`, when the Director picks, then the open block comes first and the older first observation wins with ties by identifier, then «не проверено» in the order I1, I2, I3, I4, I5, then the earliest `nextReview`; within the node the subtype asked longest ago comes first (ADR-0300). Closed by: a Director test over fixture states.
5. Given only I1 at «понимает», when the Director picks, then no task is on I5; given I1 and I2 at «понимает» by full blocks, then I5 is a candidate; given every node with no built template, then the Director plans no track task (REQ-5920). Closed by: a Director test and a golden fixture log.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the window beside the domain window and the Observatory's: when the last 2 adventure days held no completed floor with a track task, a host floor goes first. I chose to let the track window win the first place, as ADR-0300 did, because the domain window already recovers through `domain_window_missed` on the next route, while a missed track window costs the only reading evidence the game collects. Only a completed floor counts.

Pick the node for the day's 2 tasks in this order, which forms a block of 5 within the 7 days of ADR-0060 when the player plays 3 host days in a week: a node with an open block first, then a node in «не проверено», then the node whose `nextReview` is earliest. Every rule skips a node with no built template and, after the MVP, a node held for a retention check. A track node has no inferred state, so I5's gate reads tested states only.

## Depends on

- TSK-0901 (blocking): the states the picks and the gate read.
- TSK-0902 (blocking): the placement of the 2 tasks the window and the node choice work on.

The epic realising ADR-0070 supplies `planDay` and the domain window.

## Evidence

Not yet.

## Left alone

The retention check's hold and its due check on a track node, which ADR-0400 adds after the MVP. The report's line for a missed window, which stays in the log and the verify report because the track sends the owner and the parent no notification.
