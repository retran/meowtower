---
id: TSK-0535
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0070
closes: [REQ-1020, REQ-1022]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The Director never picks a task to make the player fail or to balance the success share

After this task, a property test shows that the success share changes only whether a slot is review or frontier and never which frontier node is chosen, and that no term of the value formula rises as the expected chance of success falls.

## Acceptance criteria

1. Given random states and a fixed log, when `nextTask` chooses a frontier node at success shares 0,50, 0,75 and 0,95, then it chooses the same node every time (REQ-1020, REQ-1022). Closed by: a property test with fast-check over at least 1,000 random states.
2. Given two candidate nodes that differ only in expected chance of success, when their values are computed, then the node with the lower chance never has the higher value because of that chance (REQ-1020). Closed by: a property test over the formula's terms.
3. Given the code of the frontier choice, when it is read by the type checker, then the function that picks the node takes no success share as an argument. Closed by: the type check verb and a unit test that the signature has no such parameter.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the property tests to `tests/unit/` beside the Director's unit tests, using the `fast-check` development dependency that the epic realising ADR-0060 adds for its own property test, or adding it here if this lands first. The code keeps both rules by construction: the flow share decides only whether the slot is frontier or review. If a test fails, fix the formula; the test stays.

## Depends on

- TSK-0534 (blocking): the value formula and the frontier choice the tests exercise.

## Evidence

Not yet.

## Left alone

Any change to the value formula's weights, which the simulation of TSK-0547 tunes.
