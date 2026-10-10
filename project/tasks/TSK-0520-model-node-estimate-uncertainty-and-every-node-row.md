---
id: TSK-0520
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0910, REQ-0988, REQ-0994]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A node's estimate is the weighted mean of its subtypes', carries an uncertainty, and exists for every node up to group 8

After this task, `node_estimates` holds one row for every node of the graph up to the end of group 8, level 1S, and for every stretch node, each with the subtype-weighted mean of `pKnow` and an uncertainty that falls with fresh observations, whatever the player's current school group.

## Acceptance criteria

1. Given a node with subtypes of weights 0,5, 0,3 and 0,2 and estimates 0,8, 0,4 and 0,1, when the node's estimate is read, then it is 0,54, and a subtype with no observation contributes its prior (REQ-0910). Closed by: a unit test against the graph's weights.
2. Given a node with no observation, when its row is read, then its `uncertainty` is the full binary entropy of its prior; given three fresh observations with weight 1, then it is half of that; given the same observations aged by one half-life, then it is higher again (REQ-0988). Closed by: a unit test with exact values from `H(pKnow) * 3 / (3 + nEff)`.
3. Given the real graph, when the model runs on an empty log, then `node_estimates` holds a row for each of the 69 nodes at 1F, 1S or 1F/1S and each of the 10 stretch nodes, each with the state "not checked" or "stretch: not checked", its prior and full uncertainty, for a school-group setting of 7 and of 8 alike (REQ-0994). Closed by: an integration test over both settings.
4. Given a node row and the rows of its subtypes, when `nEff` is computed, then on the node row it sums the node's observation weights each times `2^(-age / H)` with the observing pair's current half-life, and on a subtype row it sums that subtype's observations alone. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the aggregate and the uncertainty to `src/engine/model/`, and make the model write a row for every node and every subtype the graph's query module lists, through the registry of projections the epic realising ADR-0020 built. The Director reads each estimate forgotten to the current time.

The graph arrives from the epic realising ADR-0050. Until its file holds the 79 nodes, the task runs on a fixture graph of the same shape and lists the nodes the module returns; the model reads levels, weights and prerequisites through the module only, never the file.

## Depends on

- TSK-0517 (blocking): the pair estimates the aggregate reads.
- TSK-0519 (blocking): the prior of each pair.
- The epic realising ADR-0050 supplies the graph and its query module; the task runs on a fixture graph until then.

## Evidence

Not yet.

## Left alone

The states a row carries, which TSK-0524 and the tasks after it write, and the rows of the Sources track, which ADR-0300's epic adds.
