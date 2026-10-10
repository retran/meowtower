---
id: TSK-0522
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0060
closes: [REQ-0992]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After an unassisted failure a node's next review falls one day later, and the row carries its last-seen date, staleness and confidence

After this task, each node row holds `lastSeen`, `stale`, `nextReview` and `confidence`, with a review ladder of 1, 3, 7, 14 and 30 days after the 1st to 5th unassisted success in a row and 1 day after a failure, so the Director's review and stale-node rules have the fields they read.

## Acceptance criteria

1. Given an unassisted failure on a node, when its row is read, then `nextReview` is `lastSeen` plus 1 day (REQ-0992). Closed by: a unit test.
2. Given five unassisted successes in a row, each with `c = 1`, when `nextReview` is read after each, then it is `lastSeen` plus 1, 3, 7, 14 and 30 days, and plus 30 days after each further success. Closed by: a unit test.
3. Given a partially right answer after four successes, when `nextReview` is read, then the run has ended and the answer counts as a failure, so it is `lastSeen` plus 1 day. Closed by: a unit test.
4. Given a node whose last unassisted first attempt was 31 days ago and one whose was 30 days ago, when `stale` is read, then it is true for the first and false for the second; given a warm-up, a rapid guess and an excluded task after that date, then `lastSeen` stays where it was. Closed by: a unit test.
5. Given a full block 10 days old, a probe 20 days old and an inferred state, when `confidence` is read, then it is high, medium and low; given a probe or check older than 30 days, then it is low. Closed by: a unit test, once TSK-0523 and TSK-0526 supply blocks and inferred states; until then the test uses hand-written state rows.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `lastSeen`, `stale`, `nextReview` and `confidence` to the row the model writes, with the formulas of ADR-0060. A success is an observation with `c = 1`. The ladder asks whether she still solves the node cleanly, so a partial answer ends the run; ADR-0060 records that reading as a choice made.

The retention check of ADR-0400 changes the ladder after the MVP, and a hinted retention check sets `nextReview` to its day plus 1; both belong to the epic realising ADR-0400.

## Depends on

- TSK-0520 (blocking): the row the fields sit on.

## Evidence

Not yet.

## Left alone

How the Director acts on `nextReview` and `stale`, which the epic realising ADR-0070 builds, and the retention check, which ADR-0400's epic builds.
