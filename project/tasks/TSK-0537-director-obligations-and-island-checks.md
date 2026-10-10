---
id: TSK-0537
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-0956, REQ-0966, REQ-0970, REQ-0972, REQ-0974]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director acts on each obligation the model writes: escalation, owed probes, cut-off nodes and island checks

After this task, an open escalation raises its node until a full block forms, a node in "understands" gets one probe on each direct descendant, cut-off nodes stay out of selection except in an island check, and each adventure day holds 1 or 2 island checks whose failure queues the node and its prerequisites.

## Acceptance criteria

1. Given a probe that ended short of "fluent (probe)", when the next slots are chosen, then the node's `escalation` term is 1 and stays 1 until a full block forms for it (REQ-0956). Closed by: a unit test over a fixture log.
2. Given a node that gets the state "understands", when the next slots are chosen, then each direct descendant has one owed probe, raised through `escalation` (REQ-0970). Closed by: a unit test.
3. Given a node cut off by X, when the candidate set is built, then the node is absent until X is tested again, and an island check may still choose it (REQ-0966). Closed by: a unit test and the simulation's check of TSK-0547.
4. Given an adventure day with candidates, when the day is planned, then it holds 1 or 2 island checks, the count drawn from the seed, each a probe of a node drawn at random from those in "fluent (inferred)" or cut off, preferring nodes whose domain is on the route and otherwise placing the probe in a room of the day's first floor (REQ-0972). Closed by: a unit test over 90 seeded days.
5. Given a graph with no node in "fluent (inferred)" or cut off, when the day is planned, then it holds no island check and the first room's `why` records `no_island_candidate`. Closed by: a unit test.
6. Given a failed island check, when the obligations are read, then the node and its prerequisites are queued and the `escalation` term raises them (REQ-0974). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/obligations.ts`, reading `node_obligations` and acting on each kind as ADR-0070 states, and add the island check to `planDay`. The draw uses the seeded stream, so a replay of the log gives the same choice.

The block owed after a probe of 0 out of 2, the session-spanning completion and the 3-day completion of a stretch block were REQ-0958 and REQ-0822, now superseded by REQ-6406 and REQ-6404 in ADR-0360's epic; the stale-node priority is REQ-6844 in ADR-0400's. This task writes none of the three.

## Depends on

- TSK-0534 (blocking): the candidate set and the `escalation` term the obligations feed.
- The epic realising ADR-0060 supplies `node_obligations`; the task runs on fixture rows until then.

## Evidence

Not yet.

## Left alone

The three behaviours named above, the retention hold on island checks, which ADR-0400's epic adds, and the model's writing of the rows, which the epic realising ADR-0060 builds.
