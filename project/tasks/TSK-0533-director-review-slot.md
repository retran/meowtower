---
id: TSK-0533
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1012, REQ-1016, REQ-1018]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A review task comes from a fluent or stable node the player will probably solve, and looks like any other task

After this task, a review slot takes the eligible node unchecked for longest, the task is graded with `purpose: review`, the model counts it like any other observation, and no packet before or after the answer tells the client which tasks are review.

## Acceptance criteria

1. Given nodes whose tested state is «Бегло», «Устойчиво», "fluent (inferred)" and "understands", when the review candidates are listed, then only the first two qualify, and only when the expected chance of success is at least 0,85 for the subtype the task will use (REQ-1012). Closed by: a unit test.
2. Given the expected chance `pKnow * (1 - pSlip) + (1 - pKnow) * pGuess` with forgetting applied up to now, when a node's `pKnow` has decayed so that it falls below 0,85, then the node is no longer eligible (REQ-1012). Closed by: a unit test at two times.
3. Given three eligible nodes with different `lastSeen` dates and two with the same date, when the review node is chosen, then it is the one unchecked for longest and a tie goes to the lower node identifier. Closed by: a unit test.
4. Given no eligible node, when the slot is filled, then it takes a cold-start review node, then the frontier candidate with the highest expected chance of success, and `why` records `no_review_candidate`. Closed by: a unit test.
5. Given an attempt on a task with `purpose: review`, when the model reads the log, then it is an observation like any other graded first attempt (REQ-1018). Closed by: a unit test over the model's observation function.
6. Given a review slot and a frontier slot on the same floor, when the packets are compared, then both carry the same fields, the same frame and room, and neither carries `purpose`, `flowSlot` or `why` (REQ-1016). Closed by: the packet schema test of the play routes over both slots.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/engine/director/review.ts`. A review whose domain is off today's route waits for its floor, which the three-day window keeps to at most 2 days. The review task is graded and uses the same room, frame, screen and packet as any other task.

An inferred state doesn't qualify, because the island checks already test inferred nodes. The retention hold after the MVP leaves a held node out of this list, and the longest-unchecked order is replaced by REQ-6846's wording; both belong to the epic realising ADR-0400.

## Depends on

- TSK-0532 (not blocking): the corridor decides when a slot is review, and either task can land first against a stub that always answers review.
- The epic realising ADR-0060 supplies the estimates, states and `lastSeen`; the task runs on fixture projections until then.

## Evidence

Not yet.

## Left alone

The frontier choice, which TSK-0534 builds, the retention check, which ADR-0400's epic builds, and the play routes' own schema test, which the epic realising ADR-0030 built and this task extends.
