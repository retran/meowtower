---
id: TSK-1012
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0370
closes: [REQ-5068, REQ-5152, REQ-5154, REQ-2230, REQ-5838]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Version 1 events read as paid and adventure, and the threshold version joins both of its sources

After this task, the upcasters read a version 1 hint ladder as paid and a version 1 save as an adventure save, and `derived_meta` records one threshold version that changes when the content file or the parent's threshold changes.

## Acceptance criteria

1. Given a stored version 1 `thread_spent` with reason `hint` and a version 1 `hint_shown`, when the log is replayed, then the first reads as `hint_ladder` and the second as `ladderOpenedBy: "thread"`, and every version 1 ladder reads as paid (REQ-5068, REQ-5152, REQ-5154). Closed by: a replay test over a fixture of version 1 hint events.
2. Given a stored version 1 `save_accepted` and a version 1 `rest_stop_ended`, when the log is replayed, then the first reads as the reason `adventure` and the second as the reason `unrecorded`, and a fixture route-written event with `unrecorded` is refused by its schema. Closed by: an upcaster test and a schema test.
3. Given `content/versions.json` at version 3 and a log with a `fact_threshold_set` at `seq` 18204, when `derived_meta` is written, then the threshold version is `3+18204`, and with no such event it is `3+0` (REQ-5838). Closed by: a unit test.
4. Given a start-up after `content/versions.json` changes, and another after the parent's threshold change adds a `fact_threshold_set`, when the server starts, then each runs one full recompute and `derived_meta` holds the new composite value (REQ-2230, REQ-5838). Closed by: a start-up test over both logs.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the three upcasts to `src/shared/events.ts` and the composite version to `src/server/versions.ts` and `src/engine/projections/versions.ts`. A version 1 rest stop ended by her tap or by the timeout and the log doesn't say which, so a guessed reason would record a tap she may not have made; `unrecorded` is a value only the upcaster writes. Under ADR-0080 every rung cost a thread, so every version 1 rung was paid for, and the rule that tells a paid ladder from a free one reads version 1 tasks as paid. Start-up computes the composite value from both sources and compares it with `derived_meta`.

## Depends on

Nothing in this epic.

## Evidence

Not yet.

## Left alone

The new `hint_shown` and `thread_spent` payloads that ADR-0220 defines, which the epic realising ADR-0220 owns.
