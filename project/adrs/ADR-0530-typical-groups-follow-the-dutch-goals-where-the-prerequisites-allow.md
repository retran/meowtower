---
id: ADR-0530
artifact: adr
status: done
revised: 2026-10-25
addresses: [REQ-0800, REQ-0808]
supersedes: []
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 0530. A node's typical group follows the Dutch goal that first contains it, where the prerequisite order allows

## Decision

The owner agreed on 2026-10-25 that the graph's `typicalGroup` follows the Dutch programme, the base of the templates. For each node the research records RES-4281 to RES-4289 name the Dutch end-of-group goal that first contains the node's operation, and `content/graph.yaml` takes that group. Where the group would put a node after one of its dependents, ADR-0470 refuses the graph, so the node keeps the group the prerequisite order allows and the conflict is listed here for a review of the prerequisite link. Works once accepted: 24 nodes move to their Dutch group and the graph check passes. Doesn't work yet: 13 nodes sit earlier than their Dutch goal until the prerequisite links are reviewed.

Applied (graph group to Dutch group): N6 6 to 7, N7 6 to 7, A4 4 to 5, A6a 4 to 5, A7 5 to 6, A9 5 to 6, A10 6 to 7, A12 7 to 8, A14 7 to 8, D4 6 to 7, D5 6 to 7, F1 4 to 5, F2 5 to 6, F5 5 to 7, F6 6 to 8, F8 7 to 8, G3 6 to 5, P2 6 to 7, P3 7 to 8, P6 7 to 8, S4 7 to 6, S6 5 to 3, T2 3 to 4, T4 6 to 7.

Held, with the group the Dutch goal sets: N2 (4), N3 (6), A2 (4), A3 (4), D2 (6), D6 (7), F3 (6), F4 (7), F7 (8), P1 (7), P5 (7), S1 (4), S2 (4). Each is blocked by a prerequisite or dependent link that puts a node of an earlier group on the other side, and its template record states the Dutch group beside the graph group.

## Why

RES-4281 to RES-4289 compared the graph with the Dutch goals node by node and found that the graph, drafted from the Russian pace, was a year or two early for most nodes. A template that follows the Dutch goals but is filed under a group the Dutch goals place later would teach a node before the standard does. Raising every dependent to keep the order moved 25 other nodes to group 7 in a trial, including nodes the Dutch goals place at group 4, so the order rule is held and the conflicts are listed.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Keep the graph's groups | No change | The graph disagrees with the base programme for most nodes |
| Move every node and raise the dependents | The Dutch group for each flagged node | Moves 25 other nodes away from their own Dutch goals |
| Move each node where the order allows (this) | The Dutch group wherever it is compatible | Chosen |

## What it costs

13 nodes stay earlier than their Dutch goal until someone reviews the prerequisite links, and the graph version changes, which starts a recompute at the next start.

## What would reverse it

- The owner decides that a node's group follows the Russian pace again.

## Consequences

- `content/graph.yaml` changes 24 `typicalGroup` values.
- SPC-0050 says the first version's groups come from the Dutch tussendoelen.
- A review of the prerequisite links of the 13 held nodes is a later piece of work.

## How I will know it was realised

1. The graph check passes with the 24 groups changed, and the group-order test of ADR-0470 passes on the real file.

## What this does not settle

- Which prerequisite links of the 13 held nodes are not real, and whether the Russian pace sets any group.
