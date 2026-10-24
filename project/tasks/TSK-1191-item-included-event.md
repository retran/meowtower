---
id: TSK-1191
artifact: task
status: done
revised: 2026-10-24
realises: ADR-0500
closes: [REQ-0916]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A task the parent excluded returns to the estimates when `item_included` follows its exclusion

After this task, the catalogue holds `item_included` v1, and the knowledge model reads the last exclusion event of each task, so an included task is in the estimates again (ADR-0500). The work was done in EPC-0060's pull request and is recorded here so the decision has a task that realises it.

## Acceptance criteria

1. Given a log with `item_excluded` and no later event for the item, when the observations are read, then the item is in none of them. Closed by: `tests/unit/model-observations.test.ts`.
2. Given `item_excluded` followed by `item_included`, when the observations are read, then the item is back in them. Closed by: `tests/unit/model-observations.test.ts`.
3. Given an `item_included` payload with an item id, when it is validated, then it is accepted; given a further field, then it is refused. Closed by: `tests/unit/item-included.test.ts`.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `item_included` to `src/shared/events.ts` and read the last exclusion event per item in `src/engine/model/observations.ts`.

## Depends on

Nothing.

## Evidence

Closed by the tests in tests/unit/model-observations.test.ts and tests/unit/item-included.test.ts, and by the stages of the repository run on the branch that merged it.

## Left alone

The parent's screen that sends the event, which comes with ADR-0180's epic.
