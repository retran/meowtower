---
id: TSK-0330
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0030
closes: [REQ-0200, REQ-0226, REQ-2404, REQ-2412]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The adventure and session lifecycle, the leave route, the break route and the guard against reopening

After this task, an adventure moves through `planned`, `active`, `paused`, `complete` and `wrapped_up` and a session through `active` and `ended`, a daily start continues the open adventure, «Сохранить и уйти» works at any step, a break leaves play running, and no event reopens a finished adventure.

## Acceptance criteria

1. Given an adventure that is `planned`, `active` or `paused`, when `POST /api/session/start` with `daily` arrives, then the session continues that adventure and no `adventure_planned` is logged; given none open, one new adventure is planned (REQ-0226). Closed by: an integration test over the four states.
2. Given a complete or wrapped-up adventure, when any event would make it `active` or `paused`, then `appendEvents` refuses it, the transaction rolls back and the request gets `409` (REQ-2404). Closed by: a unit test of the guard and an integration test.
3. Given play at each step, before an answer, after an answer mid-review, in a scene and at a chest, when `POST /api/session/:id/pause` with `leave` arrives, then the log gains `adventure_paused` with `leave` and `session_ended` and nothing else (REQ-0200). Closed by: an integration test over the five steps.
4. Given an active session, when `POST /api/session/:id/break` arrives, then the rest-stop events are logged, the session stays `active` and the adventure is not paused (REQ-2412). Closed by: an integration test reading `sessions` and `adventures`.

## What to do

Fold the lifecycle events into the `adventures` and `sessions` projections, add the guard to `appendEvents`, and add `GET /api/adventure/current`, the pause route and the break route, as SPC-0030 states them. The first `next` of a planned adventure logs `adventure_started`, and the stand-in adventure's finale logs `adventure_completed`. The pause route takes the reasons `leave`, `background` and `idle`; TSK-0340 makes the client send the last two. An eye exercise has no route here: ADR-0090's epic sends it as a `break` packet, and the same state check covers it. ADR-0190's definition of done applies.

## Depends on

TSK-0300, because it extends that task's session start and `next`. TSK-0250, because `adventures` and `sessions` are registered projections.

## Evidence

Not yet.

## Left alone

Pausing on lease expiry (TSK-0350), the client's pause triggers (TSK-0340), and rest stops and eye exercises as story, which ADR-0090 defines.
