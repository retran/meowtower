---
id: TSK-1165
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0460
closes: [REQ-3640, REQ-3644]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A live frame moves to the library only after its checks, and a discarded reply counts as five rejected frames

After this task, «В библиотеку» is offered on a live frame that passed steps 1 to 5 and logs the day the frame was made, an edited candidate keeps its first date and doesn't expire before its check, and a reply discarded whole at step 2 counts as 5 rejected frames. This settles entries 24 to 27 of ADR-0460.

## Acceptance criteria

1. Given a live frame in `ready`, `used` or `expired`, when the parent presses «В библиотеку», then `frame_accepted` is logged with `candidateSince` set to the game day on which the live frame was made, and given a frame in `rejected` or `final_failed`, then the action isn't offered (REQ-3644). Closed by: a route test and a Playwright test over the five statuses.
2. Given a frame candidate or a science question that the parent edited, when its `candidateSince` is read, then it is the first one, and given a candidate waiting for the check of its edit near day 60, then it doesn't expire before the first `frames:generate` after the edit has run steps 4 and 5 on it. Closed by: a unit test over an edit at day 59.
3. Given a reply discarded whole at step 2, when the day's rejections are counted, then it adds 5 checked frames, all rejected (REQ-3640). Closed by: a unit test over one discarded reply.
4. Given a game day on which more than 30 % of the live frames checked are rejected, from the tenth checked frame on, when generation is asked, then live generation stops until the day ends and frames come from the library, and it starts again on the next game day (REQ-3640). Closed by: a unit test over 9, 10 and 20 checked frames.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Apply entries 24 to 27 as written. A moved frame's review time is then the days it spent live before the parent chose it, and a generator that keeps returning a broken schema pauses live frames by REQ-3640's rule, which a count of 0 would never do.

## Depends on

Nothing. The epic realising ADR-0130 owns the frame pipeline; this task runs on its fixtures.

## Evidence

Not yet.

## Left alone

The frame library's checks, which ADR-0130 owns, and the 60-day expiry itself, which ADR-0130 sets.
