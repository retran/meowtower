---
id: TSK-0847
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5546, REQ-5548, REQ-5550, REQ-5552, REQ-5554, REQ-5556, REQ-5558]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director offers at most one grouping task a floor, in a room slot, behind four gates and counted apart

After this task, `planFloor` gives a floor a grouping task only when it has none yet, the host node's tested state is «Понимает» or above, the volume forecast without the task still meets the graded minimum and the slot is in a room, and it records `flowSlot: grouping`.

## Acceptance criteria

1. Given a 90-day simulation, when it runs, then at most 1 grouping task a floor exists, none in mental arithmetic, none on a host node below «Понимает» or outside the floor's domain, and every one has `flowSlot: grouping` (REQ-5546, REQ-5548, REQ-5554, REQ-5556, REQ-5558). Closed by: the simulation's report.
2. Given the same run, when each adventure's graded first attempts are counted, then none falls below the minimum because of a grouping task, and no grouping attempt is counted among them (REQ-5550, REQ-5552). Closed by: the simulation's report.
3. Given a host node whose state is inferred, when the gate runs, then no grouping task is offered; given understands, understands and needs speed, fluent, fluent by probe or stable by test, it can be. Closed by: a unit test over every state.
4. Given no template passes the four gates, when `planFloor` runs, then the floor has no grouping task and the `why` field of its first room records `no_grouping_candidate`. Closed by: a unit test.
5. Given eligible templates of several techniques, when the Director picks, then it takes the technique with the fewest unassisted first attempts in the last 30 days, ties going to the least recently shown eligible template per ADR-0370. Closed by: a unit test with fixed counts.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the fourth room-slot source and the four gates to `planFloor`. The grouping task takes the last slot of the floor's first room, because a floor trimmed to one room then keeps it. A grouping-task attempt counts in neither the flow corridor's success share nor the review deficit rule's slot `n`. A second attempt is part of the same task, not a second offer.

## Depends on

- TSK-0836 (blocking): the Director reads the host node from the declaration.

The epic realising ADR-0070 supplies `planFloor` and its simulation harness; the epic realising ADR-0090 supplies the volume forecast; the epic realising ADR-0060 supplies the tested states. The task runs on fixture states and the harness it ships until they land.

## Evidence

Not yet.

## Left alone

The report's counts of no-candidate floors, which TSK-0846 prints, and the volley that replaces mental arithmetic on 2 floors of 3, which the epic realising the addendum's section 8 decides.
