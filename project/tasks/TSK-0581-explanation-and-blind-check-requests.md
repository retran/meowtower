---
id: TSK-0581
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0100
closes: [REQ-2602, REQ-2604, REQ-2606]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# An explanation request leaves only after a spent thread and holds only the fields the requirement lists

After this task, the gateway refuses an `ExplainRequest` unless the log holds the `thread_spent` event that paid for that task, refuses any field the requirement doesn't list, and gives the blind check a request with the task text and the finished explanation only.

## Acceptance criteria

1. Given an `ExplainRequest` that names no `thread_spent` event, or one for another task, when it is sent, then the gateway refuses it before any network call (REQ-2602). Closed by: a unit test.
2. Given an `ExplainRequest` with an extra field and, one at a time, a name of the player, a time, an estimate, a node id and a history of other tasks, when each is sent, then the gateway refuses it, and a request with only the listed fields passes (REQ-2604). Closed by: a schema test with one case for each field.
3. Given a `BlindCheckRequest` with a field beyond the task text and the finished explanation, when it is sent, then the gateway refuses it (REQ-2606). Closed by: a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the two zod schemas to the gateway of TSK-0580, strict so they refuse unknown fields. An `ExplainRequest` holds the task text as shown, the engine's solution steps and answer, her answer, any matched misconception with its calculation, the error class and the familiar's kind, name, traits and sample lines, and the id of the `thread_spent` event, which the gateway looks up in the log.

## Depends on

- TSK-0580 (blocking): the schemas are classes of that gateway.

The epic realising ADR-0120 builds the Explainer that sends these requests; this task tests the classes with fixtures.

## Evidence

Not yet.

## Left alone

The Explainer's order and the cache, which ADR-0120 owns.
