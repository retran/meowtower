---
id: TSK-0608
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1640]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After each session the planner writes a summary and a plan of 5 to 7 beats, and two failures fall back to unused beats

After this task, `PLANNER_MODEL` receives the filtered canon, story memory, the session's summary outcome events, her cleaned text and choices, the checkpoint and the level's name, returns a summary and a plan of 5 to 7 beats that pass the same checks as a reply, and after a second failure the next session plays the last plan's unused beats and a library opening.

## Acceptance criteria

1. Given a finished session, when the planner runs against a mocked model, then `plan_written` is logged with a summary and between 5 and 7 beats, and the request holds no digit, node id or topic name (REQ-1640). Closed by: an integration test over the request log.
2. Given a plan that fails a check twice, when the next session starts, then it plays the unused beats of the last accepted plan and a library opening, and one report goes to the owner. Closed by: a unit test with a failing mock.
3. Given a summary, when the next adventure opens, then «В прошлый раз…» is built from it. Closed by: an integration test.
4. Given the planner's reply that omits an `echoes` entry for a `player_action` fact older than the current adventure, when it is checked, then it is refused (ADR-0330). Closed by: a unit test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the planner's order and reply to `src/shared/master.ts`, run it after each session, and pass its output through the check module. Facts of scope `pen` are not read by the planner, as ADR-0330 states.

## Depends on

- TSK-0599 (blocking): the plan passes the same checks as a reply.
- TSK-0598 (blocking): the planner takes the filtered canon that task builds.

## Evidence

Not yet.

## Left alone

The adventure the plan feeds, which ADR-0090's epic plans, and the model's budget, which ADR-0100's epic holds.
