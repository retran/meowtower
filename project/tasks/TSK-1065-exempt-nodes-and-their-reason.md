---
id: TSK-1065
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6848, REQ-6850]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Nodes the hold would break are exempt, and the report says why

After this task, a function computes the exempt set from the content files, the Director's planner reads it to plan and hold nothing for those nodes, and the report shows «удержание не измеряется» with the reason beside each of them.

## Acceptance criteria

1. Given a content tree where `content/facts.yaml` names node A as a fact's node, the control-fact set draws from node B, and the graph holds T1 to T4 and a node C, when the exempt set is computed, then it holds A, B, T1, T2, T3 and T4 and not C (REQ-6848). Closed by: a unit test over the fixture tree.
2. Given a change to `content/facts.yaml` that adds node C, when the set is computed again, then it holds C, so a paragraph can't drift from the data (REQ-6848). Closed by: the same unit test run on the changed tree.
3. Given exempt nodes of the three kinds, when the report is built, then each shows «удержание не измеряется» with its reason: fixed control facts, the Guardian's step ladder, or automaticity measured by frequent showing; and its natural retention observations are still listed (REQ-6850). Closed by: a report test over a fixture log.
4. Given the planner, when it runs over a log where an exempt node is «устойчиво», then it writes no plan for it (REQ-6848). Closed by: a planner test that TSK-1066 extends.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/retention-exempt.ts` that reads `content/facts.yaml`, the control-fact set and the node list, and returns each exempt node with its reason. The report reads the same function, so the planner and the report can't disagree.

## Depends on

Nothing in this epic.

The epics realising ADR-0290 (facts) and ADR-0060 (the graph) supply the content files; fixtures stand in.

## Evidence

Not yet.

## Left alone

Retention of the exempt nodes: the fact states of ADR-0290 cover basic facts, and nothing covers T1 to T4.
