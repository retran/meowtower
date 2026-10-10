---
id: TSK-0876
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5706, REQ-5732, REQ-5734]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Every puzzle action is an event type of its own, and the knowledge model and the Director read none of them

After this task, the event catalogue holds the eleven `puzzle_*` types ADR-0280 owns, no puzzle action is written as `attempt_submitted`, and a static check fails the build when the knowledge projection or ADR-0070's Director registers a `puzzle_*` input type.

## Acceptance criteria

1. Given the event schemas, when the catalogue is read, then it holds `puzzle_offered`, `puzzle_opened`, `puzzle_move`, `puzzle_attempt`, `puzzle_hint`, `puzzle_solved`, `puzzle_shelved`, `puzzle_unshelved`, `puzzle_closed`, `puzzle_approved` and `puzzle_rejected`, each with the payload beyond the id and hash that ADR-0280 lists (REQ-5734). Closed by: a schema test.
2. Given a log of puzzle play, when it is read, then no puzzle step is an `attempt_submitted` (REQ-5734). Closed by: a log test over a fixture day.
3. Given the projection registry, when a static check lists the input types of the knowledge projection and the Director, then none is a `puzzle_*` type, and the check fails when one is added (REQ-5732). Closed by: the static check's output and a fixture that adds one.
4. Given a log with and without puzzle play on the same seeds, when the slots, the plan, the flow limit, the three-day domain window and every estimate are computed, then they are equal (REQ-5706). Closed by: a replay test over a 30-day fixture.
5. Given `thread_spent`, when a spend is for a puzzle's ladder, then it carries the puzzle's id with the reason `hint_ladder`. Closed by: a schema test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the schemas to `src/shared/events.ts` inside ADR-0210's one version 2, with the payloads of ADR-0280, `thread_spent`'s extension and `save_accepted`'s reason `adventure` or `puzzle` with version 1 read as `adventure`, per ADR-0370. `rest_stop_ended` gains the reason `puzzle_opened` and, per ADR-0360, `screen_opened`; version 1 reads as `unrecorded`. Add the static check to group 1.

## Depends on

The epic realising ADR-0020 supplies the event catalogue and upcasters, and the epic realising ADR-0060 supplies the knowledge projection's registered input types. A fixture projection stands in until it lands.

## Evidence

Not yet.

## Left alone

What writes each event, which TSK-0873, TSK-0874 and TSK-0875 build, and what the report reads from them, which TSK-0880 builds.
