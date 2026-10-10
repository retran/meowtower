---
id: TSK-0639
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0130
closes: [REQ-3640]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Live generation stops for the rest of the game day when more than 30 % of checked live frames fail

After this task, the server writes `live_frames_paused` when more than 30 % of the live frames checked on a game day are rejected, counting from the tenth checked frame, and takes every frame from the library until 04:00.

## Acceptance criteria

1. Given 10 checked live frames of which 4 are rejected, when the tenth is checked, then the server writes `live_frames_paused` and every task until the game day ends takes a library frame (REQ-3640). Closed by: an integration test with a stub model.
2. Given 10 checked of which 3 are rejected, when the tenth is checked, then nothing is paused, because 30 % isn't more than 30 %; given 9 checked of which 5 are rejected, then nothing is paused, because the count starts at the tenth (REQ-3640). Closed by: a unit test of the share function with both cases.
3. Given a frame that finished the pipeline or failed a step, final solve included, when the share is counted, then it counts as checked, and a reply discarded at step 2 counts as 5 rejected frames (REQ-3640). Closed by: a unit test.
4. Given the game day ends, when the next day begins, then live generation runs again, and the pause is the owner's line in the status report, never a message to the player (REQ-3640). Closed by: an integration test with a stubbed clock that reads the stream for the player.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Count the share from the `frames` table for the current game day in `src/frames/live.ts` and write one `live_frames_paused` event for the day. The period and the restart are the requirements step's default, which ADR-0130 carries: measured over the game day, restarted the next one. Report `live_frames_paused` in the status report once a day.

## Depends on

- TSK-0637 (blocking): the table whose rows are counted.

## Evidence

Not yet.

## Left alone

The reversal condition that turns live generation off by default after more than 3 paused days in 14, which the owner decides from this task's report.
