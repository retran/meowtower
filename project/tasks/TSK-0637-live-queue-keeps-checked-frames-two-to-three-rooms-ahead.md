---
id: TSK-0637
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3618, REQ-3642]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The live queue keeps checked frames two to three rooms ahead and keeps every live frame with its status

After this task, while `LIVE_FRAMES` is on, the server fills the `frames` table with frames that passed steps 1 to 5 for the top-up slots of the next 2 to 3 rooms, and the table keeps every live frame with its status and deletes none.

## Acceptance criteria

1. Given `LIVE_FRAMES` on, budget left, a rejection share under the limit and top-up slots in the next 3 rooms, when the queue runs, then it asks `LIVE_GEN_MODEL` for 5 variants for each slot's structure, runs steps 1 to 5 with `LIVE_CHECK_MODEL`, and holds each passing variant as `ready` before the player reaches the room (REQ-3618). Closed by: an integration test with stub models and a room schedule.
2. Given frames in each outcome, when the table is read, then each live frame is `ready`, `rejected` with its failing step, `used`, `final_failed`, `expired` or `moved`, and no row is ever deleted (REQ-3642). Closed by: an integration test that exercises each status and counts rows before and after.
3. Given a `ready` frame made on one game day, when the game day ends at 04:00, then its status is `expired`, because a frame is written for a floor and characters that tomorrow's rooms may not share (REQ-3642). Closed by: an integration test with a stubbed clock.
4. Given `LIVE_FRAMES` off, the adventure budget spent or the gateway unreachable, when a task needs a frame, then no live request is made and the task takes a library frame (REQ-3618). Closed by: an integration test with each of the three conditions.
5. Given the table passes 50,000 rows, when the day's report runs, then the owner is told once, and the ceiling stands in the Baselines table of ADR-0190 (REQ-3642). Closed by: a unit test with a row count of 50,001.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `frames` table to the server's database and `src/frames/live.ts`. Reuse the five-step functions of TSK-0629 to TSK-0632 with the live model names. Place each request on the top-up slots the Director has put in the next rooms, and count a reply discarded at step 2 as 5 rejected frames, as ADR-0460 sets. The record keeps `candidateSince`, the game day of generation.

## Depends on

- TSK-0629 (blocking): the live request.
- TSK-0630 (blocking): step 3.
- TSK-0631 (blocking): step 4.
- TSK-0632 (blocking): step 5.

The epic realising ADR-0070 supplies the top-up slots and the epic realising ADR-0100 the budget, the live tier and the gateway. Until they land, tests pass a room schedule and a budget flag.

## Evidence

Not yet.

## Left alone

The final solve at task build, the pause and the move to the library, which TSK-0638, TSK-0639 and TSK-0640 add to the same table.
