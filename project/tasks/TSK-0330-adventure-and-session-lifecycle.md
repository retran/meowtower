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

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 32 test files, 313 Vitest tests and 2 Playwright tests passed. `meow-verbs evidence` doesn't exist in meow-verbs 0.3.0, so the trees they ran on are cited from `git write-tree`: `src` `7bace7f4ec9ef280d49dc380f7543f7ec16e5810`, `tests` `1c58b52545ff53f6f004da2721805d7f6ddf9ec3`, `content` `165b85e2d6761f9046c36824ce6ffd38bba4e222`.
- Seen failing first, each by breaking one mechanism in a scratch copy and restoring it: with the start always planning a new adventure, the REQ-0226 continuation test failed; with the guard's throw removed, 8 tests failed, the 7 guard unit tests and the `409` integration test; with the leave logging no `adventure_paused`, the 5 step tests and 2 others failed; with the rest stop logging `adventure_paused`, the REQ-2412 test failed; with a leave after the finale logging `adventure_paused` again, the leave-after-finale test failed.
- Criterion 1, REQ-0226: `tests/integration/lifecycle.test.ts` starts a daily session with no adventure open and finds one `adventure_planned`; starts again on the adventure while `planned`, `active` and `paused` and finds one adventure and one `adventure_planned` throughout, with `adventure_started` on the first `next` and `adventure_resumed` on the first `next` after a leave; and after the finale (`{"kind":"end"}` after 60 tasks) the adventure is `complete`, `GET /api/adventure/current` answers `null`, and the next start plans a second adventure. After `adventure_wrapped_up`, the three-day rule's short ending, `next` returns the end packet and the next start plans a new adventure too.
- Criterion 2, REQ-2404: `tests/unit/adventure-guard.test.ts` makes `appendEvents` throw `AdventureClosed` for `adventure_started`, `adventure_resumed` and `adventure_paused` after `adventure_completed` and after `adventure_wrapped_up`, and for a batch that completes and then pauses; in each case the log keeps its length and the adventure its state, a valid event earlier in the batch included. In the integration test, a `background` pause after the finale gets `409 {"error":"adventure_closed"}`; the log gains nothing, its `session_ended` rolled back with the refused `adventure_paused`, and `next` still returns the end packet.
- Criterion 3, REQ-0200: before the first task, before an answer, after an answer mid-review, in a scene and at a chest, `POST /api/session/:id/pause` with `leave` adds exactly `adventure_paused` and `session_ended`, both with reason `leave`; the session is `ended` and the adventure `paused`. A repeat with the same `clientSeq` logs nothing, and the ended session's `next` gets `409`. After the finale, a leave gets `200` and logs `session_ended` alone, and the adventure stays `complete`, so she can leave at that moment too.
- Criterion 4, REQ-2412: `POST /api/session/:id/break` with `start` and then `end` logs `rest_stop_started` and `rest_stop_ended`; the `sessions` row stays `active`, the `adventures` row stays `active`, and no `adventure_paused` or `session_ended` is logged. An `eye_exercise` event leaves both rows `active`; the eye exercise's route comes with ADR-0090's epic.
- The packet recorder now plays each day on the open adventure, leaves at the day's end and starts a new adventure after each finale: `recorder: 1578 packets, 0 forbidden fields, 0 early answers`, with 9 finales over 600 first attempts: the 10th adventure's 60th task is the run's last, so no `next` after it returns the end packet.
- The snapshot test failed on this change, `writes during snapshot: 1`: a write before the snapshot stalled the event loop for the snapshot's whole 332 ms, where the last commit stalled 161 ms. Preparing every projection's statements afresh for each event left native statement objects for the collector, and two more projections doubled them. With statements cached per connection (`src/engine/projections/statements.ts`) the test logged `writes during snapshot: 2458, worst 1.31 ms, snapshot 297 ms`, and 40,000 filler events took 989 ms against 1,520 ms before.
- The crash test, from TSK-0300, left its server running when an assertion failed, which then held port 3917 for the next run; it now kills every child still running after the file.

Choices this task made, where SPC-0030 left a gap:

- `adventure_planned`, `adventure_started` and `adventure_completed` v1 hold `adventureId`, `adventure_wrapped_up` v1 also `unopenedSecrets`, and `session_ended` v1 holds `sessionId` and the pause reason; ADR-0020 names these events and this task gave them schemas. `session_ended` takes `lease_expired` with TSK-0350.
- Session 0 belongs to no adventure, because the lifecycle the spec describes is the daily adventure's.
- The first `next` of a paused adventure logs `adventure_resumed` with `pausedMs`, as the first `next` of a planned one logs `adventure_started`.
- The pause route logs `adventure_paused` and `session_ended` for all three reasons, because the spec details only `leave`, and one state after any pause is simpler for TSK-0350's resume.
- A leave after the finale logs `session_ended` alone, because REQ-0200 lets her leave at any moment and a finished adventure has nothing to pause; a `background` or `idle` pause after the finale meets the guard and gets `409 adventure_closed`, because those are the client's automatic signals of play stopping and after the end packet there is no play to stop. The session they leave open ends by lease expiry, which TSK-0350 builds and which must then log `session_ended` alone for a `complete` or `wrapped_up` adventure.
- The break route takes `action: "start" | "end"`, so a rest stop has a start and an end in the log.
- The stand-in adventure's finale comes after 60 first attempts, with 3 tasks a room and 5 rooms a floor for `GET /api/adventure/current`; these are stand-in values sized for the tests, which the adventure content of ADR-0090's and ADR-0110's epics replaces. The finale's `next` returns the packet `{ "kind": "end" }`.
- Tasks count across the adventure's sessions, because the finale belongs to the adventure: a task left open counts once toward the 60 and is shown again in the next session, as the REQ-0226 test's resumed task at slot 1 shows.

### Open review findings

An agent reviewed this record; these findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- REQ-2412 names the eye exercise as well as the rest stop, and this task builds no eye-exercise route. Not changed: `closes:` is frozen, and the task's What to do leaves the route to ADR-0090's epic; the Evidence shows an `eye_exercise` event pauses nothing, which is the half this task can check.
- Criterion 1 names only the finale, and REQ-0226 also the short ending; criterion 3 says five steps and names four. Not changed: the criteria are frozen; the Evidence covers `wrapped_up` and names the fifth step, before the first task.
- The choices above are contracts SPC-0030 doesn't state: the event payloads, `409 adventure_closed`, the pause route ending the session for `background` and `idle`, the break route's `action`, and the end packet. TSK-0340 and TSK-0350 read SPC-0030. Not fixed here: SPC-0030 is approved, and changing it is an amendment that waits for approval as a change of its own, together with the one TSK-0320's open findings name.
- After the finale a `background` or `idle` pause is refused and leaves the session `active` until lease expiry. TSK-0350's expiry logs `adventure_paused` with `session_ended`, which the guard would refuse the same way, so TSK-0350 must log `session_ended` alone for a `complete` or `wrapped_up` adventure. Not built here: lease expiry is TSK-0350's.

## Left alone

Pausing on lease expiry (TSK-0350), the client's pause triggers (TSK-0340), and rest stops and eye exercises as story, which ADR-0090 defines.
