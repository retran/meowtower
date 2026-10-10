---
id: TSK-0534
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1002]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A frontier slot takes the candidate node of highest value, and the play routes ask the Director for every room slot

After this task, `nextTask` fills each room slot with a node, a subtype and a purpose by the value formula in `content/director.v1.json`, the play route logs `purpose`, `flowSlot` and `why` in `item_shown`, and a replay of the log gives the same choice for every slot.

## Acceptance criteria

1. Given two candidates that differ in one term only, when the values are computed, then the node with higher uncertainty, longer time since it was last seen, a place on the frontier, a due lesson recheck, an open escalation, a due review or a fresh lesson mark has the higher value, and one with more shows in the last 3 days has the lower (REQ-1002). Closed by: a unit test for each term.
2. Given a frontier node and a non-frontier node last seen 7 days ago, when `staleness` is read, then it is 1 for the first and 0,5 for the second, and capped at 1 for both at 14 days. Closed by: a unit test.
3. Given a node with a lesson mark that scores both `recheck` and `parent_topic`, when the value is computed, then it takes the larger of the two and never both. Closed by: a unit test.
4. Given a candidate set, when it is built, then it holds the frontier nodes, the uncertain nodes, the nodes with obligations, the admitted stretch nodes and every stale node. Closed by: a unit test over a fixture projection.
5. Given a parent-topic slot after a lesson mark, when the day has had 4 such tasks, then no fifth is given in the first `parentTopicDays` days, and a recheck block's tasks sit outside the cap. Closed by: a unit test.
6. Given a log of a simulated adventure, when it is replayed through `planDay`, `planFloor` and `nextTask`, then each slot gets the same node, subtype and purpose, and each `item_shown` carries `purpose`, `flowSlot` and a `why` listing the value terms. Closed by: an integration test over one adventure.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/nextTask.ts` and `content/director.v1.json` with the weights and the lists RES-1000 sets. The formula is that of SPC-0070. The three points RES-1000 left open were fixed by ADR-0070: staleness divides by 7 for a frontier node and by 14 for every other, a node with a lesson mark scores the larger term and never both, and the `escalation` term is 1 for every obligation row that asks for evidence on the node.

Where a rule asks for chance, draw from a seed made of the adventure identifier and the slot number. The Director keeps a chosen node for 2 to 5 tasks, the probe or block it owes, and may alternate them with a neighbouring node's. Replace the stand-in order of `src/server/standin.ts` in `GET /api/session/:id/next` with the call; the stand-in scene, chest and ending stay.

The value weights of ADR-0290's `block_priority` and `school_goal` terms and its `content/director.v2.json` come with that epic, which extends the formula.

## Depends on

- TSK-0532 (blocking): the slot source.
- TSK-0533 (blocking): the review slot the route calls.
- The epic realising ADR-0060 supplies the estimates and `node_obligations`, the epic realising ADR-0050 the graph and the epic realising ADR-0040 the generator; the task runs on fixtures of the three until they exist.

## Evidence

Not yet.

## Left alone

The stretch gate, which TSK-0536 adds to the candidate set, the obligations' effects, which TSK-0537 adds, and the lesson marks themselves, which ADR-0180's epic creates.
