---
id: TSK-0646
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1708, REQ-1710, REQ-1746, REQ-1748, REQ-1750, REQ-1752, REQ-1754, REQ-1756, REQ-1758]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The streak grows on clean unassisted first attempts, fires a clean row at 3 and every 5, and shows only as a garland

After this task, `src/game/streak.ts` keeps the streak of one adventure in the resume snapshot, fires a clean row at 3 and a big clean row at every multiple of 5, and the client draws the streak as a garland with no digit and no announcement when it ends.

## Acceptance criteria

1. Given a sequence of outcomes, when the streak is computed, then it grows by 1 only on a `clean` unassisted scored first attempt that isn't a rapid guess, stays as it is on a `partial` outcome, a rapid guess, a warm-up, a check fact and an unscored task, and returns to 0 on `alt` (REQ-1746, REQ-1748, REQ-1750). Closed by: a unit test with one sequence for each rule.
2. Given a new adventure, when it starts, then the streak is 0, and given an adventure left at a streak of 4 and resumed, then it is 4 (REQ-1756, REQ-1758). Closed by: an integration test over a leave and a resume, which reads the resume snapshot.
3. Given the streak reaches 3, when the attempt is answered, then a clean row fires and one guiding thread is granted; given it reaches 5, 10 and 15, then a big clean row fires each time, and each row closes a clean row for the badge of TSK-0645 (REQ-1752, REQ-1754). Closed by: a unit test with 15 `clean` outcomes and a check of the grants.
4. Given the streak ends on an `alt` outcome, when the reply is read, then it carries no event, no line and no sound about the end, and differs from a reply that doesn't end a streak only in the garland's state (REQ-1710). Closed by: an integration test that compares the two replies and the event stream.
5. Given a streak of 7, when the client draws it, then the garland holds no digit in its text or accessible name and the server sends the streak in no field the client prints (REQ-1708). Closed by: a Playwright test that reads the garland's text and accessible name.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/game/streak.ts` and the garland field to the answer reply. The streak counts within one adventure and lives in the resume snapshot, so leaving and resuming keeps it. A rapid guess looks the same on screen as any answer with its verdict. How many pieces the garland has and how it looks are for the implementer, provided it shows no digit. Ask for the thread grant through the grant call the epic realising ADR-0080 supplies; until then write the `thread_granted` event the log already names.

## Depends on

- TSK-0645 (blocking): the outcome and the rapid and assisted flags the streak reads.

## Evidence

Not yet.

## Left alone

The thread stock, cap and spending, which ADR-0080 owns, and the garland's art, which ADR-0170 owns.
