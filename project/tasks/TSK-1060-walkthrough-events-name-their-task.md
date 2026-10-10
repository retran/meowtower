---
id: TSK-1060
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6890, REQ-6892]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every short solution and every hint rung names its task

After this task, a test holds `solution_shown` and `hint_shown` to a required `itemId` from their first payload version, and every such event the attempt flow writes names the task it was shown on, so a later report can place a walkthrough on a node.

## Acceptance criteria

1. Given the schemas of `solution_shown` and `hint_shown`, when a fixture payload without `itemId` is validated, then each schema refuses it, and `itemId` is in the first payload version of both (REQ-6890, REQ-6892). Closed by: a schema test.
2. Given a played adventure that shows a short solution and three hint rungs through the attempt flow, when the log is read, then every `solution_shown` and `hint_shown` carries the `itemId` of the `item_shown` it followed (REQ-6890, REQ-6892). Closed by: an integration test.
3. Given a stored event of either type without `itemId`, when the log is replayed, then a reader marks the node of that event unknown and every projection still replays (REQ-6890, REQ-6892). Closed by: a replay test with one such fixture event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

`itemId` is already in version 1 of both events in `src/shared/events.ts`, so this task adds no field. Add the three tests above and a type test that fails if the field becomes optional. If an event without `itemId` has been stored by the time this task starts, put the field into a new payload version with an upcaster that leaves it absent, as ADR-0400 sets. This is the one increment of ADR-0400 that belongs in the MVP, because a report built later can't recover which node a walkthrough belonged to from event order across resumes and devices.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

`explanation_shown`, which reaches its task through `explanation_bought` and gains nothing, and every other part of ADR-0400, which waits until after the MVP.
