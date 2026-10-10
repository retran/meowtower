---
id: TSK-0541
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1034, REQ-1036]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Cold start probes each domain's chain from the typical group down and reviews the first nodes while estimates are few

After this task, the Director runs a cold-start phase from the first adventure until fewer than half of the 1F and 1S nodes remain unchecked or the 10th adventure ends, and during it probes each domain's prerequisite chain from a node of typical group 7 or 8 downwards and uses N1 to N3, A1 to A4 and F1 as review tasks.

## Acceptance criteria

1. Given an empty log, when cold start is read, then it is on; given 9 adventures and more than half the 1F and 1S nodes unchecked, then it is on; given the 10th adventure ended, or fewer than half unchecked, whichever comes first, then it is off (REQ-1034). Closed by: a unit test for each case.
2. Given a domain's chain and no estimates, when the first probe is chosen, then it is a node whose typical group in the graph is 7 or 8, and a lower node only after a probe on it escalates, by a binary search to the middle of the chain below (REQ-1034). Closed by: a unit test on a fixture chain of 8 nodes.
3. Given cold start, when a review slot is filled, then N1 to N3, A1 to A4 and F1 serve as review tasks while estimates are few (REQ-1036). Closed by: a unit test.
4. Given cold start has ended, when the frontier is ranked, then the value formula alone ranks it. Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/cold-start.ts`. It reads each node's typical group through `typicalGroup` of the graph's query module. SPC-0050 allows that import under `src/parent/` and in this module alone, so TSK-0501's lint configuration lists `src/engine/director/cold-start.ts` as the one other importer; keep the import in this file alone.

## Depends on

- TSK-0534 (blocking): the candidate set and review slot that cold start changes.
- The epic realising ADR-0050 supplies `typicalGroup` and the node chains; the task runs on a fixture graph until then.

## Evidence

Not yet.

## Left alone

The Guardian's use of the cold-start flag, which TSK-0540 reads.
