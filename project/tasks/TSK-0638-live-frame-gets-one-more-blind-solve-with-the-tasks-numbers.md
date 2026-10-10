---
id: TSK-0638
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3632]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A live frame passes one more blind solve with the task's own numbers before the player sees it

After this task, the server builds a top-up task from the oldest `ready` frame of its structure, has `LIVE_CHECK_MODEL` solve the filled problem blind once more, and shows the frame only if the solve matches the engine's answer.

## Acceptance criteria

1. Given a top-up slot and a `ready` frame, when the server builds the task, then it fills the frame with the task's numbers, the checking model solves that exact problem with no answer and no options in the request, and a matching answer makes the frame `used` and the task shows it (REQ-3632). Closed by: an integration test with a stub model and a recording of the request.
2. Given the solve gives a different answer, when the task is built, then the frame becomes `final_failed` and the task takes a library frame (REQ-3632). Closed by: an integration test.
3. Given the queue holds no `ready` frame of the structure, when the task is built, then `live_queue_empty` is counted and the task takes a library frame (REQ-3632). Closed by: an integration test.
4. Given a simulation with `LIVE_FRAMES` on, when its log is read, then every live frame shown has a passing final solve in `llm_log`, and a task is built ahead of its room so the player never waits on a solve (REQ-3632). Closed by: a simulation test that joins `item_shown` with `llm_log`, and a timing check that the build finishes before the room opens.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the final solve in `src/frames/live.ts` beside the queue. Reuse the blind solve of TSK-0632 with the problem's own numbers in place of the three seeds. The request holds the problem text only. Build the task during the server's preparation of the next room, where it already builds tasks ahead.

## Depends on

- TSK-0637 (blocking): the `frames` table and its statuses.
- TSK-0636 (blocking): the picker's fallback to a library frame.
- TSK-0632 (blocking): the blind solve it reuses.

## Evidence

Not yet.

## Left alone

The Director's choice of the top-up slot, which the epic realising ADR-0070 owns, and the cost of the solve, which the adventure budget of the epic realising ADR-0100 counts.
