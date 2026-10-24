---
id: ADR-0470
artifact: adr
status: done
revised: 2026-10-11
addresses: [REQ-0800, REQ-0808]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0470. No node's typical group is below the group of any of its prerequisites

## Decision

The validator refuses a graph in which a node's `typicalGroup` is below the `typicalGroup` of any prerequisite the node names. A node is taught no earlier than what it needs, so the group of N2 can't be 2 when its prerequisite N1 is group 3. The check runs after the cycle check, so a cycle is still reported as a cycle. The rule works now: `./meowtower graph check` and the server's start-up both refuse such a file, and the real file passes it with 130 of 130 links in order.

What still doesn't work: the rule checks the order of the groups only. It says nothing about whether a group value is right, which the parent reviews against the school's programme.

## Why

The first draft of the graph put 35 of its 130 prerequisite links into an earlier or the same group than the node they unlock (N3 in group 5 before N4 in group 4). The prerequisite links come from RES-0800 and are correct; the groups were the drafter's reading of the Utrecht learning lines, and nothing checked them against the links. A group that comes before its prerequisite can't be taught in the order the parent sees on the map, so the report and the planner would both show the child first.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing | No change to the validator | The 35 inversions returned on the next edit, unseen |
| Raise the groups by hand | One-off correction | Not repeated when a node changes |
| Refuse the graph when a group is below a prerequisite's (this) | Caught at check, start-up and in the tests | Chosen |

## What it costs

One more rule in the validator, and a graph edit that moves a node earlier now needs its prerequisites moved with it.

## What would reverse it

- The parent's school programme places a node before a prerequisite that the research record orders after it. Then the prerequisite link is the thing to correct, through RES-0800, not the group.

## Consequences

- `src/engine/graph.ts` gains `checkGroupOrder`, run after `checkPrereqs`.
- `tests/unit/graph-group-order.test.ts` covers the refusal, the same-group case and the real file.
- The node tasks TSK-0503 to TSK-0505 record the rule and the correction.

## How I will know it was realised

1. `./meowtower graph check` exits 0 on the real file and 1 on a copy where N2 is in group 2.
2. The validator's test suite holds the refusal in the test named above.

## What this does not settle

- Whether the typical group values are right. They stay provisional until the parent reviews them.
- Whether a node's group should be the earliest group that teaches it, or the group most pupils reach it in. RES-0800 doesn't say, so the first version follows the learning lines.
