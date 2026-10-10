---
id: TSK-0887
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5820, REQ-5830]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every node and subtype carries a Cito block, and a block is ready at 80 % fluent or stable

After this task, the graph file gives every node and subtype a Cito block from 1 to 6 or `null`, the validator refuses a block that breaks the rules, and the `cito_blocks` projection says for each block whether it is ready.

## Acceptance criteria

1. Given `content/graph.yaml`, when `./meowtower graph check` runs, then it reports a `citoBlock` on every node and subtype, `null` on every S node, stretch node and track node, and for each node a value that one of its subtypes carries (REQ-5820). Closed by: the command's output.
2. Given four fixtures, a node without the field, a value of 7, a non-null value on an S node and a node value that none of its subtypes carries, when the validator runs, then each fails with `graph_block_invalid` and names the node or subtype (REQ-5820). Closed by: the validator's test.
3. Given a block of 100 members whose tested state is «Бегло» or «Устойчиво» for 80 of them, when `cito_blocks` is computed, then the block is ready; given 79, then it isn't (REQ-5830). Closed by: a projection test on fixture states.
4. Given block 1 with 80 % of its members fluent or stable and 89 % of its facts automatic, then it isn't ready; given 90 %, then it is; given block 3 with 80 % of its members, then it is ready whatever the facts say (REQ-5830). Closed by: a projection test on fixture states and fixture fact rows.
5. Given a node whose «Бегло» state rests on inference, when the count runs, then the node isn't counted as fluent (REQ-5830). Closed by: the same test with one inferred node.
6. Given the values the building agent drafted for about 250 pairs of node and subtype, when the parent reads them once, then the parent accepts them or names the pairs to change (REQ-5820). Closed by: the parent's judgement, because only a person knows whether a subtype belongs to a tested block.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `citoBlock` to the graph's schema and its validator, and fill it in `content/graph.yaml`: 1 the basic operations, 2 the times tables and division, 3 fractions, decimals, percentages and ratios, 4 measures, 5 geometry, 6 word problems. I chose to require the field on every subtype and not inherit it, as ADR-0290 did, so the validator reads each pair without an inheritance rule. A node's own value must be one of its subtypes' values, and the report groups the node under it. A change to the file is a new graph version and a full recompute.

Add the `cito_blocks` projection: a block's members are the pairs of node and subtype whose subtype carries the block, the count is unweighted and reads tested states only, and the facts' share automatic comes from `fact_states` for blocks 1 and 2.

## Depends on

- TSK-0889 (not blocking): the projection reads `fact_states` rows. The tests here write fixture rows, and the real rows arrive with that task.

The epic realising ADR-0050 supplies the graph file's loader and validator, and the epic realising ADR-0060 supplies the tested states. Until they exist the task runs on a fixture graph and fixture states, and it leaves the real file's values to the day those epics land.

## Evidence

Not yet.

## Left alone

The two value terms that read the block, which TSK-0888 adds. The weekly shares on the report, which TSK-0897 draws from this projection.
