---
id: TSK-1067
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6840, REQ-6842, REQ-6844, REQ-6846]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A held node reaches no path until its check, because one predicate refuses it

After this task, the Director's reject predicate refuses every task that names a held node unless its purpose is `retention_check`, the review ladder lets the check stand in for a review that falls during the hold, and stale-node priority and review order skip held nodes.

## Acceptance criteria

1. Given a held node and a candidate list for each of the frontier, review, stale-node priority, island checks, mental arithmetic, riddles, the Volley, the Sources track, grouping slots, warm-ups and easy tasks, when each list is built, then the predicate refuses every task naming the node, as its node or as any node a riddle or multi-node task names, and the caller takes its next candidate (REQ-6840). Closed by: one predicate test for each of the 11 lists.
2. Given a node whose last unassisted first attempt is 31 days old, once held and once not held, when stale-node priority runs, then the held node gets none and the other gets it; given two nodes eligible for review where the held one was unchecked longest, then review picks the other (REQ-6844, REQ-6846). Closed by: two Director tests.
3. Given a node that reaches «устойчиво» at its 4th unassisted success in a row, when it is held, then its next review is the retention check from day 28 in place of the review on day 14, and the ladder resumes from the check's result (REQ-6842). Closed by: a projection test.
4. Given a task of the held node with purpose `retention_check`, when the predicate runs, then it accepts it, and no response carries its `purpose` (REQ-6840). Closed by: a predicate test and ADR-0070's schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `isHeld(nodeId)` over `retention_series` and one clause in the reject predicate that ADR-0040's generator already asks. Enforce the hold in this one place, because a list of paths in prose misses the next path someone adds. While a node is held, ADR-0060's `nextReview` and `stale` still compute as before and the Director doesn't act on them. The parent's lesson recheck needs no exception, because a lesson mark cancels the plan first (TSK-1071).

## Depends on

- TSK-1066 (blocking): the plan says which nodes are held.

The epic realising ADR-0070 builds the Director and its candidate lists. This task adds the predicate clause and tests it over one stand-in list for each path, and the real lists call the same predicate when that epic lands; the 90-day run that closes this epic uses the whole Director once it exists.

## Evidence

Not yet.

## Left alone

Placing a due check in a slot, which TSK-1068 builds.
